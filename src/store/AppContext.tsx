import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { matchedScholarships } from '../data/matching';
import { scholarshipById } from '../data/scholarships';
import type {
  Academic,
  AppListFilter,
  Application,
  ApplicationStatus,
  ChatMessage,
  HomeFilters,
  Notice,
  NotificationPrefs,
  User,
} from '../data/types';
import { formatDay, formatStamp, nid } from '../lib/format';
import { hapticSuccess } from '../lib/haptics';

const STORAGE_KEY = 'scholarship-connect.v1';

type Persist = {
  users: User[];
  sessionUserId: string | null;
  applications: Application[];
  chats: Record<string, ChatMessage[]>;
  notices: Notice[];
  consented: boolean;
  onboardingDone: boolean;
  homeFilters: HomeFilters;
};

type ProfileDraft = Partial<
  Pick<
    User,
    | 'name'
    | 'photoUri'
    | 'dateOfBirth'
    | 'nationality'
    | 'contactEmail'
    | 'academics'
    | 'languages'
    | 'ielts'
    | 'toefl'
    | 'sat'
    | 'cvName'
    | 'cvUri'
    | 'countryCodes'
    | 'notifications'
  >
>;

type AppContextValue = {
  ready: boolean;
  bootError: string | null;
  consented: boolean;
  onboardingDone: boolean;
  user: User | null;
  applications: Application[];
  notices: Notice[];
  homeFilters: HomeFilters;
  appFilter: AppListFilter;
  pendingApplyIds: string[];
  setBootError: (message: string | null) => void;
  setConsented: (value: boolean) => void;
  completeOnboarding: () => void;
  signUp: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  signIn: (input: {
    email: string;
    password: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  openDemo: () => Promise<void>;
  refreshApplicationStatuses: () => void;
  signOut: () => void;
  requestPasswordReset: (
    email: string,
  ) => Promise<{ ok: true; message: string } | { ok: false; error: string }>;
  changePassword: (
    current: string,
    next: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  saveProfile: (draft: ProfileDraft) => Promise<{ ok: true } | { ok: false; error: string }>;
  saveCountries: (
    codes: string[],
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  setHomeFilters: (next: Partial<HomeFilters>) => void;
  setAppFilter: (next: AppListFilter) => void;
  toggleSaved: (scholarshipId: string) => void;
  setPendingApplyIds: (ids: string[]) => void;
  queueEligibleApply: () => string[];
  submitApplications: (
    ids: string[],
  ) => Promise<{ submitted: number; failed: number }>;
  retryApplication: (id: string) => Promise<void>;
  getMatches: () => ReturnType<typeof matchedScholarships>;
  getChat: () => ChatMessage[];
  sendChat: (text: string) => void;
  markNoticesRead: () => void;
  pushNotice: (text: string) => void;
};

const defaultFilters: HomeFilters = {
  degree: 'All',
  funding: 'All',
  savedOnly: false,
  sort: 'match',
};

const defaultNotifications: NotificationPrefs = {
  matches: true,
  applications: true,
  messages: true,
};

const AppContext = createContext<AppContextValue | null>(null);

async function hashPassword(password: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `sc:${password}`);
}

function blankUser(partial: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}): User {
  return {
    id: partial.id,
    name: partial.name,
    email: partial.email.toLowerCase(),
    passwordHash: partial.passwordHash,
    photoUri: null,
    dateOfBirth: '',
    nationality: '',
    contactEmail: partial.email.toLowerCase(),
    academics: [
      {
        id: nid('deg'),
        degree: '',
        institution: '',
        gpa: '',
        year: '',
      },
    ],
    languages: '',
    ielts: '',
    toefl: '',
    sat: '',
    cvName: null,
    cvUri: null,
    countryCodes: [],
    notifications: { ...defaultNotifications },
    savedIds: [],
  };
}

function makeTimeline(status: ApplicationStatus, now: Date): Application['timeline'] {
  const stamp = formatStamp(now);
  if (status === 'failed') {
    return [
      { title: 'Application started', at: stamp, state: 'done' },
      { title: 'Submission failed', detail: 'Could not reach the institution', at: stamp, state: 'current' },
      { title: 'Retry available', state: 'upcoming' },
    ];
  }
  if (status === 'pending' || status === 'submitting') {
    return [
      { title: 'Application started', at: stamp, state: 'done' },
      { title: 'Sending application', state: 'current' },
      { title: 'Awaiting institution', state: 'upcoming' },
    ];
  }
  return [
    { title: 'Application submitted', at: stamp, state: 'done' },
    { title: 'Under review', detail: 'Institution has your file', state: 'current' },
    { title: 'Decision', state: 'upcoming' },
  ];
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({});
  const [notices, setNotices] = useState<Notice[]>([]);
  const [consented, setConsentedState] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [homeFilters, setHomeFiltersState] = useState<HomeFilters>(defaultFilters);
  const [appFilter, setAppFilter] = useState<AppListFilter>('all');
  const [pendingApplyIds, setPendingApplyIds] = useState<string[]>([]);
  const hydrated = useRef(false);

  const user = useMemo(
    () => users.find((item) => item.id === sessionUserId) ?? null,
    [users, sessionUserId],
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!alive) return;
        if (raw) {
          const parsed = JSON.parse(raw) as Persist;
          setUsers(parsed.users ?? []);
          setSessionUserId(parsed.sessionUserId ?? null);
          setApplications(parsed.applications ?? []);
          setChats(parsed.chats ?? {});
          setNotices(parsed.notices ?? []);
          setConsentedState(Boolean(parsed.consented));
          setOnboardingDone(Boolean(parsed.onboardingDone));
          setHomeFiltersState(parsed.homeFilters ?? defaultFilters);
        }
        hydrated.current = true;
        setReady(true);
      } catch {
        if (!alive) return;
        setBootError('Scholarship Connect could not load saved data on this device.');
        hydrated.current = true;
        setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const payload: Persist = {
      users,
      sessionUserId,
      applications,
      chats,
      notices,
      consented,
      onboardingDone,
      homeFilters,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => {});
  }, [
    users,
    sessionUserId,
    applications,
    chats,
    notices,
    consented,
    onboardingDone,
    homeFilters,
  ]);

  const updateUser = useCallback((userId: string, patch: Partial<User> | ((current: User) => User)) => {
    setUsers((list) =>
      list.map((item) => {
        if (item.id !== userId) return item;
        return typeof patch === 'function' ? patch(item) : { ...item, ...patch };
      }),
    );
  }, []);

  const pushNotice = useCallback((text: string) => {
    setNotices((list) => [
      { id: nid('note'), text, read: false, createdAt: Date.now() },
      ...list,
    ].slice(0, 40));
  }, []);

  const setConsented = useCallback((value: boolean) => {
    setConsentedState(value);
  }, []);

  const completeOnboarding = useCallback(() => {
    setOnboardingDone(true);
  }, []);

  const signUp = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      const email = input.email.trim().toLowerCase();
      if (users.some((item) => item.email === email)) {
        return { ok: false as const, error: 'An account with this email already exists.' };
      }
      const passwordHash = await hashPassword(input.password);
      const next = blankUser({
        id: nid('user'),
        name: input.name.trim(),
        email,
        passwordHash,
      });
      setUsers((list) => [...list, next]);
      setSessionUserId(next.id);
      setConsentedState(true);
      setOnboardingDone(true);
      hapticSuccess();
      return { ok: true as const };
    },
    [users],
  );

  const signIn = useCallback(
    async (input: { email: string; password: string }) => {
      const email = input.email.trim().toLowerCase();
      const passwordHash = await hashPassword(input.password);
      const found = users.find((item) => item.email === email && item.passwordHash === passwordHash);
      if (!found) {
        return { ok: false as const, error: 'Email or password is incorrect.' };
      }
      setSessionUserId(found.id);
      setOnboardingDone(true);
      hapticSuccess();
      return { ok: true as const };
    },
    [users],
  );

  const openDemo = useCallback(async () => {
    const email = 'demo@scholarshipconnect.app';
    const passwordHash = await hashPassword('demo1234');
    let demo = users.find((item) => item.email === email);
    const createdNew = !demo;
    if (!demo) {
      demo = {
        ...blankUser({
          id: nid('demo'),
          name: 'Amina Yusuf',
          email,
          passwordHash,
        }),
        photoUri: null,
        dateOfBirth: '12 Mar 2000',
        nationality: 'Nigeria',
        contactEmail: email,
        academics: [
          {
            id: nid('deg'),
            degree: "BSc Computer Science",
            institution: 'University of Lagos',
            gpa: 'First class',
            year: '2023',
          },
        ],
        languages: 'English, Yoruba',
        ielts: '7.5',
        toefl: '',
        sat: '',
        countryCodes: ['United Kingdom', 'Germany', 'Canada', 'United States', 'Australia', 'France'],
        savedIds: ['chevening', 'daad'],
      };
      setUsers((list) => [...list, demo!]);
    } else {
      updateUser(demo.id, {
        name: demo.name || 'Amina Yusuf',
        passwordHash,
        dateOfBirth: demo.dateOfBirth || '12 Mar 2000',
        nationality: demo.nationality || 'Nigeria',
        academics:
          demo.academics[0]?.degree
            ? demo.academics
            : [
                {
                  id: nid('deg'),
                  degree: "BSc Computer Science",
                  institution: 'University of Lagos',
                  gpa: 'First class',
                  year: '2023',
                },
              ],
        countryCodes:
          demo.countryCodes.length > 0
            ? demo.countryCodes
            : ['United Kingdom', 'Germany', 'Canada', 'United States', 'Australia', 'France'],
      });
    }

    const demoId = demo.id;
    const hasApps = applications.some((item) => item.userId === demoId);
    if (createdNew || !hasApps) {
      const now = new Date();
      const seeds: Application[] = [
        {
          id: nid('app'),
          userId: demoId,
          scholarshipId: 'chevening',
          status: 'submitted',
          submittedAt: now.toISOString(),
          updatedAt: now.toISOString(),
          listDate: '15 Mar 2024',
          timeline: makeTimeline('submitted', now),
          messages: [
            {
              id: nid('msg'),
              from: 'UK Government',
              body: 'We received your initial application for Chevening Scholarship.',
              at: now.toISOString(),
            },
          ],
          order: Date.now() + 4,
        },
        {
          id: nid('app'),
          userId: demoId,
          scholarshipId: 'daad',
          status: 'in review',
          submittedAt: now.toISOString(),
          updatedAt: now.toISOString(),
          listDate: '12 Mar 2024',
          timeline: [
            { title: 'Application submitted', at: formatStamp(now), state: 'done' },
            { title: 'Under review', detail: 'Institution has your file', at: formatStamp(now), state: 'current' },
            { title: 'Decision', state: 'upcoming' },
          ],
          messages: [
            {
              id: nid('msg'),
              from: 'German Academic Exchange Service',
              body: 'Your file is with the selection committee.',
              at: now.toISOString(),
            },
          ],
          order: Date.now() + 3,
        },
        {
          id: nid('app'),
          userId: demoId,
          scholarshipId: 'australia-awards',
          status: 'pending',
          submittedAt: null,
          updatedAt: now.toISOString(),
          listDate: '10 Mar 2024',
          timeline: makeTimeline('pending', now),
          messages: [],
          order: Date.now() + 2,
        },
        {
          id: nid('app'),
          userId: demoId,
          scholarshipId: 'eiffel',
          status: 'accepted',
          submittedAt: now.toISOString(),
          updatedAt: now.toISOString(),
          listDate: '8 Mar 2024',
          timeline: [
            { title: 'Application submitted', at: formatStamp(now), state: 'done' },
            { title: 'Under review', at: formatStamp(now), state: 'done' },
            { title: 'Accepted', detail: 'Congratulations — the institution accepted your file.', at: formatStamp(now), state: 'current' },
          ],
          messages: [
            {
              id: nid('msg'),
              from: 'French Government',
              body: 'Your Eiffel Excellence application was accepted for the next step.',
              at: now.toISOString(),
            },
          ],
          order: Date.now() + 1,
        },
      ];
      setApplications((list) => {
        const withoutDemo = list.filter((item) => item.userId !== demoId);
        return [...seeds, ...withoutDemo];
      });
    }

    setSessionUserId(demoId);
    setConsentedState(true);
    setOnboardingDone(true);
    pushNotice('Demo profile ready with sample applications across every status.');
    hapticSuccess();
  }, [applications, pushNotice, updateUser, users]);

  const refreshApplicationStatuses = useCallback(() => {
    if (!user) return;
    setApplications((list) =>
      list.map((item) => {
        if (item.userId !== user.id) return item;
        if (item.status === 'submitted') {
          const stamp = new Date();
          return {
            ...item,
            status: 'in review',
            updatedAt: stamp.toISOString(),
            timeline: [
              { title: 'Application submitted', at: item.submittedAt ? formatStamp(new Date(item.submittedAt)) : undefined, state: 'done' },
              { title: 'Under review', detail: 'Institution has your file', at: formatStamp(stamp), state: 'current' },
              { title: 'Decision', state: 'upcoming' },
            ],
            messages: [
              {
                id: nid('msg'),
                from: scholarshipById(item.scholarshipId)?.institution ?? 'Institution',
                body: 'Your application moved into review.',
                at: stamp.toISOString(),
              },
              ...item.messages,
            ],
          };
        }
        if (item.status === 'pending') {
          const stamp = new Date();
          return {
            ...item,
            status: 'submitted',
            submittedAt: stamp.toISOString(),
            updatedAt: stamp.toISOString(),
            listDate: formatDay(stamp),
            timeline: makeTimeline('submitted', stamp),
          };
        }
        return item;
      }),
    );
    pushNotice('Application statuses refreshed.');
  }, [pushNotice, user]);

  const signOut = useCallback(() => {
    setSessionUserId(null);
    setPendingApplyIds([]);
  }, []);

  const requestPasswordReset = useCallback(
    async (email: string) => {
      const found = users.find((item) => item.email === email.trim().toLowerCase());
      if (!found) {
        return { ok: false as const, error: 'No account uses that email on this device.' };
      }
      pushNotice(`Password reset link prepared for ${found.email}. Open Change password in Profile to set a new one.`);
      return {
        ok: true as const,
        message: 'Check in-app notifications for your reset steps. Email delivery is unavailable in this preview.',
      };
    },
    [pushNotice, users],
  );

  const changePassword = useCallback(
    async (current: string, next: string) => {
      if (!user) return { ok: false as const, error: 'Sign in to change your password.' };
      const currentHash = await hashPassword(current);
      if (user.passwordHash !== currentHash) {
        return { ok: false as const, error: 'Current password is incorrect.' };
      }
      const passwordHash = await hashPassword(next);
      updateUser(user.id, { passwordHash });
      pushNotice('Your password was updated.');
      hapticSuccess();
      return { ok: true as const };
    },
    [pushNotice, updateUser, user],
  );

  const saveProfile = useCallback(
    async (draft: ProfileDraft) => {
      if (!user) return { ok: false as const, error: 'Sign in to save your profile.' };
      updateUser(user.id, (current) => ({
        ...current,
        ...draft,
        academics: draft.academics ?? current.academics,
        notifications: draft.notifications ?? current.notifications,
      }));
      hapticSuccess();
      return { ok: true as const };
    },
    [updateUser, user],
  );

  const saveCountries = useCallback(
    async (codes: string[]) => {
      if (!user) return { ok: false as const, error: 'Sign in to save countries.' };
      if (codes.length === 0) {
        return { ok: false as const, error: 'Select at least one country.' };
      }
      updateUser(user.id, { countryCodes: codes });
      pushNotice(`Matched to scholarships in ${codes.slice(0, 3).join(', ')}${codes.length > 3 ? ' and more' : ''}.`);
      hapticSuccess();
      return { ok: true as const };
    },
    [pushNotice, updateUser, user],
  );

  const setHomeFilters = useCallback((next: Partial<HomeFilters>) => {
    setHomeFiltersState((current) => ({ ...current, ...next }));
  }, []);

  const toggleSaved = useCallback(
    (scholarshipId: string) => {
      if (!user) return;
      updateUser(user.id, (current) => {
        const has = current.savedIds.includes(scholarshipId);
        return {
          ...current,
          savedIds: has
            ? current.savedIds.filter((id) => id !== scholarshipId)
            : [...current.savedIds, scholarshipId],
        };
      });
    },
    [updateUser, user],
  );

  const getMatches = useCallback(() => {
    if (!user) return [];
    return matchedScholarships(user, homeFilters);
  }, [homeFilters, user]);

  const queueEligibleApply = useCallback(() => {
    const ids = getMatches().map((item) => item.id);
    setPendingApplyIds(ids);
    return ids;
  }, [getMatches]);

  const submitApplications = useCallback(
    async (ids: string[]) => {
      if (!user || ids.length === 0) return { submitted: 0, failed: 0 };
      const existing = new Set(
        applications.filter((item) => item.userId === user.id).map((item) => item.scholarshipId),
      );
      const now = new Date();
      const created: Application[] = ids
        .filter((id) => !existing.has(id))
        .map((scholarshipId, index) => ({
          id: nid('app'),
          userId: user.id,
          scholarshipId,
          status: 'pending' as ApplicationStatus,
          submittedAt: null,
          updatedAt: now.toISOString(),
          listDate: formatDay(now),
          timeline: makeTimeline('pending', now),
          messages: [],
          order: Date.now() + index,
        }));
      if (created.length === 0) {
        return { submitted: 0, failed: 0 };
      }
      setApplications((list) => [...created, ...list]);

      let submitted = 0;
      let failed = 0;
      for (let index = 0; index < created.length; index += 1) {
        const app = created[index];
        setApplications((list) =>
          list.map((item) =>
            item.id === app.id
              ? {
                  ...item,
                  status: 'submitting',
                  updatedAt: new Date().toISOString(),
                  timeline: makeTimeline('submitting', new Date()),
                }
              : item,
          ),
        );
        await new Promise((resolve) => setTimeout(resolve, 700));
        const forceFail = index === created.length - 1 && created.length > 2 && index % 5 === 4;
        if (forceFail) {
          failed += 1;
          setApplications((list) =>
            list.map((item) =>
              item.id === app.id
                ? {
                    ...item,
                    status: 'failed',
                    error: 'Network interruption while sending.',
                    updatedAt: new Date().toISOString(),
                    timeline: makeTimeline('failed', new Date()),
                  }
                : item,
            ),
          );
        } else {
          submitted += 1;
          const stamp = new Date();
          const scholarship = scholarshipById(app.scholarshipId);
          setApplications((list) =>
            list.map((item) =>
              item.id === app.id
                ? {
                    ...item,
                    status: 'submitted',
                    submittedAt: stamp.toISOString(),
                    updatedAt: stamp.toISOString(),
                    listDate: formatDay(stamp),
                    timeline: makeTimeline('submitted', stamp),
                    messages: [
                      {
                        id: nid('msg'),
                        from: scholarship?.institution ?? 'Institution',
                        body: `We received your initial application for ${scholarship?.name ?? 'this scholarship'}.`,
                        at: stamp.toISOString(),
                      },
                    ],
                  }
                : item,
            ),
          );
        }
      }

      if (user.notifications.applications) {
        pushNotice(
          submitted > 0
            ? `${submitted} application${submitted === 1 ? '' : 's'} submitted.`
            : 'Applications could not be submitted.',
        );
      }
      if (submitted > 0) hapticSuccess();
      setPendingApplyIds([]);
      return { submitted, failed };
    },
    [applications, pushNotice, user],
  );

  const retryApplication = useCallback(
    async (id: string) => {
      if (!user) return;
      setApplications((list) =>
        list.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'submitting',
                error: undefined,
                updatedAt: new Date().toISOString(),
                timeline: makeTimeline('submitting', new Date()),
              }
            : item,
        ),
      );
      await new Promise((resolve) => setTimeout(resolve, 800));
      const stamp = new Date();
      setApplications((list) =>
        list.map((item) => {
          if (item.id !== id) return item;
          const scholarship = scholarshipById(item.scholarshipId);
          return {
            ...item,
            status: 'submitted',
            submittedAt: stamp.toISOString(),
            updatedAt: stamp.toISOString(),
            listDate: formatDay(stamp),
            timeline: makeTimeline('submitted', stamp),
            messages: [
              {
                id: nid('msg'),
                from: scholarship?.institution ?? 'Institution',
                body: `We received your initial application for ${scholarship?.name ?? 'this scholarship'}.`,
                at: stamp.toISOString(),
              },
              ...item.messages,
            ],
          };
        }),
      );
      pushNotice('Application submitted after retry.');
      hapticSuccess();
    },
    [pushNotice, user],
  );

  const getChat = useCallback(() => {
    if (!user) return [];
    return chats[user.id] ?? [];
  }, [chats, user]);

  const sendChat = useCallback(
    (text: string) => {
      if (!user) return;
      const trimmed = text.trim();
      if (!trimmed) return;
      const now = new Date().toISOString();
      const userMessage: ChatMessage = {
        id: nid('chat'),
        from: 'user',
        text: trimmed,
        at: now,
      };
      const reply: ChatMessage = {
        id: nid('chat'),
        from: 'support',
        text: replyFor(trimmed),
        at: new Date(Date.now() + 600).toISOString(),
      };
      setChats((map) => {
        const current = map[user.id] ?? [
          {
            id: nid('chat'),
            from: 'support',
            text: 'Hi! How can I help you with your scholarship search today?',
            at: new Date().toISOString(),
          },
        ];
        return { ...map, [user.id]: [...current, userMessage, reply] };
      });
      if (user.notifications.messages) {
        pushNotice('Support replied in Chat.');
      }
    },
    [pushNotice, user],
  );

  const markNoticesRead = useCallback(() => {
    setNotices((list) => list.map((item) => ({ ...item, read: true })));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      bootError,
      consented,
      onboardingDone,
      user,
      applications: applications
        .filter((item) => item.userId === user?.id)
        .sort((a, b) => b.order - a.order),
      notices,
      homeFilters,
      appFilter,
      pendingApplyIds,
      setBootError,
      setConsented,
      completeOnboarding,
      signUp,
      signIn,
      openDemo,
      refreshApplicationStatuses,
      signOut,
      requestPasswordReset,
      changePassword,
      saveProfile,
      saveCountries,
      setHomeFilters,
      setAppFilter,
      toggleSaved,
      setPendingApplyIds,
      queueEligibleApply,
      submitApplications,
      retryApplication,
      getMatches,
      getChat,
      sendChat,
      markNoticesRead,
      pushNotice,
    }),
    [
      appFilter,
      applications,
      bootError,
      changePassword,
      completeOnboarding,
      consented,
      getChat,
      getMatches,
      homeFilters,
      markNoticesRead,
      notices,
      onboardingDone,
      pendingApplyIds,
      pushNotice,
      queueEligibleApply,
      ready,
      requestPasswordReset,
      retryApplication,
      saveCountries,
      saveProfile,
      sendChat,
      openDemo,
      refreshApplicationStatuses,
      signIn,
      signOut,
      signUp,
      submitApplications,
      toggleSaved,
      user,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function replyFor(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes('deadline')) {
    return 'Open a scholarship card for the exact deadline. You can also sort matches by deadline from the filter sheet.';
  }
  if (lower.includes('apply') || lower.includes('application')) {
    return 'From Scholarships for you, open a match or tap Apply to all eligible, confirm the list, then watch Application progress.';
  }
  if (lower.includes('profile') || lower.includes('country')) {
    return 'Update your academic profile and country list in Profile. Matching uses those details on this device.';
  }
  return 'I can help with matching, applications, or your profile. Ask about a country, a deadline, or a status.';
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppProvider');
  return value;
}

export type { Academic, ProfileDraft };

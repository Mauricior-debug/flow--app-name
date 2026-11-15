export type DegreeLevel = "Bachelor's" | "Master's" | 'PhD';
export type Funding = 'Fully Funded' | 'Partial Funding';
export type PhotoKey =
  | 'parliament'
  | 'bigben'
  | 'daad'
  | 'opera'
  | 'eiffel'
  | 'campus'
  | 'canada'
  | 'japan'
  | 'canal';

export type Scholarship = {
  id: string;
  name: string;
  institution: string;
  country: string;
  description: string;
  requirement: string;
  eligibility: string[];
  degreeLevels: DegreeLevel[];
  funding: Funding;
  deadlineLabel: string;
  deadlineISO: string;
  officialUrl: string;
  image: PhotoKey;
  hero?: PhotoKey;
  tags: string[];
  fit: number;
};

export type Academic = {
  id: string;
  degree: string;
  institution: string;
  gpa: string;
  year: string;
};

export type NotificationPrefs = {
  matches: boolean;
  applications: boolean;
  messages: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  photoUri: string | null;
  dateOfBirth: string;
  nationality: string;
  contactEmail: string;
  academics: Academic[];
  languages: string;
  ielts: string;
  toefl: string;
  sat: string;
  cvName: string | null;
  cvUri: string | null;
  countryCodes: string[];
  notifications: NotificationPrefs;
  savedIds: string[];
};

export type TimelineState = 'done' | 'current' | 'upcoming';

export type TimelineEvent = {
  title: string;
  detail?: string;
  at?: string;
  state: TimelineState;
};

export type AppMessage = {
  id: string;
  from: string;
  body: string;
  at: string;
};

export type ApplicationStatus =
  | 'pending'
  | 'submitting'
  | 'submitted'
  | 'in review'
  | 'accepted'
  | 'rejected'
  | 'failed';

export type Application = {
  id: string;
  userId: string;
  scholarshipId: string;
  status: ApplicationStatus;
  submittedAt: string | null;
  updatedAt: string;
  listDate?: string;
  timeline: TimelineEvent[];
  messages: AppMessage[];
  error?: string;
  order: number;
};

export type ChatMessage = {
  id: string;
  from: 'user' | 'support';
  text: string;
  at: string;
};

export type Notice = {
  id: string;
  text: string;
  read: boolean;
  createdAt: number;
};

export type HomeFilters = {
  degree: 'All' | DegreeLevel;
  funding: 'All' | Funding;
  savedOnly: boolean;
  sort: 'match' | 'deadline' | 'name' | 'funding';
};

export type AppListFilter = 'all' | 'submitted' | 'in review' | 'other';

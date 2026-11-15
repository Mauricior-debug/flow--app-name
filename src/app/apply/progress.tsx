import { Redirect, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, StatusPill } from '../../components/ui';
import { scholarshipById } from '../../data/scholarships';
import { useApp } from '../../store/AppContext';
import { colors, fonts, radius, space } from '../../theme';

export default function ApplicationProgressScreen() {
  const insets = useSafeAreaInsets();
  const { user, pendingApplyIds, applications, submitApplications } = useApp();
  const queuedRef = useRef<string[]>(pendingApplyIds);
  const started = useRef(false);
  const [running, setRunning] = useState(true);
  const [summary, setSummary] = useState<{ submitted: number; failed: number } | null>(null);
  const [queued] = useState(() => [...pendingApplyIds]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const ids = queuedRef.current;
    let alive = true;
    (async () => {
      if (!ids.length) {
        setRunning(false);
        setSummary({ submitted: 0, failed: 0 });
        return;
      }
      const result = await submitApplications(ids);
      if (!alive) return;
      setSummary(result);
      setRunning(false);
    })();
    return () => {
      alive = false;
    };
  }, [submitApplications]);

  if (!user) return <Redirect href="/(auth)/sign-in" />;

  const rows = applications.filter((item) => queued.includes(item.scholarshipId));
  const visible =
    rows.length > 0
      ? rows
      : queued.map((scholarshipId) => ({
          id: scholarshipId,
          scholarshipId,
          status: running ? 'submitting' : 'pending',
        }));

  const doneCount = visible.filter((item) =>
    ['submitted', 'failed', 'in review', 'accepted', 'rejected'].includes(String(item.status)),
  ).length;
  const progress = visible.length ? doneCount / visible.length : running ? 0.15 : 1;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: 140 }}>
        <Text style={styles.title}>{running ? 'Sending applications' : 'Submission finished'}</Text>
        <Text style={styles.sub}>
          {running
            ? 'Each selected scholarship is being submitted with your saved profile.'
            : summary
              ? `${summary.submitted} submitted${summary.failed ? `, ${summary.failed} failed` : ''}.`
              : 'Done.'}
        </Text>

        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
        <Text style={styles.percent}>{Math.round(progress * 100)}%</Text>

        {visible.map((item) => {
          const scholarship = scholarshipById(item.scholarshipId);
          return (
            <View key={item.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{scholarship?.name ?? 'Scholarship'}</Text>
                <Text style={styles.meta}>{scholarship?.country}</Text>
              </View>
              <StatusPill status={String(item.status)} />
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button
          label="Done"
          disabled={running}
          onPress={() =>
            router.replace({
              pathname: '/apply/success',
              params: {
                count: String(summary?.submitted ?? 0),
                failed: String(summary?.failed ?? 0),
              },
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.navy,
  },
  sub: {
    marginTop: 8,
    marginBottom: space.xl,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.body,
  },
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.field,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.blue,
  },
  percent: {
    marginTop: 8,
    marginBottom: space.xl,
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.navy,
  },
  card: {
    minHeight: 72,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: space.md,
    backgroundColor: colors.white,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.navy,
  },
  meta: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 22,
    paddingTop: 12,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
});

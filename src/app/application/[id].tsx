import * as Linking from 'expo-linking';
import { Redirect, router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, StateView, StatusPill } from '../../components/ui';
import { scholarshipById } from '../../data/scholarships';
import { ago, formatStamp } from '../../lib/format';
import { useApp } from '../../store/AppContext';
import { colors, fonts, radius, space } from '../../theme';

export default function ApplicationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, applications, retryApplication } = useApp();
  const [phase, setPhase] = useState<'loading' | 'error' | 'ready'>('loading');
  const [retrying, setRetrying] = useState(false);

  const application = applications.find((item) => item.id === id);
  const scholarship = application ? scholarshipById(application.scholarshipId) : undefined;

  useEffect(() => {
    setPhase('loading');
    const timer = setTimeout(() => {
      setPhase(application ? 'ready' : 'error');
    }, 300);
    return () => clearTimeout(timer);
  }, [application]);

  if (!user) return <Redirect href="/(auth)/sign-in" />;

  return (
    <>
      <Stack.Screen options={{ title: scholarship?.name ?? 'Application details' }} />
      {phase === 'loading' ? (
        <StateView tone="loading" title="Loading application" body="Opening the timeline for this file." />
      ) : null}
      {phase === 'error' ? (
        <StateView
          tone="error"
          title="Couldn’t load application"
          body="This application is missing or failed to open."
          actionLabel="Back"
          onAction={() => router.back()}
        />
      ) : null}
      {phase === 'ready' && application && scholarship ? (
        <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 22, paddingBottom: 48 }}>
          <View style={styles.header}>
            <Text style={styles.title}>{scholarship.name}</Text>
            <Text style={styles.meta}>
              {scholarship.institution} · {scholarship.country}
            </Text>
            <View style={{ marginTop: 12 }}>
              <StatusPill status={application.status} />
            </View>
          </View>

          <Text style={styles.section}>Timeline</Text>
          {application.timeline.map((event, index) => (
            <View key={`${event.title}-${index}`} style={styles.timelineRow}>
              <View style={styles.rail}>
                <View
                  style={[
                    styles.dot,
                    event.state === 'done' && styles.dotDone,
                    event.state === 'current' && styles.dotCurrent,
                  ]}
                />
                {index < application.timeline.length - 1 ? <View style={styles.line} /> : null}
              </View>
              <View style={{ flex: 1, paddingBottom: 18 }}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                {event.detail ? <Text style={styles.eventDetail}>{event.detail}</Text> : null}
                {event.at ? <Text style={styles.eventAt}>{event.at}</Text> : null}
              </View>
            </View>
          ))}

          <Text style={styles.section}>Messages</Text>
          {application.messages.length === 0 ? (
            <Text style={styles.empty}>No messages from the institution yet.</Text>
          ) : (
            application.messages.map((message) => (
              <View key={message.id} style={styles.message}>
                <Text style={styles.messageFrom}>{message.from}</Text>
                <Text style={styles.messageBody}>{message.body}</Text>
                <Text style={styles.messageAt}>{ago(message.at)}</Text>
              </View>
            ))
          )}

          {application.error ? (
            <Text style={styles.error}>{application.error}</Text>
          ) : null}

          <Pressable
            onPress={() => Linking.openURL(scholarship.officialUrl)}
            style={({ pressed }) => [styles.linkBtn, pressed && { opacity: 0.75 }]}
          >
            <Text style={styles.link}>Open official scholarship page</Text>
          </Pressable>

          {application.status === 'failed' ? (
            <Button
              label="Retry submission"
              loading={retrying}
              style={{ marginTop: space.xl }}
              onPress={async () => {
                setRetrying(true);
                await retryApplication(application.id);
                setRetrying(false);
              }}
            />
          ) : null}

          {application.submittedAt ? (
            <Text style={styles.footerNote}>
              Submitted {formatStamp(new Date(application.submittedAt))}
            </Text>
          ) : null}
        </ScrollView>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: space.xl,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.navy,
  },
  meta: {
    marginTop: 6,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.muted,
  },
  section: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    color: colors.navy,
    marginBottom: space.md,
    marginTop: space.md,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rail: {
    width: 18,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.line,
    marginTop: 4,
  },
  dotDone: {
    backgroundColor: colors.green,
  },
  dotCurrent: {
    backgroundColor: colors.blue,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.line,
    marginTop: 4,
  },
  eventTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
  },
  eventDetail: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.body,
  },
  eventAt: {
    marginTop: 4,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  empty: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
  },
  message: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.lg,
    marginBottom: space.md,
    backgroundColor: colors.white,
  },
  messageFrom: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.navy,
  },
  messageBody: {
    marginTop: 6,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.body,
  },
  messageAt: {
    marginTop: 8,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  error: {
    marginTop: space.md,
    color: colors.danger,
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  linkBtn: {
    marginTop: space.xl,
    minHeight: 44,
    justifyContent: 'center',
  },
  link: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.blue,
  },
  footerNote: {
    marginTop: space.xl,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
});

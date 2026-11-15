import { Redirect, router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApplicationRow } from '../../components/ApplicationRow';
import { Chip, StateView } from '../../components/ui';
import { scholarshipById } from '../../data/scholarships';
import type { Application } from '../../data/types';
import { onTabReselect } from '../../lib/tabs';
import { useApp } from '../../store/AppContext';
import { colors, fonts, space } from '../../theme';

export default function ApplicationsScreen() {
  const insets = useSafeAreaInsets();
  const { user, applications, appFilter, setAppFilter } = useApp();
  const listRef = useRef<FlatList<Application>>(null);
  const [phase, setPhase] = useState<'loading' | 'error' | 'ready'>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [loadToken, setLoadToken] = useState(0);

  useEffect(() => {
    let alive = true;
    setPhase('loading');
    const timer = setTimeout(() => {
      if (!alive) return;
      setPhase('ready');
      setRefreshing(false);
    }, 450);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [applications.length, loadToken]);

  useEffect(() => {
    return onTabReselect('applications', () => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
  }, []);

  const filtered = useMemo(() => {
    if (appFilter === 'all') return applications;
    if (appFilter === 'submitted') {
      return applications.filter((item) => item.status === 'submitted' || item.status === 'pending' || item.status === 'submitting');
    }
    if (appFilter === 'in review') {
      return applications.filter((item) => item.status === 'in review');
    }
    return applications.filter((item) =>
      ['accepted', 'rejected', 'failed'].includes(item.status),
    );
  }, [appFilter, applications]);

  if (!user) return <Redirect href="/(auth)/sign-in" />;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Applications</Text>
        <Text style={styles.sub}>Track every scholarship you asked us to send.</Text>
        <View style={styles.filters}>
          {(
            [
              ['all', 'All'],
              ['submitted', 'Submitted'],
              ['in review', 'In review'],
              ['other', 'Other'],
            ] as const
          ).map(([id, label]) => (
            <Chip
              key={id}
              label={label}
              selected={appFilter === id}
              onPress={() => setAppFilter(id)}
            />
          ))}
        </View>
      </View>

      {phase === 'loading' ? (
        <StateView tone="loading" title="Loading applications" body="Fetching your submission history." />
      ) : null}

      {phase === 'error' ? (
        <StateView
          tone="error"
          title="Couldn’t load applications"
          body="Something went wrong while reading your applications."
          actionLabel="Retry"
          onAction={() => setLoadToken((value) => value + 1)}
        />
      ) : null}

      {phase === 'ready' ? (
        <FlatList
          ref={listRef}
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={colors.blue}
              onRefresh={() => {
                setRefreshing(true);
                setLoadToken((value) => value + 1);
              }}
            />
          }
          renderItem={({ item }) => (
            <ApplicationRow
              application={item}
              scholarship={scholarshipById(item.scholarshipId)}
              onPress={() => router.push(`/application/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <StateView
              title="No applications yet"
              body="When you apply from Scholarships for you, they’ll appear here."
              actionLabel="Browse matches"
              onAction={() => router.push('/(tabs)/scholarships')}
            />
          }
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 22,
    paddingBottom: space.md,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.navy,
  },
  sub: {
    marginTop: 4,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    marginBottom: space.md,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

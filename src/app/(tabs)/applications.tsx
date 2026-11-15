import { Redirect, router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApplicationRow } from '../../components/ApplicationRow';
import { Chip, StateView } from '../../components/ui';
import { scholarshipById } from '../../data/scholarships';
import type { Application } from '../../data/types';
import { onTabReselect } from '../../lib/tabs';
import { useApp } from '../../store/AppContext';
import { colors, fonts, radius, space } from '../../theme';

export default function ApplicationsScreen() {
  const insets = useSafeAreaInsets();
  const { user, applications, appFilter, setAppFilter, refreshApplicationStatuses } = useApp();
  const listRef = useRef<FlatList<Application>>(null);
  const [phase, setPhase] = useState<'loading' | 'error' | 'ready'>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [loadToken, setLoadToken] = useState(0);
  const [query, setQuery] = useState('');

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

  const counts = useMemo(() => {
    const all = applications.length;
    const submitted = applications.filter((item) =>
      ['submitted', 'pending', 'submitting'].includes(item.status),
    ).length;
    const review = applications.filter((item) => item.status === 'in review').length;
    const other = applications.filter((item) =>
      ['accepted', 'rejected', 'failed'].includes(item.status),
    ).length;
    return { all, submitted, review, other };
  }, [applications]);

  const filtered = useMemo(() => {
    let list = applications;
    if (appFilter === 'submitted') {
      list = list.filter((item) =>
        ['submitted', 'pending', 'submitting'].includes(item.status),
      );
    } else if (appFilter === 'in review') {
      list = list.filter((item) => item.status === 'in review');
    } else if (appFilter === 'other') {
      list = list.filter((item) => ['accepted', 'rejected', 'failed'].includes(item.status));
    }
    const needle = query.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((item) => {
      const scholarship = scholarshipById(item.scholarshipId);
      return [scholarship?.name, scholarship?.institution, scholarship?.country, item.status]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [appFilter, applications, query]);

  if (!user) return <Redirect href="/(auth)/sign-in" />;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>My applications</Text>
        <Text style={styles.sub}>Track every scholarship you asked us to send.</Text>

        <View style={styles.searchRow}>
          <View style={styles.search}>
            <SymbolView name="magnifyingglass" tintColor={colors.muted} size={16} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search applications..."
              placeholderTextColor={colors.placeholder}
              style={styles.searchInput}
            />
          </View>
          <Pressable
            onPress={() => router.push('/sheets/filter')}
            style={({ pressed }) => [styles.filterBtn, pressed && { opacity: 0.75 }]}
            accessibilityRole="button"
            accessibilityLabel="Open filters"
          >
            <SymbolView name="line.3.horizontal.decrease" tintColor={colors.navy} size={18} />
          </Pressable>
        </View>

        <View style={styles.filters}>
          {(
            [
              ['all', `All (${counts.all})`],
              ['submitted', `Submitted (${counts.submitted})`],
              ['in review', `In review (${counts.review})`],
              ['other', `Other (${counts.other})`],
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
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={colors.blue}
              onRefresh={() => {
                setRefreshing(true);
                refreshApplicationStatuses();
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
              title={query ? 'No matching applications' : 'No applications yet'}
              body={
                query
                  ? 'Try another search or clear the filter chips.'
                  : 'When you apply from Scholarships for you, they’ll appear here.'
              }
              actionLabel={query ? undefined : 'Browse matches'}
              onAction={query ? undefined : () => router.push('/(tabs)/scholarships')}
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
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: space.md,
  },
  search: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: colors.field,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 12,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

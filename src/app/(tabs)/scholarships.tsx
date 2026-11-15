import { router, Redirect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
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

import { ScholarshipCard } from '../../components/ScholarshipCard';
import { Button, StateView } from '../../components/ui';
import type { Scholarship } from '../../data/types';
import { onTabReselect } from '../../lib/tabs';
import { useApp } from '../../store/AppContext';
import { colors, fonts, radius, space } from '../../theme';

export default function ScholarshipsScreen() {
  const insets = useSafeAreaInsets();
  const {
    user,
    getMatches,
    homeFilters,
    toggleSaved,
    queueEligibleApply,
    setPendingApplyIds,
  } = useApp();
  const listRef = useRef<FlatList<Scholarship>>(null);
  const [phase, setPhase] = useState<'loading' | 'error' | 'ready'>('loading');
  const [matches, setMatches] = useState<Scholarship[]>([]);
  const [query, setQuery] = useState('');

  const runMatch = useCallback(async () => {
    if (!user) return;
    setPhase('loading');
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setMatches(getMatches());
      setPhase('ready');
    } catch {
      setPhase('error');
    }
  }, [getMatches, user]);

  useEffect(() => {
    runMatch();
  }, [runMatch, homeFilters, user?.countryCodes, user?.academics]);

  useEffect(() => {
    return onTabReselect('scholarships', () => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
  }, []);

  if (!user) return <Redirect href="/(auth)/sign-in" />;
  if (!user.dateOfBirth || user.countryCodes.length === 0) {
    return <Redirect href="/(onboard)/profile-setup" />;
  }

  const countries = user.countryCodes.slice(0, 3).join(', ');
  const visible = matches.filter((item) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [item.name, item.institution, item.country, item.requirement]
      .join(' ')
      .toLowerCase()
      .includes(needle);
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>Scholarship Connect</Text>
          <Text style={styles.title}>Scholarships for you</Text>
          {phase === 'ready' && matches.length > 0 ? (
            <Text style={styles.sub}>
              You’ve been matched with scholarships in {countries}
              {user.countryCodes.length > 3 ? ' and more' : ''}. Ready to apply?
            </Text>
          ) : null}
        </View>
        <Pressable
          onPress={() => router.push('/sheets/filter')}
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel="Filter and sort"
        >
          <SymbolView name="line.3.horizontal.decrease.circle" tintColor={colors.navy} size={24} />
        </Pressable>
      </View>

      {phase === 'ready' ? (
        <View style={styles.search}>
          <SymbolView name="magnifyingglass" tintColor={colors.muted} size={16} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search matched scholarships"
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
          />
        </View>
      ) : null}

      {phase === 'loading' ? (
        <StateView
          tone="loading"
          title="Matching scholarships"
          body="Comparing your profile and countries with the global catalogue."
        />
      ) : null}

      {phase === 'error' ? (
        <StateView
          tone="error"
          title="Matching failed"
          body="We couldn’t finish matching right now."
          actionLabel="Try again"
          onAction={runMatch}
        />
      ) : null}

      {phase === 'ready' ? (
        <FlatList
          ref={listRef}
          data={visible}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={false} onRefresh={runMatch} tintColor={colors.blue} />}
          renderItem={({ item }) => (
            <ScholarshipCard
              item={item}
              saved={user.savedIds.includes(item.id)}
              onPress={() => router.push(`/scholarship/${item.id}`)}
              onToggleSave={() => toggleSaved(item.id)}
            />
          )}
          ListEmptyComponent={
            <StateView
              title={query ? 'No scholarships match that search' : 'No matches yet'}
              body={
                query
                  ? 'Clear the search or adjust filters.'
                  : 'Try more countries, update your degree details, or clear filters.'
              }
              actionLabel={query ? undefined : 'Edit countries'}
              onAction={query ? undefined : () => router.push('/(onboard)/country-selection?mode=edit')}
            />
          }
          ListHeaderComponent={
            visible.length ? (
              <Text style={styles.count}>
                {visible.length} opportunit{visible.length === 1 ? 'y' : 'ies'}
              </Text>
            ) : (
              <View />
            )
          }
        />
      ) : null}

      {phase === 'ready' && matches.length > 0 ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <Button
            label="Apply to all eligible"
            onPress={() => {
              const ids = queueEligibleApply();
              setPendingApplyIds(ids);
              router.push('/apply/confirm');
            }}
          />
        </View>
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
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  kicker: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.greenDeep,
    marginBottom: 2,
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
  },
  iconBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    marginHorizontal: 22,
    marginBottom: space.md,
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
  count: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    marginBottom: space.md,
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

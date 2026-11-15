import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Body, Button, StateView } from '../../components/ui';
import { STUDY_COUNTRIES } from '../../data/countries';
import { useApp } from '../../store/AppContext';
import { colors, fonts, radius, space } from '../../theme';

export default function CountrySelectionScreen() {
  const insets = useSafeAreaInsets();
  const { user, saveCountries } = useApp();
  const params = useLocalSearchParams<{ mode?: string }>();
  const editing = params.mode === 'edit';
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>(user?.countryCodes ?? []);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [error, setError] = useState('');

  const countries = useMemo(() => {
    if (loadError) return [];
    const needle = query.trim().toLowerCase();
    return STUDY_COUNTRIES.filter((country) => country.name.toLowerCase().includes(needle));
  }, [loadError, query]);

  function toggle(name: string) {
    setSelected((list) => (list.includes(name) ? list.filter((item) => item !== name) : [...list, name]));
    setError('');
  }

  async function onContinue() {
    if (selected.length === 0) {
      setError('Select at least one country.');
      return;
    }
    setLoading(true);
    try {
      const result = await saveCountries(selected);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (editing) router.back();
      else router.replace('/(tabs)/scholarships');
    } finally {
      setLoading(false);
    }
  }

  if (loadError) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StateView
          tone="error"
          title="Couldn’t load countries"
          body="The country list failed to open. Try again."
          actionLabel="Retry"
          onAction={() => setLoadError(false)}
        />
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom + 12 }]}>
      <View style={styles.header}>
        <Body>
          Choose where you want to study. Matching uses this list with your academic profile.
        </Body>
        <View style={styles.search}>
          <SymbolView name="magnifyingglass" tintColor={colors.muted} size={16} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search countries"
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
          />
        </View>
        <Text style={styles.count}>
          {selected.length} selected
        </Text>
      </View>

      <FlatList
        data={countries}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const on = selected.includes(item.name);
          return (
            <Pressable
              onPress={() => toggle(item.name)}
              style={({ pressed }) => [styles.row, on && styles.rowOn, pressed && { opacity: 0.88 }]}
            >
              <Text style={styles.flag}>{item.flag}</Text>
              <Text style={[styles.name, on && styles.nameOn]}>{item.name}</Text>
              <View style={[styles.check, on && styles.checkOn]}>
                {on ? <SymbolView name="checkmark" tintColor={colors.white} size={14} /> : null}
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <StateView
            title="No countries found"
            body="Try another spelling, or clear the search."
          />
        }
      />

      <View style={styles.footer}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button label={editing ? 'Save countries' : 'Continue to matches'} loading={loading} onPress={onContinue} />
      </View>
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
    paddingTop: 8,
    gap: 12,
  },
  search: {
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
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
  },
  count: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    marginBottom: 4,
  },
  row: {
    minHeight: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  rowOn: {
    borderColor: colors.blue,
    backgroundColor: colors.blueSoft,
  },
  flag: {
    fontSize: 22,
  },
  name: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
  nameOn: {
    color: colors.navy,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  error: {
    color: colors.danger,
    fontFamily: fonts.medium,
    fontSize: 13,
    marginBottom: 8,
  },
});

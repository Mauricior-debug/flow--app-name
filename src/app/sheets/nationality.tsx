import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { SheetShell } from '../../components/SheetShell';
import { Button } from '../../components/ui';
import { NATIONALITIES } from '../../data/countries';
import { commitPick } from '../../lib/picker';
import { colors, fonts, radius, space } from '../../theme';

const YEARS = Array.from({ length: 40 }, (_, index) => String(2008 - index));
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const DAYS = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, '0'));

export default function NationalitySheet() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode = params.mode === 'dob' ? 'dob' : 'nationality';
  const [query, setQuery] = useState('');
  const [day, setDay] = useState('01');
  const [month, setMonth] = useState('January');
  const [year, setYear] = useState('2000');

  const countries = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return NATIONALITIES.filter((country) => country.name.toLowerCase().includes(needle));
  }, [query]);

  function selectNationality(name: string) {
    commitPick(`nat:${name}`);
    router.back();
  }

  if (mode === 'dob') {
    return (
      <>
        <Stack.Screen options={{ title: 'Date of birth' }} />
        <SheetShell scroll>
          <Text style={styles.lead}>Pick the day you were born.</Text>
          <View style={styles.dobRow}>
            <PickerColumn label="Day" values={DAYS} value={day} onChange={setDay} />
            <PickerColumn label="Month" values={MONTHS} value={month} onChange={setMonth} />
            <PickerColumn label="Year" values={YEARS} value={year} onChange={setYear} />
          </View>
          <Button
            label="Use this date"
            onPress={() => {
              const label = `${day} ${month.slice(0, 3)} ${year}`;
              commitPick(`dob:${label}`);
              router.back();
            }}
          />
        </SheetShell>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Nationality' }} />
      <SheetShell>
        <Text style={styles.lead}>Choose the nationality on your profile.</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search nationality"
          placeholderTextColor={colors.placeholder}
          style={styles.search}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        <FlatList
          data={countries}
          keyExtractor={(item) => item.name}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          removeClippedSubviews={false}
          initialNumToRender={24}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => selectNationality(item.name)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${item.name}`}
              hitSlop={4}
              style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.blueSoft }]}
            >
              <Text style={styles.flag}>{item.flag}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No nationalities match that search.</Text>
          }
        />
      </SheetShell>
    </>
  );
}

function PickerColumn({
  label,
  values,
  value,
  onChange,
}: {
  label: string;
  values: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <View style={styles.column}>
      <Text style={styles.columnLabel}>{label}</Text>
      <View style={styles.columnBox}>
        <FlatList
          data={values}
          keyExtractor={(item) => item}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onChange(item)}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.option,
                item === value && styles.optionOn,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={[styles.optionText, item === value && styles.optionTextOn]} numberOfLines={1}>
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lead: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.body,
    marginBottom: space.md,
  },
  search: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.field,
    paddingHorizontal: 14,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    marginBottom: space.md,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 12,
  },
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    marginBottom: 4,
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
  empty: {
    marginTop: space.xl,
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
  },
  dobRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: space.xl,
    minHeight: 220,
  },
  column: {
    flex: 1,
  },
  columnLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    marginBottom: 8,
  },
  columnBox: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.field,
    overflow: 'hidden',
  },
  option: {
    minHeight: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  optionOn: {
    backgroundColor: colors.blueSoft,
  },
  optionText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.body,
  },
  optionTextOn: {
    color: colors.blue,
    fontFamily: fonts.semibold,
  },
});

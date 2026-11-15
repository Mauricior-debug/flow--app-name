import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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

  if (mode === 'dob') {
    return (
      <View style={styles.root}>
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
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search nationality"
        placeholderTextColor={colors.placeholder}
        style={styles.search}
      />
      <FlatList
        data={countries}
        keyExtractor={(item) => item.name}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              commitPick(`nat:${item.name}`);
              router.back();
            }}
            style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.field }]}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
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
      <FlatList
        data={values}
        keyExtractor={(item) => item}
        style={{ maxHeight: 180 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onChange(item)}
            style={({ pressed }) => [
              styles.option,
              item === value && styles.optionOn,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={[styles.optionText, item === value && styles.optionTextOn]}>{item}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 22,
  },
  lead: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.body,
    marginBottom: space.lg,
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
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
  },
  flag: {
    fontSize: 20,
  },
  name: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
  dobRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: space.xl,
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
  option: {
    minHeight: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
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

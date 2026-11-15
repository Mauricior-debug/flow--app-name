import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Chip } from '../../components/ui';
import type { DegreeLevel, Funding, HomeFilters } from '../../data/types';
import { useApp } from '../../store/AppContext';
import { colors, fonts, space } from '../../theme';

export default function FilterSheet() {
  const { homeFilters, setHomeFilters } = useApp();
  const [degree, setDegree] = useState<HomeFilters['degree']>(homeFilters.degree);
  const [funding, setFunding] = useState<HomeFilters['funding']>(homeFilters.funding);
  const [savedOnly, setSavedOnly] = useState(homeFilters.savedOnly);
  const [sort, setSort] = useState<HomeFilters['sort']>(homeFilters.sort);

  const degrees: Array<HomeFilters['degree']> = ['All', "Bachelor's", "Master's", 'PhD'];
  const fundings: Array<HomeFilters['funding']> = ['All', 'Fully Funded', 'Partial Funding'];
  const sorts: Array<{ id: HomeFilters['sort']; label: string }> = [
    { id: 'match', label: 'Best match' },
    { id: 'deadline', label: 'Deadline' },
    { id: 'name', label: 'Name' },
    { id: 'funding', label: 'Funding' },
  ];

  return (
    <View style={styles.root}>
      <Text style={styles.label}>Degree level</Text>
      <View style={styles.wrap}>
        {degrees.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={degree === item}
            onPress={() => setDegree(item as DegreeLevel | 'All')}
          />
        ))}
      </View>

      <Text style={styles.label}>Funding</Text>
      <View style={styles.wrap}>
        {fundings.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={funding === item}
            onPress={() => setFunding(item as Funding | 'All')}
          />
        ))}
      </View>

      <Text style={styles.label}>Saved</Text>
      <View style={styles.wrap}>
        <Chip label="All matches" selected={!savedOnly} onPress={() => setSavedOnly(false)} />
        <Chip label="Saved only" selected={savedOnly} onPress={() => setSavedOnly(true)} />
      </View>

      <Text style={styles.label}>Sort by</Text>
      <View style={styles.wrap}>
        {sorts.map((item) => (
          <Chip
            key={item.id}
            label={item.label}
            selected={sort === item.id}
            onPress={() => setSort(item.id)}
          />
        ))}
      </View>

      <Button
        label="Apply filters"
        style={{ marginTop: space.xl }}
        onPress={() => {
          setHomeFilters({ degree, funding, savedOnly, sort });
          router.back();
        }}
      />
      <Button
        label="Reset"
        tone="ghost"
        onPress={() => {
          setDegree('All');
          setFunding('All');
          setSavedOnly(false);
          setSort('match');
        }}
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
  label: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.navy,
    marginBottom: 10,
    marginTop: 8,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
});

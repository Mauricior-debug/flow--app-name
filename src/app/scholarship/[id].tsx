import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageHeader } from '../../components/PageHeader';
import { Button, Chip, StateView } from '../../components/ui';
import { photos } from '../../data/photos';
import { scholarshipById } from '../../data/scholarships';
import { useApp } from '../../store/AppContext';
import { colors, fonts, radius, space } from '../../theme';

export default function ScholarshipDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, setPendingApplyIds } = useApp();
  const [phase, setPhase] = useState<'loading' | 'error' | 'ready'>('loading');

  const scholarship = id ? scholarshipById(id) : undefined;

  useEffect(() => {
    setPhase('loading');
    const timer = setTimeout(() => {
      setPhase(scholarship ? 'ready' : 'error');
    }, 350);
    return () => clearTimeout(timer);
  }, [scholarship]);

  if (!user) return <Redirect href="/(auth)/sign-in" />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <PageHeader
        title={scholarship?.name ?? 'Scholarship details'}
        backLabel="Matches"
        onBack={() => router.back()}
      />
      {phase === 'loading' ? (
        <StateView tone="loading" title="Loading details" body="Opening this scholarship." />
      ) : null}
      {phase === 'error' ? (
        <StateView
          tone="error"
          title="Couldn’t load details"
          body="This scholarship is missing or failed to open."
          actionLabel="Back to matches"
          onAction={() => router.back()}
        />
      ) : null}
      {phase === 'ready' && scholarship ? (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            <Image
              source={photos[scholarship.hero ?? scholarship.image]}
              style={styles.hero}
              contentFit="cover"
            />
            <View style={styles.body}>
              <Text style={styles.title}>{scholarship.name}</Text>
              <Text style={styles.meta}>
                {scholarship.institution} · {scholarship.country}
              </Text>
              <View style={styles.chips}>
                {scholarship.tags.map((tag) => (
                  <Chip key={tag} label={tag} />
                ))}
              </View>
              <Text style={styles.section}>About</Text>
              <Text style={styles.copy}>{scholarship.description}</Text>
              <Text style={styles.section}>Eligibility</Text>
              {scholarship.eligibility.map((item) => (
                <Text key={item} style={styles.bullet}>
                  • {item}
                </Text>
              ))}
              <Text style={styles.section}>Deadline</Text>
              <Text style={styles.copy}>{scholarship.deadlineLabel}</Text>
              <Pressable
                onPress={() => Linking.openURL(scholarship.officialUrl)}
                style={({ pressed }) => [styles.linkBtn, pressed && { opacity: 0.75 }]}
              >
                <Text style={styles.link}>Open official scholarship page</Text>
              </Pressable>
            </View>
          </ScrollView>
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <Button
              label="Apply"
              onPress={() => {
                setPendingApplyIds([scholarship.id]);
                router.push('/apply/confirm');
              }}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 210,
    backgroundColor: colors.field,
  },
  body: {
    padding: 22,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.navy,
  },
  meta: {
    marginTop: 6,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.muted,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: space.lg,
    marginBottom: space.lg,
  },
  section: {
    marginTop: space.lg,
    marginBottom: 8,
    fontFamily: fonts.semibold,
    fontSize: 17,
    color: colors.navy,
  },
  copy: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: colors.body,
  },
  bullet: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.body,
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

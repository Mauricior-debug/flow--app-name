import { Redirect, router } from 'expo-router';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui';
import { photos } from '../../data/photos';
import { scholarshipById } from '../../data/scholarships';
import { useApp } from '../../store/AppContext';
import { colors, fonts, radius, space } from '../../theme';

export default function ApplicationConfirmScreen() {
  const insets = useSafeAreaInsets();
  const { user, pendingApplyIds, applications } = useApp();

  if (!user) return <Redirect href="/(auth)/sign-in" />;

  const existing = new Set(applications.map((item) => item.scholarshipId));
  const items = pendingApplyIds
    .map((id) => scholarshipById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const fresh = items.filter((item) => !existing.has(item.id));
  const already = items.filter((item) => existing.has(item.id));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <PageHeader title="Confirm applications" backLabel="Back" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: 140 }}>
        <Text style={styles.headline}>Ready to apply?</Text>
        <Text style={styles.lead}>
          Scholarship Connect will send the initial application for each scholarship below using your
          saved profile and academic details.
        </Text>

        <Text style={styles.section}>
          {fresh.length} scholarship{fresh.length === 1 ? '' : 's'} selected
        </Text>
        {fresh.length === 0 ? (
          <Text style={styles.empty}>
            Every selected scholarship already has an application on this device.
          </Text>
        ) : (
          fresh.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={photos[item.image]} style={styles.thumb} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.institution} · {item.country}
                </Text>
                <Text style={styles.meta}>Deadline {item.deadlineLabel}</Text>
              </View>
            </View>
          ))
        )}

        {already.length ? (
          <>
            <Text style={styles.section}>Already applied</Text>
            {already.map((item) => (
              <Text key={item.id} style={styles.already}>
                {item.name}
              </Text>
            ))}
          </>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button
          label="Apply now"
          disabled={fresh.length === 0}
          onPress={() => router.replace('/apply/progress')}
        />
        <Button label="Cancel" tone="ghost" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headline: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.navy,
    marginBottom: space.sm,
  },
  lead: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: colors.body,
    marginBottom: space.xl,
  },
  section: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    color: colors.navy,
    marginBottom: space.md,
  },
  empty: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    marginBottom: space.lg,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.md,
    backgroundColor: colors.white,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.field,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.navy,
  },
  meta: {
    marginTop: 4,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  already: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    marginBottom: 6,
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
    gap: 4,
  },
});

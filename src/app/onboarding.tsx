import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Body, Button, Checkbox, Headline, LogoMark, Screen } from '../components/ui';
import { useApp } from '../store/AppContext';
import { colors, fonts, radius, space } from '../theme';

const highlights = [
  {
    title: 'One profile',
    body: 'Upload your academic details once and reuse them across scholarships.',
  },
  {
    title: 'Matched for you',
    body: 'See programmes that fit your countries and qualifications.',
  },
  {
    title: 'Apply in one step',
    body: 'Send the initial application to one or many institutions from here.',
  },
];

export default function OnboardingScreen() {
  const { setConsented, completeOnboarding } = useApp();
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  return (
    <Screen contentStyle={{ paddingBottom: 40 }}>
      <View style={styles.hero}>
        <LogoMark size={72} />
        <Headline style={{ marginTop: space.xl, textAlign: 'center' }}>
          Your gateway to global scholarships
        </Headline>
        <Body style={{ marginTop: space.md, textAlign: 'center' }}>
          Scholarship Connect warehouses global programmes, matches them to your profile, and sends
          the first application when you say yes.
        </Body>
      </View>

      <View style={styles.list}>
        {highlights.map((item) => (
          <View key={item.title} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
          </View>
        ))}
      </View>

      <Checkbox
        checked={consent}
        onChange={(value) => {
          setConsent(value);
          setError('');
        }}
        label={
          <Text style={styles.consent}>
            I agree that Scholarship Connect may store my profile and academic details on this device
            to match scholarships and prepare applications.
          </Text>
        }
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        label="Continue"
        style={{ marginTop: space.xl }}
        onPress={() => {
          if (!consent) {
            setError('Tick the consent box to continue.');
            return;
          }
          setConsented(true);
          completeOnboarding();
          router.push('/(auth)/sign-up');
        }}
      />
      <Button
        label="I already have an account"
        tone="ghost"
        onPress={() => {
          completeOnboarding();
          router.push('/(auth)/sign-in');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: space.xxl,
  },
  list: {
    gap: space.md,
    marginBottom: space.xxl,
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.field,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  cardTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.navy,
    marginBottom: 4,
  },
  cardBody: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.body,
  },
  consent: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.body,
  },
  error: {
    marginTop: 8,
    color: colors.danger,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
});

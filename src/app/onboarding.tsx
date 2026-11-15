import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { Button, Checkbox, LogoMark, Screen } from '../components/ui';
import { useApp } from '../store/AppContext';
import { colors, fonts, radius, space } from '../theme';

const highlights = [
  {
    title: 'Find global opportunities',
    body: 'Access thousands of scholarships from around the world.',
    icon: 'magnifyingglass' as const,
  },
  {
    title: 'Get matched to your profile',
    body: 'We recommend scholarships that fit you.',
    icon: 'person.2.fill' as const,
  },
  {
    title: 'Apply seamlessly',
    body: 'Let us handle the initial application process for you.',
    icon: 'paperplane.fill' as const,
  },
];

export default function OnboardingScreen() {
  const { setConsented, completeOnboarding } = useApp();
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState('');
  const [showPolicy, setShowPolicy] = useState(false);

  return (
    <Screen contentStyle={{ paddingBottom: 40 }}>
      <View style={styles.hero}>
        <LogoMark size={64} />
        <Text style={styles.brand}>
          Scholarship{'\n'}
          <Text style={{ color: colors.green }}>Connect</Text>
        </Text>
        <Text style={styles.headline}>A brighter future is within reach</Text>
        <Text style={styles.tagline}>Discover. Match. Apply. Go further.</Text>
      </View>

      <View style={styles.list}>
        {highlights.map((item) => (
          <View key={item.title} style={styles.row}>
            <View style={styles.iconWrap}>
              <SymbolView name={item.icon} tintColor={colors.blue} size={18} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{item.body}</Text>
            </View>
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
            I agree to the collection and use of my personal data as described in our{' '}
            <Text
              style={styles.policy}
              onPress={() => setShowPolicy((open) => !open)}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        }
      />
      {showPolicy ? (
        <View style={styles.policyBox}>
          <Text style={styles.policyTitle}>Privacy Policy</Text>
          <Text style={styles.policyBody}>
            Scholarship Connect stores your account, academic profile, country preferences, uploaded
            files, and application records on this device so we can match scholarships and send the
            initial application when you ask us to. We do not sell your data. You can edit or clear
            your profile and applications from Profile & settings.
          </Text>
        </View>
      ) : null}
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
      <Pressable
        onPress={() => {
          completeOnboarding();
          router.push('/(auth)/sign-in');
        }}
        style={({ pressed }) => [styles.signInLink, pressed && { opacity: 0.7 }]}
      >
        <Text style={styles.signInText}>Already have an account? Sign in</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: space.xxl,
  },
  brand: {
    marginTop: space.lg,
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.navy,
    textAlign: 'center',
  },
  headline: {
    marginTop: space.xxl,
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    color: colors.navy,
    textAlign: 'center',
  },
  tagline: {
    marginTop: space.sm,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
  },
  list: {
    gap: space.xl,
    marginBottom: space.xxl,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
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
  policy: {
    color: colors.blue,
    textDecorationLine: 'underline',
    fontFamily: fonts.medium,
  },
  policyBox: {
    marginTop: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.field,
    borderWidth: 1,
    borderColor: colors.line,
  },
  policyTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.navy,
    marginBottom: 6,
  },
  policyBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.body,
  },
  error: {
    marginTop: 8,
    color: colors.danger,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  signInLink: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  signInText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.blue,
  },
});

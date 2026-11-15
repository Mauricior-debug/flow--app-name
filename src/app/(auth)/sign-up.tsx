import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Body, Button, Field, Headline, LogoMark, PasswordField, Screen } from '../../components/ui';
import { isEmail } from '../../lib/format';
import { useApp } from '../../store/AppContext';
import { colors, fonts, space } from '../../theme';

export default function SignUpScreen() {
  const { signUp } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  async function onSubmit() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Enter your name.';
    if (!isEmail(email)) next.email = 'Enter a valid email.';
    if (password.length < 8) next.password = 'Use at least 8 characters.';
    if (password !== confirm) next.confirm = 'Passwords do not match.';
    setErrors(next);
    setFormError('');
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const result = await signUp({ name, email, password });
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      router.replace('/(onboard)/profile-setup');
    } catch {
      setFormError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <LogoMark size={64} />
        <Headline style={{ marginTop: space.lg }}>Create your account</Headline>
        <Body style={{ marginTop: space.sm, textAlign: 'center' }}>
          Save your profile, matches, and applications on this device.
        </Body>
      </View>

      <Field
        label="Full name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        placeholder="Amina Okeke"
        error={errors.name}
      />
      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@email.com"
        error={errors.email}
      />
      <PasswordField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="At least 8 characters"
        error={errors.password}
      />
      <PasswordField
        label="Confirm password"
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Repeat password"
        error={errors.confirm}
      />

      {formError ? <Text style={styles.error}>{formError}</Text> : null}

      <Button label="Sign up" loading={loading} onPress={onSubmit} />
      <Text style={styles.footer}>
        Already have an account?{' '}
        <Link href="/(auth)/sign-in" style={styles.link}>
          Sign in
        </Link>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: space.xxl,
  },
  error: {
    color: colors.danger,
    fontFamily: fonts.medium,
    fontSize: 14,
    marginBottom: space.md,
  },
  footer: {
    marginTop: space.xl,
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.body,
  },
  link: {
    color: colors.blue,
    fontFamily: fonts.semibold,
  },
});

import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Body, Button, Field, Headline, LogoMark, PasswordField, Screen } from '../../components/ui';
import { isEmail } from '../../lib/format';
import { useApp } from '../../store/AppContext';
import { colors, fonts, space } from '../../theme';

export default function SignInScreen() {
  const { signIn } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  async function onSubmit() {
    const next: Record<string, string> = {};
    if (!isEmail(email)) next.email = 'Enter a valid email.';
    if (!password) next.password = 'Enter your password.';
    setErrors(next);
    setFormError('');
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const result = await signIn({ email, password });
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      router.replace('/(tabs)/scholarships');
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
        <Headline style={{ marginTop: space.lg }}>Welcome back</Headline>
        <Body style={{ marginTop: space.sm, textAlign: 'center' }}>
          Sign in to continue matching and tracking applications.
        </Body>
      </View>

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
        placeholder="Your password"
        error={errors.password}
      />

      <Link href="/(auth)/password-reset" style={styles.forgot}>
        Forgot password?
      </Link>

      {formError ? <Text style={styles.error}>{formError}</Text> : null}

      <Button label="Sign in" loading={loading} onPress={onSubmit} />
      <Text style={styles.footer}>
        New here?{' '}
        <Link href="/(auth)/sign-up" style={styles.link}>
          Sign up
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
  forgot: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: space.lg,
    color: colors.blue,
    fontFamily: fonts.semibold,
    fontSize: 14,
    minHeight: 44,
    paddingTop: 12,
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

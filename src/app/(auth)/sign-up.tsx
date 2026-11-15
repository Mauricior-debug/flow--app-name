import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { Button, Headline, LogoMark, PasswordField, Screen } from '../../components/ui';
import { isEmail } from '../../lib/format';
import { useApp } from '../../store/AppContext';
import { colors, fonts, radius, space } from '../../theme';

function IconField({
  icon,
  error,
  ...rest
}: TextInputProps & {
  icon: React.ComponentProps<typeof SymbolView>['name'];
  error?: string;
}) {
  return (
    <View style={styles.fieldWrap}>
      <View style={[styles.field, error ? styles.fieldError : null]}>
        <SymbolView name={icon} tintColor={colors.muted} size={18} />
        <TextInput
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          {...rest}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

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
    <Screen safeTop={false}>
      <View style={styles.hero}>
        <LogoMark size={56} />
        <Text style={styles.brand}>
          Scholarship <Text style={{ color: colors.green }}>Connect</Text>
        </Text>
        <Headline style={{ marginTop: space.xl, textAlign: 'center' }}>Create your account</Headline>
        <Text style={styles.sub}>
          Join students accessing global scholarship opportunities.
        </Text>
      </View>

      <IconField
        icon="person.fill"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        placeholder="Full name"
        error={errors.name}
      />
      <IconField
        icon="envelope.fill"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email address"
        error={errors.email}
      />
      <PasswordField
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        error={errors.password}
      />
      <PasswordField
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Confirm password"
        error={errors.confirm}
      />

      {formError ? <Text style={styles.error}>{formError}</Text> : null}

      <Button label="Sign Up" loading={loading} onPress={onSubmit} />
      <Text style={styles.footer}>
        Already have an account?{' '}
        <Link href="/(auth)/sign-in" style={styles.link}>
          Sign In
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
  brand: {
    marginTop: space.md,
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.navy,
  },
  sub: {
    marginTop: space.sm,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  fieldWrap: {
    marginBottom: space.lg,
  },
  field: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.field,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 14,
  },
  errorText: {
    marginTop: 6,
    color: colors.danger,
    fontFamily: fonts.medium,
    fontSize: 13,
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

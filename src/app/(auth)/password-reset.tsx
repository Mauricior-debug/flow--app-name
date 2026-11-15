import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { SheetShell } from '../../components/SheetShell';
import { Body, Button, Field } from '../../components/ui';
import { isEmail } from '../../lib/format';
import { useApp } from '../../store/AppContext';
import { colors, fonts, space } from '../../theme';

export default function PasswordResetSheet() {
  const { requestPasswordReset } = useApp();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit() {
    setError('');
    setMessage('');
    if (!isEmail(email)) {
      setError('Enter the email on your account.');
      return;
    }
    setLoading(true);
    try {
      const result = await requestPasswordReset(email);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage(result.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SheetShell scroll>
      <Body>
        We’ll prepare reset steps on this device. Email delivery is unavailable in this preview, so
        you’ll also see an in-app notification.
      </Body>
      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@email.com"
        error={error}
        containerStyle={{ marginTop: space.lg }}
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Button label="Send reset" loading={loading} onPress={onSubmit} />
      <Button label="Close" tone="ghost" onPress={() => router.back()} />
    </SheetShell>
  );
}

const styles = StyleSheet.create({
  message: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 21,
    color: colors.greenDeep,
    marginBottom: space.lg,
  },
});

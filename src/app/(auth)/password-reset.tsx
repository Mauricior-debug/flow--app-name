import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
    <View style={styles.root}>
      <Body>
        We’ll prepare reset steps on this device. Email delivery is unavailable in this preview, so
        you’ll also see an in-app notification.
      </Body>
      <View style={{ height: space.lg }} />
      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@email.com"
        error={error}
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Button label="Send reset" loading={loading} onPress={onSubmit} />
      <Button label="Close" tone="ghost" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 22,
    backgroundColor: colors.bg,
  },
  message: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 21,
    color: colors.greenDeep,
    marginBottom: space.lg,
  },
});

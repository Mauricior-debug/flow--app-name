import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PageHeader } from '../../components/PageHeader';
import { Body, Button, PasswordField, Screen } from '../../components/ui';
import { useApp } from '../../store/AppContext';
import { colors, fonts, space } from '../../theme';

export default function ChangePasswordScreen() {
  const { user, changePassword } = useApp();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!user) return <Redirect href="/(auth)/sign-in" />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <PageHeader title="Change password" backLabel="Profile" onBack={() => router.back()} />
      <Screen safeTop={false} style={{ flex: 1 }}>
      <Body style={{ marginBottom: space.xl }}>
        Choose a new password for {user.email}. You’ll stay signed in on this device.
      </Body>
      <PasswordField
        label="Current password"
        value={current}
        onChangeText={setCurrent}
        error={fieldErrors.current}
      />
      <PasswordField
        label="New password"
        value={next}
        onChangeText={setNext}
        error={fieldErrors.next}
      />
      <PasswordField
        label="Confirm new password"
        value={confirm}
        onChangeText={setConfirm}
        error={fieldErrors.confirm}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        label="Update password"
        loading={loading}
        onPress={async () => {
          const nextErrors: Record<string, string> = {};
          if (!current) nextErrors.current = 'Enter your current password.';
          if (next.length < 8) nextErrors.next = 'Use at least 8 characters.';
          if (next !== confirm) nextErrors.confirm = 'Passwords do not match.';
          setFieldErrors(nextErrors);
          setError('');
          if (Object.keys(nextErrors).length) return;
          setLoading(true);
          const result = await changePassword(current, next);
          setLoading(false);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          router.back();
        }}
      />
    </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    fontFamily: fonts.medium,
    fontSize: 14,
    marginBottom: space.md,
  },
});

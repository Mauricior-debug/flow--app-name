import { Stack } from 'expo-router';

import { colors } from '../../theme';

export default function OnboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="profile-setup" />
      <Stack.Screen name="country-selection" />
    </Stack>
  );
}

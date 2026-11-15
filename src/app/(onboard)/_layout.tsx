import { Stack } from 'expo-router';

import { colors } from '../../theme';

export default function OnboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: colors.navy,
        headerTitleStyle: { fontFamily: 'Poppins_600SemiBold' },
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="profile-setup" options={{ title: 'Profile setup' }} />
      <Stack.Screen name="country-selection" options={{ title: 'Choose countries' }} />
    </Stack>
  );
}

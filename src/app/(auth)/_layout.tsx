import { Stack } from 'expo-router';

import { colors } from '../../theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: colors.navy,
        headerTitleStyle: { fontFamily: 'Poppins_600SemiBold' },
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="sign-up" options={{ title: 'Sign up' }} />
      <Stack.Screen name="sign-in" options={{ title: 'Sign in' }} />
      <Stack.Screen
        name="password-reset"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5, 0.75],
          sheetGrabberVisible: true,
          title: 'Forgot password',
        }}
      />
    </Stack>
  );
}

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
          sheetAllowedDetents: [0.55, 0.8],
          sheetGrabberVisible: true,
          sheetInitialDetentIndex: 0,
          title: 'Forgot password',
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </Stack>
  );
}

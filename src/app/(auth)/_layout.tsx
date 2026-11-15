import { Stack } from 'expo-router';

import { colors } from '../../theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen
        name="password-reset"
        options={{
          headerShown: true,
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

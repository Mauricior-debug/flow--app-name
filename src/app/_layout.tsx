import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { colors } from '../theme';
import { AppProvider } from '../store/AppContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="splash" options={{ animation: 'fade' }} />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboard)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="scholarship/[id]" />
            <Stack.Screen name="apply/confirm" options={{ presentation: 'card' }} />
            <Stack.Screen name="apply/progress" />
            <Stack.Screen name="apply/success" options={{ animation: 'fade' }} />
            <Stack.Screen name="application/[id]" />
            <Stack.Screen name="profile/edit" />
            <Stack.Screen name="profile/password" />
            <Stack.Screen name="profile/help/index" />
            <Stack.Screen name="profile/help/[id]" />
            <Stack.Screen name="profile/chat" />
            <Stack.Screen
              name="sheets/filter"
              options={{
                headerShown: true,
                presentation: 'formSheet',
                sheetAllowedDetents: [0.55, 0.85],
                sheetGrabberVisible: true,
                sheetInitialDetentIndex: 0,
                title: 'Filter & sort',
                contentStyle: { backgroundColor: colors.bg },
              }}
            />
            <Stack.Screen
              name="sheets/nationality"
              options={{
                headerShown: true,
                presentation: 'formSheet',
                sheetAllowedDetents: [0.7, 0.92],
                sheetGrabberVisible: true,
                sheetInitialDetentIndex: 0,
                title: 'Nationality',
                contentStyle: { backgroundColor: colors.bg },
              }}
            />
            <Stack.Screen
              name="sheets/notifications"
              options={{
                headerShown: true,
                presentation: 'formSheet',
                sheetAllowedDetents: [0.5, 0.7],
                sheetGrabberVisible: true,
                sheetInitialDetentIndex: 0,
                title: 'Notifications',
                contentStyle: { backgroundColor: colors.bg },
              }}
            />
          </Stack>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

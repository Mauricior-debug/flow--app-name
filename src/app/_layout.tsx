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
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
      <SafeAreaProvider>
        <AppProvider>
          <Stack
            screenOptions={{
              headerShadowVisible: false,
              headerTintColor: colors.navy,
              headerTitleStyle: { fontFamily: 'Poppins_600SemiBold', fontSize: 17 },
              headerBackTitle: 'Back',
              contentStyle: { backgroundColor: colors.bg },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="splash" options={{ headerShown: false, animation: 'fade' }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(onboard)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="scholarship/[id]"
              options={{ title: 'Scholarship details' }}
            />
            <Stack.Screen
              name="apply/confirm"
              options={{ title: 'Confirm applications', presentation: 'card' }}
            />
            <Stack.Screen
              name="apply/progress"
              options={{ title: 'Application progress', headerBackVisible: false }}
            />
            <Stack.Screen
              name="apply/success"
              options={{ headerShown: false, animation: 'fade' }}
            />
            <Stack.Screen
              name="application/[id]"
              options={{ title: 'Application details' }}
            />
            <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
            <Stack.Screen name="profile/password" options={{ title: 'Change password' }} />
            <Stack.Screen name="profile/help/index" options={{ title: 'Help & support' }} />
            <Stack.Screen name="profile/help/[id]" options={{ title: 'Help' }} />
            <Stack.Screen name="profile/chat" options={{ title: 'Chat' }} />
            <Stack.Screen
              name="sheets/filter"
              options={{
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

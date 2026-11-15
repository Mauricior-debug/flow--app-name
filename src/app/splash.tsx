import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandTitle, Button, LogoMark } from '../components/ui';
import { skyline } from '../data/photos';
import { useApp } from '../store/AppContext';
import { colors, fonts, space } from '../theme';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const { ready, bootError, setBootError, user, onboardingDone } = useApp();
  const [timedOut, setTimedOut] = useState(false);
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 9000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (bootError) return;
    const timer = setTimeout(() => {
      if (user) {
        if (user.countryCodes.length === 0 || !user.dateOfBirth) {
          router.replace('/(onboard)/profile-setup');
        } else {
          router.replace('/(tabs)/scholarships');
        }
        return;
      }
      if (onboardingDone) {
        router.replace('/(auth)/sign-in');
        return;
      }
      router.replace('/onboarding');
    }, 1400);
    return () => clearTimeout(timer);
  }, [bootError, onboardingDone, ready, user]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const showError = Boolean(bootError) || (timedOut && !ready);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.center}>
        <LogoMark size={108} />
        <View style={{ height: space.xl }} />
        <BrandTitle size={36} />
      </View>

      <View style={styles.bottom}>
        <Image source={skyline} style={styles.skyline} contentFit="contain" />
        {showError ? (
          <View style={styles.errorBlock}>
            <Text style={styles.errorTitle}>Couldn’t open Scholarship Connect</Text>
            <Text style={styles.errorBody}>
              {bootError ?? 'Loading took too long on this device. Try again.'}
            </Text>
            <Button
              label="Try again"
              onPress={() => {
                setBootError(null);
                setTimedOut(false);
                router.replace('/splash');
              }}
            />
          </View>
        ) : (
          <>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <ActivityIndicator size="large" color={colors.blue} />
            </Animated.View>
            <Text style={styles.loading}>Finding your next opportunity...</Text>
            <Text style={styles.sub}>Your gateway to global education</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 28,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    alignItems: 'center',
    gap: 12,
  },
  skyline: {
    width: '100%',
    height: 120,
    marginBottom: 8,
  },
  loading: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.navy,
    textAlign: 'center',
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorBlock: {
    width: '100%',
    gap: 10,
    alignItems: 'center',
  },
  errorTitle: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    color: colors.navy,
    textAlign: 'center',
  },
  errorBody: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 4,
  },
});

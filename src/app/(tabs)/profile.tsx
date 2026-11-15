import { Image } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '../../components/ui';
import { aminaPhoto } from '../../data/photos';
import { onTabReselect } from '../../lib/tabs';
import { useApp } from '../../store/AppContext';
import { colors, fonts, radius, space } from '../../theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, notices, signOut, markNoticesRead } = useApp();
  // RN ScrollViewInstance typing differs across releases; keep a loose ref for tab reselect.
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    return onTabReselect('profile', () => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  }, []);

  if (!user) return <Redirect href="/(auth)/sign-in" />;

  const unread = notices.filter((item) => !item.read).length;

  const rows = [
    {
      label: 'Edit profile',
      icon: 'person.crop.circle' as const,
      onPress: () => router.push('/(onboard)/profile-setup?mode=edit'),
    },
    {
      label: 'Country preferences',
      icon: 'globe' as const,
      onPress: () => router.push('/(onboard)/country-selection?mode=edit'),
    },
    {
      label: 'Change password',
      icon: 'key.fill' as const,
      onPress: () => router.push('/profile/password'),
    },
    {
      label: 'Notification preferences',
      icon: 'bell.fill' as const,
      onPress: () => router.push('/sheets/notifications'),
    },
    {
      label: 'Help & support',
      icon: 'questionmark.circle.fill' as const,
      onPress: () => router.push('/profile/help'),
    },
    {
      label: 'Chat with support',
      icon: 'bubble.left.and.bubble.right.fill' as const,
      onPress: () => router.push('/profile/chat'),
    },
  ];

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.root}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40, paddingHorizontal: 22 }}
    >
      <Text style={styles.title}>Profile & settings</Text>

      <View style={styles.card}>
        <Image
          source={user.photoUri ? { uri: user.photoUri } : aminaPhoto}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.meta}>
            {user.nationality || 'Nationality not set'}
            {user.countryCodes.length ? ` · ${user.countryCodes.length} countries` : ''}
          </Text>
        </View>
      </View>

      {unread > 0 ? (
        <Pressable
          onPress={markNoticesRead}
          style={({ pressed }) => [styles.notice, pressed && { opacity: 0.88 }]}
        >
          <SymbolView name="bell.badge.fill" tintColor={colors.blue} size={18} />
          <Text style={styles.noticeText}>
            {unread} new notification{unread === 1 ? '' : 's'} — tap to mark read
          </Text>
        </Pressable>
      ) : null}

      <View style={styles.list}>
        {rows.map((row) => (
          <Pressable
            key={row.label}
            onPress={row.onPress}
            style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.field }]}
          >
            <View style={styles.rowIcon}>
              <SymbolView name={row.icon} tintColor={colors.blue} size={18} />
            </View>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <SymbolView name="chevron.right" tintColor={colors.muted} size={14} />
          </Pressable>
        ))}
      </View>

      <Button
        label="Log out"
        tone="danger"
        style={{ marginTop: space.xxl }}
        onPress={() => {
          signOut();
          router.replace('/(auth)/sign-in');
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.navy,
    marginBottom: space.xl,
  },
  card: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    marginBottom: space.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.field,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    color: colors.navy,
  },
  email: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
  },
  meta: {
    marginTop: 4,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.body,
  },
  notice: {
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: colors.blueSoft,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: space.lg,
  },
  noticeText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.navy,
  },
  list: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  row: {
    minHeight: 56,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
});

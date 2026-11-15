import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, LogoMark } from '../../components/ui';
import { useApp } from '../../store/AppContext';
import { colors, fonts, radius, space } from '../../theme';

export default function ApplicationSuccessScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useApp();
  const params = useLocalSearchParams<{ count?: string; failed?: string }>();
  const count = Number(params.count ?? '0') || 0;
  const failed = Number(params.failed ?? '0') || 0;

  if (!user) return <Redirect href="/(auth)/sign-in" />;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.brand}>
        <LogoMark size={42} />
        <Text style={styles.brandText}>
          Scholarship <Text style={{ color: colors.green }}>Connect</Text>
        </Text>
      </View>

      <View style={styles.center}>
        <View style={styles.badge}>
          <SymbolView name="checkmark" tintColor={colors.greenDeep} size={42} />
        </View>
        <Text style={styles.title}>
          {count > 0 ? 'Application submitted!' : 'Nothing new submitted'}
        </Text>
        <Text style={styles.sub}>
          {count > 0
            ? failed > 0
              ? `${count} submitted. ${failed} need a retry from Application details.`
              : 'Your applications have been successfully submitted.'
            : 'Those scholarships already had applications on this device.'}
        </Text>

        <Pressable
          onPress={() => router.replace('/(tabs)/applications')}
          style={({ pressed }) => [styles.summary, pressed && { opacity: 0.88 }]}
        >
          <View style={styles.summaryIcon}>
            <SymbolView name="square.stack.3d.up.fill" tintColor={colors.blue} size={18} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>
              {count} scholarship{count === 1 ? '' : 's'}
            </Text>
            <Text style={styles.summaryBody}>Applications submitted</Text>
          </View>
          <SymbolView name="chevron.right" tintColor={colors.muted} size={16} />
        </Pressable>

        <View style={styles.info}>
          <SymbolView name="envelope" tintColor={colors.blue} size={18} />
          <Text style={styles.infoText}>
            You’ll receive updates as your applications are processed.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="View application status" onPress={() => router.replace('/(tabs)/applications')} />
        <Button
          label="Back to scholarships"
          tone="secondary"
          onPress={() => router.replace('/(tabs)/scholarships')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 22,
  },
  brand: {
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.navy,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.xl,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.navy,
    textAlign: 'center',
  },
  sub: {
    marginTop: space.sm,
    marginBottom: space.xxl,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.body,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  summary: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 72,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: space.lg,
    marginBottom: space.md,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.blue,
  },
  summaryBody: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  info: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: radius.lg,
    backgroundColor: colors.blueSoft,
    paddingHorizontal: space.lg,
    paddingVertical: 14,
  },
  infoText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.navy,
  },
  actions: {
    gap: 10,
  },
});

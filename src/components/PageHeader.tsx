import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { colors, fonts } from '../theme';

/**
 * In-screen navigation chrome with explicit top safe-area padding.
 * Used instead of the native stack header so titles and back controls
 * never sit under the status bar / Dynamic Island.
 */
export function PageHeader({
  title,
  backLabel = 'Back',
  onBack,
  showBack = true,
}: {
  title: string;
  backLabel?: string;
  onBack?: () => void;
  showBack?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const top = Math.max(insets.top, 12);

  return (
    <View style={[styles.wrap, { paddingTop: top }]}>
      <View style={styles.bar}>
        {showBack ? (
          <Pressable
            onPress={onBack ?? (() => router.back())}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Back to ${backLabel}`}
            style={({ pressed }) => [styles.back, pressed && { opacity: 0.65 }]}
          >
            <SymbolView name="chevron.left" tintColor={colors.navy} size={18} />
            <Text style={styles.backLabel} numberOfLines={1}>
              {backLabel}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.backSpacer} />
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.backSpacer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  bar: {
    minHeight: 44,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 44,
    paddingLeft: 4,
  },
  backLabel: {
    flexShrink: 1,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.navy,
  },
  backSpacer: {
    flex: 1,
  },
  title: {
    flex: 1.4,
    textAlign: 'center',
    fontFamily: fonts.semibold,
    fontSize: 17,
    color: colors.navy,
  },
});

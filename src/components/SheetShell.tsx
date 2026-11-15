import React from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, space } from '../theme';

/**
 * Shared chrome for form sheets so the grabber/header never covers
 * the first controls, and bottom actions clear the home indicator.
 */
export function SheetShell({
  children,
  scroll = false,
  style,
  contentStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 16);

  if (scroll) {
    return (
      <ScrollView
        style={[styles.root, style]}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottom + 12 },
          contentStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.root, { paddingBottom: bottom }, style]}>
      <View style={[styles.content, { flex: 1 }, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: 22,
    // Keep lead copy and first controls clear of the sheet grabber/title.
    paddingTop: space.xl,
  },
});

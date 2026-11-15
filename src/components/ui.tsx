import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { logoCap } from '../data/photos';
import { colors, fonts, radius, space } from '../theme';

export function LogoMark({ size = 88 }: { size?: number }) {
  return (
    <Image
      source={logoCap}
      style={{ width: size, height: size * 0.76 }}
      contentFit="contain"
      accessibilityLabel="Scholarship Connect"
    />
  );
}

export function BrandTitle({ size = 34 }: { size?: number }) {
  return (
    <Text style={[styles.brandTitle, { fontSize: size, lineHeight: size + 8 }]}>
      Scholarship{'\n'}
      <Text style={{ color: colors.green }}>Connect</Text>
    </Text>
  );
}

type ButtonProps = PressableProps & {
  label: string;
  tone?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  block?: boolean;
};

export function Button({
  label,
  tone = 'primary',
  loading,
  disabled,
  block = true,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        block && styles.buttonBlock,
        tone === 'primary' && styles.buttonPrimary,
        tone === 'secondary' && styles.buttonSecondary,
        tone === 'danger' && styles.buttonDanger,
        tone === 'ghost' && styles.buttonGhost,
        pressed && !isDisabled && tone === 'primary' && { backgroundColor: colors.bluePressed },
        pressed && !isDisabled && tone === 'secondary' && { backgroundColor: colors.blueSoft },
        pressed && !isDisabled && tone === 'danger' && { opacity: 0.9 },
        pressed && !isDisabled && tone === 'ghost' && { opacity: 0.7 },
        isDisabled && { opacity: 0.55 },
        style as StyleProp<ViewStyle>,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={tone === 'secondary' || tone === 'ghost' ? colors.blue : colors.white} />
      ) : (
        <Text
          style={[
            styles.buttonLabel,
            (tone === 'secondary' || tone === 'ghost') && { color: colors.blue },
            tone === 'danger' && { color: colors.white },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function Field({
  label,
  error,
  containerStyle,
  ...rest
}: TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.fieldWrap, containerStyle]}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.placeholder}
        style={[styles.field, error ? styles.fieldError : null]}
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export function PressField({
  label,
  value,
  placeholder,
  onPress,
  error,
}: {
  label?: string;
  value?: string;
  placeholder: string;
  onPress: () => void;
  error?: string;
}) {
  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.field,
          styles.pressField,
          error ? styles.fieldError : null,
          pressed && { backgroundColor: '#EEF2F7' },
        ]}
      >
        <Text style={[styles.pressFieldText, !value && { color: colors.placeholder }]}>
          {value || placeholder}
        </Text>
        <SymbolView name="chevron.down" tintColor={colors.muted} size={14} />
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      style={({ pressed }) => [styles.checkRow, pressed && { opacity: 0.8 }]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.checkBox, checked && styles.checkBoxOn]}>
        {checked ? <SymbolView name="checkmark" tintColor={colors.white} size={14} /> : null}
      </View>
      <View style={{ flex: 1 }}>{typeof label === 'string' ? <Text style={styles.checkLabel}>{label}</Text> : label}</View>
    </Pressable>
  );
}

export function Screen({
  children,
  scroll = true,
  padded = true,
  style,
  contentStyle,
  keyboard = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  keyboard?: boolean;
}) {
  const insets = useSafeAreaInsets();
  if (!scroll) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }, padded && styles.screenPad, style]}>
        {children}
      </View>
    );
  }
  return (
    <ScrollView
      style={[styles.screen, style]}
      contentContainerStyle={[
        { paddingTop: insets.top + space.lg, paddingBottom: insets.bottom + 28 },
        padded && styles.screenPad,
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={keyboard ? 'on-drag' : 'none'}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function SectionTitle({ children, style }: { children: string; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.sectionTitle, style]}>{children}</Text>;
}

export function Body({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function Headline({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.headline, style]}>{children}</Text>;
}

export function StateView({
  title,
  body,
  actionLabel,
  onAction,
  tone = 'empty',
}: {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'empty' | 'error' | 'loading';
}) {
  return (
    <View style={styles.stateBox}>
      {tone === 'loading' ? <ActivityIndicator color={colors.blue} size="large" /> : null}
      {tone === 'error' ? (
        <View style={styles.errorIcon}>
          <SymbolView name="exclamationmark.triangle.fill" tintColor={colors.danger} size={28} />
        </View>
      ) : null}
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateBody}>{body}</Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={{ marginTop: space.lg }} />
      ) : null}
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && onPress && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function StatusPill({
  status,
}: {
  status: string;
}) {
  const map: Record<string, { bg: string; fg: string }> = {
    pending: { bg: colors.amberSoft, fg: colors.amber },
    submitting: { bg: colors.blueSoft, fg: colors.blue },
    submitted: { bg: colors.greenSoft, fg: colors.greenDeep },
    'in review': { bg: colors.blueSoft, fg: colors.blue },
    accepted: { bg: colors.greenSoft, fg: colors.greenDeep },
    rejected: { bg: colors.dangerSoft, fg: colors.danger },
    failed: { bg: colors.dangerSoft, fg: colors.danger },
  };
  const tone = map[status.toLowerCase()] ?? { bg: colors.field, fg: colors.muted };
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <View style={[styles.pill, { backgroundColor: tone.bg }]}>
      <Text style={[styles.pillText, { color: tone.fg }]}>{label}</Text>
    </View>
  );
}

export function IconButton({
  name,
  onPress,
  color = colors.navy,
  size = 22,
}: {
  name: React.ComponentProps<typeof SymbolView>['name'];
  onPress?: () => void;
  color?: string;
  size?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.65 }]}
      accessibilityRole="button"
    >
      <SymbolView name={name} tintColor={color} size={size} />
    </Pressable>
  );
}

export function PasswordField(props: TextInputProps & { label?: string; error?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.fieldWrap}>
      {props.label ? <Text style={styles.fieldLabel}>{props.label}</Text> : null}
      <View style={[styles.field, styles.passwordRow, props.error ? styles.fieldError : null]}>
        <SymbolView name="lock.fill" tintColor={colors.muted} size={16} />
        <TextInput
          {...props}
          secureTextEntry={!visible}
          placeholderTextColor={colors.placeholder}
          style={[styles.passwordInput, props.style]}
        />
        <Pressable onPress={() => setVisible((value) => !value)} hitSlop={8} style={styles.iconButton}>
          <SymbolView
            name={visible ? 'eye.slash' : 'eye'}
            tintColor={colors.muted}
            size={18}
          />
        </Pressable>
      </View>
      {props.error ? <Text style={styles.errorText}>{props.error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  brandTitle: {
    fontFamily: fonts.bold,
    color: colors.navy,
    textAlign: 'center',
  },
  button: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xl,
  },
  buttonBlock: {
    alignSelf: 'stretch',
  },
  buttonPrimary: {
    backgroundColor: colors.blue,
  },
  buttonSecondary: {
    backgroundColor: colors.blueSoft,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonLabel: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.white,
  },
  fieldWrap: {
    marginBottom: space.lg,
  },
  fieldLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.body,
    marginBottom: 8,
  },
  field: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.field,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: space.lg,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  pressField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressFieldText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  errorText: {
    marginTop: 6,
    color: colors.danger,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    minHeight: 44,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkBoxOn: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  checkLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.body,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screenPad: {
    paddingHorizontal: 22,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    color: colors.navy,
    marginBottom: space.sm,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: colors.body,
  },
  headline: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    color: colors.navy,
  },
  stateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 48,
    gap: 10,
  },
  stateTitle: {
    fontFamily: fonts.semibold,
    fontSize: 20,
    color: colors.navy,
    textAlign: 'center',
  },
  stateBody: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    textAlign: 'center',
  },
  errorIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.field,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.blueSoft,
    borderColor: colors.blue,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.body,
  },
  chipTextSelected: {
    color: colors.blue,
  },
  pill: {
    minHeight: 28,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
  },
  passwordInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 14,
  },
});

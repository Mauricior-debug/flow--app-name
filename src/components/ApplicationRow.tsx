import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { photos } from '../data/photos';
import type { Application, Scholarship } from '../data/types';
import { colors, fonts, radius, space } from '../theme';
import { StatusPill } from './ui';

export function ApplicationRow({
  application,
  scholarship,
  onPress,
}: {
  application: Application;
  scholarship?: Scholarship;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.field }]}
    >
      <Image
        source={photos[scholarship?.image ?? 'campus']}
        style={styles.thumb}
        contentFit="cover"
      />
      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={2}>
          {scholarship?.name ?? 'Scholarship'}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {scholarship?.institution}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {scholarship?.country}
          {application.listDate ? ` · ${application.listDate}` : ''}
        </Text>
        <View style={{ marginTop: 8 }}>
          <StatusPill status={application.status} />
        </View>
      </View>
      <SymbolView name="chevron.right" tintColor={colors.muted} size={16} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    minHeight: 96,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.field,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.navy,
  },
  meta: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
});

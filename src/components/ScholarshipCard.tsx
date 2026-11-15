import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { photos } from '../data/photos';
import type { Scholarship } from '../data/types';
import { colors, fonts, radius, space } from '../theme';
import { Chip } from './ui';

export function ScholarshipCard({
  item,
  saved,
  onPress,
  onToggleSave,
}: {
  item: Scholarship;
  saved?: boolean;
  onPress: () => void;
  onToggleSave?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92, transform: [{ scale: 0.995 }] }]}
    >
      <Image source={photos[item.image]} style={styles.image} contentFit="cover" />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
          {onToggleSave ? (
            <Pressable
              onPress={onToggleSave}
              hitSlop={8}
              style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
              accessibilityLabel={saved ? 'Remove from saved' : 'Save scholarship'}
            >
              <SymbolView
                name={saved ? 'bookmark.fill' : 'bookmark'}
                tintColor={saved ? colors.blue : colors.muted}
                size={20}
              />
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.meta}>
          {item.country} · {item.institution}
        </Text>
        <Text style={styles.req} numberOfLines={2}>
          {item.requirement}
        </Text>
        <View style={styles.chips}>
          {item.tags.slice(0, 3).map((tag) => (
            <Chip key={tag} label={tag} />
          ))}
        </View>
        <Text style={styles.deadline}>Deadline: {item.deadlineLabel}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    marginBottom: space.lg,
  },
  image: {
    width: '100%',
    height: 148,
    backgroundColor: colors.field,
  },
  body: {
    padding: space.lg,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 17,
    color: colors.navy,
  },
  saveBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
    marginRight: -8,
  },
  meta: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
  req: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.body,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  deadline: {
    marginTop: 4,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.navy,
  },
});

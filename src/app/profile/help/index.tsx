import { Redirect, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { Body, Screen } from '../../../components/ui';
import { HELP_TOPICS } from '../../../data/help';
import { useApp } from '../../../store/AppContext';
import { colors, fonts, radius, space } from '../../../theme';

const icons = {
  help: 'questionmark.circle.fill',
  document: 'doc.text.fill',
  person: 'person.fill',
  clock: 'clock.fill',
  mail: 'envelope.fill',
} as const;

export default function HelpIndexScreen() {
  const { user } = useApp();
  if (!user) return <Redirect href="/(auth)/sign-in" />;

  return (
    <Screen safeTop={false}>
      <Body style={{ marginBottom: space.xl }}>
        Guidance for matching, applying, and managing your Scholarship Connect profile.
      </Body>
      {HELP_TOPICS.map((topic) => (
        <Pressable
          key={topic.id}
          onPress={() => router.push(`/profile/help/${topic.id}`)}
          style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.field }]}
        >
          <View style={styles.icon}>
            <SymbolView name={icons[topic.icon]} tintColor={colors.blue} size={18} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{topic.title}</Text>
            <Text style={styles.summary}>{topic.summary}</Text>
          </View>
          <SymbolView name="chevron.right" tintColor={colors.muted} size={14} />
        </Pressable>
      ))}
      <Pressable
        onPress={() => router.push('/profile/chat')}
        style={({ pressed }) => [styles.chat, pressed && { opacity: 0.9 }]}
      >
        <Text style={styles.chatTitle}>Still need help?</Text>
        <Text style={styles.chatBody}>Chat with support about a country, deadline, or application.</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.navy,
  },
  summary: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  chat: {
    marginTop: space.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.blueSoft,
    padding: space.lg,
  },
  chatTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.navy,
  },
  chatBody: {
    marginTop: 4,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.body,
  },
});

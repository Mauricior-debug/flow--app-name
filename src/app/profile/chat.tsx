import { Redirect, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageHeader } from '../../components/PageHeader';
import { formatClock } from '../../lib/format';
import { useApp } from '../../store/AppContext';
import { colors, fonts, radius, space } from '../../theme';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { user, getChat, sendChat } = useApp();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState(getChat());
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    setMessages(getChat());
  }, [getChat, user?.id]);

  if (!user) return <Redirect href="/(auth)/sign-in" />;

  function refresh() {
    setMessages(getChat());
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top + 56}
    >
      <PageHeader title="Chat" backLabel="Help" onBack={() => router.back()} />
      <FlatList
        ref={listRef}
        data={messages.length ? messages : [
          {
            id: 'welcome',
            from: 'support' as const,
            text: 'Hi! How can I help you with your scholarship search today?',
            at: new Date().toISOString(),
          },
        ]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 22, paddingBottom: 12, gap: 10 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => {
          const mine = item.from === 'user';
          return (
            <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
              <Text style={[styles.bubbleText, mine && styles.mineText]}>{item.text}</Text>
              <Text style={[styles.time, mine && styles.mineTime]}>
                {formatClock(new Date(item.at))}
              </Text>
            </View>
          );
        }}
      />
      <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type your message"
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          multiline
        />
        <Pressable
          onPress={() => {
            if (!text.trim()) return;
            sendChat(text);
            setText('');
            setTimeout(refresh, 50);
          }}
          style={({ pressed }) => [styles.send, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.sendLabel}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '82%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  theirs: {
    alignSelf: 'flex-start',
    backgroundColor: colors.field,
  },
  mine: {
    alignSelf: 'flex-end',
    backgroundColor: colors.blue,
  },
  bubbleText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 21,
    color: colors.text,
  },
  mineText: {
    color: colors.white,
  },
  time: {
    marginTop: 4,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
  mineTime: {
    color: 'rgba(255,255,255,0.8)',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.field,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  send: {
    minWidth: 64,
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  sendLabel: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.white,
  },
});

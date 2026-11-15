import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/ui';
import { useApp } from '../../store/AppContext';
import { colors, fonts, space } from '../../theme';

export default function NotificationsSheet() {
  const { user, saveProfile } = useApp();
  const [matches, setMatches] = useState(user?.notifications.matches ?? true);
  const [applications, setApplications] = useState(user?.notifications.applications ?? true);
  const [messages, setMessages] = useState(user?.notifications.messages ?? true);
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.root}>
      <Toggle label="New scholarship matches" value={matches} onChange={setMatches} />
      <Toggle label="Application status updates" value={applications} onChange={setApplications} />
      <Toggle label="Support chat replies" value={messages} onChange={setMessages} />
      <Button
        label="Save preferences"
        loading={loading}
        style={{ marginTop: space.xl }}
        onPress={async () => {
          setLoading(true);
          await saveProfile({
            notifications: { matches, applications, messages },
          });
          setLoading(false);
          router.back();
        }}
      />
    </View>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.track, value && styles.trackOn]}>
        <View style={[styles.thumb, value && styles.thumbOn]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 22,
    gap: 8,
  },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  label: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
  track: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.line,
    padding: 2,
    justifyContent: 'center',
  },
  trackOn: {
    backgroundColor: colors.blue,
  },
  thumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
});

import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SheetShell } from '../../components/SheetShell';
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
    <SheetShell scroll>
      <Text style={styles.lead}>Choose which in-app updates you want to see.</Text>
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
    </SheetShell>
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
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.track, value && styles.trackOn]}>
        <View style={[styles.thumb, value && styles.thumbOn]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  lead: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.body,
    marginBottom: space.lg,
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

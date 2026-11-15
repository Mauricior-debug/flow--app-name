import React from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PageHeader } from '../../../components/PageHeader';
import { Body, Screen, StateView } from '../../../components/ui';
import { HELP_TOPICS } from '../../../data/help';
import { useApp } from '../../../store/AppContext';
import { colors, fonts, space } from '../../../theme';

export default function HelpTopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useApp();
  const topic = HELP_TOPICS.find((item) => item.id === id);

  if (!user) return <Redirect href="/(auth)/sign-in" />;
  if (!topic) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <PageHeader title="Help" backLabel="Help" onBack={() => router.back()} />
        <StateView tone="error" title="Topic missing" body="This help article could not be found." />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <PageHeader title={topic.title} backLabel="Help" onBack={() => router.back()} />
      <Screen safeTop={false} style={{ flex: 1 }}>
        <Body style={{ marginBottom: space.xl }}>{topic.summary}</Body>
        {topic.body.map((block, index) => (
          <React.Fragment key={`${topic.id}-${index}`}>
            {block.heading ? <Text style={styles.heading}>{block.heading}</Text> : null}
            {block.paragraphs.map((paragraph) => (
              <Text key={paragraph} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </React.Fragment>
        ))}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    color: colors.navy,
    marginBottom: 8,
    marginTop: space.md,
  },
  paragraph: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: colors.body,
    marginBottom: space.md,
  },
});

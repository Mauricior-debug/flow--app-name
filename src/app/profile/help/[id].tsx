import React from 'react';
import { Redirect, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

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
    return <StateView tone="error" title="Topic missing" body="This help article could not be found." />;
  }

  return (
    <>
      <Stack.Screen options={{ title: topic.title }} />
      <Screen>
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
    </>
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

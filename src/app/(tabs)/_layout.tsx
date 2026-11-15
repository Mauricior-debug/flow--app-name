import { NativeTabs } from 'expo-router/native-tabs';

import { emitTabReselect, isTabFocused, setTabFocused } from '../../lib/tabs';
import { colors } from '../../theme';

export default function TabsLayout() {
  return (
    <NativeTabs tintColor={colors.blue} minimizeBehavior="automatic">
      <NativeTabs.Trigger
        name="scholarships"
        listeners={{
          focus: () => setTabFocused('scholarships', true),
          blur: () => setTabFocused('scholarships', false),
          tabPress: () => {
            if (isTabFocused('scholarships')) emitTabReselect('scholarships');
          },
        }}
      >
        <NativeTabs.Trigger.Label>Scholarships</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'graduationcap', selected: 'graduationcap.fill' }}
          md="school"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="applications"
        listeners={{
          focus: () => setTabFocused('applications', true),
          blur: () => setTabFocused('applications', false),
          tabPress: () => {
            if (isTabFocused('applications')) emitTabReselect('applications');
          },
        }}
      >
        <NativeTabs.Trigger.Label>Applications</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'doc.text', selected: 'doc.text.fill' }}
          md="description"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="profile"
        listeners={{
          focus: () => setTabFocused('profile', true),
          blur: () => setTabFocused('profile', false),
          tabPress: () => {
            if (isTabFocused('profile')) emitTabReselect('profile');
          },
        }}
      >
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person', selected: 'person.fill' }}
          md="person"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

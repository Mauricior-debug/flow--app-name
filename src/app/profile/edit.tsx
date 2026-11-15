import { Redirect } from 'expo-router';

export default function ProfileEditRedirect() {
  return <Redirect href="/(onboard)/profile-setup?mode=edit" />;
}

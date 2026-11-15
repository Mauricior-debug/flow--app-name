import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { PageHeader } from '../../components/PageHeader';
import {
  Body,
  Button,
  Field,
  PressField,
  Screen,
  SectionTitle,
} from '../../components/ui';
import { aminaPhoto } from '../../data/photos';
import { nid } from '../../lib/format';
import { consumePick, listenForPick } from '../../lib/picker';
import { useApp, type Academic } from '../../store/AppContext';
import { colors, fonts, radius, space } from '../../theme';

function applyPick(
  value: string,
  setNationality: (next: string) => void,
  setDateOfBirth: (next: string) => void,
) {
  if (value.startsWith('nat:')) setNationality(value.slice(4));
  if (value.startsWith('dob:')) setDateOfBirth(value.slice(4));
}

export default function ProfileSetupScreen() {
  const { user, saveProfile } = useApp();
  const params = useLocalSearchParams<{ mode?: string }>();
  const editing = params.mode === 'edit';

  const [photoUri, setPhotoUri] = useState<string | null>(user?.photoUri ?? null);
  const [name, setName] = useState(user?.name ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth ?? '');
  const [nationality, setNationality] = useState(user?.nationality ?? '');
  const [contactEmail, setContactEmail] = useState(user?.contactEmail || user?.email || '');
  const [academics, setAcademics] = useState<Academic[]>(
    user?.academics?.length
      ? user.academics
      : [{ id: nid('deg'), degree: '', institution: '', gpa: '', year: '' }],
  );
  const [languages, setLanguages] = useState(user?.languages ?? '');
  const [ielts, setIelts] = useState(user?.ielts ?? '');
  const [toefl, setToefl] = useState(user?.toefl ?? '');
  const [sat, setSat] = useState(user?.sat ?? '');
  const [cvName, setCvName] = useState<string | null>(user?.cvName ?? null);
  const [cvUri, setCvUri] = useState<string | null>(user?.cvUri ?? null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  useEffect(() => {
    return listenForPick((value) => applyPick(value, setNationality, setDateOfBirth));
  }, []);

  useFocusEffect(
    useCallback(() => {
      const value = consumePick();
      if (value) applyPick(value, setNationality, setDateOfBirth);
    }, []),
  );

  async function pickPhoto() {
    setUploadError('');
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setUploadError('Photo access was denied. You can continue without a photo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (!result.canceled && result.assets[0]?.uri) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch {
      setUploadError('Photo upload failed. Try again or continue without it.');
    }
  }

  async function pickCv() {
    setUploadError('');
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      setCvName(file.name);
      setCvUri(file.uri);
    } catch {
      setUploadError('CV upload failed. You can save the profile and retry later.');
    }
  }

  function updateAcademic(id: string, patch: Partial<Academic>) {
    setAcademics((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function onSave() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Enter your full name.';
    if (!dateOfBirth) next.dob = 'Choose your date of birth.';
    if (!nationality) next.nat = 'Choose your nationality.';
    if (!contactEmail.trim()) next.contact = 'Enter a contact email.';
    const primary = academics[0];
    if (!primary?.degree.trim()) next.degree = 'Add your current or latest degree.';
    if (!primary?.institution.trim()) next.institution = 'Add your institution.';
    setErrors(next);
    setFormError('');
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const result = await saveProfile({
        name: name.trim(),
        photoUri,
        dateOfBirth,
        nationality,
        contactEmail: contactEmail.trim(),
        academics,
        languages: languages.trim(),
        ielts: ielts.trim(),
        toefl: toefl.trim(),
        sat: sat.trim(),
        cvName,
        cvUri,
      });
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      if (editing) {
        router.back();
      } else {
        router.push('/(onboard)/country-selection');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <PageHeader
        title="Profile setup"
        backLabel={editing ? 'Profile' : 'Back'}
        showBack={editing}
        onBack={() => router.back()}
      />
      <Screen safeTop={false} style={{ flex: 1 }}>
      <Body style={{ marginBottom: space.xl }}>
        Add the details Scholarship Connect needs to judge which programmes you qualify for.
      </Body>

      <Pressable onPress={pickPhoto} style={({ pressed }) => [styles.photoWrap, pressed && { opacity: 0.85 }]}>
        <Image source={photoUri ? { uri: photoUri } : aminaPhoto} style={styles.photo} contentFit="cover" />
        <View style={styles.cameraBadge}>
          <SymbolView name="camera.fill" tintColor={colors.white} size={14} />
        </View>
      </Pressable>
      <Text style={styles.photoHint}>Tap to upload a profile photo</Text>
      {uploadError ? <Text style={styles.error}>{uploadError}</Text> : null}

      <Field label="Full name" value={name} onChangeText={setName} error={errors.name} />
      <PressField
        label="Date of birth"
        value={dateOfBirth}
        placeholder="Select date"
        error={errors.dob}
        onPress={() =>
          router.push({ pathname: '/sheets/nationality', params: { mode: 'dob' } })
        }
      />
      <PressField
        label="Nationality"
        value={nationality}
        placeholder="Select nationality"
        error={errors.nat}
        onPress={() =>
          router.push({ pathname: '/sheets/nationality', params: { mode: 'nationality' } })
        }
      />
      <Field
        label="Contact email"
        value={contactEmail}
        onChangeText={setContactEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        error={errors.contact}
      />

      <SectionTitle>Academic history</SectionTitle>
      {academics.map((item, index) => (
        <View key={item.id} style={styles.block}>
          <Field
            label={index === 0 ? 'Degree' : `Degree ${index + 1}`}
            value={item.degree}
            onChangeText={(value) => updateAcademic(item.id, { degree: value })}
            placeholder="BSc Computer Science"
            error={index === 0 ? errors.degree : undefined}
          />
          <Field
            label="Institution"
            value={item.institution}
            onChangeText={(value) => updateAcademic(item.id, { institution: value })}
            placeholder="University name"
            error={index === 0 ? errors.institution : undefined}
          />
          <View style={styles.row}>
            <Field
              label="GPA / grades"
              value={item.gpa}
              onChangeText={(value) => updateAcademic(item.id, { gpa: value })}
              placeholder="3.6 / First class"
              containerStyle={{ flex: 1 }}
            />
            <Field
              label="Year"
              value={item.year}
              onChangeText={(value) => updateAcademic(item.id, { year: value })}
              placeholder="2024"
              containerStyle={{ width: 110, marginLeft: 12 }}
              keyboardType="number-pad"
            />
          </View>
        </View>
      ))}
      <Button
        label="Add another degree"
        tone="secondary"
        onPress={() =>
          setAcademics((list) => [
            ...list,
            { id: nid('deg'), degree: '', institution: '', gpa: '', year: '' },
          ])
        }
        style={{ marginBottom: space.xl }}
      />

      <Field
        label="Languages spoken"
        value={languages}
        onChangeText={setLanguages}
        placeholder="English, French"
      />
      <SectionTitle>Test scores</SectionTitle>
      <View style={styles.row}>
        <Field label="IELTS" value={ielts} onChangeText={setIelts} placeholder="7.0" containerStyle={{ flex: 1 }} />
        <Field
          label="TOEFL"
          value={toefl}
          onChangeText={setToefl}
          placeholder="100"
          containerStyle={{ flex: 1, marginLeft: 12 }}
        />
      </View>
      <Field label="SAT" value={sat} onChangeText={setSat} placeholder="Optional" />

      <Pressable onPress={pickCv} style={({ pressed }) => [styles.cv, pressed && { opacity: 0.85 }]}>
        <SymbolView name="doc.fill" tintColor={colors.blue} size={20} />
        <View style={{ flex: 1 }}>
          <Text style={styles.cvTitle}>{cvName ? cvName : 'Upload CV / resume'}</Text>
          <Text style={styles.cvBody}>{cvName ? 'Tap to replace' : 'PDF or image, optional'}</Text>
        </View>
      </Pressable>

      {formError ? <Text style={styles.error}>{formError}</Text> : null}
      <Button label={editing ? 'Save changes' : 'Save and continue'} loading={loading} onPress={onSave} />
    </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  photoWrap: {
    alignSelf: 'center',
    width: 112,
    height: 112,
    borderRadius: 56,
    marginBottom: 8,
  },
  photo: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.field,
  },
  cameraBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  photoHint: {
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    marginBottom: space.xl,
  },
  block: {
    marginBottom: space.sm,
  },
  row: {
    flexDirection: 'row',
  },
  cv: {
    minHeight: 64,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.field,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: space.xl,
  },
  cvTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.navy,
  },
  cvBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  error: {
    color: colors.danger,
    fontFamily: fonts.medium,
    fontSize: 13,
    marginBottom: space.md,
  },
});

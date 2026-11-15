# Scholarship Connect

Expo SDK 58 app for discovering, matching, and applying to global scholarships.

## Open in Expo Go

Scan the QR from `wren-preview.json` (`qrUrl`), or open:

https://qr.expo.dev/eas-update?slug=exp&projectId=b7f37c24-6839-4d09-acb8-7434da569f68&runtimeVersion=58.0.0&channel=preview

Requires Expo Go that supports runtime `58.0.0`.

### Quick review path
On Sign in, tap **Continue with demo profile** to land on matched scholarships with a filled student profile. Or create a new account and walk the full setup flow.

## Screens

Splash → Onboarding → Sign up / Sign in → Profile setup → Country selection → Scholarships (matches) → Scholarship details → Application confirmation → Application progress → Applications → Application details → Profile & settings → Help → Chat

Sheets: filter & sort, nationality / date of birth, notifications, password reset.

## Local development

```bash
npm install
npx expo start
```

Managed workflow only. No custom native modules.

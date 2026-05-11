# SONAR Farm ROI Tracker

## Install

```bash
npm install
npx expo install expo-font @expo-google-fonts/inter expo-constants expo-location expo-localization @react-native-async-storage/async-storage react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens @expo/vector-icons react-native-google-mobile-ads
```

## Run (Expo Go)

```bash
npx expo start --clear
```

## Run (Dev Build)

```bash
npx expo prebuild
npx expo run:android
# or
npx expo run:ios
```

## AdMob Note

Before real build/release, replace the placeholder AdMob app IDs in `app.json` plugin config with your real IDs from `admob.google.com`.

## Shared Daily Weather (No-Cost)

Generate the shared weather snapshot file:

```bash
npm run weather:daily:generate
```

This writes `public/weather-daily.json`.

### GitHub Actions Automation

Workflow file: `.github/workflows/weather-daily-sync.yml`

- Runs daily and on manual trigger.
- Regenerates `public/weather-daily.json`.
- Commits changes to this repo.
- Optionally syncs to an external datasets repo.

Set these in GitHub repository settings for external sync:

- **Secret:** `DATASETS_REPO_TOKEN` (PAT with repo write access)
- **Variable:** `DATASETS_REPO` (format: `owner/repo`, e.g. `sonar-farm-roi/datasets`)

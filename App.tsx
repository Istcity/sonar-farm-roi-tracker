import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as Localization from "expo-localization";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { setI18nLocale, languageByCountry } from "./src/i18n";
import { getDailyWeatherByRegion } from "./src/lib/weather";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { useTarimStore } from "./src/store/useTarimStore";
import { useThemeStore } from "./src/store/useThemeStore";
import { brand } from "./src/theme/palettes";
import { LogoMark } from "./src/components/ui/LogoMark";
import { AppText } from "./src/components/ui/AppText";

const resolveLanguageByCountry = (countryCode?: string): string => {
  if (!countryCode) return "en";
  return languageByCountry[countryCode.toUpperCase()] || "en";
};

const NOTIF_SMOKE_KEY = "sonar-notif-smoke-date";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [ready, setReady] = useState(false);
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  const setLocale = useThemeStore((s) => s.setLocale);
  const setThemeByCountry = useThemeStore((s) => s.setThemeByCountry);
  const setWeatherCache = useTarimStore((s) => s.setWeatherCache);

  useEffect(() => {
    if (!fontsLoaded) return;

    const bootstrap = async () => {
      try {
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "Default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          });
        }

        const localeTag = Localization.getLocales()?.[0]?.languageTag || "en";
        const regionCode = Localization.getLocales()?.[0]?.regionCode || "UN";
        const lang = resolveLanguageByCountry(regionCode) || localeTag.split("-")[0] || "en";

        setI18nLocale(lang);
        setLocale(lang);

        const notifPerm = await Notifications.getPermissionsAsync();
        if (!notifPerm.granted) {
          await Notifications.requestPermissionsAsync();
        }

        // Show one visible local notification after permission is granted so the
        // user can verify notifications are actually appearing on-screen.
        const notifPermAfter = await Notifications.getPermissionsAsync();
        if (notifPermAfter.granted) {
          const today = new Date().toISOString().slice(0, 10);
          const lastSmoke = await AsyncStorage.getItem(NOTIF_SMOKE_KEY);
          if (lastSmoke !== today) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "SONAR",
                body: "Bildirim testi basarili. Gunluk uyarilar aktif.",
              },
              trigger: null,
            });
            await AsyncStorage.setItem(NOTIF_SMOKE_KEY, today);
          }
        }

        const permission = await Location.requestForegroundPermissionsAsync();

        if (permission.status === "granted") {
          // Ask for "always" permission after foreground grant for background
          // weather checks and proactive notifications.
          try {
            await Location.requestBackgroundPermissionsAsync();
          } catch {
            // Keep app working even if background permission prompt is skipped.
          }

          const position = await Location.getCurrentPositionAsync({});
          const geocode = await Location.reverseGeocodeAsync({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          const country = geocode?.[0]?.isoCountryCode || regionCode;
          const locationName = geocode?.[0]?.city || geocode?.[0]?.region || "Unknown";

          const localLang = resolveLanguageByCountry(country);
          setI18nLocale(localLang);
          setLocale(localLang);
          setThemeByCountry(country);

          const snapshot = await getDailyWeatherByRegion(
            position.coords.latitude,
            position.coords.longitude,
            locationName,
            country,
          );
          setWeatherCache(snapshot);
        } else {
          setI18nLocale("en");
          setLocale("en");
        }

        if (Constants.appOwnership !== "expo") {
          if (Platform.OS === "ios") {
            try {
              const tracking = require("expo-tracking-transparency");
              const current = await tracking.getTrackingPermissionsAsync();
              if (current.status !== "granted") {
                await tracking.requestTrackingPermissionsAsync();
              }
            } catch {
              // Tracking permission is optional; continue if unavailable.
            }
          }

          const ads = require("react-native-google-mobile-ads").default;
          ads().initialize();
          // Notifications/background tasks are limited in Expo Go.
          const { ensureMorningWeatherTaskRegistered } = require("./src/services/weatherBackgroundService");
          ensureMorningWeatherTaskRegistered().catch(() => null);
        }
      } catch (_e) {
        setI18nLocale("en");
        setLocale("en");
      } finally {
        useTarimStore.getState().refreshTasksFromContext();
        setReady(true);
      }
    };

    bootstrap();
  }, [fontsLoaded, setLocale, setThemeByCountry, setWeatherCache]);

  if (!ready || !fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: brand.deepBlue }}>
        <StatusBar style="light" />
        <LinearGradient
          colors={["#3DA9E0", "#1F6FA8", brand.deepBlue]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
        />
        <LogoMark size={132} ring />
        <AppText
          variant="titleMd"
          style={{ color: brand.white, marginTop: 18, letterSpacing: 0.6 }}
        >
          SONAR Farm ROI
        </AppText>
        <ActivityIndicator size="small" color={brand.white} style={{ marginTop: 14 }} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

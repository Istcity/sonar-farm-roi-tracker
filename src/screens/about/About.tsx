import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppCard } from "../../components/ui/AppCard";
import { LogoMark } from "../../components/ui/LogoMark";
import { AppText } from "../../components/ui/AppText";
import { useThemeStore } from "../../store/useThemeStore";
import { brand } from "../../theme/palettes";
import { SCREEN_GUTTER } from "../../theme/layout";

type Section = { title: string; body: string };

const sectionsByLocale: Record<"tr" | "en", Section[]> = {
  tr: [
    { title: "Uygulama Hakkında", body: "Yerel öncelikli (local-first) tarım asistanı ve ROI takip uygulaması." },
    {
      title: "Veri Gizliliği (KVKK / GDPR)",
      body:
        "Veriler cihazda saklanır. Konum yalnızca hava durumu ve bölgesel tema için kullanılır. Reklamlar non-personalized modda çalışır.",
    },
    { title: "İzinler", body: "Konum: hava durumu ve bölgesel tema seçimi." },
    {
      title: "Reklamlar",
      body:
        "Google AdMob, non-personalized aktif. Uygulama ücretsiz sunulur ve temel gelir modeli reklamdır.",
    },
    {
      title: "Veri Kaynak Politikası",
      body:
        "MVP aşamasında açık / ücretsiz veri setleri ve yerel mock veriler kullanılır. Canlı besleme tarafında Open-Meteo gibi ücretsiz / freemium kaynaklar tercih edilir.",
    },
    { title: "Platform Uyumluluğu", body: "iOS App Store ve Google Play kurallarına uygun." },
    { title: "Dil Algılama", body: "Konuma göre otomatik; varsayılan İngilizce. Ayarlar üzerinden manuel değiştirilebilir." },
    { title: "İletişim", body: "destek@sonarapp.com" },
    { title: "Lisans", body: "MIT" },
  ],
  en: [
    { title: "About", body: "Local-first farm assistant and ROI tracker." },
    {
      title: "Data Privacy (KVKK / GDPR)",
      body:
        "Data stays on device. Location is only used for weather and regional theme. Ads run in non-personalized mode.",
    },
    { title: "Permissions", body: "Location: weather and regional theme selection." },
    {
      title: "Ads",
      body:
        "Google AdMob, non-personalized enabled. The app is offered free of charge — ads are the main revenue model.",
    },
    {
      title: "Data Source Policy",
      body:
        "During MVP we rely on open / free datasets and local mock data. Live feeds prefer free / freemium sources such as Open-Meteo.",
    },
    { title: "Platform Compliance", body: "Aligned with iOS App Store and Google Play rules." },
    { title: "Language Detection", body: "Auto by location; English by default. You can override it from Settings." },
    { title: "Contact", body: "destek@sonarapp.com" },
    { title: "License", body: "MIT" },
  ],
};

export const AboutScreen: React.FC = () => {
  const locale = useThemeStore((s) => s.locale);
  const countryCode = useThemeStore((s) => s.countryCode);
  const themeName = useThemeStore((s) => s.themeName);
  const isTR = locale.startsWith("tr");
  const sections = isTR ? sectionsByLocale.tr : sectionsByLocale.en;

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: brand.bgLight }}
      edges={["left", "right", "bottom", "top"]}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: SCREEN_GUTTER,
          paddingBottom: SCREEN_GUTTER * 2,
          paddingLeft: SCREEN_GUTTER,
          paddingRight: SCREEN_GUTTER,
        }}
        showsVerticalScrollIndicator={false}
      >
        <LogoMark size={88} ring style={{ alignSelf: "center" }} />
        <AppText variant="titleLg" className="text-center mt-2" numberOfLines={3}>
          SONAR Farm ROI Tracker
        </AppText>
        <AppText variant="caption" className="text-center">
          v1.0.0
        </AppText>

        <View className="gap-3 mt-4">
          {sections.map((section, idx) => (
            <AppCard key={idx}>
              <AppText variant="titleMd">{section.title}</AppText>
              <AppText variant="bodyMd">{section.body}</AppText>
            </AppCard>
          ))}
        </View>

        {__DEV__ ? (
          <AppText variant="caption" className="mt-4 text-center" color="textMuted">
            {isTR ? "Algılanan Dil" : "Detected language"}: {locale} · {isTR ? "Ülke" : "Country"}: {countryCode} · {isTR ? "Tema" : "Theme"}: {themeName}
          </AppText>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

import { ScrollView, View } from "react-native";
import { AppText } from "../../components/ui/AppText";
import { useThemeStore } from "../../store/useThemeStore";
import { brand } from "../../theme/palettes";

type Section = { title: string; body: string[] };

const sectionsByLocale: Record<"tr" | "en", { intro: Section; cards: Section[] }> = {
  tr: {
    intro: {
      title: "Hakkında",
      body: ["Yerel öncelikli tarım asistanı ve ROI takip uygulaması."],
    },
    cards: [
      {
        title: "Veri Gizliliği",
        body: [
          "Tüm veriler cihazda saklanır.",
          "Konum yalnızca hava durumu ve bölgesel tema için kullanılır.",
          "Reklamlar non-personalized modda çalışır.",
        ],
      },
      {
        title: "Platform Uyumluluğu",
        body: [
          "iOS App Store ve Google Play kurallarına uygun.",
          "Ücretsiz dağıtım, AdMob banner ile desteklenir.",
          "Veri kaynakları açık / freemium tabanlıdır.",
        ],
      },
      {
        title: "Bildirim",
        body: [
          "Öneriler ziraat mühendisi tavsiyesi yerine geçmez. Yerel uzmanla teyit ediniz.",
        ],
      },
    ],
  },
  en: {
    intro: {
      title: "About",
      body: ["Local-first farm assistant and ROI tracker."],
    },
    cards: [
      {
        title: "Data Privacy",
        body: [
          "All data stays on the device.",
          "Location is used only for weather and regional theme.",
          "Ads run in non-personalized mode.",
        ],
      },
      {
        title: "Platform Compliance",
        body: [
          "Aligned with iOS App Store and Google Play rules.",
          "Free distribution, supported by AdMob banner.",
          "Data sources are open / freemium based.",
        ],
      },
      {
        title: "Notice",
        body: [
          "Suggestions do not replace agronomist advice. Always validate with local experts.",
        ],
      },
    ],
  },
};

export function ProfileScreen() {
  const locale = useThemeStore((s) => s.locale);
  const isTR = locale.startsWith("tr");
  const { intro, cards } = isTR ? sectionsByLocale.tr : sectionsByLocale.en;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: brand.bgLight }}>
      <View className="px-5 pt-14 pb-10 gap-4">
        <AppText variant="titleLg">{intro.title}</AppText>
        {intro.body.map((line, i) => (
          <AppText key={i} color="textMuted">{line}</AppText>
        ))}

        {cards.map((section, idx) => (
          <View
            key={idx}
            className="rounded-2xl p-5 border"
            style={{ backgroundColor: brand.bgCard, borderColor: brand.border }}
          >
            <AppText variant="titleMd">{section.title}</AppText>
            {section.body.map((line, i) => (
              <AppText key={i} className="mt-2">{line}</AppText>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

import React from "react";
import { ScrollView, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppCard } from "../../components/ui/AppCard";
import { AppChip } from "../../components/ui/AppChip";
import { AppText } from "../../components/ui/AppText";
import { i18n, setI18nLocale } from "../../i18n";
import { ProductCategory, ProductionSegment, SupportedCurrency } from "../../types/agro";
import { useAgroStore } from "../../store/useAgroStore";
import { useThemeStore } from "../../store/useThemeStore";
import { brand } from "../../theme/palettes";
import { SCREEN_GUTTER } from "../../theme/layout";

const categoryOrder: ProductCategory[] = ["fruit", "grain", "vegetable", "medicinal", "industrial", "niche"];
const currencies: SupportedCurrency[] = ["TRY", "USD", "EUR"];
const segmentOrder: ProductionSegment[] = ["greenhouse", "openField", "orchard", "hydroponic"];

const trCategoryLabel: Record<ProductCategory, string> = {
  fruit: "Meyve",
  grain: "Tahıl",
  vegetable: "Sebze",
  medicinal: "Tıbbi & Aromatik",
  industrial: "Endüstriyel",
  niche: "Niş",
};
const enCategoryLabel: Record<ProductCategory, string> = {
  fruit: "Fruit",
  grain: "Grain",
  vegetable: "Vegetable",
  medicinal: "Medicinal & aromatic",
  industrial: "Industrial",
  niche: "Niche",
};
const trSegmentLabel: Record<ProductionSegment, string> = {
  greenhouse: "Sera",
  openField: "Tarla",
  orchard: "Bahçe",
  hydroponic: "Topraksız",
};
const enSegmentLabel: Record<ProductionSegment, string> = {
  greenhouse: "Greenhouse",
  openField: "Open field",
  orchard: "Orchard",
  hydroponic: "Hydroponic",
};

type LangOption = { code: string; label: string };
const languages: LangOption[] = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
];

export const SettingsScreen: React.FC = () => {
  const prefs = useAgroStore((s) => s.preferences);
  const toggleCategory = useAgroStore((s) => s.toggleCategory);
  const toggleSegment = useAgroStore((s) => s.toggleSegment);
  const setCurrency = useAgroStore((s) => s.setCurrency);
  const setAllowNicheSuggestions = useAgroStore((s) => s.setAllowNicheSuggestions);

  // Reactive locale — this subscription forces the screen to re-render whenever
  // the user picks a new language so i18n.t below returns the fresh translation.
  const locale = useThemeStore((s) => s.locale);
  const setLocale = useThemeStore((s) => s.setLocale);
  const isTR = locale.startsWith("tr");

  const handleLanguageChange = (code: string) => {
    setI18nLocale(code);
    setLocale(code);
  };

  const categoryLabel = isTR ? trCategoryLabel : enCategoryLabel;
  const segmentLabel = isTR ? trSegmentLabel : enSegmentLabel;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: brand.bgLight }}>
      <ScrollView
        contentContainerStyle={{ padding: SCREEN_GUTTER, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="displayMd">{i18n.t("settings.title")}</AppText>

        <AppCard className="mt-3">
          <AppText variant="titleMd">{i18n.t("settings.language")}</AppText>
          <AppText variant="caption" className="mt-1">
            {i18n.t("settings.languageHint")}
          </AppText>
          <View className="mt-3 flex-row flex-wrap gap-2">
            {languages.map((lang) => (
              <AppChip
                key={lang.code}
                label={lang.label}
                selected={locale.startsWith(lang.code)}
                textColor={brand.textDark}
                selectedTextColor={brand.deepBlue}
                onPress={() => handleLanguageChange(lang.code)}
              />
            ))}
          </View>
        </AppCard>

        <AppCard className="mt-3">
          <AppText variant="titleMd">{i18n.t("settings.categories")}</AppText>
          <AppText variant="caption" className="mt-1">
            {i18n.t("settings.categoriesHint")}
          </AppText>
          <View className="mt-3 flex-row flex-wrap gap-2">
            {categoryOrder.map((cat) => (
              <AppChip
                key={cat}
                label={categoryLabel[cat]}
                selected={prefs.selectedCategories.includes(cat)}
                textColor={brand.textDark}
                selectedTextColor={brand.deepBlue}
                onPress={() => toggleCategory(cat)}
              />
            ))}
          </View>
        </AppCard>

        <AppCard className="mt-3">
          <AppText variant="titleMd">{i18n.t("settings.segments")}</AppText>
          <AppText variant="caption" className="mt-1">
            {i18n.t("settings.segmentsHint")}
          </AppText>
          <View className="mt-3 flex-row flex-wrap gap-2">
            {segmentOrder.map((segment) => (
              <AppChip
                key={segment}
                label={segmentLabel[segment]}
                selected={prefs.selectedSegments.includes(segment)}
                textColor={brand.textDark}
                selectedTextColor={brand.deepBlue}
                onPress={() => toggleSegment(segment)}
              />
            ))}
          </View>
        </AppCard>

        <AppCard className="mt-3">
          <AppText variant="titleMd">{i18n.t("settings.currency")}</AppText>
          <View className="mt-3 flex-row gap-2">
            {currencies.map((cur) => (
              <AppChip
                key={cur}
                label={cur}
                selected={prefs.selectedCurrency === cur}
                textColor={brand.textDark}
                selectedTextColor={brand.deepBlue}
                onPress={() => setCurrency(cur)}
              />
            ))}
          </View>
        </AppCard>

        <AppCard className="mt-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-2">
              <AppText variant="titleMd">{i18n.t("settings.niche")}</AppText>
              <AppText variant="caption" className="mt-1">
                {i18n.t("settings.nicheHint")}
              </AppText>
            </View>
            <Switch
              value={prefs.allowNicheSuggestions}
              onValueChange={setAllowNicheSuggestions}
              thumbColor={brand.white}
              trackColor={{ true: brand.teal, false: brand.border }}
            />
          </View>
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
};

import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { LineChart, BarChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppCard } from "../../components/ui/AppCard";
import { AppText } from "../../components/ui/AppText";
import { getMockCropById } from "../../data/mockCrops";
import { i18n } from "../../i18n";
import { useThemeStore } from "../../store/useThemeStore";
import { Crop, CropRequirement } from "../../types/crop";
import { brand } from "../../theme/palettes";
import { SCREEN_GUTTER } from "../../theme/layout";
import { AppStackParamList } from "../../navigation/RootNavigator";
import { getPriceSeriesByCountry } from "../../services/priceHistoryService";

type CropDetailParamList = {
  CropDetail: { cropId: string };
};

type Field = { label: string; value?: string | string[] };

const localizedRequirements = (crop: Crop, isTR: boolean): CropRequirement => {
  if (isTR) return crop.gereksinimler;
  const en = crop.gereksinimlerEn || {};
  return {
    ph: crop.gereksinimler.ph,
    su: en.su || crop.gereksinimler.su,
    toprakTipi: en.toprakTipi || crop.gereksinimler.toprakTipi,
    sulamaNotu: en.sulamaNotu ?? crop.gereksinimler.sulamaNotu,
    ekimDonemi: en.ekimDonemi ?? crop.gereksinimler.ekimDonemi,
    hasatDonemi: en.hasatDonemi ?? crop.gereksinimler.hasatDonemi,
    hastaliklar: en.hastaliklar ?? crop.gereksinimler.hastaliklar,
    gubreleme: en.gubreleme ?? crop.gereksinimler.gubreleme,
    iklimNotu: en.iklimNotu ?? crop.gereksinimler.iklimNotu,
  };
};

const Row: React.FC<{ icon: keyof typeof Ionicons.glyphMap; field: Field }> = ({ icon, field }) => {
  if (!field.value || (Array.isArray(field.value) && field.value.length === 0)) return null;
  const text = Array.isArray(field.value) ? field.value.join(", ") : field.value;
  return (
    <View className="flex-row items-start gap-2 mt-3">
      <Ionicons name={icon} size={16} color={brand.tealLight} style={{ marginTop: 3 }} />
      <View className="flex-1 min-w-0">
        <AppText variant="caption" color="textMuted">{field.label}</AppText>
        <AppText variant="bodyMd">{text}</AppText>
      </View>
    </View>
  );
};

export const CropDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<CropDetailParamList, "CropDetail">>();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const locale = useThemeStore((s) => s.locale);
  const countryCode = useThemeStore((s) => s.countryCode);
  const isTR = locale.startsWith("tr");
  const crop = getMockCropById(route.params.cropId);
  const [seriesSource, setSeriesSource] = React.useState<string>("");
  const [seriesUpdatedAt, setSeriesUpdatedAt] = React.useState<string>("");
  const [seriesData, setSeriesData] = React.useState(crop?.historicalData || []);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!crop) return;
      const result = await getPriceSeriesByCountry(crop.id, countryCode);
      if (!mounted || !result) return;
      setSeriesData(result.series);
      setSeriesSource(result.source);
      setSeriesUpdatedAt(result.updatedAt);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [crop, countryCode]);

  if (!crop) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: brand.bgLight }}
      >
        <AppText variant="titleMd">{i18n.t("cropDetail.notFound")}</AppText>
        <Pressable onPress={() => navigation.goBack()} className="mt-4">
          <AppText variant="bodyMd" color="teal">‹ {i18n.t("cropDetail.back")}</AppText>
        </Pressable>
      </SafeAreaView>
    );
  }

  const name = isTR ? crop.ad : crop.adEn;
  const category = isTR ? crop.kategori : crop.kategoriEn || crop.kategori;
  const summary = isTR ? crop.ozet : crop.ozetEn || crop.ozet;
  const req = localizedRequirements(crop, isTR);

  const priceLineData = seriesData.map((row) => ({
    value: row.ortalamaFiyat,
    label: String(row.yil),
    dataPointText: row.ortalamaFiyat.toString(),
  }));
  const yieldBarData = seriesData.map((row) => ({
    value: row.rekolteTon,
    label: String(row.yil),
    frontColor: brand.teal,
  }));
  const lastPrice = seriesData[seriesData.length - 1];
  const estRevenue =
    crop.donumBasiVerimKg && lastPrice
      ? Math.round(crop.donumBasiVerimKg * lastPrice.ortalamaFiyat).toLocaleString(locale)
      : null;
  const currency = lastPrice?.paraBirimi || "TRY";

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: brand.bgLight }}>
      <ScrollView
        contentContainerStyle={{ padding: SCREEN_GUTTER, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          className="self-start flex-row items-center gap-1 mb-2"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={20} color={brand.tealLight} />
          <AppText variant="bodyMd" color="teal">{i18n.t("cropDetail.back")}</AppText>
        </Pressable>

        <AppText variant="displayMd">{name}</AppText>
        <AppText variant="caption" className="mt-1">
          {i18n.t("cropDetail.category")}: {category}
        </AppText>
        <AppText variant="bodyMd" color="textMuted" className="mt-2">
          {summary}
        </AppText>

        <AppCard className="mt-4">
          <AppText variant="titleMd">{i18n.t("cropDetail.growthConditions")}</AppText>
          <Row
            icon="layers-outline"
            field={{ label: i18n.t("cropDetail.soil"), value: req.toprakTipi }}
          />
          <Row
            icon="flask-outline"
            field={{ label: i18n.t("cropDetail.phRange"), value: req.ph }}
          />
          <Row
            icon="water-outline"
            field={{ label: i18n.t("cropDetail.waterNeed"), value: req.su }}
          />
          <Row
            icon="rainy-outline"
            field={{ label: i18n.t("cropDetail.irrigationNote"), value: req.sulamaNotu }}
          />
          <Row
            icon="calendar-outline"
            field={{ label: i18n.t("cropDetail.sowingPeriod"), value: req.ekimDonemi }}
          />
          <Row
            icon="leaf-outline"
            field={{ label: i18n.t("cropDetail.harvestPeriod"), value: req.hasatDonemi }}
          />
          <Row
            icon="bug-outline"
            field={{ label: i18n.t("cropDetail.diseases"), value: req.hastaliklar }}
          />
          <Row
            icon="nutrition-outline"
            field={{ label: i18n.t("cropDetail.fertilization"), value: req.gubreleme }}
          />
          <Row
            icon="thermometer-outline"
            field={{ label: i18n.t("cropDetail.climateNote"), value: req.iklimNotu }}
          />
        </AppCard>

        {crop.donumBasiVerimKg ? (
          <AppCard className="mt-4">
            <AppText variant="titleMd">{i18n.t("cropDetail.yieldExpectation")}</AppText>
            <AppText variant="displayMd" color="teal" className="mt-1">
              {crop.donumBasiVerimKg.toLocaleString(locale)} {i18n.t("cropDetail.yieldPerDonum")}
            </AppText>
            {estRevenue ? (
              <AppText variant="caption" className="mt-2">
                {i18n.t("cropDetail.estimatedRevenue")}: ≈ {estRevenue} {currency}
              </AppText>
            ) : null}
          </AppCard>
        ) : null}

        <AppCard className="mt-4">
          <AppText variant="titleMd">{i18n.t("cropDetail.priceTrend")} (2021–2025)</AppText>
          {seriesSource ? (
            <AppText variant="caption" className="mt-1">
              {isTR ? "Kaynak" : "Source"}: {seriesSource}
              {seriesUpdatedAt ? ` · ${isTR ? "Guncelleme" : "Updated"}: ${seriesUpdatedAt}` : ""}
            </AppText>
          ) : null}
          <View className="mt-3">
            <LineChart
              data={priceLineData}
              color={brand.tealLight}
              thickness={3}
              dataPointsColor={brand.neonMint}
              yAxisColor={brand.border}
              xAxisColor={brand.border}
              hideRules={false}
              rulesColor={brand.border}
              spacing={56}
              noOfSections={4}
              textColor1={brand.textMuted}
              yAxisTextStyle={{ color: brand.textMuted }}
              xAxisLabelTextStyle={{ color: brand.textMuted }}
            />
          </View>
          <AppText variant="caption" className="mt-2">
            {i18n.t("modal.amount")}: {currency} / kg
          </AppText>
        </AppCard>

        <AppCard className="mt-4">
          <AppText variant="titleMd">{i18n.t("cropDetail.historicalYield")}</AppText>
          <View className="mt-3">
            <BarChart
              data={yieldBarData}
              barWidth={28}
              spacing={24}
              roundedTop
              roundedBottom
              yAxisColor={brand.border}
              xAxisColor={brand.border}
              rulesColor={brand.border}
              noOfSections={4}
              xAxisLabelTextStyle={{ color: brand.textMuted }}
              yAxisTextStyle={{ color: brand.textMuted }}
            />
          </View>
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
};

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DailyDiscoveryCard } from "../../components/cards/DailyDiscoveryCard";
import { CostEntryModal } from "../../components/forms/CostEntryModal";
import { CropLibraryModal } from "../../components/forms/CropLibraryModal";
import { LandSoilPlanModal } from "../../components/forms/LandSoilPlanModal";
import { BannerAdSlot } from "../../components/ui/BannerAdSlot";
import { LogoMark } from "../../components/ui/LogoMark";
import { WindTurbine } from "../../components/ui/WindTurbine";
import { WeatherBackdrop, inferCondition } from "../../components/ui/WeatherBackdrop";
import { AppText } from "../../components/ui/AppText";
import { AgSoilInsightCard } from "../../features/farm/AgSoilInsightCard";
import { FinanceSummaryCard } from "../../features/finance/FinanceSummaryCard";
import { DailyTaskList } from "../../features/tasks/DailyTaskList";
import { WeatherAlertCard } from "../../features/weather/WeatherAlertCard";
import { Forecast30DayCard } from "../../features/weather/Forecast30DayCard";
import { WeatherWidget } from "../../features/weather/WeatherWidget";
import { buildDailyAlert } from "../../lib/dailyInsights";
import { formatDate } from "../../lib/formatters";
import { getDailyCrop } from "../../services/dailyCropService";
import { recommendNicheAlternatives, recommendSuitableCrops } from "../../services/recommendationService";
import { i18n } from "../../i18n";
import { useAgroStore } from "../../store/useAgroStore";
import { useTarimStore } from "../../store/useTarimStore";
import { useThemeStore } from "../../store/useThemeStore";
import { brand } from "../../theme/palettes";
import { SCREEN_GUTTER } from "../../theme/layout";
import { AppStackParamList } from "../../navigation/RootNavigator";
import { Crop } from "../../types/crop";

const conditionLabel = (c: string, isTR: boolean): string => {
  if (isTR) {
    switch (c) {
      case "clear-day": return "Açık";
      case "clear-night": return "Açık · Gece";
      case "cloudy": return "Bulutlu";
      case "rain": return "Yağışlı";
      case "snow": return "Karlı";
      case "hot": return "Sıcak";
      default: return "—";
    }
  }
  switch (c) {
    case "clear-day": return "Clear";
    case "clear-night": return "Clear · Night";
    case "cloudy": return "Cloudy";
    case "rain": return "Rainy";
    case "snow": return "Snow";
    case "hot": return "Hot";
    default: return "—";
  }
};

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const weather = useTarimStore((s) => s.weatherCache);
  const tasks = useTarimStore((s) => s.dailyTasks);
  const costs = useTarimStore((s) => s.costs);
  const project = useTarimStore((s) => s.project);
  const toggleTask = useTarimStore((s) => s.toggleTask);
  const themeName = useThemeStore((s) => s.themeName);
  const locale = useThemeStore((s) => s.locale);
  const isTR = locale.startsWith("tr");
  const climate = themeName === "continental" ? "continental" : themeName === "arid" ? "arid" : "tropical";
  const preferences = useAgroStore((s) => s.preferences);
  const [dailyCrop, setDailyCrop] = useState<Crop | null>(null);
  const [showAllRecommended, setShowAllRecommended] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [landModalVisible, setLandModalVisible] = useState(false);
  const [libraryVisible, setLibraryVisible] = useState(false);

  const gutter = {
    paddingLeft: SCREEN_GUTTER + insets.left,
    paddingRight: SCREEN_GUTTER + insets.right,
  };

  const totalCost = useMemo(() => costs.reduce((sum, cost) => sum + cost.amount, 0), [costs]);
  const alertBundle = useMemo(
    () => buildDailyAlert(weather, project, themeName),
    [weather, project, themeName],
  );
  const turbineMode = alertBundle.kind === "ok" ? "calm" : alertBundle.kind === "warning" ? "watch" : "alert";
  const condition = useMemo(() => inferCondition(weather), [weather]);
  const recommended = useMemo(
    () => recommendSuitableCrops({ climate, preferences }).slice(0, 3),
    [climate, preferences],
  );
  const niche = useMemo(
    () => recommendNicheAlternatives({ climate, preferences }).slice(0, 1),
    [climate, preferences],
  );
  const visibleRecommended = showAllRecommended ? recommended : recommended.slice(0, 2);

  useEffect(() => {
    getDailyCrop().then(setDailyCrop).catch(() => null);
  }, []);

  const scrollBottomPad = 108 + insets.bottom;
  const heroHeight = 360 + insets.top;

  return (
    <View className="flex-1" style={{ backgroundColor: brand.bgLight }}>
      <View className="flex-1" style={{ zIndex: 1 }}>
        <Animated.ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: scrollBottomPad + 26,
          }}
          showsVerticalScrollIndicator={false}
          bounces
        >
          {/* Hero — Apple Weather inspired sky backdrop with wind turbine */}
          <View style={{ position: "relative", minHeight: heroHeight }}>
            <WeatherBackdrop weather={weather} height={heroHeight} />

            <View
              style={{
                paddingTop: insets.top + SCREEN_GUTTER,
                paddingBottom: SCREEN_GUTTER * 1.5,
                ...gutter,
              }}
            >
              {/* Top bar: logo + title + location */}
              <View className="flex-row items-center justify-between gap-2">
                <View className="flex-row items-center gap-2 flex-1 min-w-0">
                  <LogoMark size={32} ring style={{ flexShrink: 0 }} />
                  <AppText variant="titleMd" style={{ color: brand.white }} numberOfLines={2}>
                    SONAR Farm ROI
                  </AppText>
                </View>
                <View
                  className="flex-row items-center gap-1 flex-shrink-0 max-w-[55%] rounded-full px-2.5 py-1 border"
                  style={{
                    borderColor: "rgba(255,255,255,0.45)",
                    backgroundColor: "rgba(255,255,255,0.18)",
                  }}
                >
                  <Ionicons name="location-outline" size={14} color="white" style={{ flexShrink: 0 }} />
                  <AppText variant="caption" style={{ color: brand.white }} numberOfLines={1}>
                    {weather?.locationName || (isTR ? "Bilinmiyor" : "Unknown")}
                  </AppText>
                </View>
              </View>

              {/* Apple-Weather style centered temperature + condition */}
              <View className="items-center mt-6">
                {weather ? (
                  <AppText
                    style={{
                      color: brand.white,
                      fontSize: 86,
                      lineHeight: 96,
                      fontWeight: "200",
                      marginTop: 4,
                    }}
                  >
                    {weather.temperatureC}°
                  </AppText>
                ) : (
                  <AppText
                    style={{
                      color: brand.white,
                      fontSize: 64,
                      lineHeight: 72,
                      fontWeight: "200",
                      marginTop: 4,
                    }}
                  >
                    —
                  </AppText>
                )}
                <AppText variant="bodyMd" style={{ color: brand.white, marginTop: 2 }}>
                  {conditionLabel(condition, isTR)}
                </AppText>
                {weather ? (
                  <AppText variant="caption" style={{ color: brand.white, opacity: 0.92, marginTop: 2 }}>
                    {isTR
                      ? `Nem ${weather.humidity}%   ·   Rüzgâr ${weather.windKmh} km/s   ·   Yağış ${weather.precipitationChance}%`
                      : `Humidity ${weather.humidity}%   ·   Wind ${weather.windKmh} km/h   ·   Precip. ${weather.precipitationChance}%`}
                  </AppText>
                ) : null}
              </View>

              {/* Wind turbine — spins faster with live wind speed (km/h) */}
              <View
                pointerEvents="none"
                style={{ position: "absolute", right: 8, top: insets.top + 36 }}
              >
                <WindTurbine size={150} mode={turbineMode} windKmh={weather?.windKmh} />
              </View>

              <AppText
                variant="bodyMd"
                style={{ color: brand.white, opacity: 0.9, marginTop: 16, textAlign: "center" }}
              >
                {formatDate(new Date().toISOString())}
              </AppText>
            </View>
          </View>

          {/* Content — translucent glass cards float over the lower part of the backdrop */}
          <View className="pt-4 gap-4" style={gutter}>
            {dailyCrop ? (
              <DailyDiscoveryCard
                crop={dailyCrop}
                onPress={(cropId) => navigation.navigate("CropDetail", { cropId })}
              />
            ) : null}
            <Pressable
              className="rounded-3xl border p-4"
              style={{ borderColor: "rgba(94,234,212,0.28)", backgroundColor: brand.bgCard }}
              onPress={() => setLibraryVisible(true)}
              accessibilityRole="button"
            >
              <AppText variant="label" color="teal">
                {isTR ? "Kutuphane" : "Library"}
              </AppText>
              <AppText variant="titleMd" className="mt-1">
                {isTR ? "Tum Tarimsal Urunleri Kesfet" : "Explore All Agricultural Crops"}
              </AppText>
              <AppText variant="caption" className="mt-1">
                {isTR ? "Ara, ozetini gor, detayli analize gec." : "Search, view summary, open detailed analytics."}
              </AppText>
            </Pressable>
            <WeatherWidget weather={weather} layoutWidth={width} />
            <Forecast30DayCard weather={weather} />
            <WeatherAlertCard kind={alertBundle.kind} message={alertBundle.message} detail={alertBundle.detail} />
            <AgSoilInsightCard themeName={themeName} />
            <View
              className="rounded-3xl border p-4"
              style={{ borderColor: "rgba(94,234,212,0.28)", backgroundColor: brand.bgCard }}
            >
              <AppText variant="titleMd">{i18n.t("regionalCrops.title")}</AppText>
              <AppText variant="caption" className="mt-1">
                {i18n.t("regionalCrops.subtitle")}
              </AppText>
              <View className="mt-2">
                {visibleRecommended.map((crop) => {
                  const localized = i18n.t(`crops.${crop.id}`);
                  const cropName = localized && localized !== crop.id ? localized : crop.name;
                  return (
                    <Pressable
                      key={crop.id}
                      onPress={() => navigation.navigate("CropDetail", { cropId: crop.id })}
                      className="mt-2 flex-row items-start gap-2"
                      accessibilityRole="button"
                    >
                      <AppText variant="bodyMd" color="teal" style={{ marginTop: 1 }}>
                        ›
                      </AppText>
                      <View className="flex-1 min-w-0">
                        <AppText variant="bodyMd" color="teal">
                          {cropName}
                        </AppText>
                        <AppText variant="caption" color="textMuted">
                          {i18n.t("regionalCrops.yieldHint", { yield: crop.avgYieldPerDonumKg })}
                        </AppText>
                      </View>
                    </Pressable>
                  );
                })}
                {recommended.length > 2 ? (
                  <AppText
                    variant="bodyMd"
                    color="teal"
                    className="mt-3"
                    onPress={() => setShowAllRecommended((prev) => !prev)}
                  >
                    {showAllRecommended
                      ? i18n.t("regionalCrops.showLess")
                      : i18n.t("regionalCrops.showMore")}
                  </AppText>
                ) : null}
                {niche[0] ? (
                  <AppText variant="caption" className="mt-3">
                    {i18n.t("regionalCrops.tryNiche")}{" "}
                    {(() => {
                      const localized = i18n.t(`crops.${niche[0].id}`);
                      return localized && localized !== niche[0].id ? localized : niche[0].name;
                    })()}
                  </AppText>
                ) : null}
              </View>
            </View>
            <DailyTaskList tasks={tasks} onToggle={toggleTask} />
            <FinanceSummaryCard
              totalCost={totalCost}
              project={project}
              onAddExpense={() => setModalVisible(true)}
              onEditLand={() => setLandModalVisible(true)}
              layoutWidth={width}
            />
          </View>
        </Animated.ScrollView>

        <BannerAdSlot />
      </View>

      <CostEntryModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      <LandSoilPlanModal visible={landModalVisible} onClose={() => setLandModalVisible(false)} />
      <CropLibraryModal
        visible={libraryVisible}
        onClose={() => setLibraryVisible(false)}
        onOpenCrop={(cropId) => navigation.navigate("CropDetail", { cropId })}
      />
    </View>
  );
};

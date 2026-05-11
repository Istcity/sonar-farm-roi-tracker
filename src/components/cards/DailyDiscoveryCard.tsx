import React from "react";
import { Pressable, View } from "react-native";
import { i18n } from "../../i18n";
import { useThemeStore } from "../../store/useThemeStore";
import { Crop } from "../../types/crop";
import { AppCard } from "../ui/AppCard";
import { AppText } from "../ui/AppText";
import { brand } from "../../theme/palettes";

type Props = {
  crop: Crop;
  onPress: (cropId: string) => void;
};

export const DailyDiscoveryCard: React.FC<Props> = ({ crop, onPress }) => {
  const locale = useThemeStore((s) => s.locale);
  const isTR = locale.startsWith("tr");
  const name = isTR ? crop.ad : crop.adEn;
  const summary = isTR ? crop.ozet : crop.ozetEn || crop.ozet;
  const soilFirst = isTR
    ? crop.gereksinimler.toprakTipi[0]
    : crop.gereksinimlerEn?.toprakTipi?.[0] || crop.gereksinimler.toprakTipi[0];

  return (
    <Pressable onPress={() => onPress(crop.id)} accessibilityRole="button">
      <AppCard className="overflow-hidden">
        <View
          pointerEvents="none"
          className="absolute -top-8 -right-6 h-24 w-24 rounded-full"
          style={{ backgroundColor: "rgba(94,234,212,0.16)" }}
        />
        <AppText variant="label" color="teal">
          {i18n.t("daily.cropOfTheDay")}
        </AppText>
        <AppText variant="titleLg" className="mt-1">
          {name}
        </AppText>
        <AppText variant="bodyMd" color="textMuted" className="mt-1">
          {summary}
        </AppText>
        <View className="mt-3 flex-row items-center justify-between">
          <AppText variant="caption">
            {soilFirst} · pH {crop.gereksinimler.ph}
          </AppText>
          <AppText variant="bodyMd" style={{ color: brand.tealLight, fontWeight: "600" }}>
            {i18n.t("daily.viewDetail")}  ›
          </AppText>
        </View>
      </AppCard>
    </Pressable>
  );
};

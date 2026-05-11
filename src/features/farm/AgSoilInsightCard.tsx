import React, { useMemo } from "react";
import { View } from "react-native";
import { i18n } from "../../i18n";
import { getTotalAreaM2 } from "../../lib/area";
import { suggestCropsForSoil } from "../../lib/soilCropAdvice";
import { useTarimStore } from "../../store/useTarimStore";
import { ThemeName, brand } from "../../theme/palettes";
import { AppCard } from "../../components/ui/AppCard";
import { AppText } from "../../components/ui/AppText";

type Props = { themeName: ThemeName };

export const AgSoilInsightCard: React.FC<Props> = ({ themeName }) => {
  const project = useTarimStore((s) => s.project);
  const totalM2 = getTotalAreaM2(project);

  const crops = useMemo(() => suggestCropsForSoil(project.soil, themeName), [project.soil, themeName]);

  return (
    <AppCard>
      <AppText variant="titleMd" className="mb-2">
        {i18n.t("farm.soilCropsTitle")}
      </AppText>
      <AppText variant="caption" color="textMuted" className="mb-2">
        {i18n.t("farm.totalAreaM2", { m2: Math.round(totalM2).toLocaleString(i18n.locale) })}
      </AppText>
      <View
        className="rounded-xl p-3 mb-3 border"
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          borderColor: "rgba(57,255,142,0.28)",
        }}
      >
        <AppText variant="label" color="textMuted" className="mb-1">
          {i18n.t("farm.regionalTitle")}
        </AppText>
        <AppText variant="bodyMd" color="textDark">
          {i18n.t(`regional.${themeName}`)}
        </AppText>
      </View>
      <AppText variant="bodyMd" className="mb-2">
        {i18n.t("farm.cropHintsIntro")}
      </AppText>
      <View className="gap-2">
        {crops.slice(0, 5).map((c) => (
          <View key={c.cropKey} className="flex-row items-start gap-2">
            <View className="mt-1.5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: brand.teal }} />
            <View className="flex-1 min-w-0">
              <AppText variant="titleMd" numberOfLines={2}>
                {i18n.t(`crops.${c.cropKey}`)}
              </AppText>
              <AppText variant="caption" numberOfLines={3}>
                {i18n.t(c.reasonKey)}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </AppCard>
  );
};

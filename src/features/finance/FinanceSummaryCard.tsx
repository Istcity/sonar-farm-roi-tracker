import React from "react";
import { Alert, View } from "react-native";
import { i18n } from "../../i18n";
import { getCostPerM2, getTotalAreaM2 } from "../../lib/area";
import { AppButton } from "../../components/ui/AppButton";
import { AppCard } from "../../components/ui/AppCard";
import { AppText } from "../../components/ui/AppText";
import { formatCurrency } from "../../lib/formatters";
import { ProjectSummary } from "../../types/store";
import { brand } from "../../theme/palettes";
import { COMPACT_WIDTH } from "../../theme/layout";

type Props = {
  totalCost: number;
  project: ProjectSummary;
  onAddExpense: () => void;
  onEditLand: () => void;
  layoutWidth: number;
};

export const FinanceSummaryCard: React.FC<Props> = ({
  totalCost,
  project,
  onAddExpense,
  onEditLand,
  layoutWidth,
}) => {
  const compact = layoutWidth < COMPACT_WIDTH;
  const metricVariant = compact ? ("titleLg" as const) : ("displayMd" as const);
  const unitCost = getCostPerM2(totalCost, project);
  const totalM2 = getTotalAreaM2(project);

  const MetricBox: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
    <View
      className={compact ? "w-full rounded-xl p-3" : "flex-1 rounded-xl p-3"}
      style={{
        backgroundColor: "rgba(255,255,255,0.05)",
        borderColor: "rgba(57,255,142,0.28)",
        borderWidth: 1,
        minWidth: compact ? undefined : 0,
      }}
    >
      <AppText variant={metricVariant} color="teal" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.65}>
        {value}
      </AppText>
      <AppText variant="caption" color="textMuted" numberOfLines={2}>
        {label}
      </AppText>
    </View>
  );

  return (
    <AppCard>
      <View className="h-1 w-full rounded-full mb-3" style={{ backgroundColor: brand.teal }} />
      <AppText variant="titleLg" numberOfLines={3}>
        {project.name}
      </AppText>
      <AppText variant="bodyMd" color="textMuted" className="mt-1" numberOfLines={2}>
        {project.areaDonums} {i18n.t("farm.donumShort")} · {project.crop} · {Math.round(totalM2).toLocaleString(i18n.locale)} m²
      </AppText>
      <AppText variant="caption" className="mt-1">
        {unitCost != null ? `${i18n.t("farm.costPerM2")}: ${formatCurrency(unitCost)}` : i18n.t("farm.costPerM2Pending")}
      </AppText>

      <View className={compact ? "mt-3 gap-2" : "mt-3 flex-row flex-wrap gap-2"}>
        <MetricBox value={formatCurrency(totalCost)} label={i18n.t("dashboard.totalCost")} />
        <MetricBox value={project.expectedHarvestYear} label={i18n.t("dashboard.harvestYear")} />
        <MetricBox value={formatCurrency(project.estimatedRevenue)} label={i18n.t("dashboard.estimatedRevenue")} />
      </View>

      <View className="mt-4 gap-2">
        <AppButton title={i18n.t("farm.editLandSoil")} variant="secondary" onPress={onEditLand} />
        <AppButton title={i18n.t("dashboard.addExpense")} onPress={onAddExpense} />
        <AppButton
          title={i18n.t("dashboard.premiumCta")}
          variant="secondary"
          onPress={() => Alert.alert("Premium", i18n.t("dashboard.premiumAlert"))}
        />
      </View>
    </AppCard>
  );
};

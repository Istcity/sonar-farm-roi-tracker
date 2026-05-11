import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { i18n } from "../../i18n";
import { AppCard } from "../../components/ui/AppCard";
import { AppText } from "../../components/ui/AppText";

type Kind = "warning" | "frost" | "wind" | "ok";
type Props = { kind: Kind; message: string; detail?: string };

const config: Record<Kind, { color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  warning: { color: "#F57F17", icon: "warning-outline" },
  frost: { color: "#1287B8", icon: "snow-outline" },
  wind: { color: "#5A8DA8", icon: "flag-outline" },
  ok: { color: "#0B7A75", icon: "checkmark-circle-outline" },
};

export const WeatherAlertCard: React.FC<Props> = ({ kind, message, detail }) => (
  <AppCard className="pl-0">
    <View className="flex-row">
      <View className="w-1 rounded-full ml-4 mr-3" style={{ backgroundColor: config[kind].color }} />
      <View className="flex-1 pr-4">
        <View className="flex-row items-center gap-2">
          <Ionicons name={config[kind].icon} size={18} color={config[kind].color} />
          <AppText variant="titleMd" color="error" numberOfLines={2}>
            {i18n.t("insights.cardTitle")}
          </AppText>
        </View>
        <AppText variant="bodyMd" className="mt-2" style={{ fontWeight: "600" }}>
          {message}
        </AppText>
        {detail ? (
          <AppText variant="bodyMd" color="textMuted" className="mt-2">
            {detail}
          </AppText>
        ) : null}
      </View>
    </View>
  </AppCard>
);

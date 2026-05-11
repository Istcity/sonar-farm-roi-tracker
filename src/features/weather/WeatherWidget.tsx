import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { AppCard } from "../../components/ui/AppCard";
import { AppText } from "../../components/ui/AppText";
import { WeatherSnapshot } from "../../types/weather";
import { useThemeStore } from "../../store/useThemeStore";
import { brand } from "../../theme/palettes";
import { COMPACT_WIDTH } from "../../theme/layout";

type Props = { weather: WeatherSnapshot | null; layoutWidth: number };

export const WeatherWidget: React.FC<Props> = ({ weather, layoutWidth }) => {
  const compact = layoutWidth < COMPACT_WIDTH;
  const locale = useThemeStore((s) => s.locale);
  const isTR = locale.startsWith("tr");

  if (!weather) {
    return (
      <AppCard>
        <View className="h-24 rounded-xl" style={{ backgroundColor: "rgba(94,234,212,0.1)" }} />
      </AppCard>
    );
  }

  return (
    <AppCard>
      <View className={compact ? "flex-col gap-3" : "flex-row items-center justify-between"}>
        <AppText
          variant="displayLg"
          style={compact ? {} : { flexShrink: 0 }}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {weather.temperatureC}°C
        </AppText>
        <View
          className={compact ? "gap-2 w-full" : "gap-2 flex-1 min-w-0"}
          style={compact ? {} : { marginLeft: 12 }}
        >
          <View className="flex-row items-center gap-1 flex-wrap">
            <Ionicons name="water-outline" size={14} color={brand.textMuted} />
            <AppText variant="bodyMd" numberOfLines={2}>
              {weather.humidity}% {isTR ? "nem" : "humidity"}
            </AppText>
          </View>
          <View className="flex-row items-center gap-1 flex-wrap">
            <Ionicons name="speedometer-outline" size={14} color={brand.textMuted} />
            <AppText variant="bodyMd" numberOfLines={2}>
              {weather.windKmh} {isTR ? "km/s rüzgâr" : "km/h wind"}
            </AppText>
          </View>
          <View className="flex-row items-center gap-1 flex-wrap">
            <Ionicons name="rainy-outline" size={14} color={brand.textMuted} />
            <AppText variant="bodyMd" numberOfLines={2}>
              {weather.precipitationChance}% {isTR ? "yağış" : "precipitation"}
            </AppText>
          </View>
        </View>
      </View>
      <AppText variant="caption" className="mt-2">
        {isTR ? "Güncellendi" : "Updated"}: {new Date(weather.updatedAt).toLocaleTimeString()}
      </AppText>
    </AppCard>
  );
};

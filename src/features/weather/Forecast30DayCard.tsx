import React, { useMemo } from "react";
import { View } from "react-native";
import { AppCard } from "../../components/ui/AppCard";
import { AppText } from "../../components/ui/AppText";
import { useThemeStore } from "../../store/useThemeStore";
import { WeatherSnapshot } from "../../types/weather";
import { brand } from "../../theme/palettes";

type Props = { weather: WeatherSnapshot | null };

export const Forecast30DayCard: React.FC<Props> = ({ weather }) => {
  const locale = useThemeStore((s) => s.locale);
  const isTR = locale.startsWith("tr");
  const forecast = weather?.forecast30d || [];

  const weekly = useMemo(() => {
    if (forecast.length === 0) return [];
    return [0, 1, 2, 3].map((w) => {
      const slice = forecast.slice(w * 7, Math.min((w + 1) * 7, forecast.length));
      const min = Math.round(slice.reduce((s, d) => s + d.tempMinC, 0) / slice.length);
      const max = Math.round(slice.reduce((s, d) => s + d.tempMaxC, 0) / slice.length);
      const rain = Math.round(slice.reduce((s, d) => s + d.precipitationChance, 0) / slice.length);
      return { week: w + 1, min, max, rain };
    });
  }, [forecast]);

  return (
    <AppCard>
      <AppText variant="titleMd">{isTR ? "30 Gunluk Hava Tahmini" : "30-Day Weather Outlook"}</AppText>
      <AppText variant="caption" className="mt-1">
        {isTR
          ? "Ilk 16 gun Open-Meteo, kalan gunler trend tabanli tahmindir."
          : "First 16 days from Open-Meteo, remaining days are trend-based estimates."}
      </AppText>

      {weekly.length === 0 ? (
        <AppText variant="bodyMd" color="textMuted" className="mt-3">
          {isTR ? "Tahmin verisi bekleniyor..." : "Forecast data is loading..."}
        </AppText>
      ) : (
        <View className="mt-3 gap-2">
          {weekly.map((w) => (
            <View
              key={w.week}
              className="rounded-xl border p-3 flex-row items-center justify-between"
              style={{ borderColor: "rgba(57,255,142,0.28)", backgroundColor: "rgba(255,255,255,0.04)" }}
            >
              <AppText variant="bodyMd" color="teal">
                {isTR ? `${w.week}. Hafta` : `Week ${w.week}`}
              </AppText>
              <AppText variant="caption" color="textMuted">
                {w.min}° / {w.max}° · {isTR ? "Yagis" : "Rain"} %{w.rain}
              </AppText>
            </View>
          ))}
        </View>
      )}

      <View className="mt-3 h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
        <View className="h-1.5 rounded-full" style={{ width: "100%", backgroundColor: brand.teal }} />
      </View>
    </AppCard>
  );
};


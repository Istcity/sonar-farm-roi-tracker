import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppCard } from "../../components/ui/AppCard";
import { AppText } from "../../components/ui/AppText";
import { cropById } from "../../data/cropCatalog";
import { i18n } from "../../i18n";
import {
  getLocalizedCropName,
  getLocalizedCropSummary,
  getLocalizedSoilInfo,
  getLocalizedWaterNeed,
} from "../../lib/cropLocalization";
import { formatCurrencyByCode } from "../../lib/formatters";
import { fetchMarketQuote } from "../../services/marketService";
import { useAgroStore } from "../../store/useAgroStore";
import { MarketQuote } from "../../types/agro";
import { brand } from "../../theme/palettes";
import { SCREEN_GUTTER } from "../../theme/layout";

type ProductParamList = {
  ProductDetail: { cropId: string };
};

const YieldBars: React.FC<{ values: number[] }> = ({ values }) => {
  const max = Math.max(...values, 1);
  return (
    <View className="mt-2 flex-row items-end gap-2 h-24">
      {values.map((v, idx) => (
        <View key={`${idx}-${v}`} className="flex-1 rounded-t-md" style={{ height: `${(v / max) * 100}%`, backgroundColor: brand.teal }} />
      ))}
    </View>
  );
};

export const ProductDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<ProductParamList, "ProductDetail">>();
  const crop = cropById(route.params.cropId);
  const currency = useAgroStore((s) => s.preferences.selectedCurrency);
  const [quote, setQuote] = useState<MarketQuote | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!crop) return;
    fetchMarketQuote(crop.id, currency).then((q) => mounted && setQuote(q));
    return () => {
      mounted = false;
    };
  }, [crop, currency]);

  if (!crop) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center" style={{ backgroundColor: brand.bgLight }}>
        <AppText variant="titleMd">Urun bulunamadi</AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: brand.bgLight }}>
      <ScrollView contentContainerStyle={{ padding: SCREEN_GUTTER, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <AppText variant="displayMd">{getLocalizedCropName(crop)}</AppText>
        <AppText variant="bodyMd" color="textMuted" className="mt-1">
          {getLocalizedCropSummary(crop)}
        </AppText>

        <AppCard className="mt-3">
          <AppText variant="titleMd">{i18n.locale.startsWith("tr") ? "Ideal Gelisim Sartlari" : "Ideal Growth Conditions"}</AppText>
          <AppText variant="bodyMd" className="mt-2">
            {i18n.locale.startsWith("tr") ? "Toprak" : "Soil"}: {getLocalizedSoilInfo(crop)}
          </AppText>
          <AppText variant="bodyMd">pH: {crop.idealPhRange}</AppText>
          <AppText variant="bodyMd">
            {i18n.locale.startsWith("tr") ? "Su ihtiyaci" : "Water need"}: {getLocalizedWaterNeed(crop.waterNeed)}
          </AppText>
        </AppCard>

        <AppCard className="mt-3">
          <AppText variant="titleMd">{i18n.locale.startsWith("tr") ? "Verim Beklentisi" : "Yield Expectation"}</AppText>
          <AppText variant="displayMd" color="teal" className="mt-1">
            {crop.avgYieldPerDonumKg} kg / {i18n.locale.startsWith("tr") ? "donum" : "decare"}
          </AppText>
        </AppCard>

        <AppCard className="mt-3">
          <AppText variant="titleMd">{i18n.locale.startsWith("tr") ? "Gecmis Rekolte Trendi" : "Historical Yield Trend"}</AppText>
          <YieldBars values={crop.historicalYieldKg} />
        </AppCard>

        <AppCard className="mt-3">
          <AppText variant="titleMd">{i18n.locale.startsWith("tr") ? "Guncel Piyasa Fiyati" : "Current Market Price"}</AppText>
          {quote ? (
            <>
              <AppText variant="displayMd" color="teal" className="mt-1">
                {formatCurrencyByCode(quote.unitPrice, quote.currency)} / kg
              </AppText>
              <AppText variant="caption">
                {i18n.locale.startsWith("tr") ? "Kaynak: yerel pazar tahmini" : quote.source}
              </AppText>
            </>
          ) : (
            <AppText variant="bodyMd" className="mt-2">
              {i18n.locale.startsWith("tr") ? "Yukleniyor..." : "Loading..."}
            </AppText>
          )}
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
};

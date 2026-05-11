import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { cropById } from "../../data/cropCatalog";
import { i18n } from "../../i18n";
import { getLocalizedCropName } from "../../lib/cropLocalization";
import { formatCurrencyByCode } from "../../lib/formatters";
import { fetchMarketQuote } from "../../services/marketService";
import { useThemeStore } from "../../store/useThemeStore";
import { MarketQuote, SupportedCurrency } from "../../types/agro";
import { AppCard } from "../../components/ui/AppCard";
import { AppText } from "../../components/ui/AppText";

type Props = {
  cropIds: string[];
  currency: SupportedCurrency;
};

export const MarketBoardCard: React.FC<Props> = ({ cropIds, currency }) => {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const locale = useThemeStore((s) => s.locale);
  const countryCode = useThemeStore((s) => s.countryCode);
  const isTR = locale.startsWith("tr");

  useEffect(() => {
    let mounted = true;
    Promise.all(cropIds.map((id) => fetchMarketQuote(id, currency, countryCode))).then((result) => {
      if (!mounted) return;
      setQuotes(result.filter((q): q is MarketQuote => Boolean(q)));
    });
    return () => {
      mounted = false;
    };
  }, [cropIds, currency, countryCode]);

  return (
    <AppCard>
      <AppText variant="titleMd">{isTR ? "Pazar Panosu" : "Market Board"}</AppText>
      <AppText variant="caption" className="mt-1">
        {isTR ? "Seçili para birimi" : "Selected currency"}: {currency}
      </AppText>
      <AppText variant="caption" className="mt-1">
        {isTR ? "Fiyatlar ülke bazlı kaynak/fallback ile gösterilir." : "Prices use country-aware source/fallback."}
      </AppText>
      <View className="mt-3 gap-2">
        {quotes.map((q) => {
          const crop = cropById(q.cropId);
          return (
            <View key={`${q.cropId}-${q.currency}`} className="flex-row items-center justify-between">
              <AppText variant="bodyMd">{crop ? getLocalizedCropName(crop) : q.cropId}</AppText>
              <AppText variant="bodyMd" color="teal">
                {formatCurrencyByCode(q.unitPrice, q.currency)} / kg
              </AppText>
            </View>
          );
        })}
      </View>
    </AppCard>
  );
};

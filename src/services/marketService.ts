import { cropById } from "../data/cropCatalog";
import { MarketQuote, SupportedCurrency } from "../types/agro";
import { getPriceSeriesByCountry } from "./priceHistoryService";

const ratesFromTry: Record<SupportedCurrency, number> = {
  TRY: 1,
  USD: 0.031,
  EUR: 0.029,
};

export function convertFromTry(amountTry: number, currency: SupportedCurrency): number {
  return amountTry * ratesFromTry[currency];
}

export async function fetchMarketQuote(
  cropId: string,
  currency: SupportedCurrency,
  countryCode = "TR",
): Promise<MarketQuote | null> {
  const crop = cropById(cropId);
  if (!crop) return null;
  const series = await getPriceSeriesByCountry(cropId, countryCode);
  const latestPoint = series?.series?.[series.series.length - 1];
  const fallbackTry = crop.marketBasePriceTry;
  const baseTry = latestPoint?.paraBirimi === "TRY" ? latestPoint.ortalamaFiyat : fallbackTry;
  const unitPrice = convertFromTry(baseTry, currency);
  return {
    cropId,
    currency,
    unitPrice: Math.round(unitPrice * 100) / 100,
    source: series?.source || "Crop catalog base price",
    updatedAt: new Date().toISOString(),
  };
}

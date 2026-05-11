import { getMockCropById } from "../data/mockCrops";
import { LibraryCrop } from "../data/globalCropLibrary";

type CountryAgroProfile = {
  code: string;
  nameTr: string;
  nameEn: string;
  yieldFactor: number;
  priceFactor: number;
  climateNoteTr: string;
  climateNoteEn: string;
};

const defaultProfile: CountryAgroProfile = {
  code: "UN",
  nameTr: "Global",
  nameEn: "Global",
  yieldFactor: 1,
  priceFactor: 1,
  climateNoteTr: "Ulkeye ozel veri sinirli; global ortalama kullanildi.",
  climateNoteEn: "Country-specific data is limited; global average is used.",
};

const profiles: Record<string, CountryAgroProfile> = {
  TR: {
    code: "TR",
    nameTr: "Turkiye",
    nameEn: "Turkiye",
    yieldFactor: 1.04,
    priceFactor: 1.08,
    climateNoteTr: "Akdeniz + karasal gecis: su stresi ve ilkbahar donu takibi kritik.",
    climateNoteEn: "Mediterranean-continental transition: monitor water stress and spring frost.",
  },
  US: {
    code: "US",
    nameTr: "ABD",
    nameEn: "United States",
    yieldFactor: 1.1,
    priceFactor: 1.15,
    climateNoteTr: "Bolgesel fark yuksek; mekanizasyon ve verim potansiyeli guclu.",
    climateNoteEn: "High regional variation; strong mechanization and yield potential.",
  },
  BR: {
    code: "BR",
    nameTr: "Brezilya",
    nameEn: "Brazil",
    yieldFactor: 1.07,
    priceFactor: 0.96,
    climateNoteTr: "Tropikal nemli kusaklarda hastalik ve zararlilar hizli yayilabilir.",
    climateNoteEn: "In humid tropical zones, diseases and pests can spread quickly.",
  },
  IN: {
    code: "IN",
    nameTr: "Hindistan",
    nameEn: "India",
    yieldFactor: 0.98,
    priceFactor: 0.92,
    climateNoteTr: "Muson etkisi uretim takvimini belirler; su yonetimi stratejiktir.",
    climateNoteEn: "Monsoon patterns shape production calendars; water management is strategic.",
  },
  ES: {
    code: "ES",
    nameTr: "Ispanya",
    nameEn: "Spain",
    yieldFactor: 1.03,
    priceFactor: 1.05,
    climateNoteTr: "Akdeniz kosullari meyve, sebze ve zeytin icin avantaj saglar.",
    climateNoteEn: "Mediterranean conditions favor fruit, vegetable, and olive production.",
  },
  FR: {
    code: "FR",
    nameTr: "Fransa",
    nameEn: "France",
    yieldFactor: 1.06,
    priceFactor: 1.12,
    climateNoteTr: "Kalite odakli pazarlar fiyat primini yukseltebilir.",
    climateNoteEn: "Quality-focused markets can increase price premiums.",
  },
};

export type CountryCropInsight = {
  countryLabel: string;
  yieldText: string;
  priceText: string;
  climateLine: string;
  hasDetailedData: boolean;
};

export const getCountryCropInsight = (
  crop: LibraryCrop,
  countryCode: string,
  isTR: boolean,
): CountryCropInsight => {
  const profile = profiles[countryCode?.toUpperCase()] || defaultProfile;
  const detailed = getMockCropById(crop.id);
  const countryLabel = isTR ? profile.nameTr : profile.nameEn;

  if (detailed && detailed.historicalData.length > 0) {
    const last = detailed.historicalData[detailed.historicalData.length - 1];
    const estimatedYieldTon = Math.round(last.rekolteTon * profile.yieldFactor);
    const estimatedPrice = (last.ortalamaFiyat * profile.priceFactor).toFixed(1);
    return {
      countryLabel,
      yieldText: isTR
        ? `${last.yil} tahmini ulke bazli rekolte indeksi: ~${estimatedYieldTon.toLocaleString()} ton`
        : `${last.yil} estimated country-adjusted yield index: ~${estimatedYieldTon.toLocaleString()} tons`,
      priceText: isTR
        ? `${last.yil} ulke bazli ortalama fiyat projeksiyonu: ${estimatedPrice} ${last.paraBirimi}/kg`
        : `${last.yil} country-adjusted average price projection: ${estimatedPrice} ${last.paraBirimi}/kg`,
      climateLine: isTR ? profile.climateNoteTr : profile.climateNoteEn,
      hasDetailedData: true,
    };
  }

  return {
    countryLabel,
    yieldText: isTR
      ? "Detayli rekolte serisi henuz yok; global grup ortalamasi kullaniliyor."
      : "Detailed yield series is not available yet; using global group averages.",
    priceText: isTR
      ? "Fiyat projeksiyonu icin ulke ve urun bazli yeni veri paketi bekleniyor."
      : "Country and crop-specific pricing projections will arrive in the next data pack.",
    climateLine: isTR ? profile.climateNoteTr : profile.climateNoteEn,
    hasDetailedData: false,
  };
};

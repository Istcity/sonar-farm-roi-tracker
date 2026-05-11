export type PriceCurrency = "TRY" | "USD" | "EUR";

export interface CropRequirement {
  ph: string;
  su: "Düşük" | "Orta" | "Yüksek";
  toprakTipi: string[];
  /** Ortalama günlük / haftalık sulama notu — kısa açıklama. */
  sulamaNotu?: string;
  /** Tipik ekim dönemi (ör. "Mart – Nisan"). */
  ekimDonemi?: string;
  /** Tipik hasat dönemi (ör. "Eylül – Ekim"). */
  hasatDonemi?: string;
  /** Sıkça karşılaşılan hastalık / zararlı listesi. */
  hastaliklar?: string[];
  /** Önerilen gübreleme / besleme stratejisi. */
  gubreleme?: string;
  /** Kısa iklim notu (don, sıcaklık, nem hassasiyeti). */
  iklimNotu?: string;
}

export interface HistoricalData {
  yil: number;
  rekolteTon: number;
  ortalamaFiyat: number;
  paraBirimi: PriceCurrency;
}

export interface Crop {
  id: string;
  ad: string;
  adEn: string;
  kategori: string;
  kategoriEn?: string;
  ozet: string;
  ozetEn?: string;
  /** Tipik dekar başına verim (kg). */
  donumBasiVerimKg?: number;
  gereksinimler: CropRequirement;
  /** Locale-aware varyant — İngilizce sürüm. */
  gereksinimlerEn?: Partial<CropRequirement>;
  historicalData: HistoricalData[];
}

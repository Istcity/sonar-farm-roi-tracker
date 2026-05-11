import { HistoricalData } from "../types/crop";

export type PriceSeriesDataset = {
  cropId: string;
  countryCode: string;
  currency: "TRY" | "USD" | "EUR";
  unit: "kg";
  source: string;
  updatedAt: string;
  data: HistoricalData[];
};

// Curated baseline dataset.
// TR: TMO + commodity exchange reference blend (manually curated for MVP).
// Global rows are lightweight fallback curves to avoid empty charts.
export const priceHistoryDatasets: PriceSeriesDataset[] = [
  {
    cropId: "wheat",
    countryCode: "TR",
    currency: "TRY",
    unit: "kg",
    source: "TMO + TOBB Borsa karmasi (manuel referans seti)",
    updatedAt: "2026-05-11",
    data: [
      { yil: 2021, rekolteTon: 730, ortalamaFiyat: 2.75, paraBirimi: "TRY" },
      { yil: 2022, rekolteTon: 705, ortalamaFiyat: 4.55, paraBirimi: "TRY" },
      { yil: 2023, rekolteTon: 748, ortalamaFiyat: 6.85, paraBirimi: "TRY" },
      { yil: 2024, rekolteTon: 770, ortalamaFiyat: 8.9, paraBirimi: "TRY" },
      { yil: 2025, rekolteTon: 784, ortalamaFiyat: 10.7, paraBirimi: "TRY" },
    ],
  },
  {
    cropId: "sunflower",
    countryCode: "TR",
    currency: "TRY",
    unit: "kg",
    source: "TMO + Borsa spot karmasi (manuel referans seti)",
    updatedAt: "2026-05-11",
    data: [
      { yil: 2021, rekolteTon: 401, ortalamaFiyat: 5.9, paraBirimi: "TRY" },
      { yil: 2022, rekolteTon: 389, ortalamaFiyat: 9.8, paraBirimi: "TRY" },
      { yil: 2023, rekolteTon: 412, ortalamaFiyat: 13.6, paraBirimi: "TRY" },
      { yil: 2024, rekolteTon: 425, ortalamaFiyat: 16.4, paraBirimi: "TRY" },
      { yil: 2025, rekolteTon: 438, ortalamaFiyat: 18.3, paraBirimi: "TRY" },
    ],
  },
  {
    cropId: "hazelnut",
    countryCode: "TR",
    currency: "TRY",
    unit: "kg",
    source: "Karadeniz borsalari + ihracat referansi (manuel set)",
    updatedAt: "2026-05-11",
    data: [
      { yil: 2021, rekolteTon: 338, ortalamaFiyat: 27, paraBirimi: "TRY" },
      { yil: 2022, rekolteTon: 322, ortalamaFiyat: 39, paraBirimi: "TRY" },
      { yil: 2023, rekolteTon: 347, ortalamaFiyat: 56, paraBirimi: "TRY" },
      { yil: 2024, rekolteTon: 361, ortalamaFiyat: 73, paraBirimi: "TRY" },
      { yil: 2025, rekolteTon: 374, ortalamaFiyat: 90, paraBirimi: "TRY" },
    ],
  },
];


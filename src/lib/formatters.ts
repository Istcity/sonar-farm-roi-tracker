import { i18n } from "../i18n";
import { SupportedCurrency } from "../types/agro";

const knownCategories = ["gubre", "iscilik", "mazot", "ilaclama", "fidan", "sulama", "custom"];

export function formatCategoryLabel(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (knownCategories.includes(normalized)) {
    return i18n.t(`categories.${normalized}`);
  }
  return normalized
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatCurrency(amount: number, locale?: string): string {
  const active = locale || i18n.locale || "en";
  if (active.startsWith("tr")) {
    return `₺${Math.round(amount).toLocaleString("tr-TR")}`;
  }
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

export function formatCurrencyByCode(amount: number, currency: SupportedCurrency, locale?: string): string {
  const active = locale || i18n.locale || "en";
  return new Intl.NumberFormat(active, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(isoString: string, locale?: string): string {
  const active = locale || i18n.locale || "en";
  const dt = new Date(isoString);
  return new Intl.DateTimeFormat(active, { day: "2-digit", month: "2-digit", year: "numeric" }).format(dt);
}

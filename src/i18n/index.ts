import { I18n } from "i18n-js";

const translations = {
  en: require("./en.json"),
  tr: require("./tr.json"),
  es: require("./es.json"),
  fr: require("./fr.json"),
  de: require("./de.json"),
  pt: require("./pt.json"),
  ko: require("./ko.json"),
  ja: require("./ja.json"),
};

export const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = "en";
// "guess" humanizes a missing key (e.g. crops.eggplant → "Eggplant") instead of
// rendering the noisy `[missing "x.y.z" translation]` debug placeholder.
i18n.missingBehavior = "guess";

export const languageByCountry: Record<string, string> = {
  TR: "tr",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  FR: "fr",
  BE: "fr",
  DE: "de",
  AT: "de",
  CH: "de",
  PT: "pt",
  BR: "pt",
  KR: "ko",
  JP: "ja",
};

export const setI18nLocale = (locale: string) => {
  const normalized = (locale || "en").split("-")[0];
  i18n.locale = normalized;
};

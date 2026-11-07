"use client";
import { Globe2, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
export type Translate = (nb: string, en: string) => string;
export const languages = [
  ["nb", "Norsk bokmål"],
  ["en", "English"],
  ["nn", "Norsk nynorsk"],
  ["sv", "Svenska"],
  ["da", "Dansk"],
  ["fi", "Suomi"],
  ["is", "Íslenska"],
  ["fo", "Føroyskt"],
  ["de", "Deutsch"],
  ["fr", "Français"],
  ["es", "Español"],
  ["it", "Italiano"],
  ["pt", "Português"],
  ["nl", "Nederlands"],
  ["el", "Ελληνικά"],
  ["pl", "Polski"],
  ["uk", "Українська"],
  ["ru", "Русский"],
  ["cs", "Čeština"],
  ["sk", "Slovenčina"],
  ["sl", "Slovenščina"],
  ["hr", "Hrvatski"],
  ["bs", "Bosanski"],
  ["sr", "Српски"],
  ["bg", "Български"],
  ["ro", "Română"],
  ["hu", "Magyar"],
  ["et", "Eesti"],
  ["lv", "Latviešu"],
  ["lt", "Lietuvių"],
  ["sq", "Shqip"],
  ["mk", "Македонски"],
  ["mt", "Malti"],
  ["ga", "Gaeilge"],
  ["cy", "Cymraeg"],
  ["gd", "Gàidhlig"],
  ["eu", "Euskara"],
  ["ca", "Català"],
  ["gl", "Galego"],
  ["be", "Беларуская"],
  ["tr", "Türkçe"],
  ["az", "Azərbaycanca"],
  ["hy", "Հայերեն"],
  ["ka", "ქართული"],
  ["lb", "Lëtzebuergesch"],
  ["rm", "Rumantsch"],
  ["se", "Davvisámegiella"],
  ["en-GB", "English (UK)"],
  ["de-AT", "Deutsch (Österreich)"],
  ["ar", "العربية"],
];
export function LanguageSelector({
  locale,
  onChange,
  t,
}: {
  locale: string;
  onChange: (v: string) => void;
  t: Translate;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  return (
    <div className="language-wrap">
      <button
        className="language-trigger"
        aria-label={t("Velg språk", "Choose language")}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <Globe2 size={17} />
        <span>{locale === "nb" ? "NO" : locale.toUpperCase()}</span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <div
          className="language-menu"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <input
            autoFocus
            aria-label={t("Søk etter språk", "Search languages")}
            placeholder={t("Søk etter språk ...", "Search languages ...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <p>
            {t(
              "Norsk og engelsk er oversatt. Andre språk bruker engelsk.",
              "Norwegian and English available. Other languages fall back to English.",
            )}
          </p>
          <div>
            {languages
              .filter(([, name]) =>
                name.toLowerCase().includes(search.toLowerCase()),
              )
              .map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => {
                    onChange(code);
                    setOpen(false);
                  }}
                >
                  <span>{name}</span>
                  {locale === code ? (
                    <Check size={15} />
                  ) : code !== "nb" && code !== "en" ? (
                    <small>EN fallback</small>
                  ) : null}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

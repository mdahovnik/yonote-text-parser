import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from "./locales/en/en.json";
import ru from "./locales/ru/ru.json";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

i18next
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector)
  .init({
    debug: true,
    fallbackLng: 'ru',
    defaultNS: 'translation',
    interpolation: {escapeValue: false},
    detection: {
      order: ['localStorage'],
      caches: ['localStorage']
    },
    resources: {
      en: {translation: en},
      ru: {translation: ru}
    }
  });

export default i18next;
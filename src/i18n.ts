import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Example translation resources
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      createPost: 'Create Post',
      // ...other keys
    },
  },
  ka: {
    translation: {
      welcome: 'მოგესალმებით',
      createPost: 'პოსტის შექმნა',
      // ...other keys
    },
  },
  ru: {
    translation: {
      welcome: 'Добро пожаловать',
      createPost: 'Создать пост',
      // ...other keys
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    supportedLngs: ['en', 'ka', 'ru'],
  });

export default i18n;

import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    auth: {
      logo: '/adc-logo.png',
    },
    head: {
      favicon: '/adc-logo.png',
    },
    menu: {
      logo: '/adc-logo.png',
    },
    theme: {
      colors: {
        primary700: '#000000',
        primary600: '#000000',
        primary500: '#000000',
        primary400: '#333333',
        primary300: '#555555',
        primary200: '#666666',
        primary100: '#999999',
        buttonPrimary600: '#000000',
        buttonPrimary500: '#000000',
        buttonPrimary400: '#333333',
      },
    },
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
  },
};

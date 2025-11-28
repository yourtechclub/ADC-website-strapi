import type { StrapiApp } from '@strapi/strapi/admin';
import './extensions/global.css';
import logoIcon from './stc-icon.png';
import logoFull from './stc-logo.png';

export default {
  config: {
    auth: {
      logo: logoFull,
    },
    head: {
      favicon: logoIcon,
      title: 'Strich Tech Club CMS',
    },
    menu: {
      logo: logoIcon,
    },
    theme: {
      colors: {
        primary700: '#000000',
        primary600: '#000000',
        primary500: '#000000',
        primary400: '#333333',
        primary300: '#555555',
        primary200: '#b2b2b2ff',
        primary100: '#d7d7d7ff',
        buttonPrimary600: '#000000',
        buttonPrimary500: '#000000',
        buttonPrimary400: '#333333',
      },
    },
    translations: {
      en: {
        'Auth.form.welcome.title': 'Welcome back!',
        'Auth.form.welcome.subtitle': 'Log in to your account',
        'app.components.HomePage.welcome': 'Welcome to Strich Tech Club CMS',
        'app.components.HomePage.welcomeBlock.content': 'Manage your website content here',
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

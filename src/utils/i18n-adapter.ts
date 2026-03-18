// utils/i18n-adapter.ts
// 适配器文件：解决 i18next 和 react-i18next CommonJS 模块导入问题

// 从 i18next 导出
export { default as i18n } from 'i18next';
export * from 'i18next';

// 从 react-i18next 导出
export {
  I18nextProvider,
  useTranslation,
  initReactI18next,
  Trans,
  withTranslation,
  Translation,
} from 'react-i18next';

// 导出类型
export type {
  i18n as I18n,
  Resource,
  TFunction,
  InitOptions,
} from 'i18next';

export type {
  UseTranslationOptions,
  UseTranslationResponse,
  I18nextProviderProps,
  TransProps,
  WithTranslation,
} from 'react-i18next';

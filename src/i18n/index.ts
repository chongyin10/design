import { i18n, initReactI18next } from '../utils/i18n-adapter';
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';
// 配置 i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': {
        translation: zhCN
      },
      'en-US': {
        translation: enUS
      }
    },
    lng: 'zh-CN',
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false
    }
  });

// 导出初始化函数，支持外部资源
export function initializeI18n(resources: Record<string, any>) {
  if (resources) {
    // 遍历资源对象，为每个语言添加资源
    Object.keys(resources).forEach(language => {
      const languageResources = resources[language];
      // 遍历命名空间
      Object.keys(languageResources).forEach(namespace => {
        const namespaceResources = languageResources[namespace];
        // 添加资源包
        i18n.addResourceBundle(language, namespace, namespaceResources, true);
      });
    });
  }
}

export default i18n;

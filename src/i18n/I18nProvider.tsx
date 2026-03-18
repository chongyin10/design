import React from 'react';
import { I18nextProvider, useTranslation } from '../utils/i18n-adapter';
import i18n from './index';

// 导出 load18n 工具函数，用于注册国际化资源
export const load18n = (resources: Record<string, any>): Record<string, any> => {
  const formattedResources: Record<string, any> = {};
  
  // 遍历传入的资源对象
  Object.keys(resources).forEach(key => {
    const resource = resources[key];
    // 假设资源对象的结构为 { translation: { key: value } } 或直接 { key: value }
    if (resource && typeof resource === 'object') {
      let languageCode: string | undefined;
      let resourceContent = resource;
      
      // 1. 检查资源对象是否有明确的语言信息
      if (resource.language) {
        languageCode = resource.language;
        // 如果资源对象有language属性，那么实际内容可能在translation属性中
        if (resource.translation && typeof resource.translation === 'object') {
          resourceContent = resource.translation;
        }
      } else if (resource.locale) {
        languageCode = resource.locale;
        // 如果资源对象有locale属性，那么实际内容可能在translation属性中
        if (resource.translation && typeof resource.translation === 'object') {
          resourceContent = resource.translation;
        }
      }
      
      // 2. 检查资源对象是否有类似 { "en-US": { ... } } 的结构
      else if (Object.keys(resource).length === 1) {
        const firstKey = Object.keys(resource)[0];
        // 检查是否为有效的语言代码格式
        if (/^[a-z]{2}(-[A-Za-z]{2})?$/.test(firstKey)) {
          languageCode = firstKey;
          resourceContent = resource[firstKey];
        }
      }
      
      // 3. 检查资源对象的translation属性是否直接包含语言代码
      // 例如：{ translation: { "en-US": { ... } } }
      else if (resource.translation && typeof resource.translation === 'object' && Object.keys(resource.translation).length === 1) {
        const firstKey = Object.keys(resource.translation)[0];
        if (/^[a-z]{2}(-[A-Za-z]{2})?$/.test(firstKey)) {
          languageCode = firstKey;
          resourceContent = resource.translation[firstKey];
        }
      }
      
      // 4. 如果以上方法都无法获取语言代码，使用键名作为语言代码
      if (!languageCode) {
        // 支持常见的语言简写键名（仅作为辅助，优先使用明确的语言代码）
        const commonLanguageShortcuts: Record<string, string> = {
          'JP': 'ja-JP',
          'HK': 'zh-HK',
          'US': 'en-US',
          'CN': 'zh-CN',
          'EN': 'en-US',
          'ZH': 'zh-CN'
        };
        
        // 如果键名是常见的语言简写，则使用对应的语言代码
        // 否则，直接使用用户提供的键名
        languageCode = commonLanguageShortcuts[key] || key;
        
        // 如果直接使用键名，建议用户使用更明确的语言代码格式
        if (languageCode === key && !/^[a-z]{2}(-[A-Za-z]{2})?$/.test(key)) {
          console.warn(
            `Using key "${key}" as language code. For better results, ` +
            `please use explicit language codes like "ja-JP" or "zh-HK", or ` +
            `include language information in your JSON files.`
          );
        }
      }
      
      // 确保语言代码有效
      if (!languageCode || typeof languageCode !== 'string') {
        console.warn(`Invalid language code for resource ${key}`);
        return;
      }
      
      // 初始化语言资源
      if (!formattedResources[languageCode]) {
        formattedResources[languageCode] = {};
      }
      
      // 格式化资源内容
      if (resourceContent.translation && typeof resourceContent.translation === 'object') {
        // 如果内容中已经有translation命名空间，直接使用
        formattedResources[languageCode].translation = {
          ...formattedResources[languageCode].translation,
          ...resourceContent.translation
        };
      } else {
        // 否则，将内容作为translation命名空间
        formattedResources[languageCode].translation = {
          ...formattedResources[languageCode].translation,
          ...resourceContent
        };
      }
    }
  });
  
  return formattedResources;
};

// 保留原来的 useTranslation hook 功能，方便组件内使用翻译
export const useI18n = () => useTranslation();

// I18nProvider 组件
interface I18nProviderProps {
  children: React.ReactNode;
  locale?: string;
  resources?: Record<string, any>;
}

const I18nProvider: React.FC<I18nProviderProps> = ({ children, locale, resources }) => {
  // 如果提供了 resources 参数，则更新资源
  React.useEffect(() => {
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
  }, [resources]);

  // 如果提供了 locale 参数，则切换语言
  React.useEffect(() => {
    if (locale && locale !== i18n.language) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};

export default I18nProvider;

import React from 'react';
export declare const load18n: (resources: Record<string, any>) => Record<string, any>;
export declare const useI18n: () => import("react-i18next").UseTranslationResponse<"translation", undefined>;
interface I18nProviderProps {
    children: React.ReactNode;
    locale?: string;
    resources?: Record<string, any>;
}
declare const I18nProvider: React.FC<I18nProviderProps>;
export default I18nProvider;

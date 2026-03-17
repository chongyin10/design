/**
 * StyledProvider - 提供隔离的 styled-components 环境
 * 
 * 使用方法：
 * 在宿主项目的根组件中包裹 StyledProvider：
 * 
 * ```tsx
 * import { StyledProvider, Button, Select } from '@zjpcy/simple-design';
 * 
 * function App() {
 *   return (
 *     <StyledProvider>
 *       <YourApp />
 *     </StyledProvider>
 *   );
 * }
 * ```
 */

import * as React from 'react';
import { StyleSheetManager } from 'styled-components';

/**
 * StyledProvider 属性
 */
export interface StyledProviderProps {
    children: React.ReactNode;
    /**
     * 是否启用浏览器前缀
     * 默认开启
     */
    enableVendorPrefixes?: boolean;
}

/**
 * 判断属性是否应该转发到 DOM
 * 过滤掉 styled-components 常用的内部属性
 */
const shouldForwardProperty = (propName: string): boolean => {
    const styledInternalProps = new Set([
        'theme',
        'as',
        'forwardedAs',
        'innerRef',
        'styleProps',
        '$styles',
        '$size',
        '$open',
        '$disabled',
        '$loading',
        '$active',
        '$focused',
        '$error',
        '$variant',
        '$direction',
        '$align',
        '$justify',
        '$wrap',
        '$span',
        '$offset',
        '$push',
        '$pull',
        '$order',
        '$gap',
        '$width',
        '$height',
        '$padding',
        '$backgroundColor',
        '$rowGap',
        '$isSelected',
        '$isInSelectedSet',
        '$isToday',
        '$isCurrentMonth',
        '$isInRange',
        '$isRangeStart',
        '$isRangeEnd',
        '$isPlaceholder',
        '$isCurrentYear',
        '$isCurrentQuarter',
    ]);

    if (styledInternalProps.has(propName)) {
        return false;
    }

    if (propName.startsWith('$')) {
        return false;
    }

    return true;
};

/**
 * StyledProvider - 提供隔离的 styled-components 环境
 * 通过 StyleSheetManager 防止属性泄露到 DOM
 */
export const StyledProvider: React.FC<StyledProviderProps> = (props) => {
    const { children, enableVendorPrefixes = true } = props;

    return React.createElement(
        StyleSheetManager,
        {
            enableVendorPrefixes,
            shouldForwardProp: (propName: string) => shouldForwardProperty(propName),
        },
        children
    );
};

export default StyledProvider;

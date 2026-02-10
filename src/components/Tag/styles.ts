import { CSSProperties } from 'react';
import { TagSize } from './types';

/**
 * 获取标签尺寸对应的样式
 */
export const getTagSizeStyle = (size: TagSize): CSSProperties => {
    const sizeMap: Record<TagSize, CSSProperties> = {
        small: {
            height: 20,
            padding: '0 6px',
            fontSize: 12
        },
        medium: {
            height: 24,
            padding: '0 8px',
            fontSize: 13
        },
        large: {
            height: 28,
            padding: '0 12px',
            fontSize: 14
        }
    };

    return sizeMap[size];
};

/**
 * 获取标签颜色样式
 */
export const getTagColorStyle = (
    backgroundColor?: string,
    color?: string
): CSSProperties => {
    const style: CSSProperties = {};

    if (backgroundColor) {
        style.backgroundColor = backgroundColor;
    }

    if (color) {
        style.color = color;
    }

    return style;
};

/**
 * 预设标签颜色
 */
export const presetTagColors = {
    red: { backgroundColor: '#fff2f0', color: '#ff4d4f' },
    orange: { backgroundColor: '#fff7e6', color: '#fa8c16' },
    gold: { backgroundColor: '#fffbe6', color: '#faad14' },
    green: { backgroundColor: '#f6ffed', color: '#52c41a' },
    cyan: { backgroundColor: '#e6fffb', color: '#13c2c2' },
    blue: { backgroundColor: '#e6f7ff', color: '#1890ff' },
    purple: { backgroundColor: '#f9f0ff', color: '#722ed1' },
    pink: { backgroundColor: '#fff0f6', color: '#eb2f96' },
    gray: { backgroundColor: '#f5f5f5', color: '#666' }
} as const;

export type PresetTagColor = keyof typeof presetTagColors;

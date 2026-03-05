import styled from 'styled-components';
import { SelectStyles } from './types';

// 从 CSS 变量中读取值的辅助函数
const getCSSVar = (property: string, fallback: string) => `var(${property}, ${fallback})`;

// 外层容器
export const Wrapper = styled.div<{ $styles?: SelectStyles['wrapper'] }>`
    display: inline-block;
    position: relative;
    width: 100%;

    &.select-wrapper {
        /* 外部可通过 .select-wrapper 选择器覆盖样式 */
    }

    ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// 标签容器
export const LabelWrapper = styled.div`
    display: flex;
    align-items: center;
`;

// 标签样式
export const Label = styled.div`
    font-size: 14px;
    color: ${getCSSVar('--zjpcy-text-color', 'rgba(0, 0, 0, 0.85)')};
    white-space: nowrap;
    flex-shrink: 0;
    font-weight: 500;
    letter-spacing: 0.2px;
`;

// 选择器容器
export const Selector = styled.div<{
    $disabled: boolean;
    $loading: boolean;
    $size: 'small' | 'default' | 'large';
    $open: boolean;
    $styles?: SelectStyles['selector'];
}>`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    border: 1px solid ${({ $open }) => $open ? getCSSVar('--zjpcy-primary-color', '#1890ff') : getCSSVar('--zjpcy-input-border', '#d9d9d9')};
    border-radius: ${getCSSVar('--zjpcy-border-radius-lg', '8px')};
    background: linear-gradient(135deg, ${getCSSVar('--zjpcy-bg-color-white', '#fff')} 0%, ${getCSSVar('--zjpcy-bg-color', '#fafafa')} 100%);
    transition: all ${getCSSVar('--zjpcy-transition-duration', '0.2s')} ${getCSSVar('--zjpcy-transition-timing-function', 'ease-in-out')};
    outline: none;
    box-sizing: border-box;
    box-shadow: ${({ $open }) => $open ? getCSSVar('--zjpcy-input-box-shadow-focus', '0 0 0 2px rgba(51, 154, 240, 0.2)') : getCSSVar('--zjpcy-shadow-extra-light', '0 2px 8px rgba(0, 0, 0, 0.08)')};  
    overflow: hidden;
    cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({ $disabled }) => ($disabled ? getCSSVar('--zjpcy-opacity-disabled', '0.65') : 1)};

    &:hover {
        border-color: ${({ $disabled }) => $disabled ? getCSSVar('--zjpcy-input-border', '#d9d9d9') : getCSSVar('--zjpcy-primary-color', '#1890ff')};
        box-shadow: ${({ $disabled }) => $disabled ? 'none' : getCSSVar('--zjpcy-input-box-shadow-hover', '0 0 0 2px rgba(51, 154, 240, 0.2)')};
    }

    &.select-selector {
        /* 外部可通过 .select-selector 选择器覆盖样式 */
    }

    /* 尺寸样式 */
    ${({ $size }) => {
        switch ($size) {
            case 'small':
                return `
                    min-height: 24px;
                    padding: 2px 8px;
                    font-size: 13px;
                `;
            case 'large':
                return `
                    min-height: 40px;
                    padding: 8px 16px;
                    font-size: 15px;
                `;
            default:
                return `
                    min-height: 32px;
                    padding: 6px 12px;
                    font-size: 14px;
                `;
        }
    }}

    ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// 选择器内容区域
export const SelectorContent = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    overflow: hidden;
`;

// 占位符
export const Placeholder = styled.span`
    color: ${getCSSVar('--zjpcy-text-color-light', '#bfbfbf')};
    user-select: none;
`;

// 单选显示文本
export const SingleValue = styled.span`
    color: ${getCSSVar('--zjpcy-text-color', 'rgba(0, 0, 0, 0.85)')};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

// 多选标签容器
export const TagsContainer = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
`;

// 多选标签
export const Tag = styled.span<{
    $disabled: boolean;
    $styles?: SelectStyles['tag'];
}>`
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    background: ${getCSSVar('--zjpcy-primary-light-color', 'rgba(24, 100, 240, 0.1)')};
    border: 1px solid ${getCSSVar('--zjpcy-primary-color', '#1890ff')};
    border-radius: ${getCSSVar('--zjpcy-border-radius-sm', '4px')};
    color: ${getCSSVar('--zjpcy-primary-color', '#1890ff')};
    font-size: 13px;
    line-height: 1.4;
    transition: all ${getCSSVar('--zjpcy-transition-duration', '0.2s')} ease;

    &:hover {
        background: ${getCSSVar('--zjpcy-primary-color', '#1890ff')};
        color: ${getCSSVar('--zjpcy-bg-color-white', '#fff')};
    }

    ${({ $disabled }) => $disabled && `
        cursor: not-allowed;
        opacity: 0.6;
    `}

    ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// 标签关闭按钮
export const TagClose = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(0, 0, 0, 0.1);
    }

    svg {
        width: 10px;
        height: 10px;
    }
`;

// 搜索输入框
export const SearchInput = styled.input`
    flex: 1;
    min-width: 60px;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    font-size: inherit;
    color: ${getCSSVar('--zjpcy-text-color', 'rgba(0, 0, 0, 0.85)')};

    &::placeholder {
        color: ${getCSSVar('--zjpcy-text-color-light', '#bfbfbf')};
    }
`;

// 后缀区域
export const SuffixArea = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 8px;
    flex-shrink: 0;
`;

// 清除按钮
export const ClearButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.06);
    color: ${getCSSVar('--zjpcy-text-color-tertiary', 'rgba(0, 0, 0, 0.45)')};
    cursor: pointer;
    transition: all ${getCSSVar('--zjpcy-transition-duration', '0.2s')} ease;

    &:hover {
        background: rgba(0, 0, 0, 0.12);
        color: ${getCSSVar('--zjpcy-text-color-secondary', 'rgba(0, 0, 0, 0.65)')};
    }

    svg {
        width: 10px;
        height: 10px;
    }
`;

// 下拉箭头
export const Arrow = styled.div<{ $open: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${getCSSVar('--zjpcy-text-color-tertiary', 'rgba(0, 0, 0, 0.45)')};
    transition: transform ${getCSSVar('--zjpcy-transition-duration', '0.2s')} ease;
    transform: ${({ $open }) => $open ? 'rotate(180deg)' : 'rotate(0deg)'};

    svg {
        width: 12px;
        height: 12px;
    }
`;

// 加载图标
export const LoadingIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${getCSSVar('--zjpcy-primary-color', '#1890ff')};
    animation: select-spin 1s linear infinite;

    svg {
        width: 14px;
        height: 14px;
    }

    @keyframes select-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;

// 下拉菜单容器
export const Dropdown = styled.div<{
    $open: boolean;
    $styles?: SelectStyles['dropdown'];
}>`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    z-index: ${getCSSVar('--zjpcy-z-index-modal', '1000')};
    background: ${getCSSVar('--zjpcy-bg-color-white', '#fff')};
    border: 1px solid ${getCSSVar('--zjpcy-border-color-light', '#f0f0f0')};
    border-radius: ${getCSSVar('--zjpcy-border-radius-md', '6px')};
    box-shadow: ${getCSSVar('--zjpcy-shadow-lg', '0 8px 24px rgba(0, 0, 0, 0.15)')};
    opacity: ${({ $open }) => $open ? 1 : 0};
    visibility: ${({ $open }) => $open ? 'visible' : 'hidden'};
    transform: ${({ $open }) => $open ? 'translateY(0)' : 'translateY(-8px)'};
    transition: all ${getCSSVar('--zjpcy-transition-duration', '0.2s')} ${getCSSVar('--zjpcy-transition-timing-function', 'ease-in-out')};
    overflow: hidden;

    &.select-dropdown {
        /* 外部可通过 .select-dropdown 选择器覆盖样式 */
    }

    ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// 选项列表容器
export const OptionList = styled.div<{ $maxHeight?: number }>`
    max-height: ${({ $maxHeight }) => $maxHeight ? `${$maxHeight}px` : '256px'};
    overflow-y: auto;
    padding: 4px 0;

    /* 滚动条样式 */
    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: ${getCSSVar('--zjpcy-border-color', '#e8e8e8')};
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: ${getCSSVar('--zjpcy-text-color-light', '#bfbfbf')};
    }
`;

// 选项项
export const Option = styled.div<{
    $selected: boolean;
    $active: boolean;
    $disabled: boolean;
    $styles?: SelectStyles['option'];
}>`
    display: flex;
    align-items: center;
    padding: 10px 12px;
    cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
    transition: all ${getCSSVar('--zjpcy-transition-duration', '0.2s')} ease;
    background: ${({ $selected }) => $selected ? getCSSVar('--zjpcy-primary-light-color', 'rgba(24, 100, 240, 0.1)') : 'transparent'};
    color: ${({ $disabled, $selected }) => {
        if ($disabled) return getCSSVar('--zjpcy-text-color-light', '#bfbfbf');
        if ($selected) return getCSSVar('--zjpcy-primary-color', '#1890ff');
        return getCSSVar('--zjpcy-text-color', 'rgba(0, 0, 0, 0.85)');
    }};
    opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};

    &:hover {
        background: ${({ $disabled, $selected }) => {
            if ($disabled) return 'transparent';
            if ($selected) return getCSSVar('--zjpcy-primary-light-color', 'rgba(24, 100, 240, 0.1)');
            return getCSSVar('--zjpcy-bg-color', '#fafafa');
        }};
    }

    &.select-option {
        /* 外部可通过 .select-option 选择器覆盖样式 */
    }

    &.select-option-selected {
        font-weight: 500;
    }

    &.select-option-active {
        background: ${getCSSVar('--zjpcy-bg-color', '#fafafa')};
    }

    ${({ $styles }) => $styles && Object.entries($styles).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

// 选项勾选图标
export const CheckIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    color: ${getCSSVar('--zjpcy-primary-color', '#1890ff')};

    svg {
        width: 14px;
        height: 14px;
    }
`;

// 空状态
export const Empty = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    color: ${getCSSVar('--zjpcy-text-color-tertiary', 'rgba(0, 0, 0, 0.45)')};
    font-size: 14px;
`;

// 注入全局样式
export const injectGlobalStyles = () => {
    if (typeof document === 'undefined') return;

    const styleId = 'select-global-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        @keyframes select-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
};

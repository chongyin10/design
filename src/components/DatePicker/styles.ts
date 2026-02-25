import styled from 'styled-components';

/** 日期选择器容器 */
export const DatePickerContainer = styled.div.withConfig({
    shouldForwardProp: (prop) => !['width', 'minWidth'].includes(prop)
})<{ width?: string | number; minWidth?: string | number }>`
    display: inline-block;
    position: relative;
    font-size: 14px;
    font-family: inherit;
    width: ${props => typeof props.width === 'number' ? `${props.width}px` : props.width || 'auto'};
    min-width: ${props => props.minWidth ? (typeof props.minWidth === 'number' ? `${props.minWidth}px` : props.minWidth) : '0px'};
`;

/** 触发器容器 */
export const DatePickerTrigger = styled.div.withConfig({
    shouldForwardProp: (prop) => !['focused'].includes(prop)
})<{ focused?: boolean; disabled?: boolean; size?: string }>`
    display: flex;
    align-items: center;
    width: 100%;
    min-height: ${props => {
        switch (props.size) {
            case 'small': return '24px';
            case 'large': return '40px';
            default: return '32px';
        }
    }};
    height: auto;
    padding: ${props => {
        switch (props.size) {
            case 'small': return '1px 12px';
            case 'large': return '3px 12px';
            default: return '2px 12px';
        }
    }};
    border: 1px solid ${props => props.disabled ? 'var(--idp-border-color-extra-light)' : props.focused ? 'var(--idp-primary-color)' : 'var(--idp-border-color-extra-light)'};
    border-radius: var(--idp-border-radius-sm);
    background-color: ${props => props.disabled ? 'var(--idp-bg-color-light)' : 'var(--idp-bg-color-white)'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);
    box-sizing: border-box;

    &:hover {
        border-color: ${props => props.disabled ? 'var(--idp-border-color-extra-light)' : 'var(--idp-primary-color)'};
    }

    &:focus-within {
        border-color: var(--idp-primary-color);
        box-shadow: var(--idp-input-box-shadow-focus);
    }
`;

/** 日期显示值 */
export const DatePickerValue = styled.span.withConfig({
    shouldForwardProp: (prop) => !['isPlaceholder'].includes(prop)
})<{ isPlaceholder?: boolean; disabled?: boolean }>`
    flex: 1;
    color: ${props => props.disabled ? 'var(--idp-text-color-tertiary)' : props.isPlaceholder ? 'var(--idp-text-color-light)' : 'var(--idp-text-color)'};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;

    /* 多选模式下的 tags 布局 */
    &.idp-datepicker-value--tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        align-items: center;
        overflow: visible;
        white-space: normal;
        padding: 2px 0;
    }
`;

/** 后缀图标区域 */
export const DatePickerSuffix = styled.span`
    display: flex;
    align-items: center;
    margin-left: 8px;
    color: var(--idp-text-color-light);
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);
    position: relative;
    width: 16px;
    height: 16px;
`;

/** 清除按钮 */
export const DatePickerClear = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: var(--idp-text-color-tertiary);
    cursor: pointer;
    border-radius: 50%;
    background-color: transparent;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);
    opacity: 0;
    visibility: hidden;
    z-index: 2;

    &:hover {
        color: var(--idp-text-color);
        background-color: var(--idp-bg-color-light);
    }

    & > * {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

/** 日历图标 */
export const DatePickerIcon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);
    opacity: 1;
    visibility: visible;
    z-index: 1;
    width: 16px;
    height: 16px;
`;

/** 下拉面板 */
export const DatePickerDropdown = styled.div.withConfig({
    shouldForwardProp: (prop) => !['top', 'left', 'minWidth'].includes(prop)
})<{ top: number; left: number; minWidth?: number }>`
    position: fixed;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    z-index: 999;
    background-color: var(--idp-bg-color-white);
    border-radius: var(--idp-border-radius-md);
    box-shadow: var(--idp-shadow-lg);
    overflow: hidden;
    min-width: ${props => props.minWidth ? `${props.minWidth}px` : '280px'};
`;

/** 日历面板 */
export const CalendarPanel = styled.div`
    background-color: var(--idp-bg-color-white);
    border-radius: var(--idp-border-radius-md);
`;

/** 日历头部 */
export const CalendarHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--idp-border-color-light);
`;

/** 头部左侧区域 */
export const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

/** 头部中间区域 */
export const HeaderCenter = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 500;
    color: var(--idp-text-color);
`;

/** 头部右侧区域 */
export const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

/** 头部按钮 */
export const HeaderButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    border-radius: var(--idp-border-radius-sm);
    color: var(--idp-text-color-secondary);
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);

    &:hover:not(:disabled) {
        background-color: var(--idp-bg-color-light);
        color: var(--idp-primary-color);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

/** 年份/月份选择器 */
export const HeaderSelect = styled.select`
    border: none;
    background-color: transparent;
    font-size: 14px;
    font-weight: 500;
    color: var(--idp-text-color);
    cursor: pointer;
    padding: 2px 4px;
    border-radius: var(--idp-border-radius-sm);

    &:hover {
        background-color: var(--idp-bg-color-light);
    }

    &:focus {
        outline: none;
        background-color: var(--idp-bg-color-light);
    }
`;

/** 日历内容区域 */
export const CalendarBody = styled.div`
    padding: 12px 16px;
`;

/** 星期标题行 */
export const WeekHeader = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0;
    margin-bottom: 8px;
`;

/** 星期标题 */
export const WeekDay = styled.div`
    text-align: center;
    font-size: 12px;
    color: var(--idp-text-color-tertiary);
    padding: 8px 0;
    font-weight: 500;
`;

/** 日期网格 */
export const DateGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
`;

/** 日期单元格 */
export const DateCell = styled.div.withConfig({
    shouldForwardProp: (prop) => !['isSelected', 'isInSelectedSet', 'isToday', 'isCurrentMonth'].includes(prop)
})<{
    isSelected?: boolean;
    isInSelectedSet?: boolean;
    isToday?: boolean;
    disabled?: boolean;
    isCurrentMonth?: boolean;
}>`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    font-size: 13px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    border-radius: var(--idp-border-radius-sm);
    color: ${props => {
        if (props.disabled) return 'var(--idp-text-color-light)';
        if (props.isSelected) return '#fff';
        if (props.isInSelectedSet) return 'var(--idp-primary-color)';
        if (props.isToday) return 'var(--idp-primary-color)';
        if (!props.isCurrentMonth) return 'var(--idp-text-color-light)';
        return 'var(--idp-text-color)';
    }};
    background-color: ${props => {
        if (props.isSelected) return 'var(--idp-primary-color)';
        if (props.isInSelectedSet) return 'var(--idp-primary-light-color, rgba(24, 100, 240, 0.1))';
        return 'transparent';
    }};
    font-weight: ${props => (props.isToday || props.isSelected || props.isInSelectedSet) ? '500' : 'normal'};
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);

    &:hover:not([disabled]) {
        background-color: ${props => {
            if (props.isSelected) return 'var(--idp-primary-hover-color)';
            if (props.isInSelectedSet) return 'var(--idp-primary-light-hover-color, rgba(24, 100, 240, 0.2))';
            return 'var(--idp-bg-color-light)';
        }};
    }

    ${props => props.isToday && !props.isSelected && `
        border: 1px solid var(--idp-primary-color);
    `}
`;

/** 日历底部 */
export const CalendarFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    border-top: 1px solid var(--idp-border-color-light);
    gap: 8px;
`;

/** 日历底部占位元素（用于保持确定按钮位置统一） */
export const CalendarFooterSpacer = styled.div`
    flex: 1;
`;

/** 日历底部按钮组 */
export const CalendarFooterActions = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

/** 底部按钮 */
export const FooterButton = styled.button.withConfig({
    shouldForwardProp: (prop) => !['variant'].includes(prop)
})<{ variant?: 'primary' | 'default' }>`
    padding: 4px 12px;
    font-size: 13px;
    border-radius: var(--idp-border-radius-sm);
    cursor: pointer;
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);
    border: 1px solid ${props => props.variant === 'primary' ? 'var(--idp-primary-color)' : 'var(--idp-border-color-extra-light)'};
    background-color: ${props => props.variant === 'primary' ? 'var(--idp-primary-color)' : 'var(--idp-bg-color-white)'};
    color: ${props => props.variant === 'primary' ? '#fff' : 'var(--idp-text-color)'};

    &:hover:not(:disabled) {
        border-color: var(--idp-primary-color);
        ${props => props.variant === 'primary'
            ? 'background-color: var(--idp-primary-hover-color);'
            : 'color: var(--idp-primary-color);'
        }
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

/** 标签容器 */
export const LabelContainer = styled.div.withConfig({
    shouldForwardProp: (prop) => !['gap'].includes(prop)
})<{ gap?: string | number }>`
    display: flex;
    align-items: center;
    gap: ${props => typeof props.gap === 'number' ? `${props.gap}px` : props.gap || '8px'};
`;

/** 标签文本 */
export const Label = styled.label`
    font-size: 14px;
    color: var(--idp-text-color);
    white-space: nowrap;
    user-select: none;
`;

/** 年份选择器面板 */
export const YearPickerPanel = styled.div`
    background-color: var(--idp-bg-color-white);
    border-radius: var(--idp-border-radius-md);
    min-width: 280px;
`;

/** 年份网格 */
export const YearGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 16px;
`;

/** 月份选择器面板 */
export const MonthPickerPanel = styled.div`
    background-color: var(--idp-bg-color-white);
    border-radius: var(--idp-border-radius-md);
    min-width: 280px;
`;

/** 月份网格 */
export const MonthGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 16px;
`;

/** 月份单元格 */
export const MonthCell = styled.div.withConfig({
    shouldForwardProp: (prop) => !['isSelected', 'isInSelectedSet', 'isCurrentMonth'].includes(prop)
})<{ isSelected?: boolean; isInSelectedSet?: boolean; isCurrentMonth?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    font-size: 14px;
    cursor: pointer;
    border-radius: var(--idp-border-radius-sm);
    color: ${props => {
        if (props.isSelected) return '#fff';
        if (props.isInSelectedSet) return 'var(--idp-primary-color)';
        if (props.isCurrentMonth) return 'var(--idp-primary-color)';
        return 'var(--idp-text-color)';
    }};
    background-color: ${props => {
        if (props.isSelected) return 'var(--idp-primary-color)';
        if (props.isInSelectedSet) return 'var(--idp-primary-light-color, rgba(24, 100, 240, 0.1))';
        return 'transparent';
    }};
    font-weight: ${props => (props.isCurrentMonth || props.isSelected || props.isInSelectedSet) ? '500' : 'normal'};
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);

    &:hover:not([disabled]) {
        background-color: ${props => {
            if (props.isSelected) return 'var(--idp-primary-hover-color)';
            if (props.isInSelectedSet) return 'var(--idp-primary-light-hover-color, rgba(24, 100, 240, 0.2))';
            return 'var(--idp-bg-color-light)';
        }};
    }

    ${props => props.isCurrentMonth && !props.isSelected && !props.isInSelectedSet && `
        border: 1px solid var(--idp-primary-color);
    `}
`;

/** 年份单元格 */
export const YearCell = styled.div.withConfig({
    shouldForwardProp: (prop) => !['isSelected', 'isInSelectedSet', 'isCurrentYear'].includes(prop)
})<{ isSelected?: boolean; isInSelectedSet?: boolean; isCurrentYear?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    font-size: 14px;
    cursor: pointer;
    border-radius: var(--idp-border-radius-sm);
    color: ${props => {
        if (props.isSelected) return '#fff';
        if (props.isInSelectedSet) return 'var(--idp-primary-color)';
        if (props.isCurrentYear) return 'var(--idp-primary-color)';
        return 'var(--idp-text-color)';
    }};
    background-color: ${props => {
        if (props.isSelected) return 'var(--idp-primary-color)';
        if (props.isInSelectedSet) return 'var(--idp-primary-light-color, rgba(24, 100, 240, 0.1))';
        return 'transparent';
    }};
    font-weight: ${props => (props.isCurrentYear || props.isSelected || props.isInSelectedSet) ? '500' : 'normal'};
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);

    &:hover:not([disabled]) {
        background-color: ${props => {
            if (props.isSelected) return 'var(--idp-primary-hover-color)';
            if (props.isInSelectedSet) return 'var(--idp-primary-light-hover-color, rgba(24, 100, 240, 0.2))';
            return 'var(--idp-bg-color-light)';
        }};
    }

    ${props => props.isCurrentYear && !props.isSelected && !props.isInSelectedSet && `
        border: 1px solid var(--idp-primary-color);
    `}
`;

/** 季度选择器面板 */
export const QuarterPickerPanel = styled.div`
    background-color: var(--idp-bg-color-white);
    border-radius: var(--idp-border-radius-md);
    min-width: 280px;
`;

/** 季度网格 */
export const QuarterGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding: 16px;
`;

/** 季度单元格 */
export const QuarterCell = styled.div.withConfig({
    shouldForwardProp: (prop) => !['isSelected', 'isInSelectedSet', 'isCurrentQuarter'].includes(prop)
})<{ isSelected?: boolean; isInSelectedSet?: boolean; isCurrentQuarter?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    font-size: 14px;
    cursor: pointer;
    border-radius: var(--idp-border-radius-sm);
    color: ${props => {
        if (props.isSelected) return '#fff';
        if (props.isInSelectedSet) return 'var(--idp-primary-color)';
        if (props.isCurrentQuarter) return 'var(--idp-primary-color)';
        return 'var(--idp-text-color)';
    }};
    background-color: ${props => {
        if (props.isSelected) return 'var(--idp-primary-color)';
        if (props.isInSelectedSet) return 'var(--idp-primary-light-color, rgba(24, 100, 240, 0.1))';
        return 'transparent';
    }};
    font-weight: ${props => (props.isCurrentQuarter || props.isSelected || props.isInSelectedSet) ? '500' : 'normal'};
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);

    &:hover:not([disabled]) {
        background-color: ${props => {
            if (props.isSelected) return 'var(--idp-primary-hover-color)';
            if (props.isInSelectedSet) return 'var(--idp-primary-light-hover-color, rgba(24, 100, 240, 0.2))';
            return 'var(--idp-bg-color-light)';
        }};
    }

    ${props => props.isCurrentQuarter && !props.isSelected && !props.isInSelectedSet && `
        border: 1px solid var(--idp-primary-color);
    `}
`;

/** ==================== 日期范围选择器样式 ==================== */

/** 范围选择器容器 */
export const DateRangePickerContainer = styled.div<{ width?: string | number }>`
    display: inline-block;
    position: relative;
    font-size: 14px;
    font-family: inherit;
    width: ${props => typeof props.width === 'number' ? `${props.width}px` : props.width || 'auto'};
`;

/** 范围选择器触发器 */
export const DateRangePickerTrigger = styled.div.withConfig({
    shouldForwardProp: (prop) => !['focused', 'size', 'disabled'].includes(prop)
})<{ focused?: boolean; disabled?: boolean; size?: string }>`
    display: flex;
    align-items: center;
    width: 100%;
    min-height: ${props => {
        switch (props.size) {
            case 'small': return '24px';
            case 'large': return '40px';
            default: return '32px';
        }
    }};
    height: auto;
    padding: ${props => {
        switch (props.size) {
            case 'small': return '1px 12px';
            case 'large': return '3px 12px';
            default: return '2px 12px';
        }
    }};
    border: 1px solid ${props => props.disabled ? 'var(--idp-border-color-extra-light)' : props.focused ? 'var(--idp-primary-color)' : 'var(--idp-border-color-extra-light)'};
    border-radius: var(--idp-border-radius-sm);
    background-color: ${props => props.disabled ? 'var(--idp-bg-color-light)' : 'var(--idp-bg-color-white)'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);
    box-sizing: border-box;

    &:hover {
        border-color: ${props => props.disabled ? 'var(--idp-border-color-extra-light)' : 'var(--idp-primary-color)'};
    }

    &:focus-within {
        border-color: var(--idp-primary-color);
        box-shadow: var(--idp-input-box-shadow-focus);
    }
`;

/** 范围选择器输入框 */
export const DateRangePickerInput = styled.div.withConfig({
    shouldForwardProp: (prop) => !['active'].includes(prop)
})<{ active?: boolean }>`
    flex: 1;
    padding: 4px 8px;
    text-align: center;
    cursor: pointer;
    border-radius: var(--idp-border-radius-sm);
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);

    ${props => props.active && `
        background-color: var(--idp-primary-light-color, rgba(24, 100, 240, 0.1));
    `}

    &:hover {
        background-color: var(--idp-bg-color-light);
    }
`;

/** 范围选择器值显示 */
export const DateRangePickerValue = styled.span.withConfig({
    shouldForwardProp: (prop) => !['isPlaceholder'].includes(prop)
})<{ isPlaceholder?: boolean }>`
    color: ${props => props.isPlaceholder ? 'var(--idp-text-color-light)' : 'var(--idp-text-color)'};
    font-size: 14px;
`;

/** 范围选择器分隔符 */
export const DateRangePickerSeparator = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    color: var(--idp-text-color-light);
    font-size: 14px;
`;

/** 范围选择器后缀区域 */
export const DateRangePickerSuffix = styled.span`
    display: flex;
    align-items: center;
    margin-left: 8px;
    color: var(--idp-text-color-light);
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);
    position: relative;
    width: 16px;
    height: 16px;
`;

/** 范围选择器清除按钮 */
export const DateRangePickerClear = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: var(--idp-text-color-tertiary);
    cursor: pointer;
    border-radius: 50%;
    background-color: transparent;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);
    opacity: 0;
    visibility: hidden;
    z-index: 2;

    &:hover {
        color: var(--idp-text-color);
        background-color: var(--idp-bg-color-light);
    }

    & > * {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

/** 范围选择器图标 */
export const DateRangePickerIcon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);
    opacity: 1;
    visibility: visible;
    z-index: 1;
    width: 16px;
    height: 16px;
`;

/** 范围选择器下拉面板 */
export const DateRangePickerDropdown = styled.div.withConfig({
    shouldForwardProp: (prop) => !['top', 'left'].includes(prop)
})<{ top: number; left: number }>`
    position: fixed;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    z-index: 999;
    background-color: var(--idp-bg-color-white);
    border-radius: var(--idp-border-radius-md);
    box-shadow: var(--idp-shadow-lg);
    overflow: hidden;
    min-width: 560px;
`;

/** 范围选择器双面板容器 */
export const DateRangePickerPanels = styled.div`
    display: flex;
    gap: 16px;
    padding: 16px;
`;

/** 范围选择器日历面板 */
export const DateRangePickerCalendar = styled.div`
    flex: 1;
    min-width: 252px;
`;

/** 范围选择器日历头部 */
export const DateRangePickerCalendarHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    margin-bottom: 8px;
`;

/** 范围选择器日历头部左侧 */
export const DateRangePickerHeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

/** 范围选择器日历头部中间 */
export const DateRangePickerHeaderCenter = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 500;
    color: var(--idp-text-color);
`;

/** 范围选择器日历头部右侧 */
export const DateRangePickerHeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

/** 范围选择器日历头部按钮 */
export const DateRangePickerHeaderButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    border-radius: var(--idp-border-radius-sm);
    color: var(--idp-text-color-secondary);
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);

    &:hover:not(:disabled) {
        background-color: var(--idp-bg-color-light);
        color: var(--idp-primary-color);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

/** 范围选择器日历头部标签 */
export const DateRangePickerHeaderLabel = styled.span`
    font-size: 12px;
    color: var(--idp-text-color-tertiary);
    margin-left: 8px;
`;

/** 范围选择器日历内容区域 */
export const DateRangePickerCalendarBody = styled.div`
    padding: 8px 0;
`;

/** 范围选择器星期标题行 */
export const DateRangePickerWeekHeader = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0;
    margin-bottom: 4px;
`;

/** 范围选择器星期标题 */
export const DateRangePickerWeekDay = styled.div`
    text-align: center;
    font-size: 12px;
    color: var(--idp-text-color-tertiary);
    padding: 4px 0;
    font-weight: 500;
`;

/** 范围选择器日期网格 */
export const DateRangePickerDateGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
`;

/** 范围选择器日期单元格 */
export const DateRangePickerDateCell = styled.div.withConfig({
    shouldForwardProp: (prop) => !['isSelected', 'isToday', 'isCurrentMonth', 'isInRange', 'isRangeStart', 'isRangeEnd', 'disabled'].includes(prop)
})<{
    isSelected?: boolean;
    isToday?: boolean;
    isCurrentMonth?: boolean;
    isInRange?: boolean;
    isRangeStart?: boolean;
    isRangeEnd?: boolean;
    disabled?: boolean;
}>`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    font-size: 13px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    border-radius: ${props => {
        if (props.isRangeStart) return '4px 0 0 4px';
        if (props.isRangeEnd) return '0 4px 4px 0';
        if (props.isInRange) return '0';
        return 'var(--idp-border-radius-sm)';
    }};
    color: ${props => {
        if (props.disabled) return 'var(--idp-text-color-light)';
        if (props.isSelected) return '#fff';
        if (!props.isCurrentMonth) return 'var(--idp-text-color-light)';
        return 'var(--idp-text-color)';
    }};
    background-color: ${props => {
        if (props.isSelected) return 'var(--idp-primary-color)';
        if (props.isInRange) return 'var(--idp-primary-light-color, rgba(24, 100, 240, 0.1))';
        return 'transparent';
    }};
    font-weight: ${props => (props.isToday || props.isSelected) ? '500' : 'normal'};
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);

    &:hover:not([disabled]) {
        background-color: ${props => {
            if (props.isSelected) return 'var(--idp-primary-hover-color)';
            return 'var(--idp-bg-color-light)';
        }};
    }

    ${props => props.isToday && !props.isSelected && !props.isInRange && `
        border: 1px solid var(--idp-primary-color);
    `}
`;

/** 范围选择器底部 */
export const DateRangePickerFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border-top: 1px solid var(--idp-border-color-light);
    gap: 8px;
`;

/** 范围选择器底部占位 */
export const DateRangePickerFooterSpacer = styled.div`
    flex: 1;
`;

/** 范围选择器底部按钮组 */
export const DateRangePickerFooterActions = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

/** 范围选择器底部按钮 */
export const DateRangePickerFooterButton = styled.button.withConfig({
    shouldForwardProp: (prop) => !['variant'].includes(prop)
})<{ variant?: 'primary' | 'default' }>`
    padding: 4px 12px;
    font-size: 13px;
    border-radius: var(--idp-border-radius-sm);
    cursor: pointer;
    transition: all var(--idp-transition-duration) var(--idp-transition-timing-function);
    border: 1px solid ${props => props.variant === 'primary' ? 'var(--idp-primary-color)' : 'var(--idp-border-color-extra-light)'};
    background-color: ${props => props.variant === 'primary' ? 'var(--idp-primary-color)' : 'var(--idp-bg-color-white)'};
    color: ${props => props.variant === 'primary' ? '#fff' : 'var(--idp-text-color)'};

    &:hover:not(:disabled) {
        border-color: var(--idp-primary-color);
        ${props => props.variant === 'primary'
            ? 'background-color: var(--idp-primary-hover-color);'
            : 'color: var(--idp-primary-color);'
        }
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

/** 范围选择器标签容器 */
export const DateRangePickerLabelContainer = styled.div.withConfig({
    shouldForwardProp: (prop) => !['gap'].includes(prop)
})<{ gap?: string | number }>`
    display: flex;
    align-items: center;
    gap: ${props => typeof props.gap === 'number' ? `${props.gap}px` : props.gap || '8px'};
`;

/** 范围选择器标签 */
export const DateRangePickerLabel = styled.label`
    font-size: 14px;
    color: var(--idp-text-color);
    white-space: nowrap;
    user-select: none;
`;


import { CSSProperties } from 'react';

/**
 * 获取日历容器样式
 * Get calendar container style
 */
export const getCalendarContainerStyle = (fullscreen?: boolean): CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    width: fullscreen ? '100%' : '320px',
    height: fullscreen ? '100%' : 'auto',
    backgroundColor: 'var(--zjpcy-bg-color-white)',
    borderRadius: 'var(--zjpcy-border-radius-lg)',
    border: '1px solid var(--zjpcy-border-color-extra-light)',
    boxShadow: 'var(--zjpcy-shadow-extra-light)',
    overflow: 'hidden',
    fontFamily: 'inherit',
});

/**
 * 获取日历头部样式
 * Get calendar header style
 */
export const getCalendarHeaderStyle = (): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--zjpcy-border-color-extra-light)',
    background: 'linear-gradient(135deg, var(--zjpcy-bg-color-white) 0%, var(--zjpcy-bg-color) 100%)',
});

/**
 * 获取头部按钮样式
 * Get header button style
 */
export const getHeaderButtonStyle = (): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    padding: 0,
    border: '1px solid var(--zjpcy-border-color-extra-light)',
    borderRadius: 'var(--zjpcy-border-radius-md)',
    backgroundColor: 'var(--zjpcy-bg-color-white)',
    color: 'var(--zjpcy-text-color)',
    cursor: 'pointer',
    transition: 'all var(--zjpcy-transition-duration) var(--zjpcy-transition-timing-function)',
});

/**
 * 获取周标题样式
 * Get weekday header style
 */
export const getWeekdayHeaderStyle = (): CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    padding: '12px 16px',
    borderBottom: '1px solid var(--zjpcy-border-color-extra-light)',
    backgroundColor: 'var(--zjpcy-bg-color)',
});

/**
 * 获取日期网格样式
 * Get date grid style
 */
export const getDateGridStyle = (): CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gridAutoRows: 'minmax(80px, 1fr)',
    flex: 1,
    padding: '8px 16px',
    gap: '4px',
});

/**
 * 获取月份网格样式
 * Get month grid style
 */
export const getMonthGridStyle = (): CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    padding: '24px',
    flex: 1,
});

'use client';

import React, { useState, useEffect } from 'react';
import { SwitchProps } from './types';
import { Wrapper, Track, Thumb, LoadingIcon, CheckedInner, UnCheckedInner, injectGlobalStyles } from './styles';

/**
 * Switch 开关组件
 * 用于在两种状态之间进行切换
 *
 * @example
 * ```tsx
 * <Switch defaultChecked={false} onChange={(checked) => console.log(checked)} />
 * <Switch checked={checked} onChange={setChecked} />
 * <Switch checkedChildren="开启" unCheckedChildren="关闭" />
 * ```
 */
const Switch: React.FC<SwitchProps> = ({
    checked: checkedProp,
    defaultChecked = false,
    disabled = false,
    loading = false,
    size = 'default',
    width,
    checkedChildren,
    unCheckedChildren,
    styles,
    onChange,
    label,
    labelGap = 8,
    labelClassName = '',
    labelStyle
}) => {
    // 判断是否为受控模式
    const isControlled = checkedProp !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    // 在受控模式下使用外部状态，非受控模式下使用内部状态
    const checked = isControlled ? checkedProp : internalChecked;

    // 判断是否有自定义内容
    const hasChildren = checkedChildren !== undefined || unCheckedChildren !== undefined;

    // 注入全局样式（动画等）
    useEffect(() => {
        injectGlobalStyles();
    }, []);

    const handleClick = () => {
        if (disabled || loading) return;

        const newChecked = !checked;

        // 非受控模式下更新内部状态
        if (!isControlled) {
            setInternalChecked(newChecked);
        }

        onChange?.(newChecked);
    };

    return (
      <Wrapper className="switch-wrapper" $styles={styles?.wrapper}>
        <div className="switch-label-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
          {label && (
            <div
              className={`switch-label ${labelClassName}`}
              style={{
                marginRight: typeof labelGap === 'number' ? `${labelGap}px` : labelGap,
                ...labelStyle
              }}
            >
              {label}
            </div>
          )}
          <Track
          className={`switch-track${checked ? ' switch-track-checked' : ''}${disabled ? ' switch-track-disabled' : ''}${loading ? ' switch-track-loading' : ''}`}
          $checked={checked}
          $disabled={disabled}
          $size={size}
          $loading={loading}
          $hasChildren={hasChildren}
          $width={width}
          $styles={styles?.track}
          onClick={handleClick}
        >
          {loading && (
            <LoadingIcon
              className="switch-loading-icon"
              $checked={checked}
              $size={size}
              $width={width}
              $styles={styles?.loading}
            >
              <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="#1890ff"
              >
                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
              </svg>
            </LoadingIcon>
          )}
          {!loading && checked && checkedChildren && (
            <CheckedInner className="switch-checked-inner" $size={size} $styles={styles?.inner}>
              {checkedChildren}
            </CheckedInner>
          )}
          {!loading && !checked && unCheckedChildren && (
            <UnCheckedInner className="switch-unchecked-inner" $size={size} $styles={styles?.inner}>
              {unCheckedChildren}
            </UnCheckedInner>
          )}
          <Thumb
            className={`switch-thumb${checked ? ' switch-thumb-checked' : ''}`}
            $checked={checked}
            $size={size}
            $loading={loading}
            $hasChildren={hasChildren}
            $width={width}
            $styles={styles?.thumb}
          />
        </Track>
        </div>
      </Wrapper>
    );
};

export default Switch;

export type { SwitchProps };

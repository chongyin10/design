import React, { useMemo } from 'react';
// Import only what's needed for basic functionality
import { PresetIcon } from './path';
// Static imports for commonly used icons - these will be tree-shaken if not used
import { 
  searchIcon, 
  loadingIcon, 
  userIcon, 
  closeIcon, 
  checkIcon, 
  plusIcon, 
  minusIcon, 
  arrowLeftIcon, 
  arrowRightIcon, 
  arrowUpIcon, 
  arrowDownIcon
} from './path';
// Import presetIcons for backward compatibility and fallback - this will be tree-shaken if not used
import { presetIcons } from './path';
import './Icon.css';

// Map icon types to their static imports for optimal tree-shaking
const iconMap: Record<string, PresetIcon> = {
  search: searchIcon,
  loading: loadingIcon,
  user: userIcon,
  close: closeIcon,
  check: checkIcon,
  plus: plusIcon,
  minus: minusIcon,
  arrowLeft: arrowLeftIcon,
  arrowRight: arrowRightIcon,
  arrowUp: arrowUpIcon,
  arrowDown: arrowDownIcon
};

// Get icon path with tree-shaking support
const getIconPath = (type: string): PresetIcon | undefined => {
  // Use static mapping for commonly used icons
  if (iconMap[type]) {
    return iconMap[type];
  }
  // Fallback to presetIcons for other icons
  return presetIcons[type];
};

export interface IconProps {
    type?: string;
    path?: string;
    viewBox?: string;
    size?: number | 'small' | 'medium' | 'large';
    color?: string;
    hoverColor?: string;
    spin?: boolean;
    rotate?: number;
    align?: 'left' | 'center' | 'right';
    className?: string;
    style?: React.CSSProperties;
    onClick?: (e: React.MouseEvent<SVGSVGElement>) => void;
}

const sizeMap: Record<string, number> = {
    small: 12,
    medium: 16,
    large: 24
};

const Icon: React.FC<IconProps> = ({
    type,
    path,
    viewBox = '0 0 24 24',
    size = 'medium',
    color = '#339af0',
    hoverColor,
    spin = false,
    rotate,
    align = 'center',
    className = '',
    style,
    onClick
}) => {
    const actualSize = useMemo(() => {
        if (typeof size === 'number') return size;
        return sizeMap[size] || 16;
    }, [size]);

    const iconPath = useMemo(() => {
        if (path) return path;
        if (type) {
            const icon = getIconPath(type);
            return icon?.path || '';
        }
        return '';
    }, [type, path]);

    const actualViewBox = useMemo(() => {
        if (viewBox !== '0 0 24 24') return viewBox;
        if (type) {
            const icon = getIconPath(type);
            return icon?.viewBox || '0 0 24 24';
        }
        return '0 0 24 24';
    }, [type, viewBox]);

    const handleMouseEnter = (e: React.MouseEvent<SVGSVGElement>) => {
        if (hoverColor) {
            e.currentTarget.style.fill = hoverColor;
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<SVGSVGElement>) => {
        if (hoverColor) {
            e.currentTarget.style.fill = color;
        }
    };

    if (!iconPath) {
        return null;
    }

    // 计算SVG的内联样式
    const svgInlineStyle: React.CSSProperties = {
        width: actualSize,
        height: actualSize,
        fill: color,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        ...style
    };

    return (
        <div className={`icon-container icon-align-${align} ${className}`}>
            <svg
                viewBox={actualViewBox}
                className={`icon ${spin ? 'icon-spin' : ''}`}
                style={svgInlineStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={onClick}
            >
                <path d={iconPath} />
            </svg>
        </div>
    );
};

export default Icon;

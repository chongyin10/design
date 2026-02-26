import { CSSProperties } from 'react';
import { CarouselArrowPosition, CarouselIndicatorPosition } from './types';

export const carouselStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
};

export const carouselTrackStyle = (direction: 'horizontal' | 'vertical'): CSSProperties => ({
    display: 'flex',
    height: '100%',
    transition: 'transform 0.5s ease',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
});

export const carouselItemStyle: CSSProperties = {
    flex: '0 0 100%',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
};

export const getIndicatorContainerStyle = (
    position: CarouselIndicatorPosition,
    direction: 'horizontal' | 'vertical'
): CSSProperties => {
    const baseStyle: CSSProperties = {
        position: 'absolute',
        display: 'flex',
        zIndex: 10,
    };

    const isHorizontal = direction === 'horizontal';
    const isTopOrBottom = position === 'top' || position === 'bottom';
    const isLeftOrRight = position === 'left' || position === 'right';

    if (position === 'center') {
        return {
            ...baseStyle,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
        };
    }

    if (isTopOrBottom) {
        return {
            ...baseStyle,
            left: '50%',
            transform: 'translateX(-50%)',
            [position]: '12px',
            flexDirection: isHorizontal ? 'row' : 'row',
        };
    }

    if (isLeftOrRight) {
        return {
            ...baseStyle,
            top: '50%',
            transform: 'translateY(-50%)',
            [position]: '12px',
            flexDirection: 'column',
        };
    }

    return baseStyle;
};

export const indicatorStyle = (active: boolean, position: CarouselIndicatorPosition): CSSProperties => {
    const baseStyle: CSSProperties = {
        cursor: 'pointer',
        transition: 'all 0.3s',
    };

    const isHorizontalPosition = position === 'top' || position === 'bottom';
    const isCenter = position === 'center';

    if (isCenter) {
        return {
            ...baseStyle,
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: active ? '#1890ff' : 'rgba(255, 255, 255, 0.5)',
            margin: '3px',
            border: active ? 'none' : '1px solid #fff',
        };
    }

    if (isHorizontalPosition) {
        return {
            ...baseStyle,
            width: active ? '24px' : '8px',
            height: '8px',
            borderRadius: '4px',
            backgroundColor: active ? '#1890ff' : 'rgba(0, 0, 0, 0.3)',
            margin: '0 4px',
        };
    }

    return {
        ...baseStyle,
        width: '8px',
        height: active ? '24px' : '8px',
        borderRadius: '4px',
        backgroundColor: active ? '#1890ff' : 'rgba(0, 0, 0, 0.3)',
        margin: '4px 0',
    };
};

export const getArrowContainerStyle = (
    position: CarouselArrowPosition,
    _direction: 'horizontal' | 'vertical'
): CSSProperties => {
    if (position === 'none') {
        return { display: 'none' };
    }

    const baseStyle: CSSProperties = {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        cursor: 'pointer',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        transition: 'all 0.3s',
    };

    if (position === 'outside') {
        return {
            ...baseStyle,
            left: '12px',
        };
    }

    return {
        ...baseStyle,
        left: '12px',
    };
};

export const arrowRightStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: '12px',
    zIndex: 10,
    cursor: 'pointer',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    transition: 'all 0.3s',
};

export const carouselCardStyle = (index: number, activeIndex: number, cardNumber: number, cardSpacing: number): CSSProperties => {
    const offset = index - activeIndex;
    const isActive = index === activeIndex;
    const absOffset = Math.abs(offset);

    let scale = 1;
    let opacity = 1;
    let zIndex = 0;

    if (absOffset >= cardNumber) {
        opacity = 0;
        zIndex = -1;
    } else if (isActive) {
        scale = 1;
        zIndex = 10;
    } else {
        scale = 1 - absOffset * 0.1;
        opacity = 1 - absOffset * 0.2;
        zIndex = 10 - absOffset;
    }

    return {
        position: 'absolute',
        width: `calc(${100 / cardNumber}% - ${(cardNumber - 1) * cardSpacing / cardNumber}px)`,
        height: '100%',
        transform: `translateX(${offset * 100}%) scale(${scale})`,
        opacity,
        zIndex,
        transition: 'all 0.5s ease',
        marginRight: cardSpacing,
    };
};

export const fadeItemStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    transition: 'opacity 0.5s ease',
};

export const fadeActiveItemStyle: CSSProperties = {
    ...fadeItemStyle,
    opacity: 1,
    zIndex: 1,
};

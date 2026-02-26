import { CSSProperties } from 'react';

export const getCarouselStyle = (
  isVertical: boolean,
  currentIndex: number,
  duration: number
): CSSProperties => ({
  transform: isVertical
    ? `translateY(-${currentIndex * 100}%)`
    : `translateX(-${currentIndex * 100}%)`,
  transitionDuration: `${duration}ms`,
});

export const getItemStyle = (
  isFade: boolean,
  isActive: boolean,
  duration: number
): CSSProperties => {
  if (isFade) {
    return {
      opacity: isActive ? 1 : 0,
      zIndex: isActive ? 1 : 0,
      transitionDuration: `${duration}ms`,
    };
  }
  return {};
};

export const getIndicatorStyle = (
  isActive: boolean,
  isVertical: boolean
): CSSProperties => ({
  width: isActive ? (isVertical ? 8 : 24) : 8,
  height: isActive ? (isVertical ? 24 : 8) : 8,
});

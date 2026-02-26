import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import { CarouselItem, CarouselProps } from './types';
import './Carousel.css';

const Carousel: React.FC<CarouselProps> = ({
  items,
  currentIndex: controlledIndex,
  defaultCurrentIndex = 0,
  onChange,
  autoplay = true,
  interval = 3000,
  effect = 'slide',
  direction = 'horizontal',
  showIndicators = true,
  indicatorPosition = 'bottom',
  showArrows = true,
  loop = true,
  pauseOnHover = true,
  className,
  style,
  contentClassName,
  contentStyle,
  onItemClick,
  duration = 500,
  prevIcon,
  nextIcon,
  upIcon,
  downIcon,
  indicatorProgress = false,
}) => {
  const isControlled = controlledIndex !== undefined;
  const [internalIndex, setInternalIndex] = useState(defaultCurrentIndex);
  const currentIndex = isControlled ? controlledIndex : internalIndex;
  
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const totalItems = items.length;
  const isVertical = direction === 'vertical';
  const isFade = effect === 'fade';

  // 计算实际索引（用于循环）
  const getValidIndex = useCallback((index: number) => {
    if (loop) {
      if (index < 0) return totalItems - 1;
      if (index >= totalItems) return 0;
    } else {
      if (index < 0) return 0;
      if (index >= totalItems) return totalItems - 1;
    }
    return index;
  }, [loop, totalItems]);

  // 切换到指定索引
  const goTo = useCallback((index: number) => {
    if (isTransitioning || totalItems <= 1) return;
    
    const validIndex = getValidIndex(index);
    
    if (validIndex !== currentIndex) {
      setIsTransitioning(true);
      
      if (!isControlled) {
        setInternalIndex(validIndex);
      }
      onChange?.(validIndex);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, duration);
    }
  }, [currentIndex, isControlled, isTransitioning, onChange, getValidIndex, duration, totalItems]);

  // 下一张
  const goNext = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  // 上一张
  const goPrev = useCallback(() => {
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  // 自动播放
  useEffect(() => {
    if (!autoplay || totalItems <= 1) return;
    
    if (pauseOnHover && isHovering) return;

    autoplayTimerRef.current = setInterval(() => {
      goNext();
    }, interval);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, interval, isHovering, pauseOnHover, goNext, totalItems]);

  // 处理触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  // 处理触摸结束
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 50;

    if (isVertical) {
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          goPrev();
        } else {
          goNext();
        }
      }
    } else {
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          goPrev();
        } else {
          goNext();
        }
      }
    }
    
    touchStartRef.current = null;
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      goPrev();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      goNext();
    }
  };

  // 处理项目点击
  const handleItemClick = (item: CarouselItem, index: number) => {
    if (item.link) {
      window.open(item.link, '_blank');
    }
    onItemClick?.(item, index);
  };

  // 计算滑动偏移量
  const slideOffset = useMemo(() => {
    if (isFade) return 0;
    return -currentIndex * 100;
  }, [currentIndex, isFade]);

  // 容器类名
  const containerClasses = classNames(
    'idp-carousel',
    `idp-carousel--${effect}`,
    `idp-carousel--${direction}`,
    {
      'idp-carousel--hover': isHovering,
    },
    className
  );

  // 内容容器类名
  const contentClasses = classNames(
    'idp-carousel__content',
    contentClassName
  );

  // 指示器容器类名
  const indicatorsClasses = classNames(
    'idp-carousel__indicators',
    `idp-carousel__indicators--${indicatorPosition}`
  );

  // 如果没有项目，返回空
  if (totalItems === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={style}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
    >
      {/* 内容区域 */}
      <div
        className={contentClasses}
        style={{
          ...contentStyle,
          ...(isFade
            ? {}
            : {
                transform: isVertical
                  ? `translateY(${slideOffset}%)`
                  : `translateX(${slideOffset}%)`,
                transitionDuration: `${duration}ms`,
              }),
        }}
      >
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          const itemClasses = classNames('idp-carousel__item', {
            'idp-carousel__item--active': isActive,
          });

          return (
            <div
              key={item.key}
              className={itemClasses}
              style={{
                ...(isFade
                  ? {
                      opacity: isActive ? 1 : 0,
                      zIndex: isActive ? 1 : 0,
                      transitionDuration: `${duration}ms`,
                    }
                  : {}),
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${totalItems}`}
              aria-hidden={!isActive}
            >
              {item.render ? (
                item.render()
              ) : (
                <div
                  className="idp-carousel__item-inner"
                  onClick={() => handleItemClick(item, index)}
                  style={{ cursor: item.link || onItemClick ? 'pointer' : 'default' }}
                >
                  <img
                    src={item.image}
                    alt={typeof item.title === 'string' ? item.title : ''}
                    className="idp-carousel__image"
                    draggable={false}
                  />
                  {(item.title || item.description) && (
                    <div className="idp-carousel__info">
                      {item.title && (
                        <div className="idp-carousel__title">{item.title}</div>
                      )}
                      {item.description && (
                        <div className="idp-carousel__description">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 箭头控制 */}
      {showArrows && totalItems > 1 && (
        <>
          <button
            className={classNames('idp-carousel__arrow', 'idp-carousel__arrow--prev')}
            onClick={goPrev}
            aria-label="Previous slide"
            type="button"
          >
            {isVertical
              ? (upIcon ?? <Icon type="up" size={20} />)
              : (prevIcon ?? <Icon type="left" size={20} />)}
          </button>
          <button
            className={classNames('idp-carousel__arrow', 'idp-carousel__arrow--next')}
            onClick={goNext}
            aria-label="Next slide"
            type="button"
          >
            {isVertical
              ? (downIcon ?? <Icon type="down" size={20} />)
              : (nextIcon ?? <Icon type="right" size={20} />)}
          </button>
        </>
      )}

      {/* 指示器 */}
      {showIndicators && totalItems > 1 && (
        <div className={indicatorsClasses} role="tablist">
          {items.map((item, index) => {
            const isActive = index === currentIndex;
            const showProgress = indicatorProgress && autoplay && isActive;
            
            return (
              <button
                key={`${item.key}-${showProgress ? 'progress' : 'static'}`}
                className={classNames('idp-carousel__indicator', {
                  'idp-carousel__indicator--active': isActive,
                  'idp-carousel__indicator--progress': showProgress,
                })}
                onClick={() => goTo(index)}
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${index + 1}`}
                type="button"
                style={
                  showProgress
                    ? { '--progress-duration': `${interval}ms` } as React.CSSProperties
                    : undefined
                }
              >
                {showProgress && (
                  <span
                    key={`progress-${currentIndex}`}
                    className="idp-carousel__indicator-progress-bar"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 页码显示 */}
      <div className="idp-carousel__pagination">
        <span className="idp-carousel__pagination-current">{currentIndex + 1}</span>
        <span className="idp-carousel__pagination-separator">/</span>
        <span className="idp-carousel__pagination-total">{totalItems}</span>
      </div>
    </div>
  );
};

export default Carousel;

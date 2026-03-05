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
  const [isRaining, setIsRaining] = useState(false);
  const [rainDrops, setRainDrops] = useState<Array<{ id: number; left: number; delay: number; duration: number; isLarge: boolean }>>([]);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const rainTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const totalItems = items.length;
  const isVertical = direction === 'vertical';
  const isFade = effect === 'fade';
  const is3D = ['flip', 'cards', 'creative', 'coverflow', 'parallax', 'zoom', 'book', 'curtain', 'mosaic', 'rain'].includes(effect);

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
  const goTo = useCallback((index: number, delayForRain = false) => {
    if (isTransitioning || totalItems <= 1) return;
    
    const validIndex = getValidIndex(index);
    
    if (validIndex === currentIndex) return;
    
    // 如果是 rain 效果且需要延迟，先显示雨滴效果
    if (effect === 'rain' && delayForRain && !isRaining) {
      setIsRaining(true);
      setRainDrops(generateRainDrops());
      
      // 延迟后执行切换
      rainTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(true);
        if (!isControlled) {
          setInternalIndex(validIndex);
        }
        onChange?.(validIndex);
        
        setTimeout(() => {
          setIsTransitioning(false);
          setIsRaining(false);
          setRainDrops([]);
        }, duration);
      }, 1500);
      return;
    }
    
    // 普通切换
    setIsTransitioning(true);
    
    if (!isControlled) {
      setInternalIndex(validIndex);
    }
    onChange?.(validIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, duration);
  }, [currentIndex, isControlled, isTransitioning, onChange, getValidIndex, duration, totalItems, effect, isRaining]);

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
    if (isFade || is3D) return 0;
    return -currentIndex * 100;
  }, [currentIndex, isFade, is3D]);

  // 计算循环模式下的最短路径差值
  const getLoopDiff = useCallback((index: number, current: number, total: number): number => {
    if (!loop) return index - current;
    
    const diff = index - current;
    const altDiff = diff > 0 ? diff - total : diff + total;
    
    // 选择绝对值较小的路径
    return Math.abs(diff) <= Math.abs(altDiff) ? diff : altDiff;
  }, [loop]);

  // 获取3D效果的样式
  const get3DItemStyle = (index: number): React.CSSProperties => {
    if (!is3D) return {};
    
    const isActive = index === currentIndex;
    const diff = getLoopDiff(index, currentIndex, totalItems);
    
    switch (effect) {
      case 'flip': {
        const rotateY = diff * 180;
        return {
          transform: `rotateY(${rotateY}deg)`,
          opacity: Math.abs(diff) <= 1 ? (isActive ? 1 : 0.5) : 0,
          zIndex: isActive ? 10 : 1,
        };
      }
      case 'cards': {
        const translateX = diff * 30;
        const translateZ = isActive ? 0 : -100;
        const scale = isActive ? 1 : 0.9;
        const rotateY = diff * 5;
        return {
          transform: `translateX(${translateX}%) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
          opacity: isActive ? 1 : Math.abs(diff) <= 2 ? 0.6 - Math.abs(diff) * 0.2 : 0,
          zIndex: isActive ? 10 : 5 - Math.abs(diff),
        };
      }
      case 'coverflow': {
        const absOffset = Math.abs(diff);
        const rotateY = diff * -45;
        const translateX = diff * 50;
        const translateZ = isActive ? 0 : -200;
        const scale = isActive ? 1 : 0.8;
        return {
          transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
          opacity: absOffset <= 2 ? 1 - absOffset * 0.3 : 0,
          zIndex: isActive ? 10 : 5 - absOffset,
        };
      }
      case 'parallax': {
        const translateX = diff * 100;
        const scale = isActive ? 1 : 0.8;
        return {
          transform: `translateX(${translateX}%) scale(${scale})`,
          opacity: Math.abs(diff) <= 1 ? 1 : 0,
          zIndex: isActive ? 10 : 5,
        };
      }
      case 'zoom': {
        const scale = isActive ? 1 : 2;
        const opacity = isActive ? 1 : 0;
        const blur = isActive ? 0 : 10;
        return {
          transform: `scale(${scale})`,
          opacity,
          filter: `blur(${blur}px)`,
          zIndex: isActive ? 10 : 1,
        };
      }
      case 'book': {
        const rotateY = diff < 0 ? -90 : diff > 0 ? 90 : 0;
        const opacity = isActive ? 1 : diff === -1 ? 0.3 : 0;
        return {
          transform: `rotateY(${rotateY}deg)`,
          opacity,
          zIndex: isActive ? 10 : 5,
        };
      }
      case 'mosaic': {
        const scale = isActive ? 1 : 0.8;
        const translateX = diff * 20;
        const rotate = diff * 5;
        return {
          transform: `scale(${scale}) translateX(${translateX}%) rotate(${rotate}deg)`,
          opacity: isActive ? 1 : 0,
          filter: isActive ? 'blur(0)' : 'blur(5px)',
          zIndex: isActive ? 10 : 5,
        };
      }
      case 'creative': {
        // 创意效果在CSS中处理
        return {};
      }
      case 'curtain': {
        const translateX = isActive ? 0 : diff < 0 ? -100 : 100;
        const scaleX = isActive ? 1 : 0;
        const origin = diff < 0 ? 'right' : 'left';
        return {
          transform: `translateX(${translateX}%) scaleX(${scaleX})`,
          opacity: isActive ? 1 : 0,
          zIndex: isActive ? 10 : 5,
          transformOrigin: origin,
        };
      }
      default:
        return {};
    }
  };

  // 生成雨滴
  const generateRainDrops = useCallback(() => {
    const drops = [];
    for (let i = 0; i < 80; i++) {
      const isLarge = Math.random() > 0.7;
      drops.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 0.4 + Math.random() * 0.4,
        isLarge,
      });
    }
    return drops;
  }, []);

  // 处理点击 - 触发雨滴效果
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (effect !== 'rain') {
      return;
    }
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 添加水波纹
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    // 开始下雨
    setIsRaining(true);
    setRainDrops(generateRainDrops());
    
    // 延迟后切换到下一张
    setTimeout(() => {
      goNext();
      setIsRaining(false);
      setRainDrops([]);
    }, 1500);
    
    // 清理水波纹
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
  };

  // 容器类名
  const containerClasses = classNames(
    'zjpcy-carousel',
    `zjpcy-carousel--${effect}`,
    `zjpcy-carousel--${direction}`,
    {
      'zjpcy-carousel--hover': isHovering,
      'zjpcy-carousel--raining': isRaining,
    },
    className
  );

  // 内容容器类名
  const contentClasses = classNames(
    'zjpcy-carousel__content',
    contentClassName
  );

  // 指示器容器类名
  const indicatorsClasses = classNames(
    'zjpcy-carousel__indicators',
    `zjpcy-carousel__indicators--${indicatorPosition}`
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
      onClick={handleContainerClick}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
    >
      {/* 内容区域 */}
      <div
        className={contentClasses}
        style={{
          ...contentStyle,
          ...(is3D
            ? {}
            : isFade
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
          const diff = index - currentIndex;
          const itemClasses = classNames('zjpcy-carousel__item', {
            'zjpcy-carousel__item--active': isActive,
            'zjpcy-carousel__item--prev': diff === -1,
            'zjpcy-carousel__item--next': diff === 1,
            'zjpcy-carousel__item--exit': effect === 'book' && diff === -1,
          });

          return (
            <div
              key={item.key}
              className={itemClasses}
              style={{
                ...(is3D
                  ? get3DItemStyle(index)
                  : isFade
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
                  className="zjpcy-carousel__item-inner"
                  onClick={() => handleItemClick(item, index)}
                  style={{ cursor: item.link || onItemClick ? 'pointer' : 'default' }}
                >
                  <img
                    src={item.image}
                    alt={typeof item.title === 'string' ? item.title : ''}
                    className="zjpcy-carousel__image"
                    draggable={false}
                  />
                  {(item.title || item.description) && (
                    <div className={classNames('zjpcy-carousel__info', `zjpcy-carousel__info--${item.infoPosition || 'bottom'}`)}>
                      {item.title && (
                        <div className="zjpcy-carousel__title">{item.title}</div>
                      )}
                      {item.description && (
                        <div className="zjpcy-carousel__description">
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
            className={classNames('zjpcy-carousel__arrow', 'zjpcy-carousel__arrow--prev')}
            onClick={goPrev}
            aria-label="Previous slide"
            type="button"
          >
            {isVertical
              ? (upIcon ?? <Icon type="arrow-up" size={20} />)
              : (prevIcon ?? <Icon type="chevron-left" size={20} />)}
          </button>
          <button
            className={classNames('zjpcy-carousel__arrow', 'zjpcy-carousel__arrow--next')}
            onClick={goNext}
            aria-label="Next slide"
            type="button"
          >
            {isVertical
              ? (downIcon ?? <Icon type="arrow-down" size={20} />)
              : (nextIcon ?? <Icon type="chevron-right" size={20} />)}
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
                className={classNames('zjpcy-carousel__indicator', {
                  'zjpcy-carousel__indicator--active': isActive,
                  'zjpcy-carousel__indicator--progress': showProgress,
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
                    className="zjpcy-carousel__indicator-progress-bar"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 页码显示 */}
      <div className="zjpcy-carousel__pagination">
        <span className="zjpcy-carousel__pagination-current">{currentIndex + 1}</span>
        <span className="zjpcy-carousel__pagination-separator">/</span>
        <span className="zjpcy-carousel__pagination-total">{totalItems}</span>
      </div>

      {/* 雨滴效果 - 雨雾遮罩 */}
      {effect === 'rain' && (
        <div className="zjpcy-carousel__rain-overlay" />
      )}

      {/* 雨滴效果 - 雨滴 */}
      {effect === 'rain' && rainDrops.map((drop) => (
        <span
          key={drop.id}
          className={classNames('zjpcy-carousel__rain-drop', {
            'zjpcy-carousel__rain-drop--large': drop.isLarge,
          })}
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
          }}
        />
      ))}

      {/* 雨滴效果 - 水波纹 */}
      {effect === 'rain' && ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="zjpcy-carousel__ripple"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}
    </div>
  );
};

export default Carousel;


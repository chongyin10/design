'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '../Icon';
import { TabItem, TabsProps } from './types';
import './Tabs.css';

interface SortableTabProps {
  item: TabItem;
  isActive: boolean;
  isClosable: boolean;
  onClick: () => void;
  onClose: (event: React.MouseEvent) => void;
  tabRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
}

const SortableTab: React.FC<SortableTabProps> = ({
  item,
  isActive,
  isClosable,
  onClick,
  onClose,
  tabRefs
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item.key, 
    disabled: item.disabled 
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    position: 'relative'
  };

  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        if (el) {
          tabRefs.current.set(item.key, el);
        } else {
          tabRefs.current.delete(item.key);
        }
      }}
      className={classNames('zjpcy-tabs-tab', {
        'zjpcy-tabs-tab--active': isActive,
        'zjpcy-tabs-tab--disabled': item.disabled,
        'zjpcy-tabs-tab--dragging': isDragging
      })}
      role="tab"
      aria-selected={isActive}
      style={style}
    >
      <div
        className="zjpcy-tabs-tab__drag-handle"
        {...attributes}
        {...listeners}
        onClick={onClick}
        style={{ 
          cursor: item.disabled ? 'not-allowed' : 'grab',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        {item.icon && <span className="zjpcy-tabs-tab__icon">{item.icon}</span>}
        <span className="zjpcy-tabs-tab__label">{item.label}</span>
      </div>
      {isClosable && !item.disabled && (
        <span className="zjpcy-tabs-tab__close" onClick={(event) => onClose(event)}>
          <Icon type="close" size={12} />
        </span>
      )}
    </div>
  );
};

const Tabs: React.FC<TabsProps> = ({
  items = [],
  activeKey,
  defaultActiveKey,
  onChange,
  onClose,
  tabsClosable = false,
  tabPlacement = 'top',
  type = 'line',
  onAdd,
  className,
  style,
  contentClassName,
  contentStyle,
  draggable = false,
  onDragEnd
}) => {
  const [innerActiveKey, setInnerActiveKey] = useState<string | undefined>(() => defaultActiveKey);
  const tabsNavRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const addTabRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const isScrollingRef = useRef(false);
  const isFirstUpdateRef = useRef(true);
  const [isAddButtonSticky, setIsAddButtonSticky] = useState(false);
  const [dragItems, setDragItems] = useState<TabItem[]>(items);

  useEffect(() => {
    if (activeKey !== undefined) {
      setInnerActiveKey(activeKey);
    }
  }, [activeKey]);

  useEffect(() => {
    setDragItems(items);
  }, [items]);

  useEffect(() => {
    if (activeKey !== undefined) return;

    const firstKey = items[0]?.key;
    const hasDefault = defaultActiveKey ? items.some(item => item.key === defaultActiveKey) : false;

    if (hasDefault && !innerActiveKey) {
      setInnerActiveKey(defaultActiveKey);
      return;
    }

    if (!firstKey) {
      setInnerActiveKey(undefined);
      return;
    }

    const exists = items.some(item => item.key === innerActiveKey);
    if (!exists) {
      setInnerActiveKey(firstKey);
    }
  }, [items, innerActiveKey, activeKey, defaultActiveKey]);

  const currentActiveKey = activeKey !== undefined ? activeKey : innerActiveKey;

  const activeItem = useMemo(() => {
    return items.find(item => item.key === currentActiveKey) || items[0];
  }, [items, currentActiveKey]);

  const updateIndicatorWithKey = (key: string, animate = true) => {
    if (!key || !tabsNavRef.current) return;

    const activeTab = tabRefs.current.get(key);
    const container = tabsNavRef.current;

    if (activeTab && container) {
      const indicator = container.querySelector('.zjpcy-tabs-indicator') as HTMLElement;
      const isFirstUpdate = isFirstUpdateRef.current;

      // 首次更新时禁用transition，避免闪烁
      if (indicator && isFirstUpdate) {
        indicator.style.transition = 'none';
      }

      // 使用相对于容器的位置，不受滚动影响
      if (tabPlacement === 'top' || tabPlacement === 'bottom') {
        setIndicatorStyle({
          left: activeTab.offsetLeft,
          width: activeTab.offsetWidth,
          top: undefined,
          height: undefined
        });

        // 只在非动画模式下（初始化、resize时）才自动滚动到可视区域
        // 避免在用户手动滚动时产生冲突
        if (!animate) {
          const tabLeft = activeTab.offsetLeft;
          const tabRight = tabLeft + activeTab.offsetWidth;
          const scrollLeft = container.scrollLeft;
          const containerWidth = container.clientWidth;

          if (tabLeft < scrollLeft || tabRight > scrollLeft + containerWidth) {
            activeTab.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
          }
        }
      } else {
        setIndicatorStyle({
          top: activeTab.offsetTop,
          height: activeTab.offsetHeight,
          left: undefined,
          width: undefined
        });
      }

      // 首次更新后，恢复transition并标记已初始化
      if (indicator && isFirstUpdate && animate) {
        requestAnimationFrame(() => {
          indicator.style.transition = '';
          isFirstUpdateRef.current = false;
        });
      } else if (isFirstUpdate) {
        isFirstUpdateRef.current = false;
      }
    }
  };

  const checkOverflow = React.useCallback(() => {
    if (!tabsNavRef.current) return;

    const container = tabsNavRef.current;
    const isHorizontal = tabPlacement === 'top' || tabPlacement === 'bottom';

    // 卡片式页签不显示滚动按钮
    if (type === 'card') {
      setShowScrollButtons(false);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    if (isHorizontal) {
      // 精确计算是否有溢出，考虑小数点精度
      const hasOverflow = Math.ceil(container.scrollWidth) > Math.floor(container.clientWidth);
      setShowScrollButtons(hasOverflow);

      if (hasOverflow) {
        // 检查是否可以向左滚动（当前滚动位置 > 0）
        const canLeft = container.scrollLeft > 1;
        setCanScrollLeft(canLeft);

        // 检查是否可以向右滚动（当前滚动位置 + 容器宽度 < 内容宽度 - 1）
        const maxScroll = container.scrollWidth - container.clientWidth;
        const canRight = container.scrollLeft < maxScroll - 1;
        setCanScrollRight(canRight);
      } else {
        // 没有溢出时，重置按钮状态
        setCanScrollLeft(false);
        setCanScrollRight(false);
      }
    } else {
      // 垂直布局时隐藏滚动按钮
      setShowScrollButtons(false);
      setCanScrollLeft(false);
      setCanScrollRight(false);
    }
  }, [tabPlacement, type]);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (!tabsNavRef.current || isScrollingRef.current) return;

    const container = tabsNavRef.current;
    const containerWidth = container.clientWidth;
    const scrollAmount = Math.max(200, containerWidth * 0.6); // 每次滚动至少200px，或容器宽度的60%

    isScrollingRef.current = true;

    if (direction === 'left') {
      container.scrollTo({
        left: container.scrollLeft - scrollAmount,
        behavior: 'smooth'
      });
    } else {
      container.scrollTo({
        left: container.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }

    // 重置滚动状态，允许下一次滚动
    setTimeout(() => {
      isScrollingRef.current = false;
      checkOverflow(); // 滚动后更新按钮状态
    }, 400);
  };

  useEffect(() => {
    // 当currentActiveKey变化时，使用平滑滑动更新indicator
    if (currentActiveKey) {
      updateIndicatorWithKey(currentActiveKey, false); // 初始化时不使用动画
      checkOverflow();
    }
  }, [currentActiveKey, items, tabPlacement, checkOverflow]);

  // 组件挂载后检查溢出和初始indicator位置
  useEffect(() => {
    // 初始检查
    checkOverflow();

    // 使用requestAnimationFrame确保DOM完全渲染后设置初始indicator位置
    const rafId = requestAnimationFrame(() => {
      // 设置初始位置，首次不使用动画
      if (currentActiveKey) {
        updateIndicatorWithKey(currentActiveKey, false);
      }
      // 再次检查溢出，确保按钮状态正确
      checkOverflow();
    });

    return () => cancelAnimationFrame(rafId);
  }, [checkOverflow, currentActiveKey]);

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    
    const handleResize = () => {
      // 窗口大小变化时更新indicator
      if (currentActiveKey) {
        updateIndicatorWithKey(currentActiveKey, false); // resize时不使用动画
      }
      checkOverflow();
    };
    
    const handleScroll = () => {
      // 防抖处理，避免滚动期间频繁更新
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        checkOverflow(); // 只更新按钮状态，不更新indicator位置
      }, 100);
    };
    
    const container = tabsNavRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      clearTimeout(scrollTimeout);
    };
  }, [checkOverflow, currentActiveKey]);

  // 检测 add 按钮是否需要固定显示
  useEffect(() => {
    const checkAddButtonPosition = () => {
      if (!addTabRef.current || !tabsNavRef.current || type !== 'card' || !onAdd) {
        setIsAddButtonSticky(false);
        return;
      }

      const container = tabsNavRef.current;
      const addButton = addTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const addButtonRect = addButton.getBoundingClientRect();

      // 如果 add 按钮距离右端小于等于 20px，则固定显示
      const distanceToRight = containerRect.right - addButtonRect.right;
      const shouldBeSticky = distanceToRight <= 20;

      setIsAddButtonSticky(shouldBeSticky);
    };

    // 初始检查
    checkAddButtonPosition();

    // 监听滚动和 resize
    const handleScrollOrResize = () => {
      checkAddButtonPosition();
    };

    const container = tabsNavRef.current;
    if (container) {
      container.addEventListener('scroll', handleScrollOrResize);
      window.addEventListener('resize', handleScrollOrResize);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScrollOrResize);
      }
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [type, onAdd, items]);

  const handleTabClick = (item: TabItem) => {
    if (item.disabled) return;

    if (activeKey === undefined) {
      setInnerActiveKey(item.key);
    }

    // 点击时使用平滑滑动效果
    updateIndicatorWithKey(item.key, true);
    checkOverflow();
    onChange?.(item.key);
  };

  const handleClose = (event: React.MouseEvent, item: TabItem) => {
    event.stopPropagation();
    if (item.disabled) return;
    onClose?.(item.key);
  };

  const handleAddTab = () => {
    onAdd?.();
    // 等待DOM更新后滚动到新增的tab
    // items.length 代表当前tab数量，新增后的索引是 items.length
    setTimeout(() => {
      if (tabsNavRef.current) {
        // 新增的tab索引将是 items.length（因为onAdd会更新items）
        // 但此时items还未更新，所以我们需要等待下一次渲染
        // 使用 requestAnimationFrame 确保在DOM更新后执行
        requestAnimationFrame(() => {
          if (tabsNavRef.current && tabRefs.current.size > 0) {
            // 获取所有tab的keys，最后一个就是新增的
            const tabKeys = Array.from(tabRefs.current.keys());
            if (tabKeys.length > 0) {
              const lastKey = tabKeys[tabKeys.length - 1];
              const lastTab = tabRefs.current.get(lastKey);
              const container = tabsNavRef.current;

              if (lastTab && container && addTabRef.current) {
                // 卡片式页签需要考虑 add 按钮的宽度
                if (type === 'card') {
                  const addButton = addTabRef.current;
                  const addButtonWidth = addButton.offsetWidth + 4; // 加上 gap 的间距
                  const tabLeft = lastTab.offsetLeft;
                  const tabRight = tabLeft + lastTab.offsetWidth;
                  const containerWidth = container.clientWidth;
                  const scrollLeft = container.scrollLeft;

                  // 计算 tab 相对于容器的右边界
                  const tabRightInViewport = tabRight - scrollLeft;

                  // 如果 tab 的右边界加上 add 按钮宽度超过了容器宽度，需要向左滚动
                  if (tabRightInViewport > containerWidth - addButtonWidth) {
                    const targetScrollLeft = tabRight - containerWidth + addButtonWidth;
                    container.scrollTo({
                      left: targetScrollLeft,
                      behavior: 'smooth'
                    });
                  }
                } else {
                  lastTab.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
                }
              }
            }
          }
        });
      }
    }, 100);
  };

  // 拖拽相关
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (_event: DragStartEvent) => {
    // 拖拽开始时的逻辑
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = dragItems.findIndex(item => item.key === active.id);
    const newIndex = dragItems.findIndex(item => item.key === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = arrayMove(dragItems, oldIndex, newIndex);
      setDragItems(newItems);
      onDragEnd?.(newItems);
    }
  };

  const renderNav = () => {
    const isHorizontal = tabPlacement === 'top' || tabPlacement === 'bottom';
    const isCardType = type === 'card';
    const effectiveItems = draggable ? dragItems : items;

    const renderTabContent = (item: TabItem, isActive: boolean, isClosable: boolean) => {
      if (draggable && !item.disabled && (tabPlacement === 'top' || tabPlacement === 'bottom')) {
        return (
          <SortableTab
            key={item.key}
            item={item}
            isActive={isActive}
            isClosable={isClosable}
            onClick={() => handleTabClick(item)}
            onClose={(event) => handleClose(event, item)}
            tabRefs={tabRefs}
          />
        );
      }

      return (
        <div
          key={item.key}
          ref={(el) => {
            if (el) {
              tabRefs.current.set(item.key, el);
            } else {
              tabRefs.current.delete(item.key);
            }
          }}
          className={classNames('zjpcy-tabs-tab', {
            'zjpcy-tabs-tab--active': isActive,
            'zjpcy-tabs-tab--disabled': item.disabled
          })}
          role="tab"
          aria-selected={isActive}
          onClick={() => handleTabClick(item)}
        >
          {item.icon && <span className="zjpcy-tabs-tab__icon">{item.icon}</span>}
          <span className="zjpcy-tabs-tab__label">{item.label}</span>
          {isClosable && !item.disabled && (
            <span className="zjpcy-tabs-tab__close" onClick={(event) => handleClose(event, item)}>
              <Icon type="close" size={12} />
            </span>
          )}
        </div>
      );
    };

    const navContent = (
      <div 
        className="zjpcy-tabs-nav-wrapper"
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => setIsNavHovered(false)}
      >
        {isHorizontal && showScrollButtons && !isCardType && (
          <button
            className={classNames(
              'zjpcy-tabs-nav__button',
              'zjpcy-tabs-nav__button--left',
              {
                'zjpcy-tabs-nav__button--disabled': !canScrollLeft,
                'zjpcy-tabs-nav__button--visible': isNavHovered
              }
            )}
            onClick={() => scrollTabs('left')}
            disabled={!canScrollLeft}
            type="button"
          >
            <Icon type="arrowLeft" size={12} />
          </button>
        )}

        <div className="zjpcy-tabs-nav" ref={tabsNavRef}>
          {effectiveItems.map(item => {
            const isActive = item.key === currentActiveKey;
            const isClosable = tabsClosable || item.closable;
            return renderTabContent(item, isActive, isClosable || false);
          })}
          {/* 卡片式页签的增加按钮 */}
          {type === 'card' && onAdd && (
            <div
              ref={addTabRef}
              className={classNames('zjpcy-tabs-tab zjpcy-tabs-tab--add', {
                'sticky': isAddButtonSticky === true
              })}
              role="tab"
              onClick={handleAddTab}
            >
              <Icon type="plus" size={16} />
            </div>
          )}
          <div className="zjpcy-tabs-indicator" style={indicatorStyle} />
        </div>

        {isHorizontal && showScrollButtons && !isCardType && (
          <button
            className={classNames(
              'zjpcy-tabs-nav__button',
              'zjpcy-tabs-nav__button--right',
              {
                'zjpcy-tabs-nav__button--disabled': !canScrollRight,
                'zjpcy-tabs-nav__button--visible': isNavHovered
              }
            )}
            onClick={() => scrollTabs('right')}
            disabled={!canScrollRight}
            type="button"
          >
            <Icon type="arrowRight" size={12} />
          </button>
        )}
      </div>
    );

    if (draggable && !isCardType && (tabPlacement === 'top' || tabPlacement === 'bottom')) {
      return (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={effectiveItems.map(item => item.key)}
            strategy={horizontalListSortingStrategy}
          >
            {navContent}
          </SortableContext>
        </DndContext>
      );
    }

    return navContent;
  };

  const renderContent = () => {
    // 支持 content 或 renderContent 两种方式
    // renderContent 是函数，在渲染时调用，避免闭包问题
    const content = activeItem?.renderContent
      ? activeItem.renderContent()
      : activeItem?.content;

    // 优先级：外部 className > 内部 className
    // 优先级：外部 style > 内部 style
    const finalClassName = classNames(
      'zjpcy-tabs-content',
      `zjpcy-tabs-content--${tabPlacement}`,
      contentClassName // 外部传入的 className 优先级最高
    );

    // 合并样式：外部 style 优先级最高
    const finalStyle = {
      ...contentStyle // 外部传入的 style 优先级最高
    };

    return (
      <div className={finalClassName} style={finalStyle}>
        {content}
      </div>
    );
  };

  return (
    <div
      className={classNames(
        'zjpcy-tabs',
        `zjpcy-tabs--${tabPlacement}`,
        `zjpcy-tabs--${type}`,
        className
      )}
      style={style}
    >
      {tabPlacement === 'bottom' ? (
        <>
          {renderContent()}
          {renderNav()}
        </>
      ) : (
        <>
          {renderNav()}
          {renderContent()}
        </>
      )}
    </div>
  );
};

export default Tabs;

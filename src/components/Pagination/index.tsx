import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '../Icon';
import './Pagination.css';
import type { PaginationProps } from './types';

// 内联自定义选择器组件
interface PageSizeSelectProps {
  value: number;
  options: (string | number)[];
  onChange: (value: number) => void;
}

const PageSizeSelect: React.FC<PageSizeSelectProps> = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  // 计算下拉菜单位置 - 居中显示在触发器下方
  const updateDropdownPosition = useCallback(() => {
    if (!selectRef.current) return;

    const rect = selectRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownWidth = dropdownRef.current?.offsetWidth || 120;
    const dropdownHeight = dropdownRef.current?.offsetHeight || 200;

    // 计算居中位置
    const centerLeft = rect.left + rect.width / 2;
    const dropdownLeft = centerLeft - dropdownWidth / 2 + window.scrollX;

    // 计算下方空间是否足够
    const spaceBelow = viewportHeight - rect.bottom;
    const showBelow = spaceBelow >= dropdownHeight || spaceBelow >= rect.top;

    if (showBelow) {
      // 显示在触发器下方居中
      setDropdownStyle({
        top: rect.bottom + window.scrollY + 6,
        left: dropdownLeft,
        width: 'auto',
        minWidth: Math.max(dropdownWidth, 120),
      });
    } else {
      // 显示在上方居中
      setDropdownStyle({
        top: rect.top + window.scrollY - dropdownHeight - 6,
        left: dropdownLeft,
        width: 'auto',
        minWidth: Math.max(dropdownWidth, 120),
      });
    }
  }, []);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 窗口大小改变或滚动时更新位置
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      const handleUpdate = () => updateDropdownPosition();
      window.addEventListener('resize', handleUpdate);
      window.addEventListener('scroll', handleUpdate, true);
      return () => {
        window.removeEventListener('resize', handleUpdate);
        window.removeEventListener('scroll', handleUpdate, true);
      };
    }
  }, [isOpen, updateDropdownPosition]);

  const handleSelect = (optionValue: number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // 打开时更新位置
      setTimeout(updateDropdownPosition, 0);
    }
  };

  return (
    <div className="idp-page-size-select" ref={selectRef}>
      <div
        className={`idp-page-size-select-trigger ${isOpen ? 'is-open' : ''}`}
        onClick={handleToggle}
      >
        <span className="idp-page-size-select-value">{value} 条/页</span>
        <svg
          className="idp-page-size-select-arrow"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M6 8L1 3h10z" fill="currentColor" />
        </svg>
      </div>
      {isOpen && (
        <div className={`idp-page-size-select-dropdown is-open`} ref={dropdownRef} style={dropdownStyle}>
          {options.map((option) => {
            const numValue = typeof option === 'number' ? option : parseInt(option, 10);
            return (
              <div
                key={option}
                className={`idp-page-size-select-option ${value === numValue ? 'is-selected' : ''}`}
                onClick={() => handleSelect(numValue)}
              >
                {option} 条/页
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Pagination: React.FC<PaginationProps> = ({
  total = 0,
  current: externalCurrent,
  pageSize: externalPageSize = 10,
  onChange,
  pageSizeOptions = ['10', '20', '50', '100'],
  showSizeChanger = false,
  showQuickJumper = false,
  showTotal,
  size = 'default',
  align,
  className = '',
  style
}) => {
  // 内部状态管理
  const [internalCurrent, setInternalCurrent] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(externalPageSize);
  // 用于标记是否是初始渲染
  const isFirstRender = useRef(true);

  // 使用外部传入的值或内部状态
  const current = externalCurrent !== undefined ? externalCurrent : internalCurrent;
  const pageSize = externalPageSize !== undefined ? externalPageSize : internalPageSize;

  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);

  // 使用 ref 存储 onChange，避免依赖变化导致重复触发
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // 当 externalPageSize 变化时，同步更新 internalPageSize
  useEffect(() => {
    if (externalPageSize !== undefined) {
      setInternalPageSize(externalPageSize);
    }
  }, [externalPageSize]);

  // 当 externalCurrent 变化时，同步更新 internalCurrent
  useEffect(() => {
    if (externalCurrent !== undefined) {
      setInternalCurrent(externalCurrent);
    }
  }, [externalCurrent]);

  // 确保当前页在有效范围内（只在真正的页码超出范围时触发 onChange，初始渲染不触发）
  useEffect(() => {
    // 跳过初始渲染
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (current > totalPages && totalPages > 0) {
      const newCurrent = totalPages;
      if (externalCurrent === undefined) {
        setInternalCurrent(newCurrent);
      }
      // 使用 ref 中的 onChange，避免依赖变化
      if (onChangeRef.current) {
        onChangeRef.current(newCurrent, pageSize);
      }
    }
  }, [current, totalPages, externalCurrent, pageSize]);

  // 生成页码数组
  const generatePages = (): (number | string)[] => {
    if (totalPages <= 7) {
      // 如果总页数小于等于7，直接显示所有页码
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    // 第一页始终显示
    pages.push(1);

    if (current <= 4) {
      // 当前页靠近开头
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (current >= totalPages - 3) {
      // 当前页靠近结尾
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages - 1; i++) {
        pages.push(i);
      }
      pages.push(totalPages);
    } else {
      // 当前页在中间
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  // 处理页码变化
  const handlePageChange = (page: number) => {
    if (page === current || page < 1 || page > totalPages) return;

    if (externalCurrent === undefined) {
      setInternalCurrent(page);
    }

    if (onChange) {
      onChange(page, pageSize);
    }
  };

  // 处理上一页
  const handlePrev = () => {
    if (current > 1) {
      handlePageChange(current - 1);
    }
  };

  // 处理下一页
  const handleNext = () => {
    if (current < totalPages) {
      handlePageChange(current + 1);
    }
  };

  // 处理每页条数变化
  const handlePageSizeChange = (value: any) => {
    const newPageSize = parseInt(value, 10);
    if (externalPageSize === undefined) {
      setInternalPageSize(newPageSize);
    }

    // 重新计算当前页
    const newCurrent = 1; // 切换每页条数时回到第一页
    if (externalCurrent === undefined) {
      setInternalCurrent(newCurrent);
    }

    if (onChange) {
      onChange(newCurrent, newPageSize);
    }
  };

  // 处理快速跳转
  const handleQuickJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.target as HTMLInputElement;
      const page = parseInt(input.value, 10);

      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        handlePageChange(page);
        input.value = ''; // 清空输入框
      }
    }
  };

  // 计算当前页显示的数据范围
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);

  const alignClass = align === 'center' ? 'align-center' : align === 'flex-end' ? 'align-right' : '';
  return (
    <div className={`idp-pagination ${size === 'small' ? 'mini' : ''} ${alignClass} ${className}`} style={style}>
      {showTotal && (
        <div className="idp-pagination-total-text">
          {showTotal(total, [startItem, endItem])}
        </div>
      )}

      <ul className="idp-pagination-list">
        <li
          className={`idp-pagination-prev ${current <= 1 ? 'idp-pagination-prev-disabled' : ''}`}
          onClick={() => handlePrev()}
        >
          <Icon type="arrowLeft" />
        </li>

        {generatePages().map((page, index) => (
          <li
            key={index}
            className={
              typeof page === 'number'
                ? `idp-pagination-item ${page === current
                  ? 'idp-pagination-item-active'
                  : ''
                }`
                : 'idp-pagination-ellipsis'
            }
            onClick={() => typeof page === 'number' && handlePageChange(page)}
          >
            {page}
          </li>
        ))}

        <li
          className={`idp-pagination-next ${current >= totalPages ? 'idp-pagination-next-disabled' : ''}`}
          onClick={() => handleNext()}>
          <Icon type="arrowRight" />
        </li>
      </ul>

      {(showSizeChanger || showQuickJumper) && (
        <div className="idp-pagination-options">
          {showSizeChanger && (
            <PageSizeSelect
              value={pageSize}
              options={pageSizeOptions}
              onChange={(value) => handlePageSizeChange(value.toString())}
            />
          )}

          {showQuickJumper && (
            <div className="idp-pagination-options-quick-jumper">
              <div style={{ minWidth: '30px' }}>跳至</div>
              <input
                type="text"
                onKeyPress={handleQuickJump}
                placeholder="页码"
              />
              页
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Pagination;
import classNames from 'classnames';
import type { CSSProperties } from 'react';
import { UploadStyles, UploadFile } from './types';

// ============================================
// 上传容器
// ============================================

/**
 * 获取 Upload 容器类名
 */
export const getUploadClassName = (options: {
    disabled?: boolean;
    className?: string;
}): string => {
    const { disabled, className } = options;
    return classNames(
        'zjpcy-upload',
        {
            'zjpcy-upload--disabled': disabled,
        },
        className
    );
};

/**
 * 获取 Upload 容器样式
 */
export const getUploadStyle = (options: {
    style?: CSSProperties;
    customStyles?: UploadStyles['wrapper'];
}): CSSProperties => {
    const { style, customStyles } = options;
    return {
        ...style,
        ...customStyles,
    };
};

// ============================================
// 上传输入框
// ============================================

/**
 * 获取 Input 类名
 */
export const getInputClassName = (): string => {
    return 'zjpcy-upload__input';
};

// ============================================
// 上传触发器
// ============================================

/**
 * 获取 Trigger 类名
 */
export const getTriggerClassName = (): string => {
    return 'zjpcy-upload__trigger';
};

// ============================================
// 拖拽上传区域
// ============================================

/**
 * 获取 DragArea 类名
 */
export const getDragAreaClassName = (options: {
    isDragOver?: boolean;
    disabled?: boolean;
    className?: string;
}): string => {
    const { isDragOver, disabled, className } = options;
    return classNames(
        'zjpcy-upload__drag',
        {
            'zjpcy-upload__drag-over': isDragOver,
            'zjpcy-upload__drag-disabled': disabled,
        },
        className
    );
};

/**
 * 获取 DragArea 样式
 */
export const getDragAreaStyle = (options: {
    customStyles?: UploadStyles['dragArea'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 拖拽图标
// ============================================

/**
 * 获取 DragIcon 类名
 */
export const getDragIconClassName = (): string => {
    return 'zjpcy-upload__drag-icon';
};

/**
 * 获取 DragIcon 样式
 */
export const getDragIconStyle = (options: {
    customStyles?: UploadStyles['dragIcon'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 拖拽文本
// ============================================

/**
 * 获取 DragText 类名
 */
export const getDragTextClassName = (): string => {
    return 'zjpcy-upload__drag-text';
};

/**
 * 获取 DragText 样式
 */
export const getDragTextStyle = (options: {
    customStyles?: UploadStyles['dragText'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 拖拽提示
// ============================================

/**
 * 获取 DragHint 类名
 */
export const getDragHintClassName = (): string => {
    return 'zjpcy-upload__drag-hint';
};

/**
 * 获取 DragHint 样式
 */
export const getDragHintStyle = (options: {
    customStyles?: UploadStyles['dragHint'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 文件列表容器
// ============================================

/**
 * 获取 List 类名
 */
export const getListClassName = (): string => {
    return 'zjpcy-upload__list';
};

/**
 * 获取 List 样式
 */
export const getListStyle = (options: {
    customStyles?: UploadStyles['list'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 文件列表项
// ============================================

/**
 * 获取 ListItem 类名
 */
export const getListItemClassName = (options: {
    status?: UploadFile['status'];
    className?: string;
}): string => {
    const { status, className } = options;
    return classNames(
        'zjpcy-upload__list-item',
        {
            'zjpcy-upload__list-item-error': status === 'error',
            'zjpcy-upload__list-item-success': status === 'success',
        },
        className
    );
};

/**
 * 获取 ListItem 样式
 */
export const getListItemStyle = (options: {
    customStyles?: UploadStyles['listItem'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 文件信息区域
// ============================================

/**
 * 获取 ListItemInfo 类名
 */
export const getListItemInfoClassName = (): string => {
    return 'zjpcy-upload__list-item-info';
};

/**
 * 获取 ListItemInfo 样式
 */
export const getListItemInfoStyle = (options: {
    customStyles?: UploadStyles['listItemInfo'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 文件图标
// ============================================

/**
 * 获取 ListItemIcon 类名
 */
export const getListItemIconClassName = (): string => {
    return 'zjpcy-upload__list-item-icon';
};

/**
 * 获取 ListItemIcon 样式
 */
export const getListItemIconStyle = (options: {
    customStyles?: UploadStyles['listItemIcon'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 文件名
// ============================================

/**
 * 获取 ListItemName 类名
 */
export const getListItemNameClassName = (): string => {
    return 'zjpcy-upload__list-item-name';
};

/**
 * 获取 ListItemName 样式
 */
export const getListItemNameStyle = (options: {
    customStyles?: UploadStyles['listItemName'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 文件操作区域
// ============================================

/**
 * 获取 ListItemActions 类名
 */
export const getListItemActionsClassName = (): string => {
    return 'zjpcy-upload__list-item-actions';
};

/**
 * 获取 ListItemActions 样式
 */
export const getListItemActionsStyle = (options: {
    customStyles?: UploadStyles['listItemActions'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 文件操作按钮
// ============================================

/**
 * 获取 ListItemAction 类名
 */
export const getListItemActionClassName = (): string => {
    return 'zjpcy-upload__list-item-action';
};

/**
 * 获取 ListItemAction 样式
 */
export const getListItemActionStyle = (options: {
    customStyles?: UploadStyles['listItemAction'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

// ============================================
// 进度条容器
// ============================================

/**
 * 获取 ProgressWrapper 类名
 */
export const getProgressWrapperClassName = (options: {
    visible?: boolean;
    className?: string;
}): string => {
    const { visible, className } = options;
    return classNames(
        'zjpcy-upload__progress-wrapper',
        {
            'zjpcy-upload__progress-wrapper-visible': visible,
        },
        className
    );
};

/**
 * 获取 ProgressWrapper 样式
 */
export const getProgressWrapperStyle = (options: {
    customStyles?: UploadStyles['progress'];
}): CSSProperties => {
    const { customStyles } = options;
    return {
        ...customStyles,
    };
};

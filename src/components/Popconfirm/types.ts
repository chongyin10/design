import { ReactNode } from 'react';

export type PopconfirmPlacement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';

export type PopconfirmType = 'info' | 'success' | 'warning' | 'error' | 'danger';

export interface PopconfirmProps {
  title?: ReactNode;
  description?: ReactNode;
  okText?: string;
  cancelText?: string;
  okButtonProps?: {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'link';
    loading?: boolean;
    disabled?: boolean;
  };
  cancelButtonProps?: {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'link';
    disabled?: boolean;
  };
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  type?: PopconfirmType;
  placement?: PopconfirmPlacement;
  showCancel?: boolean;
  getContainer?: HTMLElement | (() => HTMLElement) | false;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactElement;
}

export default PopconfirmProps;

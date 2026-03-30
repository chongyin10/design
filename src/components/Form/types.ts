import { CSSProperties, ReactNode, MutableRefObject } from 'react';

export interface FormProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelSpan?: number;
  wrapperSpan?: number;
  initialValues?: Record<string, any>;
  onFinish?: (values: Record<string, any>) => void;
  onFinishFailed?: (errorInfo: any) => void;
  colon?: boolean;
  requiredMark?: boolean | 'optional';
  styles?: {
    wrapper?: CSSProperties;
    item?: CSSProperties;
    label?: CSSProperties;
  };
  formRef?: MutableRefObject<FormInstance | null>;
  form?: FormInstance;
}

export interface FormItemProps {
  name?: string;
  label?: ReactNode;
  required?: boolean;
  rules?: Rule[];
  className?: string;
  style?: CSSProperties;
  help?: ReactNode;
  validateStatus?: 'success' | 'warning' | 'error' | 'validating';
  colon?: boolean;
  labelSpan?: number;
  wrapperSpan?: number;
  hidden?: boolean;
  noStyle?: boolean;
  tooltip?: ReactNode;
  extra?: ReactNode;
  styles?: {
    wrapper?: CSSProperties;
    label?: CSSProperties;
    input?: CSSProperties;
    error?: CSSProperties;
    help?: CSSProperties;
  };
  children?: ReactNode;
}

export interface Rule {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  min?: number;
  max?: number;
  len?: number;
  type?: 'string' | 'number' | 'boolean' | 'method' | 'regexp' | 'integer' | 'float' | 'array' | 'object' | 'enum' | 'date' | 'url' | 'hex' | 'email';
  validator?: (rule: Rule, value: any) => Promise<void> | void;
  whitespace?: boolean;
  enum?: any[];
}

export interface FormContextType {
  layout: 'horizontal' | 'vertical' | 'inline';
  labelSpan?: number;
  wrapperSpan?: number;
  colon: boolean;
  requiredMark: boolean | 'optional';
  values: Record<string, any>;
  errors: Record<string, string>;
  setFieldValue: (name: string, value: any) => void;
  getFieldValue: (name: string) => any;
  setFieldValueList: (values: Record<string, any>) => void;
  validateField: (name: string) => Promise<void>;
  validateFields: (names?: string[]) => Promise<Record<string, any>>;
  resetFields: (names?: string[]) => void;
  registerItem?: (name: string, item: any) => () => void;
}

export interface FormInstance {
  getFieldValue: (name: string) => any;
  getFieldsValue: (names?: string[]) => Record<string, any>;
  setFieldValue: (name: string, value: any) => void;
  setFieldsValue: (values: Record<string, any>) => void;
  setFields: (fields: { name: string; errors?: string[]; value?: any }[]) => void;
  resetFields: (names?: string[]) => void;
  validateFields: (names?: string[]) => Promise<Record<string, any>>;
  submit: () => void;
  destroy: () => void;
}

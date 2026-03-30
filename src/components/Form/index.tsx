'use client';

import React, { useState, useContext, createContext, useCallback, useRef, useEffect, useMemo } from 'react';
import { FormProps, FormItemProps, FormContextType, FormInstance, Rule } from './types';
import {
    getFormWrapperClassName,
    getFormWrapperStyle,
    getFormItemWrapperClassName,
    getFormItemWrapperStyle,
    getFormLabelClassName,
    getFormLabelStyle,
    getFormControlClassName,
    getFormControlStyle,
    getFormErrorClassName,
    getFormErrorStyle,
    getFormHelpClassName,
    getFormHelpStyle,
} from './styles';
import classNames from 'classnames';
import './Form.css';

const FormContext = createContext<FormContextType | null>(null);

export const useForm = (): [FormInstance] => {
  const formInstanceRef = useRef<FormInstance | null>(null);
  // 在 Form 未挂载时暂存通过 setFieldsValue/setFieldValue 设置的值
  const pendingValuesRef = useRef<Record<string, any>>({});

  if (!formInstanceRef.current) {
    const instance: FormInstance & { _pendingValues?: Record<string, any> } = {
      getFieldValue: () => undefined,
      getFieldsValue: () => ({}),
      setFieldValue: (name: string, value: any) => {
        pendingValuesRef.current[name] = value;
      },
      setFieldsValue: (newValues: Record<string, any>) => {
        Object.assign(pendingValuesRef.current, newValues);
      },
      setFields: () => {},
      resetFields: () => {
        pendingValuesRef.current = {};
      },
      validateFields: () => Promise.reject(new Error('Form instance not initialized')),
      submit: () => {},
      destroy: () => {
        pendingValuesRef.current = {};
      }
    };
    // 将 pendingValues 挂载到实例上，供 Form 挂载时消费
    Object.defineProperty(instance, '_pendingValues', {
      get: () => pendingValuesRef.current,
      set: (v: Record<string, any>) => { pendingValuesRef.current = v; },
      enumerable: false,
      configurable: true,
    });
    formInstanceRef.current = instance as FormInstance;
  }

  return [formInstanceRef.current];
};

const Form: React.FC<FormProps> & { Item: typeof FormItem; useForm: typeof useForm } = ({
  children,
  className = '',
  style,
  layout = 'horizontal',
  labelSpan,
  wrapperSpan,
  initialValues = {},
  onFinish,
  onFinishFailed,
  colon = true,
  requiredMark = true,
  styles,
  formRef,
  form: externalForm
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRefElement = useRef<HTMLFormElement>(null);
  const itemsRef = useRef<Map<string, any>>(new Map());
  const formInstanceRef = useRef<FormInstance | null>(null);

  // 使用 ref 存储最新的 values 和 errors，避免闭包问题
  const valuesRef = useRef<Record<string, any>>(initialValues);
  const errorsRef = useRef<Record<string, string>>({});

  // 同步 values 到 ref
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  // 同步 errors 到 ref
  useEffect(() => {
    errorsRef.current = errors;
  }, [errors]);

  // 使用 ref 存储最新的方法引用，避免 useMemo 缓存导致 remount 后引用旧实例
  const methodsRef = useRef<{
    getFieldValue: (name: string) => any;
    setFieldValue: (name: string, value: any) => void;
    setFieldValueList: (newValues: Record<string, any>) => void;
    validateField: (name: string) => Promise<string | null>;
    validateFields: (names?: string[]) => Promise<Record<string, any>>;
    resetFields: (names?: string[]) => void;
  } | null>(null);

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // 直接更新 ref，确保立即生效
    valuesRef.current = { ...valuesRef.current, [name]: value };
    if (errorsRef.current[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      delete errorsRef.current[name];
    }
  }, []);

  const getFieldValue = useCallback((name: string) => {
    return valuesRef.current[name];
  }, []);

  const setFieldValueList = useCallback((newValues: Record<string, any>) => {
    if (Object.keys(newValues).length === 0) {
      return;
    }

    setValues(prev => ({ ...prev, ...newValues }));
    // 直接更新 ref，确保立即生效
    valuesRef.current = { ...valuesRef.current, ...newValues };

    Object.keys(newValues).forEach(name => {
      if (errorsRef.current[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        delete errorsRef.current[name];
      }
    });
  }, []);

  const validateField = useCallback(async (name: string) => {
    const item = itemsRef.current.get(name);
    if (!item) return null;

    const { rules } = item;
    const value = valuesRef.current[name];
    if (!rules || rules.length === 0) return null;

    for (const rule of rules) {
      if (rule.required && (value === undefined || value === null || value === '')) {
        const errorMessage = rule.message || `${name} is required`;
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
        errorsRef.current = { ...errorsRef.current, [name]: errorMessage };
        return errorMessage;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        const errorMessage = rule.message || `${name} format is invalid`;
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
        errorsRef.current = { ...errorsRef.current, [name]: errorMessage };
        return errorMessage;
      }

      if (rule.type) {
        let isValid = true;
        switch (rule.type) {
          case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            break;
          case 'url':
            isValid = /^https?:\/\/.+$/.test(value);
            break;
          case 'number':
            isValid = !isNaN(Number(value));
            break;
          case 'integer':
            isValid = Number.isInteger(Number(value));
            break;
          case 'float':
            isValid = !isNaN(parseFloat(value)) && isFinite(value);
            break;
          case 'string':
            isValid = typeof value === 'string';
            break;
          case 'boolean':
            isValid = typeof value === 'boolean';
            break;
          case 'array':
            isValid = Array.isArray(value);
            break;
          case 'object':
            isValid = typeof value === 'object' && value !== null && !Array.isArray(value);
            break;
        }
        if (!isValid) {
          const errorMessage = rule.message || `${name} must be a ${rule.type}`;
          setErrors(prev => ({ ...prev, [name]: errorMessage }));
          errorsRef.current = { ...errorsRef.current, [name]: errorMessage };
          return errorMessage;
        }
      }

      if (rule.min !== undefined && value.length < rule.min) {
        const errorMessage = rule.message || `${name} must be at least ${rule.min} characters`;
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
        errorsRef.current = { ...errorsRef.current, [name]: errorMessage };
        return errorMessage;
      }

      if (rule.max !== undefined && value.length > rule.max) {
        const errorMessage = rule.message || `${name} must be at most ${rule.max} characters`;
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
        errorsRef.current = { ...errorsRef.current, [name]: errorMessage };
        return errorMessage;
      }

      if (rule.len !== undefined && value.length !== rule.len) {
        const errorMessage = rule.message || `${name} must be exactly ${rule.len} characters`;
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
        errorsRef.current = { ...errorsRef.current, [name]: errorMessage };
        return errorMessage;
      }

      if (rule.validator) {
        try {
          await rule.validator(rule, value);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : rule.message || `${name} validation failed`;
          setErrors(prev => ({ ...prev, [name]: errorMessage }));
          errorsRef.current = { ...errorsRef.current, [name]: errorMessage };
          return errorMessage;
        }
      }
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    delete errorsRef.current[name];
    return null;
  }, []);

  const validateFields = useCallback(async (names?: string[]): Promise<Record<string, any>> => {
    const fieldNames = names || Array.from(itemsRef.current.keys());
    const errorResults = await Promise.all(fieldNames.map(name => validateField(name)));
    const hasError = errorResults.some(error => error !== null);

    if (hasError) {
      // 收集所有错误信息，抛出包含详细错误信息的对象
      const errorFields: { name: string; errors: string[] }[] = [];
      fieldNames.forEach((name, index) => {
        if (errorResults[index] !== null) {
          errorFields.push({ name, errors: [errorResults[index]!] });
        }
      });
      // 构建详细的错误消息
      const errorDetails = errorFields.map(f => `${f.name}: ${f.errors.join(', ')}`).join('; ');
      const error: any = new Error(`Validation failed: ${errorDetails}`);
      error.errorFields = errorFields;
      error.values = { ...valuesRef.current };
      throw error;
    }

    return { ...valuesRef.current };
  }, [validateField]);

  const resetFields = useCallback((names?: string[]) => {
    // 只重置已注册的表单项
    const registeredNames = names?.filter(name => itemsRef.current.has(name)) ||
                            Array.from(itemsRef.current.keys());

    if (registeredNames.length > 0) {
      const newValues = { ...valuesRef.current };
      registeredNames.forEach(name => {
        newValues[name] = initialValues[name] !== undefined ? initialValues[name] : undefined;
      });
      setValues(newValues);
      valuesRef.current = newValues;
    }
    setErrors({});
    errorsRef.current = {};
  }, [initialValues]);

  // 使用 useMemo 避免每次渲染重新创建 formInstance
  const formInstance: FormInstance = useMemo(() => ({
    getFieldValue,
    getFieldsValue: (names?: string[]) => {
      // 只返回已注册的表单项的值，使用 ref 获取最新值
      const registeredNames = names?.filter(name => itemsRef.current.has(name)) ||
                              Array.from(itemsRef.current.keys());
      const result: Record<string, any> = {};
      registeredNames.forEach(name => {
        result[name] = valuesRef.current[name];
      });
      return result;
    },
    setFieldValue,
    setFieldsValue: setFieldValueList,
    setFields: (fields: { name: string; errors?: string[]; value?: any }[]) => {
      const newValues = { ...valuesRef.current };
      const newErrors = { ...errorsRef.current };

      fields.forEach(field => {
        if (field.value !== undefined) {
          newValues[field.name] = field.value;
        }
        if (field.errors && field.errors.length > 0) {
          newErrors[field.name] = field.errors[0];
        } else {
          delete newErrors[field.name];
        }
      });

      setValues(newValues);
      setErrors(newErrors);
      valuesRef.current = newValues;
      errorsRef.current = newErrors;
    },
    resetFields,
    validateFields,
    submit: () => {
      validateFields().then(() => {
        const formElement = formRefElement.current;
        if (formElement) {
          formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      });
    },
    destroy: () => {
      setValues({});
      setErrors({});
      valuesRef.current = {};
      errorsRef.current = {};
      itemsRef.current.clear();
      formInstanceRef.current = null;
    }
  }), [getFieldValue, setFieldValue, setFieldValueList, resetFields, validateFields]);

  // 同步 formInstance 到 externalForm，确保 remount 后也能正确连接
  // 同时更新 methodsRef 供外部使用最新方法
  methodsRef.current = {
    getFieldValue: formInstance.getFieldValue,
    setFieldValue: formInstance.setFieldValue,
    setFieldValueList: formInstance.setFieldsValue,
    validateField: validateField,
    validateFields: formInstance.validateFields,
    resetFields: formInstance.resetFields,
  };

  if (externalForm) {
    externalForm.getFieldValue = formInstance.getFieldValue;
    externalForm.getFieldsValue = formInstance.getFieldsValue;
    externalForm.setFieldValue = formInstance.setFieldValue;
    externalForm.setFieldsValue = formInstance.setFieldsValue;
    externalForm.setFields = formInstance.setFields;
    externalForm.resetFields = formInstance.resetFields;
    externalForm.validateFields = formInstance.validateFields;
    externalForm.submit = formInstance.submit;
    externalForm.destroy = formInstance.destroy;
  }

  // Form 挂载时，消费 useForm stub 暂存的 pending values
  useEffect(() => {
    formInstanceRef.current = formInstance;
    if (formRef) {
      formRef.current = formInstance;
    }
    // 消费 useForm stub 存储的待处理值
    if (externalForm && (externalForm as any)._pendingValues) {
      const pending = (externalForm as any)._pendingValues as Record<string, any>;
      if (Object.keys(pending).length > 0) {
        (externalForm as any)._pendingValues = {};
        const merged = { ...valuesRef.current, ...pending };
        setValues(merged);
        valuesRef.current = merged;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await validateFields();
      onFinish?.(valuesRef.current);
    } catch (error) {
      onFinishFailed?.({ error, values: valuesRef.current });
    }
  };

  const registerItem = useCallback((name: string, item: any) => {
    itemsRef.current.set(name, item);
    return () => {
      itemsRef.current.delete(name);
    };
  }, []);

  const contextValue: FormContextType = {
    layout,
    labelSpan,
    wrapperSpan,
    colon,
    requiredMark,
    values,
    errors,
    setFieldValue,
    getFieldValue,
    setFieldValueList,
    validateField,
    validateFields,
    resetFields,
    registerItem
  };

  const formWrapperClassName = getFormWrapperClassName({ className });
  const formWrapperStyle = getFormWrapperStyle({ style, customStyles: styles?.wrapper });

  return (
    <FormContext.Provider value={contextValue}>
      <form
        ref={formRefElement}
        className={formWrapperClassName}
        style={formWrapperStyle}
        onSubmit={handleSubmit}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

// 根据字段名推断 autoComplete 值
const getAutoCompleteValue = (name: string | undefined): string | undefined => {
  if (!name) return undefined;

  const autoCompleteMap: Record<string, string> = {
    username: 'username',
    email: 'email',
    password: 'current-password',
    'new-password': 'new-password',
    'current-password': 'current-password',
    name: 'name',
    'given-name': 'given-name',
    'family-name': 'family-name',
    tel: 'tel',
    'phone': 'tel',
    address: 'street-address',
    city: 'address-level2',
    country: 'country-name',
    zipcode: 'postal-code',
    'postal-code': 'postal-code',
    organization: 'organization',
    company: 'organization',
  };

  const lowerName = name.toLowerCase();
  return autoCompleteMap[lowerName];
};

// 已知的布局/容器组件，遇到时应跳过并递归查找子级
const LAYOUT_COMPONENT_NAMES = ['Space', 'Flex', 'Row', 'Col', 'Grid', 'Grid.Row', 'Grid.Col'];

// 递归注入表单属性到子组件
// 跳过布局组件（如 Space、Flex），继续向下查找输入组件
const injectFormPropsToChildren = (
  children: React.ReactNode,
  formProps: {
    value: any;
    onChange: (value: any) => void;
    error: boolean;
    name?: string;
  }
): React.ReactNode => {
  return React.Children.map(children, (child) => {
    // 非元素子节点（文本、数字等）原样保留
    if (!React.isValidElement(child)) {
      return child;
    }

    const childProps = child.props as any;
    const childType = child.type as any;
    const displayName = childType?.displayName || childType?.name || '';

      // 原生输入元素（字符串标签名）
      if (['input', 'textarea', 'select'].includes(childType)) {
        const autoCompleteValue = childProps.autoComplete || getAutoCompleteValue(formProps.name);
        return React.cloneElement(child, {
          value: formProps.value,
          onChange: (e: any) => {
            const value = e?.target?.value !== undefined ? e.target.value : e;
            formProps.onChange(value);
            childProps.onChange?.(e);
          },
          error: formProps.error || undefined,
          autoComplete: autoCompleteValue
        } as any);
      }

      // 检查是否是布局组件，如果是则只递归处理 children
      const isLayoutComponent = LAYOUT_COMPONENT_NAMES.some(name => displayName === name);

      if (isLayoutComponent && childProps.children) {
        const newChildren = injectFormPropsToChildren(childProps.children, formProps);
        return React.cloneElement(child, { children: newChildren } as any);
      }

      // 检查是否是输入组件
      const isInputComponent =
        // 常见的输入组件类型（displayName 或 name）
        ['Input', 'InputBase', 'InputNumber', 'NumberInput', 'Input.Number', 'Select', 'DatePicker',
          'Checkbox', 'Radio', 'Switch', 'Textarea', 'TextArea', 'Input.Textarea', 'Password', 'Input.Password',
          'Search', 'Input.Search'].includes(displayName) ||
        // 组件 props 中有 onChange 签名的（排除已知的布局/容器组件）
        (!isLayoutComponent && typeof childProps.onChange === 'function');

      if (isInputComponent) {
        const autoCompleteValue = childProps.autoComplete || getAutoCompleteValue(formProps.name);

        return React.cloneElement(child, {
          value: formProps.value,
          onChange: (e: any) => {
            const value = e?.target?.value !== undefined ? e.target.value : e;
            formProps.onChange(value);
            childProps.onChange?.(e);
          },
          error: formProps.error || undefined,
          autoComplete: autoCompleteValue
        } as any);
      }

      // 如果有 children，递归处理
      if (childProps.children) {
        return React.cloneElement(child, { children: injectFormPropsToChildren(childProps.children, formProps) } as any);
      }

      // 其他组件原样返回
      return child;
    }
  );
};

const FormItem: React.FC<FormItemProps & { registerItem?: (name: string, item: any) => () => void }> = ({
  name,
  label,
  required,
  rules = [],
  className = '',
  style,
  help,
  validateStatus,
  colon,
  labelSpan: itemLabelSpan,
  wrapperSpan: itemWrapperSpan,
  hidden = false,
  noStyle = false,
  extra,
  styles,
  registerItem,
  children
}) => {
  const context = useContext(FormContext);
  // 使用 ref 存储最新值，避免闭包问题
  const localValueRef = useRef<any>('');
  const [localValue, setLocalValue] = useState<any>('');

  // 同步 localValue 到 ref
  useEffect(() => {
    localValueRef.current = localValue;
  }, [localValue]);

  // 优先使用 prop 传入的 registerItem，否则从 context 获取
  const effectiveRegisterItem = registerItem || context?.registerItem;

  // 立即注册表单项
  if (effectiveRegisterItem && name) {
    effectiveRegisterItem(name, { rules });
  }

  // 从 context 同步值到 localValue
  useEffect(() => {
    if (context && name) {
      const val = context.values[name];
      const newValue = val !== undefined && val !== null ? val : '';
      // 只有当值真正变化时才更新，避免无限循环
      if (localValueRef.current !== newValue) {
        setLocalValue(newValue);
      }
    }
  }, [context, name, context?.values]);

  const handleChange = (value: any) => {
    setLocalValue(value);
    if (name) {
      context?.setFieldValue(name, value);
    }
  };

  const isRequired = required || rules.some(rule => rule.required);
  const error = (context && name ? context.errors[name] : '');
  const hasError = !!error || validateStatus === 'error';

  const currentLabelSpan = itemLabelSpan !== undefined ? itemLabelSpan : context?.labelSpan;
  const currentWrapperSpan = itemWrapperSpan !== undefined ? itemWrapperSpan : context?.wrapperSpan;

  const labelWidth = currentLabelSpan ? (currentLabelSpan / 24) * 100 : undefined;

  let controlWidth = undefined;
  if (currentLabelSpan !== undefined) {
    const maxWrapperSpan = 24 - currentLabelSpan;
    let actualWrapperSpan = currentWrapperSpan !== undefined ? currentWrapperSpan : maxWrapperSpan;

    if (actualWrapperSpan > maxWrapperSpan) {
      actualWrapperSpan = maxWrapperSpan;
    }
    if (actualWrapperSpan < 1) {
      actualWrapperSpan = 1;
    }

    controlWidth = (actualWrapperSpan / 24) * 100;
  }

  if (hidden) return null;

  // noStyle 模式：只传递表单值和事件，不渲染包裹结构
  if (noStyle) {
    return (
      <>
        {injectFormPropsToChildren(children, {
          value: localValue,
          onChange: handleChange,
          error: hasError,
          name
        })}
      </>
    );
  }

  const itemWrapperClassName = getFormItemWrapperClassName({
    layout: context?.layout || 'horizontal',
    className,
  });
  const itemWrapperStyle = getFormItemWrapperStyle({ style, customStyles: styles?.wrapper });

  const labelClassName = getFormLabelClassName({ required: isRequired });
  const labelStyle = getFormLabelStyle({
    labelAlign: context?.layout === 'vertical' ? 'start' : 'end',
    labelWidth,
    style: undefined,
    customStyles: styles?.label,
  });

  const controlClassName = getFormControlClassName({});
  const controlStyle = getFormControlStyle({
    controlWidth,
    style: undefined,
    customStyles: styles?.input,
  });

  const errorClassName = getFormErrorClassName({ visible: hasError });
  const errorStyle = getFormErrorStyle({ style: undefined, customStyles: styles?.error });

  const helpClassName = getFormHelpClassName({});
  const helpStyle = getFormHelpStyle({ style: undefined, customStyles: styles?.help });

  const showColon = colon !== undefined ? colon : context?.colon;

  return (
    <div
      className={itemWrapperClassName}
      style={itemWrapperStyle}
    >
      {label && (
        <label
          className={classNames(labelClassName, showColon && 'zjpcy-form-label--colon')}
          style={labelStyle}
        >
          {label}
        </label>
      )}
      <div
        className={controlClassName}
        style={controlStyle}
      >
        {injectFormPropsToChildren(children, {
          value: localValue,
          onChange: handleChange,
          error: hasError,
          name
        })}
        <div className={errorClassName} style={errorStyle}>
          {error || ''}
        </div>
        {help && !hasError && (
          <div className={helpClassName} style={helpStyle}>
            {help}
          </div>
        )}
        {extra && !hasError && (
          <div className={helpClassName} style={helpStyle}>
            {extra}
          </div>
        )}
      </div>
    </div>
  );
};

Form.Item = FormItem;
Form.useForm = useForm;

export default Form;
export type { FormProps, FormItemProps, Rule, FormContextType, FormInstance };

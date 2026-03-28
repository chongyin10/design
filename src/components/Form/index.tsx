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

  if (!formInstanceRef.current) {
    formInstanceRef.current = {
      getFieldValue: () => undefined,
      getFieldsValue: () => ({}),
      setFieldValue: () => {},
      setFieldsValue: () => {},
      setFields: () => {},
      resetFields: () => {},
      validateFields: () => Promise.reject(new Error('Form instance not initialized')),
      submit: () => {},
      destroy: () => {}
    };
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

  const setFieldValue = useCallback((name: string, value: any) => {
    // 只处理已注册的表单项
    if (!itemsRef.current.has(name)) {
      return;
    }
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
    // 只读取已注册的表单项，使用 ref 获取最新值
    if (!itemsRef.current.has(name)) {
      return undefined;
    }
    return valuesRef.current[name];
  }, []);

  const setFieldValueList = useCallback((newValues: Record<string, any>) => {
    // 只处理已注册的表单项
    const registeredValues: Record<string, any> = {};
    Object.keys(newValues).forEach(name => {
      if (itemsRef.current.has(name)) {
        registeredValues[name] = newValues[name];
      }
    });

    if (Object.keys(registeredValues).length === 0) {
      return;
    }

    setValues(prev => ({ ...prev, ...registeredValues }));
    // 直接更新 ref，确保立即生效
    valuesRef.current = { ...valuesRef.current, ...registeredValues };

    Object.keys(registeredValues).forEach(name => {
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
    if (!item) return;

    const { rules } = item;
    const value = valuesRef.current[name];
    if (!rules || rules.length === 0) return;

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
      throw new Error('Validation failed');
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
        // 只处理已注册的表单项
        if (!itemsRef.current.has(field.name)) {
          return;
        }
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
        const formElement = document.querySelector('form');
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

  useEffect(() => {
    formInstanceRef.current = formInstance;
    if (formRef) {
      formRef.current = formInstance;
    }
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
  }, [formInstance, formRef, externalForm]);

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
    resetFields
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
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === FormItem) {
            return React.cloneElement(child, { registerItem } as any);
          }
          return child;
        })}
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
  extra,
  styles,
  registerItem,
  children
}) => {
  const context = useContext(FormContext);
  // 初始化 localValue，确保 undefined/null 时使用空字符串
  const [localValue, setLocalValue] = useState<any>(() => {
    if (name && context?.values && name in context.values) {
      const val = context.values[name];
      return val !== undefined && val !== null ? val : '';
    }
    return '';
  });

  // 立即注册表单项
  if (registerItem && name) {
    registerItem(name, { rules });
  }

  useEffect(() => {
    if (context && name && context.values && name in context.values) {
      const val = context.values[name];
      // 当值变为 undefined/null 时，更新为空字符串，确保输入框能正确显示
      setLocalValue(val !== undefined && val !== null ? val : '');
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
        {React.Children.map(
          React.Children.toArray(children).filter(child => React.isValidElement(child)),
          (child: React.ReactElement) => {
            const childProps = child.props as any;
            // 自动推断 autoComplete 值，如果子组件未设置
            const autoCompleteValue = childProps.autoComplete || getAutoCompleteValue(name);

            return React.cloneElement(child, {
              value: localValue,
              onChange: (e: any) => {
                const value = e?.target?.value !== undefined ? e.target.value : e;
                handleChange(value);
                childProps.onChange?.(e);
              },
              error: hasError || undefined,
              autoComplete: autoCompleteValue
            } as any);
          }
        )}
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

'use client';

import React, { useState, useContext, createContext, useCallback, useRef, useEffect } from 'react';
import { FormProps, FormItemProps, FormContextType, FormInstance, Rule } from './types';
import { FormWrapper, FormItemWrapper, FormLabel, FormControl, FormError, FormHelp } from './styles';
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

const Form: React.FC<FormProps> & { Item: typeof FormItem } = ({
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

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const getFieldValue = useCallback((name: string) => {
    return values[name];
  }, [values]);

  const setFieldValueList = useCallback((newValues: Record<string, any>) => {
    setValues(prev => ({ ...prev, ...newValues }));
    Object.keys(newValues).forEach(name => {
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    });
  }, [errors]);

  const validateField = useCallback(async (name: string) => {
    const item = itemsRef.current.get(name);
    if (!item) return;

    const { rules } = item;
    const value = values[name];
    if (!rules || rules.length === 0) return;

    for (const rule of rules) {
      if (rule.required && (value === undefined || value === null || value === '')) {
        const errorMessage = rule.message || `${name} is required`;
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
        return errorMessage;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        const errorMessage = rule.message || `${name} format is invalid`;
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
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
          return errorMessage;
        }
      }

      if (rule.min !== undefined && value.length < rule.min) {
        const errorMessage = rule.message || `${name} must be at least ${rule.min} characters`;
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
        return errorMessage;
      }

      if (rule.max !== undefined && value.length > rule.max) {
        const errorMessage = rule.message || `${name} must be at most ${rule.max} characters`;
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
        return errorMessage;
      }

      if (rule.len !== undefined && value.length !== rule.len) {
        const errorMessage = rule.message || `${name} must be exactly ${rule.len} characters`;
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
        return errorMessage;
      }

      if (rule.validator) {
        try {
          await rule.validator(rule, value);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : rule.message || `${name} validation failed`;
          setErrors(prev => ({ ...prev, [name]: errorMessage }));
          return errorMessage;
        }
      }
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    return null;
  }, [values]);

  const validateFields = useCallback(async (names?: string[]): Promise<Record<string, any>> => {
    const fieldNames = names || Array.from(itemsRef.current.keys());
    const errorResults = await Promise.all(fieldNames.map(name => validateField(name)));
    const hasError = errorResults.some(error => error !== null);

    if (hasError) {
      throw new Error('Validation failed');
    }

    return values;
  }, [validateField, values]);

  const resetFields = useCallback((names?: string[]) => {
    if (names) {
      const newValues = { ...values };
      names.forEach(name => {
        newValues[name] = initialValues[name] || undefined;
      });
      setValues(newValues);
    } else {
      setValues(initialValues);
    }
    setErrors({});
  }, [values, initialValues]);

  const formInstance: FormInstance = {
    getFieldValue,
    getFieldsValue: (names?: string[]) => {
      if (!names) return values;
      const result: Record<string, any> = {};
      names.forEach(name => {
        result[name] = values[name];
      });
      return result;
    },
    setFieldValue,
    setFieldsValue: setFieldValueList,
    setFields: (fields: { name: string; errors?: string[]; value?: any }[]) => {
      const newValues = { ...values };
      const newErrors = { ...errors };
      
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
      itemsRef.current.clear();
      formInstanceRef.current = null;
    }
  };

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
      onFinish?.(values);
    } catch (error) {
      onFinishFailed?.({ error, values });
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

  return (
    <FormContext.Provider value={contextValue}>
      <FormWrapper
        ref={formRefElement}
        className={`form-wrapper ${className}`}
        style={style}
        $styles={styles?.wrapper}
        onSubmit={handleSubmit}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === FormItem) {
            return React.cloneElement(child, { registerItem } as any);
          }
          return child;
        })}
      </FormWrapper>
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
  const [localValue, setLocalValue] = useState<any>(name && context?.values[name] ? context.values[name as string] : '');

  useEffect(() => {
    if (registerItem && name) {
      return registerItem(name, { rules });
    }
  }, [registerItem, name, rules]);

  useEffect(() => {
    if (context && name) {
      setLocalValue(context.values[name]);
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

  return (
    <FormItemWrapper
      className={`form-item ${className}`}
      style={style}
      $layout={context?.layout || 'horizontal'}
      $styles={styles?.wrapper}
    >
      {label && (
        <FormLabel
          className="form-label"
          $required={isRequired}
          $colon={colon !== undefined ? colon : context?.colon}
          $styles={{
            ...styles?.label,
            ...(labelWidth !== undefined ? { width: `${labelWidth}%` } : {})
          }}
        >
          {label}
        </FormLabel>
      )}
      <FormControl
        className="form-control"
        $styles={{
          ...styles?.input,
          ...(controlWidth !== undefined ? { width: `${controlWidth}%` } : {})
        }}
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
        {hasError && (
          <FormError className={`form-error ${hasError ? 'form-error-visible' : ''}`} $styles={styles?.error}>
            {error}
          </FormError>
        )}
        {help && !hasError && (
          <FormHelp className="form-help" $styles={styles?.help}>
            {help}
          </FormHelp>
        )}
        {extra && !hasError && (
          <FormHelp className="form-help" $styles={styles?.help}>
            {extra}
          </FormHelp>
        )}
      </FormControl>
    </FormItemWrapper>
  );
};

Form.Item = FormItem;

export default Form;
export type { FormProps, FormItemProps, Rule, FormContextType, FormInstance };

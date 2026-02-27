import React from 'react';
import InputBase, { InputProps } from './InputBase';
import './Input.css';

export type NumberType = 
    | 'positive-float'  // 正浮点数
    | 'negative-float'  // 负浮点数
    | 'positive-integer' // 正整数
    | 'negative-integer' // 负整数
    | 'integer'          // 整数
    | 'negative'         // 负数
    | 'positive';        // 正数

export interface NumberInputProps extends InputProps {
    nType?: NumberType;
    errorMessage?: string;
    /** 默认提示信息，与错误信息互斥 */
    extra?: string | React.ReactNode;
}

const NumberInput: React.FC<NumberInputProps> = ({
    nType,
    errorMessage: customErrorMessage,
    extra,
    value,
    onChange,
    clear = false,
    ...rest
}) => {
    // 验证输入值是否符合nType要求
    const validateValue = (val: any): { isValid: boolean; message: string } => {
        if (!val) {
            return { isValid: true, message: '' };
        }

        // 确保val是字符串类型，如果不是则转换为字符串
        const valStr = typeof val === 'string' ? val : String(val);
        
        // 移除首尾空格
        const trimmedVal = valStr.trim();
        
        // 检查整个字符串是否为有效的数字
        const num = parseFloat(trimmedVal);
        
        // 基础数字验证 - 确保可以转换为数字且不是NaN
        if (isNaN(num)) {
            return { isValid: false, message: '请输入有效的数字' };
        }
        
        // 使用正则表达式进行不同类型的验证
        let regex: RegExp;
        
        switch (nType) {
            case 'positive-float':
                regex = /^\d+(\.\d+)?$/;
                if (regex.test(trimmedVal) && num > 0) {
                    return { isValid: true, message: '' };
                }
                return { isValid: false, message: '请输入正浮点数' };
            
            case 'negative-float':
                regex = /^-\d+(\.\d+)?$/;
                if (regex.test(trimmedVal) && num < 0) {
                    return { isValid: true, message: '' };
                }
                return { isValid: false, message: '请输入负浮点数' };
            
            case 'positive-integer':
                regex = /^\d+$/;
                if (regex.test(trimmedVal) && num > 0) {
                    return { isValid: true, message: '' };
                }
                return { isValid: false, message: '请输入正整数' };
            
            case 'negative-integer':
                regex = /^-\d+$/;
                if (regex.test(trimmedVal) && num < 0) {
                    return { isValid: true, message: '' };
                }
                return { isValid: false, message: '请输入负整数' };
            
            case 'integer':
                regex = /^-?\d+$/;
                if (regex.test(trimmedVal)) {
                    return { isValid: true, message: '' };
                }
                return { isValid: false, message: '请输入整数' };
            
            case 'negative':
                regex = /^-\d+(\.\d+)?$/;
                if (regex.test(trimmedVal) && num < 0) {
                    return { isValid: true, message: '' };
                }
                return { isValid: false, message: '请输入负数' };
            
            case 'positive':
                regex = /^\d+(\.\d+)?$/;
                if (regex.test(trimmedVal) && num > 0) {
                    return { isValid: true, message: '' };
                }
                return { isValid: false, message: '请输入正数' };
            
            default:
                return { isValid: true, message: '' };
        }
    };

    const [validation, setValidation] = React.useState<{ isValid: boolean; message: string }>({
        isValid: true,
        message: ''
    });

    // 处理输入变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange?.(e);
        
        // 只有当设置了nType时才验证
        if (nType) {
            const result = validateValue(newValue);
            setValidation(result);
        }
    };

    // 处理初始值验证
    React.useEffect(() => {
        if (nType && value) {
            const result = validateValue(value);
            setValidation(result);
        }
    }, [nType, value]);

    // 显示的错误消息：优先使用自定义错误消息，否则使用验证生成的消息
    const displayErrorMessage = customErrorMessage || validation.message;
    const hasError = !!displayErrorMessage;

    // extra 和错误信息互斥，当有错误时不显示 extra
    const shouldShowExtra = !hasError && extra;

    return (
        <div className="number-input-wrapper">
            <InputBase
                type="text"
                value={value}
                onChange={handleChange}
                clear={clear}
                {...rest}
                className={`${rest.className || ''} ${hasError ? 'input-error' : ''}`}
            />
            {hasError && (
                <div className={`input-error-message ${hasError ? 'visible' : ''}`}>
                    {displayErrorMessage}
                </div>
            )}
            {shouldShowExtra && (
                <div className="input-extra">
                    {extra}
                </div>
            )}
        </div>
    );
};

export default NumberInput;
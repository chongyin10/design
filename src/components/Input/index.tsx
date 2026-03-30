import React from 'react';
import InputBase, { InputProps } from './InputBase';
import Search from './Search';
import NumberInput, { NumberInputProps } from './Number';
import Textarea, { TextareaProps } from './Textarea';
import Password, { PasswordProps } from './Password';

export type { InputProps, NumberInputProps, TextareaProps, PasswordProps };

// 扩展InputBase组件，添加Search和Number静态属性
type InputComponent = React.FC<InputProps> & {
    Search: typeof Search;
    Number: typeof NumberInput;
    Textarea: typeof Textarea;
    Password: typeof Password;
};

const Input = InputBase as InputComponent;
Input.displayName = 'Input';
Input.Search = Search;
Input.Search.displayName = 'Input.Search';
Input.Number = NumberInput;
Input.Number.displayName = 'Input.Number';
Input.Textarea = Textarea;
Input.Textarea.displayName = 'Input.Textarea';
Input.Password = Password;
Input.Password.displayName = 'Input.Password';

export { Search, NumberInput, Textarea, Password };
export default Input;
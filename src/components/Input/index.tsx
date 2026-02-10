import React from 'react';
import InputBase, { InputProps } from './InputBase';
import Search from './Search';
import NumberInput, { NumberInputProps } from './Number';
import Textarea, { TextareaProps } from './Textarea';

export type { InputProps, NumberInputProps, TextareaProps };

// 扩展InputBase组件，添加Search和Number静态属性
type InputComponent = React.FC<InputProps> & {
    Search: typeof Search;
    Number: typeof NumberInput;
    Textarea: typeof Textarea;
};

const Input = InputBase as InputComponent;
Input.Search = Search;
Input.Number = NumberInput;
Input.Textarea = Textarea;

export { Search, NumberInput, Textarea };
export default Input;
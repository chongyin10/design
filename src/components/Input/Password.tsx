import React from 'react';
import Input, { InputProps } from './InputBase';
import Icon from '../Icon/Icon';
import './Input.css';

export interface PasswordProps extends Omit<InputProps, 'type' | 'suffix'> {
    /** 是否默认可见密码 */
    defaultVisible?: boolean;
    /** 切换可见性时的回调 */
    onVisibleChange?: (visible: boolean) => void;
    /** 自动完成属性 */
    autoComplete?: string;
}

const Password: React.FC<PasswordProps> = ({
    defaultVisible = false,
    onVisibleChange,
    autoComplete = 'current-password',
    ...rest
}) => {
    const [visible, setVisible] = React.useState(defaultVisible);

    const handleToggleVisible = () => {
        const newVisible = !visible;
        setVisible(newVisible);
        onVisibleChange?.(newVisible);
    };

    // 渲染眼睛图标
    const renderPasswordIcon = () => (
        <div
            className="input-suffix-content"
            onClick={handleToggleVisible}
            style={{ cursor: 'pointer' }}
        >
            <Icon
                type={visible ? 'eye' : 'eyeOff'}
                size="medium"
                color="#909399"
            />
        </div>
    );

    return (
        <Input
            type={visible ? 'text' : 'password'}
            suffix={renderPasswordIcon()}
            autoComplete={autoComplete}
            {...rest}
        />
    );
};

export default Password;

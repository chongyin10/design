import { FC } from 'react';
import { getLabelClassName, getLabelStyle } from './styles';
import { LabelProps } from './types';
import './Label.css';

const Label: FC<LabelProps> = (props: LabelProps) => {
    const {
        title,
        indicatorColor = 'blue',
        indicatorWidth = '3px',
        indicatorHeight = '100%',
        paddingRight = '8px',
        style,
        className,
    } = props;

    return (
        <label
            className={getLabelClassName({ className })}
            style={getLabelStyle({ indicatorColor, indicatorWidth, indicatorHeight, paddingRight, style })}
        >
            {title || null}
        </label>
    );
};

export default Label;

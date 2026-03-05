import Marquee from 'react-fast-marquee';
import React from 'react';
import './Notice.css';

export type NoticeType = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'dark';

export interface NoticeProps {
    text?: string | React.ReactNode | React.ReactElement | React.ReactElement[] | (string | React.ReactNode)[];
    speed?: number;
    height?: number;
    styles?: React.CSSProperties;
    icon?: React.ReactNode | null;
    showCloseButton?: boolean;
    closeStyle?: React.CSSProperties;
    floatingTop?: boolean;
    pauseOnHover?: boolean;
    type?: NoticeType;
    className?: string;
}

const Notice: React.FC<NoticeProps> = ({
    text = "",
    speed = 50,
    height = 60,
    icon = null,
    styles = {},
    closeStyle = {},
    showCloseButton = false,
    floatingTop = false,
    pauseOnHover = true,
    type = 'primary',
    className = ''
}) => {
    const [visible, setVisible] = React.useState(true);

    if (!text || !visible) return null;

    // 处理text为数组或字符串的不同情况
    const renderTextContent = () => {
        if (Array.isArray(text)) {
            // 当text为数组时，渲染数组中的所有元素
            return (
                <div className="zjpcy-notice-content">
                    {text.map((item, index) => (
                        <span key={index} style={{ marginRight: '15px', display: 'inline-block' }}>
                            {icon ? <span className="zjpcy-notice-icon">{icon}</span> : null}
                            <span className="zjpcy-notice-text">{item}</span>
                        </span>
                    ))}
                </div>
            );
        } else {
            // 当text为字符串或其他类型时，直接渲染
            return (
                <div className="zjpcy-notice-content">
                    <span>
                        {icon ? <span className="zjpcy-notice-icon">{icon}</span> : null}
                        <span className="zjpcy-notice-text">{text}</span>
                    </span>
                </div>
            );
        }
    };

    const handleClose = () => {
        setVisible(false);
    };

    return (
        <div
            className={`zjpcy-notice zjpcy-notice--${type} ${floatingTop ? 'zjpcy-notice-floating' : ''} ${className}`}
            style={{
                height: `${height}px`,
                ...styles
            }}
        >
            <Marquee pauseOnHover={pauseOnHover} speed={speed} gradient={false}>
                <span style={{ width: '1200px' }}></span>
                {renderTextContent()}
            </Marquee>
            {showCloseButton && (
                <div
                    className="zjpcy-notice-close"
                    style={{ height: `${height}px`, ...closeStyle }}
                    onClick={handleClose}
                >
                    <span className="zjpcy-notice-close-icon">×</span>
                </div>
            )}
        </div>
    );
};

export default Notice;

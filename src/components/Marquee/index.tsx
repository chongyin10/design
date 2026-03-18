'use client';

import React, { useEffect, useRef, useState } from 'react';
import Icon from '../Icon';
import './index.css';

export interface MarqueeProps {
    announcement?: string | string[];
    height?: number;
    speed?: number;
    backgroundColor?: string;
    visible?: boolean;
    fixed?: boolean;
    fixedTop?: number;
    isIcon?: boolean;
    onClose?: () => void;
}

const Marquee: React.FC<MarqueeProps> = ({
    announcement,
    height = 40,
    speed = 50,
    backgroundColor = 'linear-gradient(to right, #e8eaf6 0%, #f5f5f5 50%, #e8eaf6 100%)',
    visible: externalVisible = true,
    fixed = false,
    fixedTop = 0,
    isIcon = true,
    onClose,
}) => {

    if (!announcement) return null;

    const [internalVisible, setInternalVisible] = useState(true);
    const visible = externalVisible && internalVisible;

    const containerRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const isPausedRef = useRef<boolean>(false);
    const isMountedRef = useRef<boolean>(true);

    const handleClose = () => {
        isMountedRef.current = false;
        setInternalVisible(false);
        if (onClose) {
            onClose();
        }
    };

    useEffect(() => {
        if (!visible) return;
        if (!containerRef.current || !marqueeRef.current) return;

        const container = containerRef.current;
        const marquee = marqueeRef.current;

        marquee.style.left = `${container.offsetWidth}px`;

        const animate = () => {
            if (!isMountedRef.current || !marquee) return;

            if (isPausedRef.current) {
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            const currentLeft = parseFloat(marquee.style.left) || 0;

            if (currentLeft < -marquee.offsetWidth) {
                marquee.style.left = `${container.offsetWidth}px`;
            } else {
                marquee.style.left = `${currentLeft - speed / 100}px`;
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        const handleMouseEnter = () => {
            isPausedRef.current = true;
        };

        const handleMouseLeave = () => {
            isPausedRef.current = false;
        };

        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [speed, announcement, visible]);

    if (!visible) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className={`marquee-container ${fixed ? 'marquee-container-fixed' : ''}`}
            style={{
                height: `${height}px`,
                background: backgroundColor,
                top: fixed ? `${fixedTop}px` : undefined,
            }}
        >
            <div
                ref={marqueeRef}
                className="marquee-text"
            >
                {
                    Array.isArray(announcement) ? <span>{
                        announcement.map((item: string, index: number) => <span style={index == 0 ? {} : { marginLeft: '100px' }} key={index}>
                            <span style={{ marginRight: '5px' }}>{isIcon ? `📢` : null}</span>
                            {item}
                        </span>)
                    }</span> : announcement
                }
            </div>
            <div
                className="marquee-close"
                style={{
                    height: `${height}px`,
                    width: '45px',
                    background: backgroundColor,
                }}
                onClick={handleClose}
                onMouseEnter={() => { isPausedRef.current = true; }}
                onMouseLeave={() => { isPausedRef.current = false; }}
            >
                <Icon type="close" size={18} color="#666" />
            </div>
        </div>
    );
};

export default Marquee;

import React, { useState } from 'react';
import './index.css';
import { Button, Icon } from '../../components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DemoSectionProps {
    title?: string;
    children?: React.ReactNode;
}

const DemoSection: React.FC<DemoSectionProps> = ({ title, children }) => {
    return (
        <section className="demo-section">
            <h2>{title}</h2>
            {children}
        </section>
    );
};

// 速度控制组件
export const SpeedControl: React.FC<{
    currentSpeed: number;
    onSpeedChange: (speed: number) => void;
}> = ({ currentSpeed, onSpeedChange }) => {
    const speeds = [
        { value: 30, label: '30 (较慢)' },
        { value: 40, label: '40 (正常)', default: true },
        { value: 50, label: '50 (较快)' },
        { value: 60, label: '60 (快速)' },
    ];

    return (
        <div className="speed-control">
            <h3>调整滚动速度：</h3>
            <div className="speed-buttons">
                {speeds.map(speed => (
                    <Button
                        key={speed.value}
                        className={`speed-btn ${currentSpeed === speed.value ? 'active' : ''}`}
                        onClick={() => onSpeedChange(speed.value)}
                        variant={currentSpeed === speed.value ? 'primary' : 'secondary'}
                    >
                        {speed.label}
                    </Button>
                ))}
            </div>
            <p>当前速度：<span className="current-speed">{currentSpeed}</span> (数值越大滚动越快)</p>
        </div>
    );
};

// 修复说明组件
export const FixDescription: React.FC = () => {
    const [isDemoPaused, setIsDemoPaused] = useState(false);

    return (
        <div className="fix-description">
            <h3>修复的问题：</h3>
            <p><strong>原问题：</strong>公告动画开始时，有一部分内容已经在视窗内，而不是完全从右侧进入。</p>
            <p><strong>解决方案：</strong>设置公告内容的初始位置在容器右侧（left: 100%），确保动画开始时内容完全不可见。</p>

            <div className="animation-explain">
                <h4>从右端进入原理：</h4>
                <div className="visual-explain">
                    <div className="scroll-visual">
                        <div className="container-box"></div>
                        <div className={`content-track ${isDemoPaused ? 'paused' : ''}`}>
                            <div className="content-box">公告内容1</div>
                            <div className="content-box">公告内容2</div>
                            <div className="content-box">公告内容3</div>
                            <div className="content-box">公告内容4</div>
                            {/* 重复一次 */}
                            <div className="content-box">公告内容1</div>
                            <div className="content-box">公告内容2</div>
                            <div className="content-box">公告内容3</div>
                            <div className="content-box">公告内容4</div>
                        </div>
                    </div>
                    <div className="explain-text">
                        <p><Icon type="check" size={14} /> 设置初始位置：<code>left: 100%</code>（在容器右侧）</p>
                        <p><Icon type="check" size={14} /> 动画从 <code>transform: translateX(0)</code> 开始</p>
                        <p><Icon type="check" size={14} /> 动画到 <code>transform: translateX(-100%)</code> 结束</p>
                        <p><Icon type="check" size={14} /> 内容从完全不可见的位置开始，逐渐从右侧进入视窗</p>
                    </div>
                </div>
            </div>

            <div className="demo-container">
                <div className={`demo-content ${isDemoPaused ? 'paused' : ''}`}>
                    <div className="demo-item">
                        <span className="announcement-icon">📢</span>
                        <span className="announcement-text">演示：公告从右侧开始进入</span>
                    </div>
                    <span className="announcement-separator">•</span>
                    <div className="demo-item">
                        <span className="announcement-icon">🎁</span>
                        <span className="announcement-text">演示：无缝滚动效果</span>
                    </div>
                    <span className="announcement-separator">•</span>
                    <div className="demo-item">
                        <span className="announcement-icon">⚠️</span>
                        <span className="announcement-text">演示：从右向左平滑滚动</span>
                    </div>
                    <span className="announcement-separator">•</span>
                    <div className="demo-item">
                        <span className="announcement-icon">⭐</span>
                        <span className="announcement-text">演示：修复完成</span>
                    </div>

                    {/* 重复一次 */}
                    <div className="demo-item">
                        <span className="announcement-icon">📢</span>
                        <span className="announcement-text">演示：公告从右侧开始进入</span>
                    </div>
                    <span className="announcement-separator">•</span>
                    <div className="demo-item">
                        <span className="announcement-icon">🎁</span>
                        <span className="announcement-text">演示：无缝滚动效果</span>
                    </div>
                    <span className="announcement-separator">•</span>
                    <div className="demo-item">
                        <span className="announcement-icon">⚠️</span>
                        <span className="announcement-text">演示：从右向左平滑滚动</span>
                    </div>
                    <span className="announcement-separator">•</span>
                    <div className="demo-item">
                        <span className="announcement-icon">⭐</span>
                        <span className="announcement-text">演示：修复完成</span>
                    </div>
                </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '10px' }}>
                <Button
                    className="speed-btn"
                    style={{ padding: '8px 15px' }}
                    onClick={() => setIsDemoPaused(!isDemoPaused)}
                    variant="primary"
                >
                    {isDemoPaused ? '▶' : '⏸'}
                    {isDemoPaused ? ' 继续演示' : ' 暂停演示'}
                </Button>
            </p>
        </div>
    );
};

// 功能特点组件
export const Features: React.FC = () => {
    const features = [
        {
            icon: <Icon type="arrowRight" />,
            title: '从右端进入',
            description: '公告内容从浏览器右侧完全不可见的位置开始进入，形成真正的从右向左滚动效果。'
        },
        {
            icon: '♾️',
            title: '无缝滚动',
            description: '使用两份相同的公告内容，实现真正的无缝循环，无延迟、无间断。'
        },
        {
            icon: '⚙️',
            title: '可控交互',
            description: '支持暂停/继续、关闭公告栏、鼠标悬停暂停等功能，用户可自由控制公告显示。'
        }
    ];

    return (
        <div className="features">
            {features.map((feature, index) => (
                <div key={index} className="feature-card">
                    <h3>{feature.icon} {feature.title}</h3>
                    <p>{feature.description}</p>
                </div>
            ))}
        </div>
    );
};

// 操作指南组件
export const OperationGuide: React.FC = () => {
    return (
        <div className="operation-guide">
            <h3>操作指南：</h3>
            <ol>
                <li>公告栏内容从<strong>浏览器右侧完全不可见的位置开始进入</strong></li>
                <li>鼠标<strong>悬停在公告栏上会自动暂停</strong>，方便阅读</li>
                <li>点击 <span style={{ margin: '0 5px', verticalAlign: 'middle' }}>⏸</span> 按钮可以手动暂停/继续滚动</li>
                <li>点击 <Icon type="close" size={14} style={{ margin: '0 5px', verticalAlign: 'middle' }} /> 按钮可以关闭公告栏</li>
                <li>可以调整滚动速度，数值越大滚动越快</li>
            </ol>
        </div>
    );
};

// 代码示例组件
export const CodeExample: React.FC<{ title: string; code: string; language?: string }> = ({ title, code, language = 'tsx' }) => {
    return (
        <div className="code-example">
            <h3>{title}</h3>
            <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

export default DemoSection;
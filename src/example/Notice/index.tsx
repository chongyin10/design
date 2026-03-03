import React, { useState, useEffect } from 'react';
import { Notice, Button, Table, Anchor } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './index.css';

const NoticeExample: React.FC = () => {
    const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
    const [showNotice, setShowNotice] = useState(true);
    const [noticeText, setNoticeText] = useState('I can be a React component, multiple React components, or just some text.');
    const [noticeSpeed, setNoticeSpeed] = useState(50);
    const [noticeHeight, setNoticeHeight] = useState(60);
    const [showCloseButton, setShowCloseButton] = useState(false);
    const [floatingTop, setFloatingTop] = useState(false);

    useEffect(() => {
        // 获取滚动容器
        const container = document.querySelector('.app-content') as HTMLElement;
        setScrollContainer(container);
    }, []);

    const toggleNotice = () => {
        setShowNotice(!showNotice);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNoticeText(e.target.value);
    };

    const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNoticeSpeed(Number(e.target.value));
    };
    
    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNoticeHeight(Number(e.target.value));
    };
    
    const handleShowCloseButtonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowCloseButton(e.target.checked);
    };
    
    const handleFloatingTopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFloatingTop(e.target.checked);
    };

    // API参数列配置
    const apiColumns: Column[] = [
        { dataIndex: 'param', title: '属性名', width: '150px' },
        { dataIndex: 'type', title: '类型', width: '400px' },
        { dataIndex: 'default', title: '默认值', width: '150px' },
        { dataIndex: 'description', title: '描述', width: '300px' }
    ];

    // API参数数据源
    const apiDataSource = [
        { param: 'speed', type: 'number', default: '50', description: '滚动速度，数值越大滚动越快' },
        { param: 'height', type: 'number', default: '60', description: '公告栏高度，单位为像素' },
        { param: 'styles', type: 'React.CSSProperties', default: '{}', description: '自定义通知栏样式' },
        { param: 'icon', type: 'React.ReactNode | null', default: 'null', description: '通知文本前的图标' },
        { param: 'showCloseButton', type: 'boolean', default: 'false', description: '是否显示关闭按钮' },
        { param: 'closeStyle', type: 'React.CSSProperties', default: '{}', description: '自定义关闭按钮样式' },
        { param: 'floatingTop', type: 'boolean', default: 'false', description: '是否固定悬浮在页面顶部' },
        { param: 'pauseOnHover', type: 'boolean', default: 'true', description: '鼠标悬停时是否暂停滚动' }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
                {/* 左侧主内容区 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h1 id="notice-intro">Notice 公告栏</h1>
                    <p>这是一个滚动通知栏组件，使用 react-fast-marquee 实现无缝滚动效果。</p>
                    
                    <div id="notice-basic">
                        <div style={{ marginBottom: '40px' }}>
                            <h2>基本用法</h2>
                            <div className="notice-container">
                                {showNotice ? <Notice text={noticeText} speed={noticeSpeed} height={noticeHeight} showCloseButton={showCloseButton} floatingTop={floatingTop} /> : <p>通知已隐藏</p>}
                            </div>
                            <div className="controls">
                                <Button onClick={toggleNotice} className="control-btn" variant="primary">
                                    {showNotice ? '隐藏通知' : '显示通知'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div id="notice-config">
                        <div style={{ marginBottom: '40px' }}>
                            <h2>自定义配置</h2>
                            <div className="config-controls">
                                <div className="control-group">
                                    <label htmlFor="noticeText">通知文本:</label>
                                    <input
                                        id="noticeText"
                                        type="text"
                                        value={noticeText}
                                        onChange={handleTextChange}
                                        placeholder="输入通知文本"
                                    />
                                </div>
                                <div className="control-group">
                                    <label htmlFor="noticeSpeed">滚动速度:</label>
                                    <input
                                        id="noticeSpeed"
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={noticeSpeed}
                                        onChange={handleSpeedChange}
                                    />
                                    <span className="speed-value">{noticeSpeed}</span>
                                </div>
                                <div className="control-group">
                                    <label htmlFor="noticeHeight">公告栏高度:</label>
                                    <input
                                        id="noticeHeight"
                                        type="range"
                                        min="30"
                                        max="100"
                                        value={noticeHeight}
                                        onChange={handleHeightChange}
                                    />
                                    <span className="height-value">{noticeHeight}px</span>
                                </div>
                                <div className="control-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={showCloseButton}
                                            onChange={handleShowCloseButtonChange}
                                        />
                                        显示关闭按钮
                                    </label>
                                </div>
                                <div className="control-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={floatingTop}
                                            onChange={handleFloatingTopChange}
                                        />
                                        悬浮到顶部
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="notice-features">
                        <div style={{ marginBottom: '40px' }}>
                            <h2>功能说明</h2>
                            <ul>
                                <li>使用 Marquee 组件实现无缝滚动效果</li>
                                <li>滚动速度可配置（默认为50，范围10-100）</li>
                                <li>支持自定义通知文本内容</li>
                                <li>支持自定义公告栏高度（默认为60px，范围30-100px）</li>
                                <li>可选择显示关闭按钮，宽度30px，点击可隐藏公告栏</li>
                                <li>支持悬浮到顶部功能，固定显示在页面顶部</li>
                                <li>组件支持TypeScript类型定义</li>
                            </ul>
                        </div>
                    </div>

                    <div id="notice-scenes">
                        <div style={{ marginBottom: '40px' }}>
                            <h2>使用场景</h2>
                            <ul>
                                <li>网站公告</li>
                                <li>系统通知</li>
                                <li>促销活动信息</li>
                                <li>重要消息提醒</li>
                            </ul>
                        </div>
                    </div>

                    {/* API 文档 */}
                    <div id="notice-api">
                        <div style={{ marginBottom: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
                            <h2>API 参数</h2>
                            <Table pagination={false} columns={apiColumns} dataSource={apiDataSource} />
                        </div>
                    </div>

                    {/* 代码示例 */}
                    <div id="notice-code">
                        <div style={{ marginBottom: '40px' }}>
                            <h2>代码示例</h2>
                            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`import { Notice } from '@zjpcy/simple-design';

// 基本用法
<Notice text="这是一条公告信息" />

// 自定义速度和高度
<Notice
  text="自定义速度和高度的公告"
  speed={70}
  height={80}
/>

// 带图标的公告
<Notice
  text="带图标的公告"
  icon={<span>📢</span>}
/>

// 带关闭按钮
<Notice
  text="可关闭的公告"
  showCloseButton={true}
/>

// 固定在顶部
<Notice
  text="固定在顶部的公告"
  floatingTop={true}
/>

// 数组形式的文本
<Notice
  text={[
    "第一条公告信息",
    "第二条公告信息",
    "第三条公告信息"
  ]}
/>

// 自定义样式
<Notice
  text="自定义样式的公告"
  styles={{ backgroundColor: '#f0f0f0', color: '#333' }}
/>

// 带React元素的文本
<Notice
  text={
    <>
      这是一条带 <strong>加粗</strong> 和 <a href="#">链接</a> 的公告
    </>
  }
/>`}
                            </SyntaxHighlighter>
                        </div>
                    </div>

                    {/* 在其他项目中引用示例 */}
                    <div id="notice-install">
                        <div>
                            <h2>在其他项目中引用</h2>
                            <div style={{ margin: '15px 0' }}>
                                <h4>1. 安装</h4>
                                <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`npm i @zjpcy/simple-design`}
                                </SyntaxHighlighter>
                            </div>
                            <div>
                                <h4>2. 引用组件</h4>
                                <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`// 方式一：单独引入
import Notice from '@zjpcy/simple-design/lib/Notice/Notice';
import '@zjpcy/simple-design/lib/Notice/Notice.css';

// 方式二：批量引入
import { Notice } from '@zjpcy/simple-design';
import '@zjpcy/simple-design/lib/index.css';`}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 右侧锚点导航 */}
                <div style={{ width: '140px', flexShrink: 0 }}>
                    <div style={{ position: 'fixed', top: '100px', right: '40px', width: '140px' }}>
                        {scrollContainer && (
                            <Anchor
                                getContainer={() => scrollContainer}
                                offsetTop={20}
                                affix={false}
                                bounds={30}
                            >
                                <Anchor.Link href="#notice-intro" title="组件介绍" />
                                <Anchor.Link href="#notice-basic" title="基本用法" />
                                <Anchor.Link href="#notice-config" title="自定义配置" />
                                <Anchor.Link href="#notice-features" title="功能说明" />
                                <Anchor.Link href="#notice-scenes" title="使用场景" />
                                <Anchor.Link href="#notice-api" title="API 文档" />
                                <Anchor.Link href="#notice-code" title="代码示例" />
                                <Anchor.Link href="#notice-install" title="安装引用" />
                            </Anchor>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeExample;

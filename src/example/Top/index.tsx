import { useRef, useState, useEffect } from "react";
import Top from "../../components/Top";
import { Table, Anchor } from "../../components";
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function TopExample() {
    const customIconContainerRef = useRef<HTMLDivElement>(null);
    const pngIconContainerRef = useRef<HTMLDivElement>(null);
    const svgIconContainerRef = useRef<HTMLDivElement>(null);
    const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // 获取滚动容器
        const container = document.querySelector('.app-content') as HTMLElement;
        setScrollContainer(container);
    }, []);

    const customSvgIcon = (
        <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
            <path d="M12 4l-8 8h5v8h6v-8h5z"/>
        </svg>
    );

    const customSvgIcon2 = (
        <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
    );

    // API参数列配置
    const apiColumns: Column[] = [
        { dataIndex: 'param', title: '属性名', width: '150px' },
        { dataIndex: 'type', title: '类型', width: '300px' },
        { dataIndex: 'default', title: '默认值', width: '150px' },
        { dataIndex: 'description', title: '描述', width: '300px' }
    ];

    // API参数数据源
    const apiDataSource = [
        { param: 'showAfter', type: 'number', default: '100', description: '滚动多少距离后显示按钮（像素）' },
        { param: 'bottom', type: 'number', default: '30', description: '距离底部的距离（像素）' },
        { param: 'right', type: 'number', default: '30', description: '距离右侧的距离（像素）' },
        { param: 'size', type: 'number', default: '40', description: '按钮大小（像素）' },
        { param: 'color', type: 'string', default: '#fff', description: '图标颜色' },
        { param: 'bgColor', type: 'string', default: '#1a2980', description: '背景颜色' },
        { param: 'boxShadow', type: 'string', default: '0 2px 10px rgba(0, 0, 0, 0.15)', description: '阴影效果' },
        { param: 'onClick', type: '() => void', default: '-', description: '点击事件回调' },
        { param: 'containerRef', type: 'React.RefObject<HTMLElement | null>', default: '-', description: '容器引用，用于容器级回到顶部' },
        { param: 'icon', type: 'React.ReactNode', default: '-', description: '自定义图标，默认使用向上箭头' }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
                {/* 左侧主内容区 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h1 id="top-intro">Top 组件</h1>
                    <p>这是一个回到顶部组件，支持页面级和容器级回到顶部功能，可自定义样式和触发位置。</p>
                    
                    <div id="top-default" style={{ marginBottom: '40px' }}>
                        <h3>1. 默认图标</h3>
                        <p>使用默认的向上箭头图标</p>
                        <Top
                            showAfter={50}
                            size={44}
                            bgColor="#1a2980"
                        />
                    </div>
                    
                    <div id="top-custom-svg" style={{ marginBottom: '40px' }}>
                        <h3>2. 自定义 SVG 图标</h3>
                        <p>使用自定义 SVG 路径图标</p>
                        <div
                            ref={customIconContainerRef}
                            style={{
                                height: '300px',
                                overflowY: 'auto',
                                border: '1px solid #e8e8e8',
                                borderRadius: '8px',
                                position: 'relative',
                                background: '#fff5f5',
                            }}
                        >
                            <div style={{ height: '600px', padding: '20px' }}>
                                <p style={{ color: '#666' }}>向下滚动查看自定义 SVG 图标效果</p>
                                <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ color: '#999' }}>继续向下滚动 ↓</span>
                                </div>
                            </div>
                            <Top
                                containerRef={customIconContainerRef}
                                showAfter={50}
                                size={48}
                                bgColor="#ff6b6b"
                                color="#fff"
                                icon={customSvgIcon}
                            />
                        </div>
                    </div>
                    
                    <div id="top-png" style={{ marginBottom: '40px' }}>
                        <h3>3. 自定义 PNG 图片图标</h3>
                        <p>使用 PNG 图片作为图标</p>
                        <div
                            ref={pngIconContainerRef}
                            style={{
                                height: '300px',
                                overflowY: 'auto',
                                border: '1px solid #e8e8e8',
                                borderRadius: '8px',
                                position: 'relative',
                                background: '#f0fff4',
                            }}
                        >
                            <div style={{ height: '600px', padding: '20px' }}>
                                <p style={{ color: '#666' }}>向下滚动查看 PNG 图标效果</p>
                                <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ color: '#999' }}>继续向下滚动 ↓</span>
                                </div>
                            </div>
                            <Top
                                containerRef={pngIconContainerRef}
                                showAfter={50}
                                size={48}
                                bgColor="#52c41a"
                                color="#fff"
                                icon={<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 4l-8 8h5v8h6v-8h5z'/%3E%3C/svg%3E" alt="top" style={{ width: '100%', height: '100%' }} />}
                            />
                        </div>
                    </div>
                    
                    <div id="top-svg-outline" style={{ marginBottom: '40px' }}>
                        <h3>4. 自定义 SVG 组件图标</h3>
                        <p>使用线框风格的 SVG 图标</p>
                        <div
                            ref={svgIconContainerRef}
                            style={{
                                height: '300px',
                                overflowY: 'auto',
                                border: '1px solid #e8e8e8',
                                borderRadius: '8px',
                                position: 'relative',
                                background: '#faf5ff',
                            }}
                        >
                            <div style={{ height: '600px', padding: '20px' }}>
                                <p style={{ color: '#666' }}>向下滚动查看线框风格图标效果</p>
                                <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ color: '#999' }}>继续向下滚动 ↓</span>
                                </div>
                            </div>
                            <Top
                                containerRef={svgIconContainerRef}
                                showAfter={50}
                                size={48}
                                bgColor="#722ed1"
                                color="#fff"
                                icon={customSvgIcon2}
                            />
                        </div>
                    </div>
                    
                    <div id="top-full" style={{ marginBottom: '40px' }}>
                        <h3>5. 完整配置示例</h3>
                        <p>自定义图标 + 所有配置项</p>
                        <Top
                            showAfter={100}
                            size={56}
                            bottom={40}
                            right={40}
                            bgColor="#1890ff"
                            color="#fff"
                            boxShadow="0 4px 16px rgba(24, 144, 255, 0.4)"
                            icon={
                                <svg viewBox="0 0 24 24" width="100%" height="100%" fill="white">
                                    <path d="M7 14l5-5 5 5H7z"/>
                                </svg>
                            }
                        />
                    </div>
                    
                    {/* API 文档 */}
                    <div id="top-api" style={{ marginBottom: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
                        <h3>API 参数</h3>
                        <Table pagination={false} columns={apiColumns} dataSource={apiDataSource} />
                    </div>
                    
                    {/* 代码示例 */}
                    <div id="top-code" style={{ marginBottom: '40px' }}>
                        <h3>代码示例</h3>
                        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`import { Top } from '@zjpcy/simple-design';

// 基本用法
<Top />

// 自定义位置和大小
<Top
  bottom={50}
  right={50}
  size={50}
/>

// 自定义颜色和阴影
<Top
  bgColor="#1890ff"
  color="#ffffff"
  boxShadow="0 4px 12px rgba(24, 144, 255, 0.3)"
/>

// 自定义显示条件
<Top
  showAfter={200} // 滚动200px后显示
/>

// 容器级回到顶部
const containerRef = useRef<HTMLDivElement>(null);

<div ref={containerRef} style={{ overflowY: 'auto', position: 'relative' }}>
  {/* 内容 */}
  <Top
    containerRef={containerRef}
    bottom={20}
    right={20}
  />
</div>

// 自定义图标
<Top
  icon={<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-8 8h5v8h6v-8h5z"/></svg>}
/>

// 带点击回调
<Top
  onClick={() => {
    console.log('回到顶部按钮被点击');
  }}
/>

// 完整配置
<Top
  showAfter={150}
  bottom={30}
  right={30}
  size={48}
  color="#ffffff"
  bgColor="#52c41a"
  boxShadow="0 4px 16px rgba(82, 196, 26, 0.3)"
  onClick={() => console.log('回到顶部')}
  icon={<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5H7z"/></svg>}
/>

// 使用PNG图片作为图标
<Top
  icon={<img src="/path/to/icon.png" alt="top" style={{ width: '100%', height: '100%' }} />}
/>

// 使用文字作为图标
<Top
  icon={<span style={{ fontSize: '20px' }}>↑</span>}
/>
`}
                        </SyntaxHighlighter>
                    </div>
                    
                    {/* 在其他项目中引用示例 */}
                    <div id="top-usage" style={{ marginBottom: '60px' }}>
                        <h3>在其他项目中引用</h3>
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
import Top from '@zjpcy/simple-design/lib/Top';
import '@zjpcy/simple-design/lib/Top/Top.css';

// 方式二：批量引入
import { Top } from '@zjpcy/simple-design';
import '@zjpcy/simple-design/lib/index.css';`}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                    
                    <Top
                        showAfter={50}
                        size={44}
                        bgColor="#1a2980"
                    />
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
                                <Anchor.Link href="#top-intro" title="组件介绍" />
                                <Anchor.Link href="#top-default" title="默认图标" />
                                <Anchor.Link href="#top-custom-svg" title="自定义SVG" />
                                <Anchor.Link href="#top-png" title="PNG图标" />
                                <Anchor.Link href="#top-svg-outline" title="线框图标" />
                                <Anchor.Link href="#top-full" title="完整配置" />
                                <Anchor.Link href="#top-api" title="API 参数" />
                                <Anchor.Link href="#top-code" title="代码示例" />
                                <Anchor.Link href="#top-usage" title="引用方式" />
                            </Anchor>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopExample;

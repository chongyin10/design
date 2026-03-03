import React, { useState, useEffect } from 'react';
import Marquee from '../../components/Marquee';
import { Table, Anchor } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarqueeExample: React.FC = () => {
    const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // 获取滚动容器
        const container = document.querySelector('.app-content') as HTMLElement;
        setScrollContainer(container);
    }, []);

    // API参数列配置
    const apiColumns: Column[] = [
        { dataIndex: 'param', title: '属性名', width: '150px' },
        { dataIndex: 'type', title: '类型', width: '250px' },
        { dataIndex: 'default', title: '默认值', width: '200px' },
        { dataIndex: 'description', title: '描述', width: '300px' }
    ];

    // API参数数据源
    const apiDataSource = [
        { param: 'announcement', type: 'string | string[]', default: '-', description: '公告文本，可以是字符串或字符串数组' },
        { param: 'height', type: 'number', default: '40', description: '公告栏高度，单位为像素' },
        { param: 'speed', type: 'number', default: '50', description: '滚动速度，数值越大滚动越快' },
        { param: 'backgroundColor', type: 'string', default: 'linear-gradient(to right, #e8eaf6 0%, #f5f5f5 50%, #e8eaf6 100%)', description: '公告栏背景色，可以是纯色或渐变' },
        { param: 'visible', type: 'boolean', default: 'true', description: '是否显示公告栏' },
        { param: 'fixed', type: 'boolean', default: 'false', description: '是否固定在页面顶部' },
        { param: 'fixedTop', type: 'number', default: '0', description: '固定时距离顶部的距离，单位为像素' },
        { param: 'isIcon', type: 'boolean', default: 'true', description: '是否显示公告图标' },
        { param: 'onClose', type: '() => void', default: '-', description: '关闭按钮点击时的回调函数' }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
                {/* 左侧主内容区 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h1 id="marquee-intro">Marquee 公告组件</h1>
                    <p>这是一个可定制的滚动公告栏组件，支持多种样式和配置选项。</p>

                    <div id="marquee-default" style={{ marginBottom: '40px' }}>
                        <h3>1. 默认配置</h3>
                <p>默认高度: 40px, 默认速度: 50, 默认渐变背景</p>
                <Marquee announcement="这是一条默认配置的公告信息，从右向左滚动，播放完毕后会自动重复播放！" />
                    </div>

                    <div id="marquee-height" style={{ marginBottom: '40px' }}>
                        <h3>2. 自定义高度</h3>
                <p>高度: 60px</p>
                <Marquee
                    announcement="这是一条自定义高度为60px的公告信息！"
                    height={60}
                />
                    </div>

                    <div id="marquee-speed" style={{ marginBottom: '40px' }}>
                        <h3>3. 自定义速度</h3>
                <p>慢速: 20</p>
                <Marquee
                    announcement="这是一条慢速滚动的公告信息，速度为20！"
                    speed={20}
                />

                <p style={{ marginTop: '20px' }}>快速: 100</p>
                <Marquee
                    announcement="这是一条快速滚动的公告信息，速度为100！"
                    speed={100}
                />
                    </div>

                    <div id="marquee-bgcolor" style={{ marginBottom: '40px' }}>
                        <h3>4. 自定义背景色</h3>
                <p>自定义渐变背景</p>
                <Marquee
                    announcement={['这是一条自定义渐变背景的公告信息', '这是第二条自定义渐变背景的公告信息']}
                    backgroundColor="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
                />
                    </div>

                    <div id="marquee-combined" style={{ marginBottom: '40px' }}>
                        <h3>5. 综合自定义</h3>
                <p>高度: 50px, 速度: 75, 自定义背景</p>
                <Marquee
                    announcement="这是一条综合自定义配置的公告信息，高度50px，速度75，自定义渐变背景！"
                    height={50}
                    speed={75}
                    backgroundColor="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                />
                    </div>

                    <div id="marquee-fixed" style={{ marginBottom: '40px' }}>
                        <h3>6. 固定到顶部</h3>
                <p>fixed=true，公告栏会浮动固定在页面顶部</p>
                <Marquee
                    announcement="这是一条固定顶部的公告信息，滚动页面时保持可见！"
                    fixed={true}
                />
                    </div>

                    <div id="marquee-close" style={{ marginBottom: '40px' }}>
                        <h3>7. 关闭回调</h3>
                <p>点击关闭按钮触发 onClose 回调</p>
                <Marquee
                    announcement="这是一条带关闭回调的公告信息，点击右侧X关闭！"
                    onClose={() => alert('公告已关闭')}
                />
                    </div>

                    <div id="marquee-full" style={{ marginBottom: '40px' }}>
                        <h3>8. 完整功能示例</h3>
                <p>固定顶部 + 自定义高度 + 自定义速度 + 关闭回调</p>
                <Marquee
                    announcement="这是一条功能完整的公告信息，固定顶部、自定义高度和速度、支持关闭！"
                    height={50}
                    speed={60}
                    fixed={true}
                    fixedTop={60}
                    backgroundColor="linear-gradient(to right, #e8eaf6 0%, #f5f5f5 50%, #e8eaf6 100%)"
                    onClose={() => console.log('公告已关闭')}
                />
                    </div>

                    {/* API 文档 */}
                    <div id="marquee-api" style={{ marginBottom: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
                        <h3>API 参数</h3>
                <Table pagination={false} columns={apiColumns} dataSource={apiDataSource} />
                    </div>

                    {/* 代码示例 */}
                    <div id="marquee-code" style={{ marginBottom: '40px' }}>
                        <h3>代码示例</h3>
                <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`import { Marquee } from '@zjpcy/simple-design';

// 基本用法
<Marquee announcement="这是一条公告信息" />

// 数组形式的公告
<Marquee
  announcement={[
    "第一条公告",
    "第二条公告",
    "第三条公告"
  ]}
/>

// 自定义高度和速度
<Marquee
  announcement="自定义高度和速度"
  height={60}
  speed={80}
/>

// 自定义背景色
<Marquee
  announcement="自定义背景色"
  backgroundColor="#f5f5f5"
/>

// 渐变背景
<Marquee
  announcement="渐变背景"
  backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
/>

// 固定在顶部
<Marquee
  announcement="固定在顶部"
  fixed={true}
  fixedTop={0}
/>

// 不显示图标
<Marquee
  announcement="不显示图标的公告"
  isIcon={false}
/>

// 带关闭回调
<Marquee
  announcement="带关闭回调的公告"
  onClose={() => {
    console.log('公告已关闭');
  }}
/>

// 综合配置
<Marquee
  announcement={["第一条综合配置", "第二条综合配置"]}
  height={50}
  speed={60}
  backgroundColor="linear-gradient(to right, #e8eaf6 0%, #f5f5f5 50%, #e8eaf6 100%)"
  fixed={true}
  fixedTop={60}
  onClose={() => console.log('关闭回调')}
/>`}
                </SyntaxHighlighter>
            </div>
            </div>

                    {/* 在其他项目中引用示例 */}
                    <div id="marquee-usage">
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
import Marquee from '@zjpcy/simple-design/lib/Marquee';
import '@zjpcy/simple-design/lib/Marquee/index.css';

// 方式二：批量引入
import { Marquee } from '@zjpcy/simple-design';
import '@zjpcy/simple-design/lib/index.css';`}
                    </SyntaxHighlighter>
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
                                <Anchor.Link href="#marquee-intro" title="组件介绍" />
                                <Anchor.Link href="#marquee-default" title="默认配置" />
                                <Anchor.Link href="#marquee-height" title="自定义高度" />
                                <Anchor.Link href="#marquee-speed" title="自定义速度" />
                                <Anchor.Link href="#marquee-bgcolor" title="自定义背景色" />
                                <Anchor.Link href="#marquee-combined" title="综合自定义" />
                                <Anchor.Link href="#marquee-fixed" title="固定顶部" />
                                <Anchor.Link href="#marquee-close" title="关闭回调" />
                                <Anchor.Link href="#marquee-full" title="完整示例" />
                                <Anchor.Link href="#marquee-api" title="API 文档" />
                                <Anchor.Link href="#marquee-code" title="代码示例" />
                                <Anchor.Link href="#marquee-usage" title="引用说明" />
                            </Anchor>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarqueeExample;
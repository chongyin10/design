import React, { useState } from 'react';
import { Grid, Row, Col, Table } from '../../components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 复制功能组件
const CopyBlock: React.FC<{ code: string }> = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    };

    return (
        <div style={{ position: 'relative', marginBottom: '16px' }}>
            <button
                onClick={handleCopy}
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '4px 8px',
                    background: copied ? '#52c41a' : '#1890ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    zIndex: 1,
                }}
            >
                {copied ? '已复制' : '复制'}
            </button>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ margin: 0 }}>
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div style={{ marginBottom: '32px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '16px', color: '#333' }}>{title}</h2>
        {children}
    </div>
);

// 带颜色的盒子组件，用于演示
const DemoBox: React.FC<{ text: string; bgColor?: string; style?: React.CSSProperties }> = ({ text, bgColor = '#1890ff', style }) => (
    <div
        style={{
            backgroundColor: bgColor,
            color: 'white',
            padding: '16px',
            textAlign: 'center',
            borderRadius: '4px',
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            ...style,
        }}
    >
        {text}
    </div>
);

const GridExample: React.FC = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Grid 栅格</h1>
            <p>24 栅格系统，通过基础的 24 分栏，迅速简便地创建布局。</p>

            {/* 基础栅格 */}
            <Section title="基础栅格">
                <p style={{ color: '#666', marginBottom: '16px' }}>使用 span 属性来设置栅格占据的列数。</p>
                <div style={{ marginBottom: '16px' }}>
                    <Row>
                        <Col span={24}><DemoBox text="col-24" /></Col>
                    </Row>
                    <Row style={{ marginTop: '8px' }}>
                        <Col span={12}><DemoBox text="col-12" /></Col>
                        <Col span={12}><DemoBox text="col-12" bgColor="#52c41a" /></Col>
                    </Row>
                    <Row style={{ marginTop: '8px' }}>
                        <Col span={8}><DemoBox text="col-8" /></Col>
                        <Col span={8}><DemoBox text="col-8" bgColor="#52c41a" /></Col>
                        <Col span={8}><DemoBox text="col-8" bgColor="#faad14" /></Col>
                    </Row>
                    <Row style={{ marginTop: '8px' }}>
                        <Col span={6}><DemoBox text="col-6" /></Col>
                        <Col span={6}><DemoBox text="col-6" bgColor="#52c41a" /></Col>
                        <Col span={6}><DemoBox text="col-6" bgColor="#faad14" /></Col>
                        <Col span={6}><DemoBox text="col-6" bgColor="#f5222d" /></Col>
                    </Row>
                </div>
                <CopyBlock code={`import { Grid, Row, Col } from '@idp/design';

const Demo = () => (
    <Row>
        <Col span={24}>col-24</Col>
    </Row>
    <Row>
        <Col span={12}>col-12</Col>
        <Col span={12}>col-12</Col>
    </Row>
    <Row>
        <Col span={8}>col-8</Col>
        <Col span={8}>col-8</Col>
        <Col span={8}>col-8</Col>
    </Row>
);`} />
            </Section>

            {/* 区块间隔 */}
            <Section title="区块间隔">
                <p style={{ color: '#666', marginBottom: '16px' }}>使用 gap 属性设置栅格之间的间隔。</p>
                <div style={{ marginBottom: '16px' }}>
                    <Row gap={16}>
                        <Col span={8}><DemoBox text="gap-16" /></Col>
                        <Col span={8}><DemoBox text="gap-16" bgColor="#52c41a" /></Col>
                        <Col span={8}><DemoBox text="gap-16" bgColor="#faad14" /></Col>
                    </Row>
                    <Row gap={24} style={{ marginTop: '16px' }}>
                        <Col span={6}><DemoBox text="gap-24" /></Col>
                        <Col span={6}><DemoBox text="gap-24" bgColor="#52c41a" /></Col>
                        <Col span={6}><DemoBox text="gap-24" bgColor="#faad14" /></Col>
                        <Col span={6}><DemoBox text="gap-24" bgColor="#f5222d" /></Col>
                    </Row>
                </div>
                <CopyBlock code={`import { Grid, Row, Col } from '@idp/design';

const Demo = () => (
    <Row gap={16}>
        <Col span={8}>gap-16</Col>
        <Col span={8}>gap-16</Col>
        <Col span={8}>gap-16</Col>
    </Row>
    <Row gap={24}>
        <Col span={6}>gap-24</Col>
        <Col span={6}>gap-24</Col>
        <Col span={6}>gap-24</Col>
        <Col span={6}>gap-24</Col>
    </Row>
);`} />
            </Section>

            {/* 左右偏移 */}
            <Section title="左右偏移">
                <p style={{ color: '#666', marginBottom: '16px' }}>使用 offset 属性设置栅格左侧间隔格数。</p>
                <div style={{ marginBottom: '16px' }}>
                    <Row>
                        <Col span={8}><DemoBox text="col-8" /></Col>
                        <Col span={8} offset={8}><DemoBox text="col-8 offset-8" /></Col>
                    </Row>
                    <Row style={{ marginTop: '8px' }}>
                        <Col span={6} offset={6}><DemoBox text="col-6 offset-6" /></Col>
                        <Col span={6} offset={6}><DemoBox text="col-6 offset-6" bgColor="#52c41a" /></Col>
                    </Row>
                    <Row style={{ marginTop: '8px' }}>
                        <Col span={12} offset={6}><DemoBox text="col-12 offset-6" /></Col>
                    </Row>
                </div>
                <CopyBlock code={`import { Grid, Row, Col } from '@idp/design';

const Demo = () => (
    <Row>
        <Col span={8}>col-8</Col>
        <Col span={8} offset={8}>col-8 offset-8</Col>
    </Row>
    <Row>
        <Col span={6} offset={6}>col-6 offset-6</Col>
        <Col span={6} offset={6}>col-6 offset-6</Col>
    </Row>
    <Row>
        <Col span={12} offset={6}>col-12 offset-6</Col>
    </Row>
);`} />
            </Section>

            {/* 栅格移动 */}
            <Section title="栅格移动">
                <p style={{ color: '#666', marginBottom: '16px' }}>使用 push 和 pull 属性来改变栅格的顺序。</p>
                <div style={{ marginBottom: '16px' }}>
                    <Row>
                        <Col span={12} push={12}><DemoBox text="col-12 push-12" /></Col>
                        <Col span={12} pull={12}><DemoBox text="col-12 pull-12" bgColor="#52c41a" /></Col>
                    </Row>
                </div>
                <CopyBlock code={`import { Grid, Row, Col } from '@idp/design';

const Demo = () => (
    <Row>
        <Col span={12} push={12}>col-12 push-12</Col>
        <Col span={12} pull={12}>col-12 pull-12</Col>
    </Row>
);`} />
            </Section>

            {/* 栅格排序 */}
            <Section title="栅格排序">
                <p style={{ color: '#666', marginBottom: '16px' }}>使用 order 属性设置栅格的顺序。</p>
                <div style={{ marginBottom: '16px' }}>
                    <Row>
                        <Col span={8} order={3}><DemoBox text="1 col-8 order-3" /></Col>
                        <Col span={8} order={2}><DemoBox text="2 col-8 order-2" bgColor="#52c41a" /></Col>
                        <Col span={8} order={1}><DemoBox text="3 col-8 order-1" bgColor="#faad14" /></Col>
                    </Row>
                </div>
                <CopyBlock code={`import { Grid, Row, Col } from '@idp/design';

const Demo = () => (
    <Row>
        <Col span={8} order={3}>1 col-8 order-3</Col>
        <Col span={8} order={2}>2 col-8 order-2</Col>
        <Col span={8} order={1}>3 col-8 order-1</Col>
    </Row>
);`} />
            </Section>

            {/* Flex 对齐 */}
            <Section title="Flex 对齐">
                <p style={{ color: '#666', marginBottom: '16px' }}>使用 align 和 justify 属性设置 Flex 对齐方式。</p>
                <div style={{ marginBottom: '16px' }}>
                    <p style={{ marginBottom: '8px', fontWeight: 500 }}>子元素顶部对齐 (align="flex-start")</p>
                    <Row align="flex-start" style={{ backgroundColor: '#f0f2f5', padding: '16px', marginBottom: '16px' }}>
                        <Col span={6}><DemoBox text="col-6" /></Col>
                        <Col span={6}><DemoBox text="col-6" bgColor="#52c41a" style={{ padding: '32px' }} /></Col>
                        <Col span={6}><DemoBox text="col-6" bgColor="#faad14" /></Col>
                    </Row>

                    <p style={{ marginBottom: '8px', fontWeight: 500 }}>子元素居中对齐 (align="center")</p>
                    <Row align="center" style={{ backgroundColor: '#f0f2f5', padding: '16px', marginBottom: '16px' }}>
                        <Col span={6}><DemoBox text="col-6" /></Col>
                        <Col span={6}><DemoBox text="col-6" bgColor="#52c41a" style={{ padding: '32px' }} /></Col>
                        <Col span={6}><DemoBox text="col-6" bgColor="#faad14" /></Col>
                    </Row>

                    <p style={{ marginBottom: '8px', fontWeight: 500 }}>子元素右对齐 (justify="flex-end")</p>
                    <Row justify="flex-end" style={{ backgroundColor: '#f0f2f5', padding: '16px', marginBottom: '16px' }}>
                        <Col span={6}><DemoBox text="col-6" /></Col>
                        <Col span={6}><DemoBox text="col-6" bgColor="#52c41a" /></Col>
                    </Row>

                    <p style={{ marginBottom: '8px', fontWeight: 500 }}>子元素等间距排列 (justify="space-between")</p>
                    <Row justify="space-between" style={{ backgroundColor: '#f0f2f5', padding: '16px' }}>
                        <Col span={4}><DemoBox text="col-4" /></Col>
                        <Col span={4}><DemoBox text="col-4" bgColor="#52c41a" /></Col>
                        <Col span={4}><DemoBox text="col-4" bgColor="#faad14" /></Col>
                    </Row>
                </div>
                <CopyBlock code={`import { Grid, Row, Col } from '@idp/design';

const Demo = () => (
    // 子元素顶部对齐
    <Row align="flex-start">
        <Col span={6}>col-6</Col>
        <Col span={6}>col-6</Col>
        <Col span={6}>col-6</Col>
    </Row>

    // 子元素居中对齐
    <Row align="center">
        <Col span={6}>col-6</Col>
        <Col span={6}>col-6</Col>
        <Col span={6}>col-6</Col>
    </Row>

    // 子元素右对齐
    <Row justify="flex-end">
        <Col span={6}>col-6</Col>
        <Col span={6}>col-6</Col>
    </Row>

    // 子元素等间距排列
    <Row justify="space-between">
        <Col span={4}>col-4</Col>
        <Col span={4}>col-4</Col>
        <Col span={4}>col-4</Col>
    </Row>
);`} />
            </Section>

            {/* Grid 容器 */}
            <Section title="Grid 容器">
                <p style={{ color: '#666', marginBottom: '16px' }}>Grid 组件可以作为容器使用，支持设置宽度、高度、间距、内边距和背景色。</p>
                <div style={{ marginBottom: '16px' }}>
                    <Grid
                        width="100%"
                        gap={16}
                        padding={24}
                        backgroundColor="#f0f2f5"
                    >
                        <Row>
                            <Col span={12}><DemoBox text="Grid 容器内 col-12" /></Col>
                            <Col span={12}><DemoBox text="Grid 容器内 col-12" bgColor="#52c41a" /></Col>
                        </Row>
                        <Row style={{ marginTop: '16px' }}>
                            <Col span={8}><DemoBox text="col-8" /></Col>
                            <Col span={8}><DemoBox text="col-8" bgColor="#52c41a" /></Col>
                            <Col span={8}><DemoBox text="col-8" bgColor="#faad14" /></Col>
                        </Row>
                    </Grid>
                </div>
                <CopyBlock code={`import { Grid, Row, Col } from '@idp/design';

const Demo = () => (
    <Grid
        width="100%"
        gap={16}
        padding={24}
        backgroundColor="#f0f2f5"
    >
        <Row>
            <Col span={12}>col-12</Col>
            <Col span={12}>col-12</Col>
        </Row>
        <Row>
            <Col span={8}>col-8</Col>
            <Col span={8}>col-8</Col>
            <Col span={8}>col-8</Col>
        </Row>
    </Grid>
);`} />
            </Section>

            {/* 嵌套栅格 */}
            <Section title="嵌套栅格">
                <p style={{ color: '#666', marginBottom: '16px' }}>栅格可以嵌套使用。</p>
                <div style={{ marginBottom: '16px' }}>
                    <Row>
                        <Col span={12}>
                            <DemoBox text="col-12" />
                        </Col>
                        <Col span={12}>
                            <Row gap={8}>
                                <Col span={12}><DemoBox text="嵌套 col-12" bgColor="#52c41a" /></Col>
                                <Col span={12}><DemoBox text="嵌套 col-12" bgColor="#faad14" /></Col>
                                <Col span={24}><DemoBox text="嵌套 col-24" bgColor="#f5222d" /></Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <CopyBlock code={`import { Grid, Row, Col } from '@idp/design';

const Demo = () => (
    <Row>
        <Col span={12}>col-12</Col>
        <Col span={12}>
            <Row gap={8}>
                <Col span={12}>嵌套 col-12</Col>
                <Col span={12}>嵌套 col-12</Col>
                <Col span={24}>嵌套 col-24</Col>
            </Row>
        </Col>
    </Row>
);`} />
            </Section>

            {/* API 文档 */}
            <Section title="API">
                <h3>Grid Props</h3>
                <Table
                    columns={[
                        { dataIndex: 'property', title: '属性', width: '120px' },
                        { dataIndex: 'description', title: '说明' },
                        { dataIndex: 'type', title: '类型', width: '180px' },
                        { dataIndex: 'default', title: '默认值', width: '120px' }
                    ]}
                    dataSource={[
                        { property: 'width', description: '宽度', type: 'number | string', default: '100%' },
                        { property: 'height', description: '高度', type: 'number | string', default: '-' },
                        { property: 'gap', description: '栅格间距', type: 'number | string', default: '-' },
                        { property: 'padding', description: '内边距', type: 'number | string', default: '-' },
                        { property: 'backgroundColor', description: '背景色', type: 'string', default: '-' },
                        { property: 'className', description: '自定义类名', type: 'string', default: '-' },
                        { property: 'style', description: '自定义样式', type: 'CSSProperties', default: '-' }
                    ]}
                    bordered
                />

                <h3 style={{ marginTop: '32px' }}>Row Props</h3>
                <Table
                    columns={[
                        { dataIndex: 'property', title: '属性', width: '120px' },
                        { dataIndex: 'description', title: '说明' },
                        { dataIndex: 'type', title: '类型', width: '200px' },
                        { dataIndex: 'default', title: '默认值', width: '120px' }
                    ]}
                    dataSource={[
                        { property: 'gap', description: '栅格间距', type: 'number | string', default: '-' },
                        { property: 'align', description: '垂直对齐方式', type: '"flex-start" | "center" | "flex-end" | "stretch"', default: '-' },
                        { property: 'justify', description: '水平对齐方式', type: '"flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly"', default: '-' },
                        { property: 'wrap', description: '是否换行', type: 'boolean', default: 'true' },
                        { property: 'className', description: '自定义类名', type: 'string', default: '-' },
                        { property: 'style', description: '自定义样式', type: 'CSSProperties', default: '-' }
                    ]}
                    bordered
                />

                <h3 style={{ marginTop: '32px' }}>Col Props</h3>
                <Table
                    columns={[
                        { dataIndex: 'property', title: '属性', width: '120px' },
                        { dataIndex: 'description', title: '说明' },
                        { dataIndex: 'type', title: '类型', width: '180px' },
                        { dataIndex: 'default', title: '默认值', width: '120px' }
                    ]}
                    dataSource={[
                        { property: 'span', description: '栅格占位格数，总共 24 格', type: 'number', default: '-' },
                        { property: 'offset', description: '栅格左侧间隔格数', type: 'number', default: '0' },
                        { property: 'push', description: '栅格向右移动格数', type: 'number', default: '0' },
                        { property: 'pull', description: '栅格向左移动格数', type: 'number', default: '0' },
                        { property: 'order', description: '栅格顺序', type: 'number', default: '-' },
                        { property: 'className', description: '自定义类名', type: 'string', default: '-' },
                        { property: 'style', description: '自定义样式', type: 'CSSProperties', default: '-' }
                    ]}
                    bordered
                />
            </Section>
        </div>
    );
};

export default GridExample;

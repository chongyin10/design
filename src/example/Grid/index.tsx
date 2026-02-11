import React, { useState } from 'react';
import { Grid, Row, Col, Table, Slider, Flex, Button } from '../../components';
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
    const [flexGap, setFlexGap] = useState(16);
    const [rowGap, setRowGap] = useState(16);
    const [gridGap, setGridGap] = useState(16);

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
    <>
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
    </>
);`} />
            </Section>

            {/* 动态间距控制 */}
            <Section title="动态间距控制">
                <p style={{ color: '#666', marginBottom: '16px' }}>使用 Slider 组件动态调整 Grid 和 Flex 的间距。</p>
                
                {/* Flex 动态间距 */}
                <div style={{ marginBottom: '32px', backgroundColor: '#f0f2f5', padding: '16px', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: 500 }}>Flex 动态间距</h3>
                    <Flex gap={flexGap} wrap="wrap" style={{ marginBottom: '16px', backgroundColor: '#fff', padding: '16px', borderRadius: '4px' }}>
                        <DemoBox text={`gap: ${flexGap}px`} />
                        <DemoBox text={`gap: ${flexGap}px`} bgColor="#52c41a" />
                        <DemoBox text={`gap: ${flexGap}px`} bgColor="#faad14" />
                        <DemoBox text={`gap: ${flexGap}px`} bgColor="#f5222d" />
                        <DemoBox text={`gap: ${flexGap}px`} bgColor="#722ed1" />
                    </Flex>
                    <div style={{ marginTop: '16px' }}>
                        <span style={{ marginRight: '12px', fontSize: '14px', color: '#666' }}>间距值：</span>
                        <Slider
                            min={0}
                            max={48}
                            value={flexGap}
                            onChange={setFlexGap}
                            style={{ width: '200px', display: 'inline-block', verticalAlign: 'middle' }}
                        />
                        <span style={{ marginLeft: '12px', fontSize: '16px', fontWeight: 500, color: '#1890ff' }}>{flexGap}px</span>
                    </div>
                </div>
                <CopyBlock code={`import { Flex, Slider } from '@idp/design';
import { useState } from 'react';

const FlexGapDemo = () => {
    const [gap, setGap] = useState(16);

    return (
        <>
            <Flex gap={gap} wrap>
                <div>Item 1</div>
                <div>Item 2</div>
                <div>Item 3</div>
            </Flex>
            <Slider
                min={0}
                max={48}
                value={gap}
                onChange={setGap}
            />
        </>
    );
};`} />

                {/* Row 动态间距 */}
                <div style={{ marginBottom: '32px', backgroundColor: '#f0f2f5', padding: '16px', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: 500 }}>Row 动态间距</h3>
                    <div style={{ marginBottom: '16px', display: 'flex', gap: '32px' }}>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>水平间距 (gap)</h4>
                            <Row gap={rowGap} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '4px', marginBottom: '8px' }}>
                                <Col span={8}><DemoBox text={`gap: ${rowGap}`} /></Col>
                                <Col span={8}><DemoBox text={`gap: ${rowGap}`} bgColor="#52c41a" /></Col>
                                <Col span={8}><DemoBox text={`gap: ${rowGap}`} bgColor="#faad14" /></Col>
                            </Row>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>垂直间距 (rowGap)</h4>
                            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '4px' }}>
                                <Row rowGap={rowGap}>
                                    <Col span={24}><DemoBox text={`rowGap: ${rowGap}px`} /></Col>
                                    <Col span={24}><DemoBox text={`rowGap: ${rowGap}px`} bgColor="#52c41a" /></Col>
                                    <Col span={24}><DemoBox text={`rowGap: ${rowGap}px`} bgColor="#faad14" /></Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '12px', fontSize: '14px', color: '#666' }}>间距值：</span>
                            <Slider
                                min={0}
                                max={48}
                                value={rowGap}
                                onChange={setRowGap}
                                style={{ width: '200px' }}
                            />
                            <span style={{ marginLeft: '12px', fontSize: '16px', fontWeight: 500, color: '#1890ff' }}>{rowGap}px</span>
                        </div>
                    </div>
                </div>
                <CopyBlock code={`import { Grid, Row, Col, Slider } from '@idp/design';
import { useState } from 'react';

const RowGapDemo = () => {
    const [gap, setGap] = useState(16);
    const [rowGap, setRowGap] = useState(16);

    return (
        <>
            {/* 水平间距 - 控制 Col 之间的左右间距 */}
            <Row gap={gap}>
                <Col span={8}>Item 1</Col>
                <Col span={8}>Item 2</Col>
                <Col span={8}>Item 3</Col>
            </Row>
            
            {/* 垂直间距 - 控制 Row 之间的上下间距 */}
            <Row rowGap={rowGap}>
                <Col span={24}>Row 1</Col>
                <Col span={24}>Row 2</Col>
                <Col span={24}>Row 3</Col>
            </Row>
            
            <Slider
                min={0}
                max={48}
                value={gap}
                onChange={setGap}
            />
            <Slider
                min={0}
                max={48}
                value={rowGap}
                onChange={setRowGap}
            />
        </>
    );
};`} />

                {/* Grid 容器动态间距 */}
                <div style={{ marginBottom: '32px', backgroundColor: '#f0f2f5', padding: '16px', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: 500 }}>Grid 容器动态间距</h3>
                    <Grid gap={gridGap} backgroundColor="#fff" padding={16}>
                        <Row>
                            <Col span={12}><DemoBox text={`gap: ${gridGap}px`} /></Col>
                            <Col span={12}><DemoBox text={`gap: ${gridGap}px`} bgColor="#52c41a" /></Col>
                        </Row>
                        <Row>
                            <Col span={8}><DemoBox text={`gap: ${gridGap}px`} /></Col>
                            <Col span={8}><DemoBox text={`gap: ${gridGap}px`} bgColor="#52c41a" /></Col>
                            <Col span={8}><DemoBox text={`gap: ${gridGap}px`} bgColor="#faad14" /></Col>
                        </Row>
                    </Grid>
                    <div style={{ marginTop: '16px' }}>
                        <span style={{ marginRight: '12px', fontSize: '14px', color: '#666' }}>间距值：</span>
                        <Slider
                            min={0}
                            max={48}
                            value={gridGap}
                            onChange={setGridGap}
                            style={{ width: '200px', display: 'inline-block', verticalAlign: 'middle' }}
                        />
                        <span style={{ marginLeft: '12px', fontSize: '16px', fontWeight: 500, color: '#1890ff' }}>{gridGap}px</span>
                    </div>
                </div>
                <CopyBlock code={`import { Grid, Row, Col, Slider } from '@idp/design';
import { useState } from 'react';

const GridGapDemo = () => {
    const [gap, setGap] = useState(16);

    return (
        <Grid gap={gap} backgroundColor="#fff" padding={16}>
            <Row>
                <Col span={12}>Item 1</Col>
                <Col span={12}>Item 2</Col>
            </Row>
            <Row>
                <Col span={8}>Item 1</Col>
                <Col span={8}>Item 2</Col>
                <Col span={8}>Item 3</Col>
            </Row>
        </Grid>
        <Slider
            min={0}
            max={48}
            value={gap}
            onChange={setGap}
        />
    );
};`} />
            </Section>

            {/* Flex 组合使用 */}
            <Section title="Flex 组合使用">
                <p style={{ color: '#666', marginBottom: '16px' }}>Flex 组件可以与 Grid 组件组合使用，创建更灵活的布局。</p>
                
                <div style={{ marginBottom: '16px', backgroundColor: '#f0f2f5', padding: '16px', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: 500 }}>Flex + Grid 组合</h3>
                    <Flex gap={flexGap} justify="center" style={{ marginBottom: '16px', backgroundColor: '#fff', padding: '16px', borderRadius: '4px' }}>
                        <Row gap={8}>
                            <Col span={8}><DemoBox text="Row" /></Col>
                            <Col span={8}><DemoBox text="Row" bgColor="#52c41a" /></Col>
                        </Row>
                    </Flex>
                    <Flex gap={flexGap} justify="center" style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '4px' }}>
                        <Row gap={rowGap}>
                            <Col span={6}><DemoBox text="Row" /></Col>
                            <Col span={6}><DemoBox text="Row" bgColor="#52c41a" /></Col>
                            <Col span={6}><DemoBox text="Row" bgColor="#faad14" /></Col>
                            <Col span={6}><DemoBox text="Row" bgColor="#f5222d" /></Col>
                        </Row>
                    </Flex>
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <Button variant="primary" size="small" onClick={() => setFlexGap(Math.floor(Math.random() * 32 + 8))}>
                            随机 Flex 间距
                        </Button>
                        <Button variant="secondary" size="small" onClick={() => setRowGap(Math.floor(Math.random() * 32 + 8))}>
                            随机 Row 间距
                        </Button>
                    </div>
                </div>
                <CopyBlock code={`import { Flex, Grid, Row, Col, Button } from '@idp/design';
import { useState } from 'react';

const FlexGridDemo = () => {
    const [flexGap, setFlexGap] = useState(16);
    const [rowGap, setRowGap] = useState(16);

    return (
        <>
            <Flex gap={flexGap} justify="center">
                <Row gap={rowGap}>
                    <Col span={8}>Item 1</Col>
                    <Col span={8}>Item 2</Col>
                </Row>
            </Flex>
            <Button onClick={() => setFlexGap(24)}>
                设置 Flex 间距为 24px
            </Button>
            <Button onClick={() => setRowGap(24)}>
                设置 Row 间距为 24px
            </Button>
        </>
    );
};`} />

                {/* 嵌套组合 */}
                <div style={{ backgroundColor: '#f0f2f5', padding: '16px', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: 500 }}>多层嵌套组合</h3>
                    <Grid gap={gridGap} padding={16}>
                        <Row>
                            <Col span={12}>
                                <Flex gap={8} justify="center" style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '4px' }}>
                                    <DemoBox text="Flex" />
                                    <DemoBox text="Flex" bgColor="#52c41a" />
                                </Flex>
                            </Col>
                            <Col span={12}>
                                <Flex gap={8} justify="center" style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '4px' }}>
                                    <Row gap={8}>
                                        <Col span={12}><DemoBox text="Row" bgColor="#faad14" /></Col>
                                        <Col span={12}><DemoBox text="Row" bgColor="#f5222d" /></Col>
                                    </Row>
                                </Flex>
                            </Col>
                        </Row>
                    </Grid>
                </div>
                <CopyBlock code={`import { Flex, Grid, Row, Col } from '@idp/design';

const NestedDemo = () => {
    return (
        <Grid gap={16} padding={16}>
            <Row>
                <Col span={12}>
                    <Flex gap={8} justify="center">
                        <div>Flex Item 1</div>
                        <div>Flex Item 2</div>
                    </Flex>
                </Col>
                <Col span={12}>
                    <Flex gap={8} justify="center">
                        <Row gap={8}>
                            <Col span={12}>Row Item 1</Col>
                            <Col span={12}>Row Item 2</Col>
                        </Row>
                    </Flex>
                </Col>
            </Row>
        </Grid>
    );
};`} />
            </Section>

            {/* 区块间隔 */}
            <Section title="区块间隔">
                <p style={{ color: '#666', marginBottom: '16px' }}>使用 <code>gap</code> 属性设置 Col 之间的水平间距，使用 <code>rowGap</code> 属性设置 Row 之间的垂直间距。</p>
                <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>水平间距 (gap)</h4>
                    <Row gap={16}>
                        <Col span={8}><DemoBox text="gap-16" /></Col>
                        <Col span={8}><DemoBox text="gap-16" bgColor="#52c41a" /></Col>
                        <Col span={8}><DemoBox text="gap-16" bgColor="#faad14" /></Col>
                    </Row>
                    <h4 style={{ fontSize: '14px', marginTop: '16px', marginBottom: '8px' }}>垂直间距 (rowGap)</h4>
                    <div style={{ backgroundColor: '#f0f2f5', padding: '16px', borderRadius: '4px' }}>
                        <Row rowGap={16}>
                            <Col span={24}><DemoBox text="rowGap-16" /></Col>
                            <Col span={24}><DemoBox text="rowGap-16" bgColor="#52c41a" /></Col>
                        </Row>
                    </div>
                    <h4 style={{ fontSize: '14px', marginTop: '16px', marginBottom: '8px' }}>组合使用</h4>
                    <Row gap={16} rowGap={16} style={{ backgroundColor: '#f0f2f5', padding: '16px', borderRadius: '4px' }}>
                        <Col span={8}><DemoBox text="Both" /></Col>
                        <Col span={8}><DemoBox text="Both" bgColor="#52c41a" /></Col>
                        <Col span={8}><DemoBox text="Both" bgColor="#faad14" /></Col>
                        <Col span={8}><DemoBox text="Both" bgColor="#f5222d" /></Col>
                        <Col span={8}><DemoBox text="Both" bgColor="#722ed1" /></Col>
                        <Col span={8}><DemoBox text="Both" bgColor="#13c2c2" /></Col>
                    </Row>
                </div>
                <CopyBlock code={`import { Grid, Row, Col } from '@idp/design';

const Demo = () => (
    <>
        {/* 水平间距 - Col 之间的左右间距 */}
        <Row gap={16}>
            <Col span={8}>gap-16</Col>
            <Col span={8}>gap-16</Col>
            <Col span={8}>gap-16</Col>
        </Row>

        {/* 垂直间距 - Row 之间的上下间距 */}
        <Row rowGap={16}>
            <Col span={24}>rowGap-16</Col>
            <Col span={24}>rowGap-16</Col>
        </Row>

        {/* 组合使用 */}
        <Row gap={16} rowGap={16}>
            <Col span={8}>Both</Col>
            <Col span={8}>Both</Col>
            <Col span={8}>Both</Col>
        </Row>
    </>
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
                        { property: 'gap', description: 'Col 之间的水平间距（左右间距）', type: 'number | string', default: '0' },
                        { property: 'rowGap', description: 'Row 之间的垂直间距（上下间距）', type: 'number | string', default: '0' },
                        { property: 'align', description: '垂直对齐方式', type: '"flex-start" | "center" | "flex-end" | "stretch"', default: 'stretch' },
                        { property: 'justify', description: '水平对齐方式', type: '"flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly"', default: 'flex-start' },
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

import React, { useState, useEffect } from 'react';
import { Space, Button, Input, Select, Table, Anchor } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SpaceExample: React.FC = () => {
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  // API参数列配置
  const apiColumns: Column[] = [
    { dataIndex: 'param', title: '参数名', width: '150px' },
    { dataIndex: 'type', title: '类型', width: '300px' },
    { dataIndex: 'default', title: '默认值', width: '150px' },
    { dataIndex: 'description', title: '描述', width: '300px' }
  ];

  // API参数数据源
  const apiDataSource = [
    { param: 'children', type: 'React.ReactNode', default: '-', description: '子元素' },
    { param: 'gap', type: 'number | string', default: '12px', description: '间距大小，可以是数字（px）或字符串' },
    { param: 'align', type: "'start' | 'end' | 'center' | 'baseline' | 'stretch'", default: 'center', description: '水平对齐方式' },
    { param: 'wrap', type: "'nowrap' | 'wrap' | 'wrap-reverse'", default: 'nowrap', description: '包裹方式' },
    { param: 'className', type: 'string', default: '-', description: '类名' },
    { param: 'style', type: 'React.CSSProperties', default: '-', description: '样式' },
    { param: 'inline', type: 'boolean', default: 'false', description: '是否为内联元素' },
    { param: 'as', type: "'div' | 'span'", default: 'div', description: '渲染的元素类型，在 p 标签内使用时建议设置为 span' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="space-intro">Space 间距</h1>
          <p>设置组件之间的间距，避免组件紧贴在一起，拉开统一的空间。</p>
          
          {/* 基本使用示例 */}
          <div id="space-basic" style={{ marginBottom: '40px' }}>
            <h2>基本使用</h2>
            <p>适合行内元素的水平间距。</p>
            
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '8px' }}>
              <Space gap={16}>
                <Button variant="primary">按钮1</Button>
                <Button variant="secondary">按钮2</Button>
                <Button variant="success">按钮3</Button>
                <Button variant="warning">按钮4</Button>
                <Button variant="danger">按钮5</Button>
              </Space>
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0' }}>
{`<Space gap={16}>
  <Button variant="primary">按钮1</Button>
  <Button variant="secondary">按钮2</Button>
  <Button variant="success">按钮3</Button>
  <Button variant="warning">按钮4</Button>
  <Button variant="danger">按钮5</Button>
</Space>`}
            </SyntaxHighlighter>
          </div>
          
          {/* 对齐方式示例 */}
          <div id="space-align" style={{ marginBottom: '40px' }}>
            <h2>对齐方式</h2>
            <p>可以设置各种水平对齐方式。</p>
            
            <h3>居中对齐 (默认)</h3>
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '8px' }}>
              <Space gap={12} align="center">
                <Button variant="primary" size="small">小按钮</Button>
                <Button variant="secondary" size="medium">中等按钮</Button>
                <Button variant="success" size="large">大按钮</Button>
              </Space>
            </div>
            
            <h3>顶部对齐</h3>
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '8px' }}>
              <Space gap={12} align="start">
                <Button variant="primary" size="small">小按钮</Button>
                <Button variant="secondary" size="medium">中等按钮</Button>
                <Button variant="success" size="large">大按钮</Button>
              </Space>
            </div>
            
            <h3>底部对齐</h3>
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '8px' }}>
              <Space gap={12} align="end">
                <Button variant="primary" size="small">小按钮</Button>
                <Button variant="secondary" size="medium">中等按钮</Button>
                <Button variant="success" size="large">大按钮</Button>
              </Space>
            </div>
            
            <h3>基线对齐</h3>
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '8px' }}>
              <Space gap={12} align="baseline">
                <Input style={{ width: '120px' }} placeholder="输入框" />
                <Button variant="primary">按钮</Button>
                <Select
                  style={{ width: '120px' }}
                  options={[
                    { value: '1', label: '选项1' },
                    { value: '2', label: '选项2' },
                    { value: '3', label: '选项3' }
                  ]}
                  placeholder="选择框"
                />
              </Space>
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0' }}>
{`<Space gap={12} align="center">
  <Button variant="primary" size="small">小按钮</Button>
  <Button variant="secondary" size="medium">中等按钮</Button>
  <Button variant="success" size="large">大按钮</Button>
</Space>

<Space gap={12} align="start">
  {/* 顶部对齐 */}
</Space>

<Space gap={12} align="end">
  {/* 底部对齐 */}
</Space>

<Space gap={12} align="baseline">
  {/* 基线对齐 */}
</Space>`}
            </SyntaxHighlighter>
          </div>
          
          {/* 内联模式示例 */}
          <div id="space-inline" style={{ marginBottom: '40px' }}>
            <h2>内联模式</h2>
            <p>设置 inline 属性为 true，使 Space 组件表现为内联元素。</p>
            
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '8px' }}>
              <p>
                这是一段文本，
                <Space gap={8} inline as="span">
                  <Button variant="primary" size="small">按钮1</Button>
                  <Button variant="secondary" size="small">按钮2</Button>
                </Space>
                在文本中间插入内联按钮。
              </p>
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0' }}>
{`<p>
  这是一段文本，
  <Space gap={8} inline as="span">
    <Button variant="primary" size="small">按钮1</Button>
    <Button variant="secondary" size="small">按钮2</Button>
  </Space>
  在文本中间插入内联按钮。
</p>`}
            </SyntaxHighlighter>
          </div>
          
          {/* 换行模式示例 */}
          <div id="space-wrap" style={{ marginBottom: '40px' }}>
            <h2>换行模式</h2>
            <p>当子元素超出容器宽度时，设置 wrap 属性为 wrap 可以自动换行。</p>
            
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '8px', width: '400px' }}>
              <Space gap={12} wrap="wrap">
                <Button variant="primary" size="small">按钮1</Button>
                <Button variant="secondary" size="small">按钮2</Button>
                <Button variant="success" size="small">按钮3</Button>
                <Button variant="warning" size="small">按钮4</Button>
                <Button variant="danger" size="small">按钮5</Button>
                <Button variant="primary" size="small">按钮6</Button>
                <Button variant="secondary" size="small">按钮7</Button>
                <Button variant="success" size="small">按钮8</Button>
              </Space>
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0' }}>
{`<div style={{ width: '400px' }}>
  <Space gap={12} wrap="wrap">
    <Button variant="primary" size="small">按钮1</Button>
    <Button variant="secondary" size="small">按钮2</Button>
    <Button variant="success" size="small">按钮3</Button>
    <Button variant="warning" size="small">按钮4</Button>
    <Button variant="danger" size="small">按钮5</Button>
    <Button variant="primary" size="small">按钮6</Button>
    <Button variant="secondary" size="small">按钮7</Button>
    <Button variant="success" size="small">按钮8</Button>
  </Space>
</div>`}
            </SyntaxHighlighter>
          </div>
          
          {/* API 文档 */}
          <div id="space-api" style={{ marginBottom: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
            <h2>API 参数</h2>
            <Table pagination={false} columns={apiColumns} dataSource={apiDataSource} />
          </div>
          
          {/* 代码示例 */}
          <div id="space-code" style={{ marginBottom: '40px' }}>
            <h2>代码示例</h2>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0' }}>
{`import { Space, Button } from '@zjpcy/simple-design';

// 基本用法
<Space gap={16}>
  <Button variant="primary">按钮1</Button>
  <Button variant="secondary">按钮2</Button>
  <Button variant="success">按钮3</Button>
</Space>

// 对齐方式
<Space gap={12} align="center">
  <Button variant="primary" size="small">小按钮</Button>
  <Button variant="secondary" size="medium">中等按钮</Button>
  <Button variant="success" size="large">大按钮</Button>
</Space>

<Space gap={12} align="start">
  {/* 顶部对齐 */}
</Space>

<Space gap={12} align="end">
  {/* 底部对齐 */}
</Space>

<Space gap={12} align="baseline">
  {/* 基线对齐 */}
</Space>

// 内联模式
<p>
  这是一段文本，
  <Space gap={8} inline as="span">
    <Button variant="primary" size="small">按钮1</Button>
    <Button variant="secondary" size="small">按钮2</Button>
  </Space>
  在文本中间插入内联按钮。
</p>

// 换行模式
<div style={{ width: '400px' }}>
  <Space gap={12} wrap="wrap">
    <Button variant="primary" size="small">按钮1</Button>
    <Button variant="secondary" size="small">按钮2</Button>
    <Button variant="success" size="small">按钮3</Button>
    <Button variant="warning" size="small">按钮4</Button>
    <Button variant="danger" size="small">按钮5</Button>
    <Button variant="primary" size="small">按钮6</Button>
    <Button variant="secondary" size="small">按钮7</Button>
    <Button variant="success" size="small">按钮8</Button>
  </Space>
</div>`}
            </SyntaxHighlighter>
          </div>
          
          {/* 在其他项目中引用示例 */}
          <div id="space-install">
            <h2>在其他项目中引用</h2>
            <div style={{ margin: '15px 0' }}>
              <h3>1. 安装</h3>
              <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
                {`npm i @zjpcy/simple-design`}
              </SyntaxHighlighter>
            </div>
            <div>
              <h3>2. 引用组件</h3>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`// 方式一：单独引入
import Space from '@zjpcy/simple-design/lib/Space';
import '@zjpcy/simple-design/lib/Space/Space.css';

// 方式二：批量引入
import { Space } from '@zjpcy/simple-design';
import '@zjpcy/simple-design/lib/index.css';`}
              </SyntaxHighlighter>
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
                <Anchor.Link href="#space-intro" title="组件介绍" />
                <Anchor.Link href="#space-basic" title="基本使用" />
                <Anchor.Link href="#space-align" title="对齐方式" />
                <Anchor.Link href="#space-inline" title="内联模式" />
                <Anchor.Link href="#space-wrap" title="换行模式" />
                <Anchor.Link href="#space-api" title="API 参数" />
                <Anchor.Link href="#space-code" title="代码示例" />
                <Anchor.Link href="#space-install" title="安装引用" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceExample;

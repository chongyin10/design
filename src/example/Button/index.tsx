import React, { useState, useEffect } from 'react';
import { Flex, Button, Table, Anchor } from '../../components';
import type { Column } from '../../components/Table';
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

const DemoRow: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Flex align="center" gap="middle" style={{ marginBottom: '16px' }}>
    <span style={{ minWidth: '120px', fontWeight: 500 }}>{title}:</span>
    {children}
  </Flex>
);

const ButtonExample: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  // API 表格列配置
  const apiColumns: Column[] = [
    { dataIndex: 'property', title: '属性', width: '120px' },
    { dataIndex: 'description', title: '说明', width: '250px' },
    { dataIndex: 'type', title: '类型', width: '300px' },
    { dataIndex: 'default', title: '默认值', width: '100px' },
  ];

  // API 表格数据源
  const apiDataSource = [
    { property: 'children', description: '按钮文本内容', type: 'React.ReactNode', default: '-' },
    { property: 'variant', description: '按钮变体样式', type: "'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'link'", default: "'primary'" },
    { property: 'size', description: '按钮尺寸', type: "'small' | 'medium' | 'large'", default: "'medium'" },
    { property: 'disabled', description: '是否禁用按钮', type: 'boolean', default: 'false' },
    { property: 'loading', description: '设置按钮载入状态', type: 'boolean', default: 'false' },
    { property: 'href', description: '设置链接按钮的跳转地址（仅在 variant="link" 时生效）', type: 'string', default: '-' },
    { property: 'icon', description: '按钮前缀图标，支持字符串（内置图标名）或自定义图标节点', type: 'string | React.ReactNode', default: '-' },
    { property: 'onClick', description: '点击事件回调', type: '() => void', default: '-' },
    { property: 'className', description: '自定义 CSS 类名', type: 'string', default: '-' },
    { property: 'style', description: '自定义内联样式', type: 'React.CSSProperties', default: '-' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="button-intro">Button 按钮</h1>
          <p>用于触发一个即时操作。</p>

          {/* 基础用法 */}
          <div id="button-basic">
            <Section title="基础用法">
              <DemoRow title="主要按钮">
                <Button variant="primary" onClick={() => setClickCount(prev => prev + 1)}>
                  Primary
                </Button>
              </DemoRow>
              <DemoRow title="次要按钮">
                <Button variant="secondary">Secondary</Button>
              </DemoRow>
              <DemoRow title="危险按钮">
                <Button variant="danger">Danger</Button>
              </DemoRow>
              <DemoRow title="成功按钮">
                <Button variant="success">Success</Button>
              </DemoRow>
              <DemoRow title="警告按钮">
                <Button variant="warning">Warning</Button>
              </DemoRow>
              <CopyBlock code={`import { Button } from '@zjpcy/simple-design';

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>`} />
            </Section>
          </div>

          {/* 不同尺寸 */}
          <div id="button-size">
            <Section title="不同尺寸">
              <DemoRow title="小号">
                <Button variant="primary" size="small">Small</Button>
              </DemoRow>
              <DemoRow title="中号">
                <Button variant="primary" size="medium">Medium</Button>
              </DemoRow>
              <DemoRow title="大号">
                <Button variant="primary" size="large">Large</Button>
              </DemoRow>
              <CopyBlock code={`import { Button } from '@zjpcy/simple-design';

// 小号
<Button variant="primary" size="small">Small</Button>

// 中号
<Button variant="primary" size="medium">Medium</Button>

// 大号
<Button variant="primary" size="large">Large</Button>`} />
            </Section>
          </div>

          {/* 禁用状态 */}
          <div id="button-disabled">
            <Section title="禁用状态">
              <DemoRow title="禁用主要">
                <Button variant="primary" disabled>Disabled</Button>
              </DemoRow>
              <DemoRow title="禁用次要">
                <Button variant="secondary" disabled>Disabled</Button>
              </DemoRow>
              <CopyBlock code={`import { Button } from '@zjpcy/simple-design';

<Button variant="primary" disabled>Disabled</Button>
<Button variant="secondary" disabled>Disabled</Button>`} />
            </Section>
          </div>

          {/* 带图标 */}
          <div id="button-icon">
            <Section title="带图标">
              <DemoRow title="搜索图标">
                <Button variant="primary" icon="search">Search</Button>
              </DemoRow>
              <DemoRow title="用户图标">
                <Button variant="secondary" icon="user">User</Button>
              </DemoRow>
              <DemoRow title="删除图标">
                <Button variant="danger" icon="delete">Delete</Button>
              </DemoRow>
              <DemoRow title="成功图标">
                <Button variant="success" icon="check">Confirm</Button>
              </DemoRow>
              <DemoRow title="警告图标">
                <Button variant="warning" icon="exclamation">Warning</Button>
              </DemoRow>
              <CopyBlock code={`import { Button } from '@zjpcy/simple-design';

<Button variant="primary" icon="search">Search</Button>
<Button variant="secondary" icon="user">User</Button>
<Button variant="danger" icon="delete">Delete</Button>
<Button variant="success" icon="check">Confirm</Button>
<Button variant="warning" icon="exclamation">Warning</Button>`} />
            </Section>
          </div>

          {/* 链接按钮 */}
          <div id="button-link">
            <Section title="链接按钮">
              <DemoRow title="基础链接">
                <Button variant="link" href="https://example.com">Link Button</Button>
              </DemoRow>
              <DemoRow title="禁用链接">
                <Button variant="link" href="https://example.com" disabled>Disabled Link</Button>
              </DemoRow>
              <DemoRow title="带图标链接">
                <Button variant="link" href="/home" icon="home">Home</Button>
              </DemoRow>
              <DemoRow title="小号链接">
                <Button variant="link" href="#" size="small">Small Link</Button>
              </DemoRow>
              <CopyBlock code={`import { Button } from '@zjpcy/simple-design';

// 基础链接
<Button variant="link" href="https://example.com">Link Button</Button>

// 禁用链接
<Button variant="link" href="https://example.com" disabled>Disabled Link</Button>

// 带图标链接
<Button variant="link" href="/home" icon="home">Home</Button>

// 小号链接
<Button variant="link" href="#" size="small">Small Link</Button>`} />
            </Section>
          </div>

          {/* 加载状态 */}
          <div id="button-loading">
            <Section title="加载状态">
              <DemoRow title="加载中">
                <Button variant="primary" loading>Loading</Button>
              </DemoRow>
              <DemoRow title="带图标加载">
                <Button variant="secondary" loading>Loading</Button>
              </DemoRow>
              <CopyBlock code={`import { Button } from '@zjpcy/simple-design';

<Button variant="primary" loading>Loading</Button>
<Button variant="secondary" loading>Loading</Button>`} />
            </Section>
          </div>

          {/* 事件回调 */}
          <div id="button-event">
            <Section title="事件回调">
              <DemoRow title="点击计数">
                <Button variant="primary" onClick={() => setClickCount(prev => prev + 1)}>
                  Click Me ({clickCount})
                </Button>
                <span>已点击 {clickCount} 次</span>
              </DemoRow>
              <CopyBlock code={`import { useState } from 'react';
import { Button } from '@zjpcy/simple-design';

const Demo = () => {
  const [count, setCount] = useState(0);
  
  return (
    <Button variant="primary" onClick={() => setCount(prev => prev + 1)}>
      Click Me ({count})
    </Button>
  );
};`} />
            </Section>
          </div>

          {/* 自定义样式 */}
          <div id="button-custom">
            <Section title="自定义样式">
              <DemoRow title="圆角按钮">
                <Button 
                  variant="primary" 
                  style={{ borderRadius: '20px', padding: '8px 24px' }}
                >
                  Rounded Button
                </Button>
              </DemoRow>
              <DemoRow title="渐变背景">
                <Button 
                  variant="primary" 
                  style={{ 
                    background: 'linear-gradient(45deg, #1890ff, #69c0ff)',
                    border: 'none'
                  }}
                >
                  Gradient Button
                </Button>
              </DemoRow>
              <CopyBlock code={`import { Button } from '@zjpcy/simple-design';

// 圆角按钮
<Button 
  variant="primary" 
  style={{ borderRadius: '20px', padding: '8px 24px' }}
>
  Rounded Button
</Button>

// 渐变背景
<Button 
  variant="primary" 
  style={{ 
    background: 'linear-gradient(45deg, #1890ff, #69c0ff)',
    border: 'none'
  }}
>
  Gradient Button
</Button>`} />
            </Section>
          </div>

          {/* API 文档 */}
          <div id="button-api">
            <Section title="API">
              <h3>Props</h3>
              <Table 
                columns={apiColumns} 
                dataSource={apiDataSource} 
                pagination={false}
              />
            </Section>
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
                <Anchor.Link href="#button-intro" title="组件介绍" />
                <Anchor.Link href="#button-basic" title="基础用法" />
                <Anchor.Link href="#button-size" title="不同尺寸" />
                <Anchor.Link href="#button-disabled" title="禁用状态" />
                <Anchor.Link href="#button-icon" title="带图标" />
                <Anchor.Link href="#button-link" title="链接按钮" />
                <Anchor.Link href="#button-loading" title="加载状态" />
                <Anchor.Link href="#button-event" title="事件回调" />
                <Anchor.Link href="#button-custom" title="自定义样式" />
                <Anchor.Link href="#button-api" title="API 文档" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonExample;

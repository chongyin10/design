import React, { useState, useEffect } from 'react';
import { Flex, Button, Table, Anchor } from '../../components';
import type { Column } from '../../components/Table';
import { CodePlayground, Section } from '../components';
import type { ExtraLib } from '../components';
import { flexTypeLib, buttonTypeLib } from '../utils';

// 使用工具库中的类型定义
const extraLibs: ExtraLib[] = [flexTypeLib, buttonTypeLib];

// 示例代码定义
const basicCode = `const Example = () => {
  return (
    <Flex gap="middle">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
    </Flex>
  );
};`;

const sizeCode = `const Example = () => {
  return (
    <Flex gap="middle" align="center">
      <Button variant="primary" size="small">Small</Button>
      <Button variant="primary" size="medium">Medium</Button>
      <Button variant="primary" size="large">Large</Button>
    </Flex>
  );
};`;

const disabledCode = `const Example = () => {
  return (
    <Flex gap="middle">
      <Button variant="primary" disabled>Disabled</Button>
      <Button variant="secondary" disabled>Disabled</Button>
    </Flex>
  );
};`;

const iconCode = `const Example = () => {
  return (
    <Flex gap="middle" wrap>
      <Button variant="primary" icon="search">Search</Button>
      <Button variant="secondary" icon="user">User</Button>
      <Button variant="danger" icon="delete">Delete</Button>
      <Button variant="success" icon="check">Confirm</Button>
      <Button variant="warning" icon="exclamation">Warning</Button>
    </Flex>
  );
};`;

const linkCode = `const Example = () => {
  return (
    <Flex gap="middle" wrap>
      <Button variant="link" href="https://example.com">Link Button</Button>
      <Button variant="link" href="https://example.com" disabled>Disabled Link</Button>
      <Button variant="link" href="/home" icon="home">Home</Button>
      <Button variant="link" href="#" size="small">Small Link</Button>
    </Flex>
  );
};`;

const loadingCode = `const Example = () => {
  return (
    <Flex gap="middle">
      <Button variant="primary" loading>Loading</Button>
      <Button variant="secondary" loading>Loading</Button>
    </Flex>
  );
};`;

const eventCode = `const Example = () => {
  const [count, setCount] = React.useState(0);

  return (
    <Flex gap="middle" align="center">
      <Button variant="primary" onClick={() => setCount(c => c + 1)}>
        Click Me ({count})
      </Button>
      <span>已点击 {count} 次</span>
    </Flex>
  );
};`;

const customCode = `const Example = () => {
  return (
    <Flex gap="middle" wrap>
      <Button
        variant="primary"
        style={{ borderRadius: '20px', padding: '8px 24px' }}
      >
        Rounded Button
      </Button>
      <Button
        variant="primary"
        style={{
          background: 'linear-gradient(45deg, #1890ff, #69c0ff)',
          border: 'none'
        }}
      >
        Gradient Button
      </Button>
    </Flex>
  );
};`;

const ButtonExample: React.FC = () => {
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  // 共享的 scope，包含 Button 组件
  const scope = { Button, Flex };

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
          <p>
            用于触发一个即时操作。
            <strong style={{ color: '#1890ff' }}> 编辑下方代码可实时预览效果！</strong>
          </p>

          {/* 基础用法 */}
          <div id="button-basic">
            <Section title="基础用法">
              <p>五种主要按钮变体，适用于不同场景</p>
              <CodePlayground initialCode={basicCode} height={80} scope={scope} extraLibs={extraLibs} />
            </Section>
          </div>

          {/* 不同尺寸 */}
          <div id="button-size">
            <Section title="不同尺寸">
              <p>提供三种尺寸选择</p>
              <CodePlayground initialCode={sizeCode} height={80} scope={scope} extraLibs={extraLibs} />
            </Section>
          </div>

          {/* 禁用状态 */}
          <div id="button-disabled">
            <Section title="禁用状态">
              <p>禁用状态下的按钮不可点击</p>
              <CodePlayground initialCode={disabledCode} height={80} scope={scope} extraLibs={extraLibs} />
            </Section>
          </div>

          {/* 带图标 */}
          <div id="button-icon">
            <Section title="带图标">
              <p>支持内置图标名称或自定义图标</p>
              <CodePlayground initialCode={iconCode} height={120} scope={scope} extraLibs={extraLibs} />
            </Section>
          </div>

          {/* 链接按钮 */}
          <div id="button-link">
            <Section title="链接按钮">
              <p>使用 variant="link" 创建链接样式的按钮</p>
              <CodePlayground initialCode={linkCode} height={100} scope={scope} extraLibs={extraLibs} />
            </Section>
          </div>

          {/* 加载状态 */}
          <div id="button-loading">
            <Section title="加载状态">
              <p>loading 属性显示加载状态</p>
              <CodePlayground initialCode={loadingCode} height={80} scope={scope} extraLibs={extraLibs} />
            </Section>
          </div>

          {/* 事件回调 */}
          <div id="button-event">
            <Section title="事件回调">
              <p>通过 onClick 绑定点击事件</p>
              <CodePlayground initialCode={eventCode} height={80} scope={scope} extraLibs={extraLibs} />
            </Section>
          </div>

          {/* 自定义样式 */}
          <div id="button-custom">
            <Section title="自定义样式">
              <p>使用 style 属性覆盖默认样式</p>
              <CodePlayground initialCode={customCode} height={100} scope={scope} extraLibs={extraLibs} />
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

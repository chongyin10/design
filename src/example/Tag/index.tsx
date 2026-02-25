import React, { useState } from 'react';
import { Flex, Tag, Table, Button } from '../../components';
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

const TagExample: React.FC = () => {
  const [visibleTags, setVisibleTags] = useState<string[]>(['标签1', '标签2', '标签3']);
  const [clickCount, setClickCount] = useState(0);

  // API 表格列配置
  const apiColumns: Column[] = [
    { dataIndex: 'property', title: '属性', width: '120px' },
    { dataIndex: 'description', title: '说明', width: '250px' },
    { dataIndex: 'type', title: '类型', width: '300px' },
    { dataIndex: 'default', title: '默认值', width: '100px' },
  ];

  // API 数据源
  const apiDataSource = [
    { property: 'children', description: '标签内容', type: 'React.ReactNode', default: '-' },
    { property: 'className', description: '自定义类名', type: 'string', default: '-' },
    { property: 'style', description: '自定义样式', type: 'React.CSSProperties', default: '-' },
    { property: 'size', description: '标签尺寸', type: "'small' | 'medium' | 'large'", default: "'medium'" },
    { property: 'backgroundColor', description: '自定义背景色', type: 'string', default: '-' },
    { property: 'color', description: '自定义字体颜色', type: 'string', default: '-' },
    { property: 'icon', description: '前缀图标，可以是 Icon 组件的 type 字符串或自定义 React 节点', type: 'string | React.ReactNode', default: '-' },
    { property: 'closable', description: '是否可关闭', type: 'boolean', default: 'false' },
    { property: 'onClose', description: '关闭时的回调', type: '(e: React.MouseEvent) => void', default: '-' },
    { property: 'onClick', description: '点击标签时的回调', type: '(e: React.MouseEvent) => void', default: '-' },
  ];

  const handleClose = (tag: string) => {
    setVisibleTags(prev => prev.filter(t => t !== tag));
  };

  const handleAddTag = () => {
    const newTag = `标签${visibleTags.length + 1}`;
    setVisibleTags(prev => [...prev, newTag]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Tag 标签</h1>
      <p>用于标记和分类的标签组件。</p>

      {/* 基础用法 */}
      <Section title="基础用法">
        <DemoRow title="默认标签">
          <Tag>默认标签</Tag>
        </DemoRow>
        <DemoRow title="小号标签">
          <Tag size="small">小号标签</Tag>
        </DemoRow>
        <DemoRow title="中号标签">
          <Tag size="medium">中号标签</Tag>
        </DemoRow>
        <DemoRow title="大号标签">
          <Tag size="large">大号标签</Tag>
        </DemoRow>
        <CopyBlock code={`import { Tag } from '@zjpcy/simple-design';

<Tag>默认标签</Tag>
<Tag size="small">小号标签</Tag>
<Tag size="medium">中号标签</Tag>
<Tag size="large">大号标签</Tag>`} />
      </Section>

      {/* 可关闭标签 */}
      <Section title="可关闭标签">
        <DemoRow title="可关闭">
          <Flex gap="small" wrap="wrap">
            {visibleTags.map(tag => (
              <Tag key={tag} closable onClose={() => handleClose(tag)}>
                {tag}
              </Tag>
            ))}
          </Flex>
        </DemoRow>
        <DemoRow title="操作">
          <Button variant="primary" size="small" onClick={handleAddTag}>
            添加标签
          </Button>
        </DemoRow>
        <CopyBlock code={`import { useState } from 'react';
import { Tag, Button } from '@zjpcy/simple-design';

const TagExample = () => {
  const [visibleTags, setVisibleTags] = useState(['标签1', '标签2', '标签3']);

  const handleClose = (tag: string) => {
    setVisibleTags(prev => prev.filter(t => t !== tag));
  };

  const handleAddTag = () => {
    const newTag = \`标签\${visibleTags.length + 1}\`;
    setVisibleTags(prev => [...prev, newTag]);
  };

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        {visibleTags.map(tag => (
          <Tag key={tag} closable onClose={() => handleClose(tag)}>
            {tag}
          </Tag>
        ))}
      </div>
      <Button onClick={handleAddTag}>添加标签</Button>
    </>
  );
};`} />
      </Section>

      {/* 带图标 */}
      <Section title="带图标">
        <DemoRow title="搜索图标">
          <Tag icon="search">搜索</Tag>
        </DemoRow>
        <DemoRow title="用户图标">
          <Tag icon="user">用户</Tag>
        </DemoRow>
        <DemoRow title="成功图标">
          <Tag icon="check">成功</Tag>
        </DemoRow>
        <DemoRow title="警告图标">
          <Tag icon="exclamation">警告</Tag>
        </DemoRow>
        <DemoRow title="关闭图标">
          <Tag icon="close">关闭</Tag>
        </DemoRow>
        <CopyBlock code={`import { Tag } from '@zjpcy/simple-design';

<Tag icon="search">搜索</Tag>
<Tag icon="user">用户</Tag>
<Tag icon="check">成功</Tag>
<Tag icon="exclamation">警告</Tag>
<Tag icon="close">关闭</Tag>`} />
      </Section>

      {/* 自定义颜色 */}
      <Section title="自定义颜色">
        <DemoRow title="背景色">
          <Tag backgroundColor="#e6f7ff" color="#1890ff">蓝色标签</Tag>
        </DemoRow>
        <DemoRow title="成功色">
          <Tag backgroundColor="#f6ffed" color="#52c41a">绿色标签</Tag>
        </DemoRow>
        <DemoRow title="警告色">
          <Tag backgroundColor="#fffbe6" color="#faad14">橙色标签</Tag>
        </DemoRow>
        <DemoRow title="错误色">
          <Tag backgroundColor="#fff2e8" color="#ff4d4f">红色标签</Tag>
        </DemoRow>
        <DemoRow title="紫色">
          <Tag backgroundColor="#f9f0ff" color="#722ed1">紫色标签</Tag>
        </DemoRow>
        <CopyBlock code={`import { Tag } from '@zjpcy/simple-design';

<Tag backgroundColor="#e6f7ff" color="#1890ff">蓝色标签</Tag>
<Tag backgroundColor="#f6ffed" color="#52c41a">绿色标签</Tag>
<Tag backgroundColor="#fffbe6" color="#faad14">橙色标签</Tag>
<Tag backgroundColor="#fff2e8" color="#ff4d4f">红色标签</Tag>
<Tag backgroundColor="#f9f0ff" color="#722ed1">紫色标签</Tag>`} />
      </Section>

      {/* 可点击 */}
      <Section title="可点击">
        <DemoRow title="点击标签">
          <Tag onClick={() => setClickCount(prev => prev + 1)}>点击我</Tag>
        </DemoRow>
        <DemoRow title="点击次数">
          <span>已点击 {clickCount} 次</span>
        </DemoRow>
        <CopyBlock code={`import { useState } from 'react';
import { Tag } from '@zjpcy/simple-design';

const TagExample = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <Tag onClick={() => setCount(prev => prev + 1)}>
        点击我
      </Tag>
      <span>已点击 {count} 次</span>
    </>
  );
};`} />
      </Section>

      {/* 组合示例 */}
      <Section title="组合示例">
        <DemoRow title="状态标签">
          <Flex gap="small" wrap="wrap">
            <Tag icon="check" backgroundColor="#f6ffed" color="#52c41a">已完成</Tag>
            <Tag icon="loading" backgroundColor="#e6f7ff" color="#1890ff">进行中</Tag>
            <Tag icon="clock" backgroundColor="#fffbe6" color="#faad14">待处理</Tag>
            <Tag icon="close" backgroundColor="#fff2e8" color="#ff4d4f">已取消</Tag>
          </Flex>
        </DemoRow>
        <DemoRow title="分类标签">
          <Flex gap="small" wrap="wrap">
            <Tag closable>JavaScript</Tag>
            <Tag closable>TypeScript</Tag>
            <Tag closable>React</Tag>
            <Tag closable>Vue</Tag>
            <Tag closable>Node.js</Tag>
          </Flex>
        </DemoRow>
        <CopyBlock code={`import { Flex, Tag } from '@zjpcy/simple-design';

// 状态标签
<Flex gap="small" wrap>
  <Tag icon="check" backgroundColor="#f6ffed" color="#52c41a">已完成</Tag>
  <Tag icon="loading" backgroundColor="#e6f7ff" color="#1890ff">进行中</Tag>
  <Tag icon="clock" backgroundColor="#fffbe6" color="#faad14">待处理</Tag>
  <Tag icon="close" backgroundColor="#fff2e8" color="#ff4d4f">已取消</Tag>
</Flex>

// 分类标签
<Flex gap="small" wrap>
  <Tag closable>JavaScript</Tag>
  <Tag closable>TypeScript</Tag>
  <Tag closable>React</Tag>
  <Tag closable>Vue</Tag>
  <Tag closable>Node.js</Tag>
</Flex>`} />
      </Section>

      {/* API 文档 */}
      <Section title="API">
        <h3>Props</h3>
        <Table 
          columns={apiColumns} 
          dataSource={apiDataSource} 
          pagination={false}
        />
      </Section>
    </div>
  );
};

export default TagExample;

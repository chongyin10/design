import React, { useState } from 'react';
import { Splitter, Table } from '../../components';
import type { Column } from '../../components/Table';
import type { SplitterPanel } from '../../components/Splitter/types';
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

const PanelContent: React.FC<{ title: string; color: string; children?: React.ReactNode }> = ({ title, color, children }) => (
  <div style={{
    height: '100%',
    background: color,
    overflow: 'auto',
    padding: '16px',
    boxSizing: 'border-box',
  }}>
    <h3 style={{ margin: '0 0 8px 0' }}>{title}</h3>
    {children}
  </div>
);

const SplitterExample: React.FC = () => {
  const [sizes, setSizes] = useState<number[]>([]);

  // API 表格列配置
  const apiColumns: Column[] = [
    { dataIndex: 'property', title: '属性', width: '140px' },
    { dataIndex: 'description', title: '说明', width: '300px' },
    { dataIndex: 'type', title: '类型', width: '350px' },
    { dataIndex: 'default', title: '默认值', width: '150px' },
  ];

  // API 数据源
  const apiDataSource = [
    { property: 'layout', description: '布局方向', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
    { property: 'panels', description: '面板数组配置（多面板模式）', type: 'SplitterPanel[]', default: '-' },
    { property: 'defaultSize', description: '默认大小（单值或数组）', type: 'number | string | (number | string)[]', default: "'50%'" },
    { property: 'minSize', description: '最小尺寸（单值或数组）', type: 'number | number[]', default: '50' },
    { property: 'maxSize', description: '最大尺寸（单值或数组）', type: 'number | number[]', default: 'Infinity' },
    { property: 'splitterSize', description: '分割条大小（像素）', type: 'number', default: '10' },
    { property: 'lineColor', description: '拖拽线颜色', type: 'string', default: '-' },
    { property: 'lineHoverColor', description: '拖拽线悬停/拖拽时的颜色', type: 'string', default: '-' },
    { property: 'disabled', description: '是否禁用拖拽', type: 'boolean', default: 'false' },
    { property: 'onResize', description: '拖拽时的回调', type: '(sizes: number[], index: number) => void', default: '-' },
    { property: 'onResizeEnd', description: '拖拽结束后的回调', type: '(sizes: number[]) => void', default: '-' },
    { property: 'className', description: '自定义类名', type: 'string', default: '-' },
    { property: 'style', description: '自定义样式', type: 'React.CSSProperties', default: '-' },
    { property: 'left', description: '左侧面板（2面板模式，已废弃）', type: 'React.ReactNode', default: '-' },
    { property: 'right', description: '右侧面板（2面板模式，已废弃）', type: 'React.ReactNode', default: '-' },
    { property: 'top', description: '上面板（2面板模式，已废弃）', type: 'React.ReactNode', default: '-' },
    { property: 'bottom', description: '下面板（2面板模式，已废弃）', type: 'React.ReactNode', default: '-' },
    { property: 'children', description: '子元素数组', type: 'React.ReactNode[]', default: '-' },
  ];

  // 多面板配置示例
  const multiPanels: SplitterPanel[] = [
    {
      content: <PanelContent title="导航面板" color="#f0f2f5">固定宽度 200px</PanelContent>,
      defaultSize: 200,
      minSize: 150,
      maxSize: 300,
    },
    {
      content: <PanelContent title="主内容" color="#e6f7ff">自适应宽度</PanelContent>,
      defaultSize: '40%',
      minSize: 200,
    },
    {
      content: <PanelContent title="属性面板" color="#f6ffed">最小 150px</PanelContent>,
      minSize: 150,
    },
  ];

  // 垂直多面板配置
  const verticalPanels: SplitterPanel[] = [
    {
      content: <PanelContent title="顶部工具栏" color="#fff0f6">高度 80px</PanelContent>,
      defaultSize: 80,
      minSize: 60,
      maxSize: 120,
    },
    {
      content: <PanelContent title="编辑器" color="#f9f0ff">自适应高度</PanelContent>,
      defaultSize: '60%',
      minSize: 100,
    },
    {
      content: <PanelContent title="底部控制台" color="#fff2e8">最小 100px</PanelContent>,
      minSize: 100,
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Splitter 分割面板</h1>
      <p>用于自由切分指定区域，支持水平和垂直分隔，可拖拽调整各区域大小。支持双面板和多面板模式。</p>

      {/* 双面板模式（向后兼容） */}
      <Section title="双面板模式（基础用法）">
        <p>经典的左右/上下两面板布局，通过 left/right 或 top/bottom 属性配置</p>
        <div style={{ height: 300 }}>
          <Splitter
            layout="horizontal"
            defaultSize="30%"
            minSize={100}
            maxSize={500}
            left={
              <PanelContent title="左侧面板" color="#f0f2f5">
                <p>默认宽度 30%</p>
                <p>最小 100px，最大 500px</p>
              </PanelContent>
            }
            right={
              <PanelContent title="右侧面板" color="#e6f7ff">
                <p>自动填充剩余空间</p>
              </PanelContent>
            }
          />
        </div>
        <CopyBlock code={`import { Splitter } from '@zjpcy/simple-design';

<Splitter
  layout="horizontal"
  defaultSize="30%"
  minSize={100}
  maxSize={500}
  left={<div>左侧面板</div>}
  right={<div>右侧面板</div>}
/>`} />
      </Section>

      {/* 使用 children 方式 */}
      <Section title="使用 children（双面板）">
        <p>使用 children 传递两个子元素作为左右面板</p>
        <div style={{ height: 300 }}>
          <Splitter layout="horizontal" defaultSize={200}>
            <PanelContent title="左侧面板" color="#fff2e8">固定宽度 200px</PanelContent>
            <PanelContent title="右侧面板" color="#f6ffed">自动填充剩余空间</PanelContent>
          </Splitter>
        </div>
        <CopyBlock code={`import { Splitter } from '@zjpcy/simple-design';

<Splitter layout="horizontal" defaultSize={200}>
  <div>左侧面板</div>
  <div>右侧面板</div>
</Splitter>`} />
      </Section>

      {/* 多面板模式 - 水平 */}
      <Section title="多面板模式 - 水平布局">
        <p>支持三个或更多面板，通过 panels 数组配置每个面板</p>
        <div style={{ height: 300 }}>
          <Splitter
            layout="horizontal"
            panels={multiPanels}
            onResize={(newSizes) => setSizes(newSizes)}
            onResizeEnd={(finalSizes) => console.log('最终尺寸:', finalSizes)}
          />
        </div>
        <p style={{ color: '#666', fontSize: '14px' }}>
          当前尺寸: {sizes.map((s, i) => `面板${i + 1}: ${s.toFixed(0)}px`).join(', ')}
        </p>
        <CopyBlock code={`import { Splitter } from '@zjpcy/simple-design';
import type { SplitterPanel } from '@zjpcy/simple-design';

const panels: SplitterPanel[] = [
  {
    content: <div>导航面板</div>,
    defaultSize: 200,
    minSize: 150,
    maxSize: 300,
  },
  {
    content: <div>主内容</div>,
    defaultSize: '40%',
    minSize: 200,
  },
  {
    content: <div>属性面板</div>,
    minSize: 150,
  },
];

<Splitter layout="horizontal" panels={panels} />`} />
      </Section>

      {/* 多面板模式 - 垂直 */}
      <Section title="多面板模式 - 垂直布局">
        <p>垂直方向的多面板布局</p>
        <div style={{ height: 400 }}>
          <Splitter
            layout="vertical"
            panels={verticalPanels}
          />
        </div>
        <CopyBlock code={`import { Splitter } from '@zjpcy/simple-design';

const panels: SplitterPanel[] = [
  { content: <div>顶部工具栏</div>, defaultSize: 80, minSize: 60, maxSize: 120 },
  { content: <div>编辑器</div>, defaultSize: '60%', minSize: 100 },
  { content: <div>底部控制台</div>, minSize: 100 },
];

<Splitter layout="vertical" panels={panels} />`} />
      </Section>

      {/* 使用 children 的多面板 */}
      <Section title="多面板 - 使用 children">
        <p>通过 children 传递多个子元素实现多面板，使用数组配置尺寸</p>
        <div style={{ height: 300 }}>
          <Splitter
            layout="horizontal"
            defaultSize={['25%', '35%', '40%']}
            minSize={[100, 150, 100]}
          >
            <PanelContent title="面板 A" color="#fff0f6">25%</PanelContent>
            <PanelContent title="面板 B" color="#f9f0ff">35%</PanelContent>
            <PanelContent title="面板 C" color="#fff2e8">40%</PanelContent>
          </Splitter>
        </div>
        <CopyBlock code={`import { Splitter } from '@zjpcy/simple-design';

<Splitter
  layout="horizontal"
  defaultSize={['25%', '35%', '40%']}
  minSize={[100, 150, 100]}
>
  <div>面板 A</div>
  <div>面板 B</div>
  <div>面板 C</div>
</Splitter>`} />
      </Section>

      {/* 禁用特定分割条 */}
      <Section title="禁用特定分割条">
        <p>通过面板配置 disabled 属性，可以禁用特定相邻分割条的拖拽</p>
        <div style={{ height: 300 }}>
          <Splitter
            layout="horizontal"
            panels={[
              {
                content: <PanelContent title="固定面板" color="#fcffe6">左侧分割条已禁用</PanelContent>,
                defaultSize: 200,
                disabled: true,
              },
              {
                content: <PanelContent title="可调整面板" color="#e6fffb">可以拖拽调整</PanelContent>,
                defaultSize: '30%',
              },
              {
                content: <PanelContent title="右侧面板" color="#f0f2f5">自动填充</PanelContent>,
              },
            ]}
          />
        </div>
        <CopyBlock code={`import { Splitter } from '@zjpcy/simple-design';

<Splitter
  layout="horizontal"
  panels={[
    { content: <div>固定面板</div>, defaultSize: 200, disabled: true },
    { content: <div>可调整面板</div>, defaultSize: '30%' },
    { content: <div>右侧面板</div> },
  ]}
/>`} />
      </Section>

      {/* 垂直分隔示例 */}
      <Section title="垂直分隔（双面板）">
        <p>上下两个面板，可拖拽中间的分割条调整大小</p>
        <div style={{ height: 400 }}>
          <Splitter
            layout="vertical"
            defaultSize="40%"
            minSize={80}
            onResize={(newSizes) => console.log('垂直双面板尺寸:', newSizes)}
            top={
              <PanelContent title="顶部面板" color="#fff0f6">
                <p>默认高度 40%</p>
                <p>最小高度 80px</p>
              </PanelContent>
            }
            bottom={
              <PanelContent title="底部面板" color="#f9f0ff">
                <p>自动填充剩余空间</p>
              </PanelContent>
            }
          />
        </div>
        <CopyBlock code={`import { Splitter } from '@zjpcy/simple-design';

<Splitter
  layout="vertical"
  defaultSize="40%"
  minSize={80}
  top={<div>顶部面板</div>}
  bottom={<div>底部面板</div>}
/>`} />
      </Section>

      {/* 禁用拖拽 */}
      <Section title="禁用拖拽">
        <p>设置 disabled 属性禁用所有拖拽调整</p>
        <div style={{ height: 200 }}>
          <Splitter
            layout="horizontal"
            defaultSize="50%"
            disabled
            left={
              <PanelContent title="左侧面板" color="#fcffe6">拖拽已禁用</PanelContent>
            }
            right={
              <PanelContent title="右侧面板" color="#e6fffb" />
            }
          />
        </div>
        <CopyBlock code={`import { Splitter } from '@zjpcy/simple-design';

<Splitter
  layout="horizontal"
  defaultSize="50%"
  disabled
  left={<div>左侧面板</div>}
  right={<div>右侧面板</div>}
/>`} />
      </Section>

      {/* 自定义颜色 */}
      <Section title="自定义颜色">
        <p>自定义拖拽线的颜色</p>
        <div style={{ height: 200 }}>
          <Splitter
            layout="horizontal"
            defaultSize="50%"
            lineColor="#d9d9d9"
            lineHoverColor="#52c41a"
            left={
              <PanelContent title="左侧面板" color="#f0f2f5" />
            }
            right={
              <PanelContent title="右侧面板" color="#f6ffed" />
            }
          />
        </div>
        <CopyBlock code={`import { Splitter } from '@zjpcy/simple-design';

<Splitter
  layout="horizontal"
  defaultSize="50%"
  lineColor="#d9d9d9"
  lineHoverColor="#52c41a"
  left={<div>左侧面板</div>}
  right={<div>右侧面板</div>}
/>`} />
      </Section>

      {/* 嵌套使用 */}
      <Section title="嵌套使用">
        <p>嵌套 Splitter 实现复杂布局</p>
        <div style={{ height: 400 }}>
          <Splitter
            layout="horizontal"
            defaultSize="25%"
            left={
              <PanelContent title="左侧导航" color="#f0f2f5" />
            }
            right={
              <Splitter
                layout="vertical"
                defaultSize="30%"
                top={
                  <PanelContent title="顶部内容" color="#e6f7ff" />
                }
                bottom={
                  <PanelContent title="底部内容" color="#f6ffed" />
                }
              />
            }
          />
        </div>
        <CopyBlock code={`import { Splitter } from '@zjpcy/simple-design';

<Splitter
  layout="horizontal"
  defaultSize="25%"
  left={<div>左侧导航</div>}
  right={
    <Splitter
      layout="vertical"
      defaultSize="30%"
      top={<div>顶部内容</div>}
      bottom={<div>底部内容</div>}
    />
  }
/>`} />
      </Section>

      {/* API 文档 */}
      <Section title="API">
        <h3>Props</h3>
        <Table
          columns={apiColumns}
          dataSource={apiDataSource}
          pagination={false}
        />

        <h3 style={{ marginTop: '24px' }}>SplitterPanel</h3>
        <Table
          columns={[
            { dataIndex: 'property', title: '属性', width: '140px' },
            { dataIndex: 'description', title: '说明', width: '300px' },
            { dataIndex: 'type', title: '类型', width: '350px' },
            { dataIndex: 'default', title: '默认值', width: '150px' },
          ]}
          dataSource={[
            { property: 'content', description: '面板内容', type: 'React.ReactNode', default: '-' },
            { property: 'defaultSize', description: '面板默认大小', type: 'number | string', default: "'auto'" },
            { property: 'minSize', description: '面板最小尺寸', type: 'number', default: '50' },
            { property: 'maxSize', description: '面板最大尺寸', type: 'number', default: 'Infinity' },
            { property: 'disabled', description: '是否禁用相邻分割条', type: 'boolean', default: 'false' },
          ]}
          pagination={false}
        />
      </Section>
    </div>
  );
};

export default SplitterExample;

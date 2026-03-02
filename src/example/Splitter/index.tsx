import React, { useState } from 'react';
import { Splitter, Table } from '../../components';
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

const SplitterExample: React.FC = () => {
  const [leftSize, setLeftSize] = useState<number>(0);
  const [topSize, setTopSize] = useState<number>(0);

  // API 表格列配置
  const apiColumns: Column[] = [
    { dataIndex: 'property', title: '属性', width: '140px' },
    { dataIndex: 'description', title: '说明', width: '250px' },
    { dataIndex: 'type', title: '类型', width: '300px' },
    { dataIndex: 'default', title: '默认值', width: '120px' },
  ];

  // API 数据源
  const apiDataSource = [
    { property: 'layout', description: '布局方向', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
    { property: 'defaultSize', description: '默认大小（像素或百分比）', type: 'number | string', default: "'50%'" },
    { property: 'minSize', description: '最小尺寸', type: 'number', default: '50' },
    { property: 'maxSize', description: '最大尺寸', type: 'number', default: 'Infinity' },
    { property: 'splitterSize', description: '分割条大小（像素）', type: 'number', default: '8' },
    { property: 'lineColor', description: '拖拽线颜色', type: 'string', default: '-' },
    { property: 'lineHoverColor', description: '拖拽线悬停/拖拽时的颜色', type: 'string', default: '-' },
    { property: 'disabled', description: '是否禁用拖拽', type: 'boolean', default: 'false' },
    { property: 'onResize', description: '拖拽时的回调', type: '(size: number) => void', default: '-' },
    { property: 'onResizeEnd', description: '拖拽结束后的回调', type: '(size: number) => void', default: '-' },
    { property: 'className', description: '自定义类名', type: 'string', default: '-' },
    { property: 'style', description: '自定义样式', type: 'React.CSSProperties', default: '-' },
    { property: 'left', description: '左侧面板内容（水平布局）', type: 'React.ReactNode', default: '-' },
    { property: 'right', description: '右侧面板内容（水平布局）', type: 'React.ReactNode', default: '-' },
    { property: 'top', description: '上面板内容（垂直布局）', type: 'React.ReactNode', default: '-' },
    { property: 'bottom', description: '下面板内容（垂直布局）', type: 'React.ReactNode', default: '-' },
    { property: 'children', description: '子元素（替代 left/right/top/bottom）', type: '[React.ReactNode, React.ReactNode]', default: '-' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Splitter 分割面板</h1>
      <p>用于自由切分指定区域，支持水平和垂直分隔，可拖拽调整各区域大小。</p>

      {/* 水平分隔示例 */}
      <Section title="水平分隔">
        <p>左右两个面板，可拖拽中间的分割条调整大小</p>
        <div style={{ height: 300,  }}>
          <Splitter
            layout="horizontal"
            defaultSize="30%"
            minSize={100}
            maxSize={500}
            onResize={(size) => setLeftSize(size)}
            onResizeEnd={(size) => console.log('左侧最终尺寸:', size)}
            left={
              <div style={{
                height: '100%',
                background: '#f0f2f5',
                overflow: 'auto',
               
              }}>
                <h3>左侧面板</h3>
                <p>默认宽度 30%</p>
                <p>最小 100px，最大 500px</p>
                <p>当前尺寸: {leftSize.toFixed(0)}px</p>
              </div>
            }
            right={
              <div style={{
                height: '100%',
                background: '#e6f7ff',
                overflow: 'auto',
               
              }}>
                <h3>右侧面板</h3>
                <p>自动填充剩余空间</p>
              </div>
            }
          />
        </div>
        <CopyBlock code={`import { Splitter } from '@zjpcy/simple-design';

<Splitter
  layout="horizontal"
  defaultSize="30%"
  minSize={100}
  maxSize={500}
  onResize={(size) => console.log('当前尺寸:', size)}
  onResizeEnd={(size) => console.log('最终尺寸:', size)}
  left={<div>左侧面板</div>}
  right={<div>右侧面板</div>}
/>`} />
      </Section>

      {/* 使用 children 方式 */}
      <Section title="使用 children">
        <p>使用 children 传递两个子元素作为左右面板</p>
        <div style={{ height: 300,  }}>
          <Splitter layout="horizontal" defaultSize={200}>
            <div style={{
              height: '100%',
              background: '#fff2e8',
              overflow: 'auto',
             
            }}>
              <h3>左侧面板</h3>
              <p>固定宽度 200px</p>
            </div>
            <div style={{
              height: '100%',
              background: '#f6ffed',
              overflow: 'auto',
             
            }}>
              <h3>右侧面板</h3>
              <p>自动填充剩余空间</p>
            </div>
          </Splitter>
        </div>
        <CopyBlock code={`import { Splitter } from '@zjpcy/simple-design';

<Splitter layout="horizontal" defaultSize={200}>
  <div>左侧面板</div>
  <div>右侧面板</div>
</Splitter>`} />
      </Section>

      {/* 垂直分隔示例 */}
      <Section title="垂直分隔">
        <p>上下两个面板，可拖拽中间的分割条调整大小</p>
        <div style={{ height: 400,  }}>
          <Splitter
            layout="vertical"
            defaultSize="40%"
            minSize={80}
            onResize={(size) => setTopSize(size)}
            top={
              <div style={{
                height: '100%',
                background: '#fff0f6',
                overflow: 'auto',
               
              }}>
                <h3>顶部面板</h3>
                <p>默认高度 40%</p>
                <p>最小高度 80px</p>
                <p>当前尺寸: {topSize.toFixed(0)}px</p>
              </div>
            }
            bottom={
              <div style={{
                height: '100%',
                background: '#f9f0ff',
                overflow: 'auto',
               
              }}>
                <h3>底部面板</h3>
                <p>自动填充剩余空间</p>
              </div>
            }
          />
        </div>
        <CopyBlock code={`import { Splitter } from '@zjpcy/simple-design';

<Splitter
  layout="vertical"
  defaultSize="40%"
  minSize={80}
  onResize={(size) => console.log('当前尺寸:', size)}
  top={<div>顶部面板</div>}
  bottom={<div>底部面板</div>}
/>`} />
      </Section>

      {/* 禁用拖拽 */}
      <Section title="禁用拖拽">
        <p>设置 disabled 属性禁用拖拽调整</p>
        <div style={{ height: 200,  }}>
          <Splitter
            layout="horizontal"
            defaultSize="50%"
            disabled
            left={
              <div style={{
                height: '100%',
                background: '#fcffe6',
                overflow: 'auto',
               
              }}>
                <h3>左侧面板</h3>
                <p>拖拽已禁用</p>
              </div>
            }
            right={
              <div style={{
                height: '100%',
                background: '#e6fffb',
                overflow: 'auto',
               
              }}>
                <h3>右侧面板</h3>
              </div>
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
        <div style={{ height: 200,  }}>
          <Splitter
            layout="horizontal"
            defaultSize="50%"
            lineColor="#d9d9d9"
            lineHoverColor="#52c41a"
            left={
              <div style={{
                height: '100%',
                background: '#f0f2f5',
                overflow: 'auto',
               
              }}>
                <h3>左侧面板</h3>
              </div>
            }
            right={
              <div style={{
                height: '100%',
                background: '#f6ffed',
                overflow: 'auto',
               
              }}>
                <h3>右侧面板</h3>
              </div>
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
        <div style={{ height: 400,  }}>
          <Splitter
            layout="horizontal"
            defaultSize="30%"
            left={
              <div style={{
                height: '100%',
                background: '#f0f2f5',
                overflow: 'auto',
               
              }}>
                <h3>左侧导航</h3>
              </div>
            }
            right={
              <Splitter
                layout="vertical"
                defaultSize="30%"
                top={
                  <div style={{
                    height: '100%',
                    background: '#e6f7ff',
                    overflow: 'auto',
                   
                  }}>
                    <h3>顶部内容</h3>
                  </div>
                }
                bottom={
                  <div style={{
                    height: '100%',
                    background: '#f6ffed',
                    overflow: 'auto',
                   
                  }}>
                    <h3>底部内容</h3>
                  </div>
                }
              />
            }
          />
        </div>
        <CopyBlock code={`import { Splitter } from '@zjpcy/simple-design';

<Splitter
  layout="horizontal"
  defaultSize="30%"
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
      </Section>
    </div>
  );
};

export default SplitterExample;

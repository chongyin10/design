import React, { useState } from 'react';
import { Spin, Button, Table } from '../../components';
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

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    padding: '24px',
    background: '#fff',
    ...style
  }}>
    {children}
  </div>
);

const SpinExample: React.FC = () => {
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);

  // API 表格列配置
  const apiColumns: Column[] = [
    { dataIndex: 'property', title: '属性', width: '140px' },
    { dataIndex: 'description', title: '说明', width: '300px' },
    { dataIndex: 'type', title: '类型', width: '350px' },
    { dataIndex: 'default', title: '默认值', width: '150px' },
  ];

  // API 数据源
  const apiDataSource = [
    { property: 'spinning', description: '是否为加载中状态', type: 'boolean', default: 'true' },
    { property: 'size', description: '组件大小', type: "'small' | 'default' | 'large'", default: "'default'" },
    { property: 'tip', description: '当作为包裹元素时，可以自定义描述文案', type: 'ReactNode', default: '-' },
    { property: 'delay', description: '延迟显示加载效果的时间（防止闪烁）', type: 'number (ms)', default: '0' },
    { property: 'indicator', description: '自定义加载指示符', type: 'ReactNode', default: '-' },
    { property: 'fullscreen', description: '是否全屏显示', type: 'boolean', default: 'false' },
    { property: 'className', description: '自定义类名', type: 'string', default: '-' },
    { property: 'style', description: '自定义样式', type: 'CSSProperties', default: '-' },
  ];

  // 表格数据
  const tableColumns: Column[] = [
    { dataIndex: 'name', title: '姓名', width: '100px' },
    { dataIndex: 'age', title: '年龄', width: '80px' },
    { dataIndex: 'address', title: '地址' },
  ];

  const tableData = [
    { name: '张三', age: 28, address: '北京市朝阳区' },
    { name: '李四', age: 32, address: '上海市浦东新区' },
    { name: '王五', age: 24, address: '广州市天河区' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginTop: 0, marginBottom: '24px' }}>Spin 加载中</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        用于页面和区块的加载中状态，支持多种使用模式。
      </p>

      {/* 基础用法 */}
      <Section title="基础用法">
        <Card>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <Spin size="small" />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>small</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Spin />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>default</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" />
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>large</div>
            </div>
          </div>
        </Card>
        <CopyBlock code={`<Spin size="small" />
<Spin />
<Spin size="large" />`} />
      </Section>

      {/* 带提示文本 */}
      <Section title="带提示文本">
        <Card>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <Spin tip="加载中..." />
            <Spin tip="请稍候" size="large" />
          </div>
        </Card>
        <CopyBlock code={`<Spin tip="加载中..." />
<Spin tip="请稍候" size="large" />`} />
      </Section>

      {/* 切换加载状态 */}
      <Section title="切换加载状态">
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Button onClick={() => setLoading1(!loading1)}>
              {loading1 ? '停止加载' : '开始加载'}
            </Button>
          </div>
          <Spin spinning={loading1} tip="加载中...">
            <Card style={{ background: '#f5f5f5' }}>
              <h4 style={{ marginTop: 0 }}>内容区域</h4>
              <p>这是一段示例内容，当 Spin 处于加载状态时会显示遮罩层。</p>
              <p>点击上方按钮可以切换加载状态。</p>
            </Card>
          </Spin>
        </Card>
        <CopyBlock code={`const [loading, setLoading] = useState(true);

<Spin spinning={loading} tip="加载中...">
  <Card>
    <h4>内容区域</h4>
    <p>这是一段示例内容...</p>
  </Card>
</Spin>`} />
      </Section>

      {/* 延迟显示 */}
      <Section title="延迟显示">
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Button onClick={() => setLoading2(!loading2)}>
              {loading2 ? '停止加载' : '开始加载（延迟300ms）'}
            </Button>
          </div>
          <Spin spinning={loading2} delay={300} tip="加载中（延迟300ms）...">
            <Card style={{ background: '#f5f5f5' }}>
              <h4 style={{ marginTop: 0 }}>延迟加载示例</h4>
              <p>设置 delay 属性后，加载状态会在指定时间后才显示，避免快速切换时的闪烁。</p>
            </Card>
          </Spin>
        </Card>
        <CopyBlock code={`<Spin spinning={loading} delay={300} tip="加载中...">
  <Card>
    <p>延迟显示加载效果</p>
  </Card>
</Spin>`} />
      </Section>

      {/* 表格加载示例 */}
      <Section title="表格加载示例">
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Button onClick={() => setTableLoading(!tableLoading)}>
              {tableLoading ? '加载完成' : '重新加载'}
            </Button>
          </div>
          <Spin spinning={tableLoading} tip="数据加载中...">
            <Table
              columns={tableColumns}
              dataSource={tableData}
              pagination={false}
            />
          </Spin>
        </Card>
        <CopyBlock code={`<Spin spinning={loading} tip="数据加载中...">
  <Table
    columns={columns}
    dataSource={dataSource}
    pagination={false}
  />
</Spin>`} />
      </Section>

      {/* 自定义指示符 */}
      <Section title="自定义指示符">
        <Card>
          <Spin
            spinning={loading3}
            indicator={
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f0f0f0',
                borderTop: '4px solid #1890ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            }
            tip="自定义加载样式"
          >
            <Card style={{ background: '#f5f5f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>自定义加载指示符</h4>
                <Button size="small" onClick={() => setLoading3(!loading3)}>
                  {loading3 ? '停止' : '加载'}
                </Button>
              </div>
            </Card>
          </Spin>
        </Card>
        <CopyBlock code={`<Spin
  spinning={loading}
  indicator={
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #f0f0f0',
      borderTop: '4px solid #1890ff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
  }
  tip="自定义加载样式"
>
  <Card>内容区域</Card>
</Spin>`} />
      </Section>

      {/* 全屏加载 */}
      <Section title="全屏加载">
        <Card>
          <p>全屏加载会覆盖整个视口，适用于页面初始加载或全局操作。</p>
          <FullScreenDemo />
        </Card>
        <CopyBlock code={`const [fullscreen, setFullscreen] = useState(false);

// 开启全屏加载
setFullscreen(true);

// 渲染全屏 Spin
{fullscreen && (
  <Spin
    fullscreen
    spinning={true}
    tip="系统加载中..."
  />
)}`} />
      </Section>

      {/* API 文档 */}
      <Section title="API">
        <Table
          columns={apiColumns}
          dataSource={apiDataSource}
          bordered
          pagination={false}
        />
      </Section>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// 全屏加载演示组件
const FullScreenDemo: React.FC = () => {
  const [fullscreen, setFullscreen] = useState(false);

  const showFullscreen = () => {
    setFullscreen(true);
    // 3秒后自动关闭
    setTimeout(() => {
      setFullscreen(false);
    }, 3000);
  };

  return (
    <>
      <Button variant="primary" onClick={showFullscreen}>
        显示全屏加载（3秒后自动关闭）
      </Button>
      {fullscreen && (
        <Spin
          fullscreen
          spinning={true}
          tip="系统加载中..."
        />
      )}
    </>
  );
};

export default SpinExample;

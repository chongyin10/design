import React, { useState, useEffect } from 'react';
import { Progress, Flex, Button, Table } from '../../components';
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

const ProgressExample: React.FC = () => {
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  // API 表格列配置
  const apiColumns: Column[] = [
    { dataIndex: 'property', title: '属性', width: '140px' },
    { dataIndex: 'description', title: '说明', width: '200px' },
    { dataIndex: 'type', title: '类型', width: '300px' },
    { dataIndex: 'default', title: '默认值', width: '100px' },
  ];

  // API 数据源
  const apiDataSource = [
    { property: 'percent', description: '进度百分比（0-100）', type: 'number', default: '0' },
    { property: 'type', description: '进度条类型', type: "'line' | 'circle' | 'dashboard'", default: "'line'" },
    { property: 'status', description: '状态', type: "'success' | 'exception' | 'active' | 'normal'", default: '自动判断' },
    { property: 'showInfo', description: '是否显示进度百分比', type: 'boolean', default: 'true' },
    { property: 'format', description: '自定义显示格式', type: '(percent: number) => ReactNode', default: '-' },
    { property: 'strokeColor', description: '进度条颜色', type: 'string', default: "'#1890ff'" },
    { property: 'trailColor', description: '背景条颜色', type: 'string', default: "'#f5f5f5'" },
    { property: 'strokeWidth', description: '线条粗细', type: 'number', default: '10' },
    { property: 'size', description: '尺寸', type: "'small' | 'default' | 'large'", default: "'default'" },
    { property: 'transition', description: '是否开启动画', type: 'boolean', default: 'true' },
    { property: 'icon', description: '前缀图标', type: 'ReactNode', default: '-' },
    { property: 'prefix', description: '前缀文字', type: 'string', default: '-' },
    { property: 'suffix', description: '后缀文字', type: 'string', default: '-' },
  ];

  // 模拟加载进度
  const handleStartLoading = () => {
    setLoading(true);
    setPercent(0);
    const timer = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setLoading(false);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    return () => clearInterval(timer);
  };

  useEffect(() => {
    if (loading) {
      return handleStartLoading();
    }
  }, [loading]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Progress 进度条</h1>
      <p>展示操作的当前进度，在操作需要较长时间才能完成时，为用户显示该操作的当前进度和状态。</p>

      {/* 基础用法 */}
      <Section title="基础用法">
        <DemoRow title="0%">
          <Progress percent={0} />
        </DemoRow>
        <DemoRow title="30%">
          <Progress percent={30} />
        </DemoRow>
        <DemoRow title="50%">
          <Progress percent={50} />
        </DemoRow>
        <DemoRow title="70%">
          <Progress percent={70} />
        </DemoRow>
        <DemoRow title="100%">
          <Progress percent={100} />
        </DemoRow>
        <CopyBlock code={`import { Progress } from '@idp/design';

<Progress percent={0} />
<Progress percent={30} />
<Progress percent={50} />
<Progress percent={70} />
<Progress percent={100} />`} />
      </Section>

      {/* 不同尺寸 */}
      <Section title="不同尺寸">
        <DemoRow title="小号">
          <Progress percent={50} size="small" />
        </DemoRow>
        <DemoRow title="默认">
          <Progress percent={50} size="default" />
        </DemoRow>
        <DemoRow title="大号">
          <Progress percent={50} size="large" />
        </DemoRow>
        <CopyBlock code={`import { Progress } from '@idp/design';

<Progress percent={50} size="small" />
<Progress percent={50} size="default" />
<Progress percent={50} size="large" />`} />
      </Section>

      {/* 进度状态 */}
      <Section title="进度状态">
        <DemoRow title="正常">
          <Progress percent={30} />
        </DemoRow>
        <DemoRow title="进行中">
          <Progress percent={60} status="active" />
        </DemoRow>
        <DemoRow title="成功">
          <Progress percent={100} status="success" />
        </DemoRow>
        <DemoRow title="异常">
          <Progress percent={70} status="exception" />
        </DemoRow>
        <CopyBlock code={`import { Progress } from '@idp/design';

<Progress percent={30} />
<Progress percent={60} status="active" />
<Progress percent={100} status="success" />
<Progress percent={70} status="exception" />`} />
      </Section>

      {/* 自定义颜色 */}
      <Section title="自定义颜色">
        <DemoRow title="蓝色">
          <Progress percent={60} strokeColor="#1890ff" />
        </DemoRow>
        <DemoRow title="绿色">
          <Progress percent={60} strokeColor="#52c41a" />
        </DemoRow>
        <DemoRow title="橙色">
          <Progress percent={60} strokeColor="#faad14" />
        </DemoRow>
        <DemoRow title="红色">
          <Progress percent={60} strokeColor="#ff4d4f" />
        </DemoRow>
        <DemoRow title="紫色">
          <Progress percent={60} strokeColor="#722ed1" />
        </DemoRow>
        <CopyBlock code={`import { Progress } from '@idp/design';

<Progress percent={60} strokeColor="#1890ff" />
<Progress percent={60} strokeColor="#52c41a" />
<Progress percent={60} strokeColor="#faad14" />
<Progress percent={60} strokeColor="#ff4d4f" />
<Progress percent={60} strokeColor="#722ed1" />`} />
      </Section>

      {/* 自定义格式 */}
      <Section title="自定义格式">
        <DemoRow title="自定义文本">
          <Progress percent={60} format={() => '加载中'} />
        </DemoRow>
        <DemoRow title="带前缀">
          <Progress percent={60} prefix="已上传" />
        </DemoRow>
        <DemoRow title="带后缀">
          <Progress percent={60} suffix="/ 100%" />
        </DemoRow>
        <DemoRow title="完全自定义">
          <Progress percent={75} format={(percent) => `${Math.floor(percent as number)} / 100 MB`} />
        </DemoRow>
        <CopyBlock code={`import { Progress } from '@idp/design';

// 自定义文本
<Progress percent={60} format={() => '加载中'} />

// 带前缀
<Progress percent={60} prefix="已上传" />

// 带后缀
<Progress percent={60} suffix="/ 100%" />

// 完全自定义
<Progress percent={75} format={(percent) => \`\${Math.floor(percent)} / 100 MB\`} />`} />
      </Section>

      {/* 动态进度 */}
      <Section title="动态进度">
        <div style={{ marginBottom: '16px' }}>
          <Progress percent={percent} />
        </div>
        <Flex gap="small">
          <Button variant="primary" onClick={() => setLoading(true)} disabled={loading}>
            {loading ? '加载中...' : '开始加载'}
          </Button>
          <Button variant="secondary" onClick={() => setPercent(0)} disabled={loading}>
            重置
          </Button>
        </Flex>
        <CopyBlock code={`import { useState, useEffect } from 'react';
import { Progress, Button } from '@idp/design';

const DynamicProgress = () => {
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleStartLoading = () => {
    setLoading(true);
    setPercent(0);
    const timer = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setLoading(false);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    return () => clearInterval(timer);
  };

  return (
    <>
      <Progress percent={percent} />
      <Button onClick={() => setLoading(true)} disabled={loading}>
        开始加载
      </Button>
      <Button onClick={() => setPercent(0)} disabled={loading}>
        重置
      </Button>
    </>
  );
};`} />
      </Section>

      {/* 圆形进度条 */}
      <Section title="圆形进度条">
        <Flex gap="large" align="center">
          <div>
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>0%</div>
            <Progress type="circle" percent={0} />
          </div>
          <div>
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>30%</div>
            <Progress type="circle" percent={30} />
          </div>
          <div>
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>50%</div>
            <Progress type="circle" percent={50} />
          </div>
          <div>
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>70%</div>
            <Progress type="circle" percent={70} />
          </div>
          <div>
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>100%</div>
            <Progress type="circle" percent={100} status="success" />
          </div>
        </Flex>
        <CopyBlock code={`import { Progress, Flex } from '@idp/design';

<Flex gap="large">
  <Progress type="circle" percent={0} />
  <Progress type="circle" percent={30} />
  <Progress type="circle" percent={50} />
  <Progress type="circle" percent={70} />
  <Progress type="circle" percent={100} status="success" />
</Flex>`} />
      </Section>

      {/* 实时动态 */}
      <Section title="实时动态">
        <Flex direction="column" gap="large">
          <div>
            <div style={{ marginBottom: '8px' }}>线性进度条</div>
            <Progress percent={percent} />
          </div>
          <Flex gap="middle" align="center">
            <div>
              <div style={{ marginBottom: '8px', textAlign: 'center' }}>圆形进度</div>
              <Progress type="circle" percent={percent} />
            </div>
            <div>
              <div style={{ marginBottom: '8px' }}>控制面板</div>
              <Flex direction="column" gap="small">
                <Button variant="primary" onClick={() => setLoading(true)} disabled={loading}>
                  {loading ? '加载中...' : '开始加载'}
                </Button>
                <Button variant="secondary" onClick={() => setPercent(0)} disabled={loading}>
                  重置
                </Button>
              </Flex>
            </div>
          </Flex>
        </Flex>
        <CopyBlock code={`import { useState, useEffect } from 'react';
import { Progress, Button, Flex } from '@idp/design';

const DynamicDemo = () => {
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleStartLoading = () => {
    setLoading(true);
    setPercent(0);
    const timer = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setLoading(false);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    return () => clearInterval(timer);
  };

  return (
    <Flex direction="column" gap="large">
      <Progress percent={percent} />
      <Progress type="circle" percent={percent} />
      <Button onClick={() => setLoading(true)} disabled={loading}>
        开始加载
      </Button>
      <Button onClick={() => setPercent(0)} disabled={loading}>
        重置
      </Button>
    </Flex>
  );
};`} />
      </Section>

      {/* 组合使用 */}
      <Section title="组合使用">
        <DemoRow title="文件上传">
          <Progress 
            percent={75} 
            strokeColor="#1890ff"
            format={(percent) => `${Math.floor(percent as number)}%`}
            prefix="上传中"
          />
        </DemoRow>
        <DemoRow title="下载进度">
          <Progress 
            percent={45} 
            strokeColor="#52c41a"
            format={(percent) => `${Math.floor(percent as number)} MB / 100 MB`}
          />
        </DemoRow>
        <DemoRow title="处理进度">
          <Progress 
            percent={90} 
            strokeColor="#faad14"
            status="active"
            suffix="完成"
          />
        </DemoRow>
        <CopyBlock code={`import { Progress } from '@idp/design';

// 文件上传
<Progress 
  percent={75} 
  strokeColor="#1890ff"
  prefix="上传中"
/>

// 下载进度
<Progress 
  percent={45} 
  strokeColor="#52c41a"
  format={(percent) => \`\${Math.floor(percent)} MB / 100 MB\`}
/>

// 处理进度
<Progress 
  percent={90} 
  strokeColor="#faad14"
  status="active"
  suffix="完成"
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

export default ProgressExample;

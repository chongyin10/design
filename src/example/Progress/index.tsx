import React, { useState, useEffect } from 'react';
import { Progress, Flex, Button, Table, Anchor } from '../../components';
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
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

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
    { property: 'strokeColor', description: '进度条颜色，支持纯色或渐变对象（渐变支持 animated 开启波浪动画）', type: 'string | { from: string; to: string; direction?: string; animated?: boolean }', default: "'#1890ff'" },
    { property: 'trailColor', description: '背景条颜色', type: 'string', default: "'#f5f5f5'" },
    { property: 'strokeWidth', description: '线条粗细', type: 'number', default: '10' },
    { property: 'size', description: '尺寸', type: "'small' | 'default' | 'large'", default: "'default'" },
    { property: 'transition', description: '是否开启动画', type: 'boolean', default: 'true' },
    { property: 'steps', description: '步骤进度条的总步数', type: 'number', default: '-' },
    { property: 'segments', description: '多段颜色配置', type: 'Array<{ color: string | GradientConfig; percent: number }>', default: '-' },
    { property: 'icon', description: '前缀图标', type: 'ReactNode', default: '-' },
    { property: 'prefix', description: '前缀文字', type: 'string', default: '-' },
    { property: 'suffix', description: '后缀文字', type: 'string', default: '-' },
    { property: 'children', description: '自定义内部内容（圆形进度条），优先级高于默认进度显示', type: 'ReactNode', default: '-' },
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
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="progress-intro">Progress 进度条</h1>
          <p>展示操作的当前进度，在操作需要较长时间才能完成时，为用户显示该操作的当前进度和状态。</p>

          {/* 基础用法 */}
          <div id="progress-basic">
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
              <CopyBlock code={`import { Progress } from '@zjpcy/simple-design';

<Progress percent={0} />
<Progress percent={30} />
<Progress percent={50} />
<Progress percent={70} />
<Progress percent={100} />`} />
            </Section>
          </div>

          {/* 不同尺寸 */}
          <div id="progress-size">
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
              <CopyBlock code={`import { Progress } from '@zjpcy/simple-design';

<Progress percent={50} size="small" />
<Progress percent={50} size="default" />
<Progress percent={50} size="large" />`} />
            </Section>
          </div>

          {/* 进度状态 */}
          <div id="progress-status">
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
              <CopyBlock code={`import { Progress } from '@zjpcy/simple-design';

<Progress percent={30} />
<Progress percent={60} status="active" />
<Progress percent={100} status="success" />
<Progress percent={70} status="exception" />`} />
            </Section>
          </div>

          {/* 动态进度 */}
          <div id="progress-dynamic">
            <Section title="动态进度">
              <DemoRow title="模拟加载">
                <Progress percent={Math.floor(percent)} status={percent >= 100 ? 'success' : 'active'} />
              </DemoRow>
              <DemoRow title="操作">
                <Button variant="primary" onClick={() => setLoading(true)} disabled={loading}>
                  {loading ? '加载中...' : '开始加载'}
                </Button>
              </DemoRow>
              <CopyBlock code={`import { Progress, Button } from '@zjpcy/simple-design';
import { useState, useEffect } from 'react';

const Demo = () => {
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
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
    }
  }, [loading]);

  return (
    <>
      <Progress percent={Math.floor(percent)} />
      <Button onClick={() => setLoading(true)} disabled={loading}>
        开始加载
      </Button>
    </>
  );
};`} />
            </Section>
          </div>

          {/* 圆形进度条 */}
          <div id="progress-circle">
            <Section title="圆形进度条">
              <DemoRow title="基础">
                <Progress type="circle" percent={75} />
              </DemoRow>
              <DemoRow title="成功">
                <Progress type="circle" percent={100} status="success" />
              </DemoRow>
              <DemoRow title="异常">
                <Progress type="circle" percent={70} status="exception" />
              </DemoRow>
              <CopyBlock code={`import { Progress } from '@zjpcy/simple-design';

<Progress type="circle" percent={75} />
<Progress type="circle" percent={100} status="success" />
<Progress type="circle" percent={70} status="exception" />`} />
            </Section>
          </div>

          {/* 自定义颜色 */}
          <div id="progress-color">
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
                <Progress percent={60} strokeColor="#f5222d" />
              </DemoRow>
              <CopyBlock code={`import { Progress } from '@zjpcy/simple-design';

<Progress percent={60} strokeColor="#1890ff" />
<Progress percent={60} strokeColor="#52c41a" />
<Progress percent={60} strokeColor="#faad14" />
<Progress percent={60} strokeColor="#f5222d" />`} />
            </Section>
          </div>

          {/* 步骤进度条 */}
          <div id="progress-steps">
            <Section title="步骤进度条">
              <DemoRow title="5步骤">
                <Progress percent={60} steps={5} />
              </DemoRow>
              <DemoRow title="10步骤">
                <Progress percent={70} steps={10} />
              </DemoRow>
              <CopyBlock code={`import { Progress } from '@zjpcy/simple-design';

<Progress percent={60} steps={5} />
<Progress percent={70} steps={10} />`} />
            </Section>
          </div>

          {/* 分段颜色 */}
          <div id="progress-segments">
            <Section title="分段颜色">
              <DemoRow title="双色分段">
                <Progress
                  segments={[
                    { color: '#1890ff', percent: 30 },
                    { color: '#52c41a', percent: 40 },
                  ]}
                />
              </DemoRow>
              <DemoRow title="三色分段">
                <Progress
                  segments={[
                    { color: '#1890ff', percent: 25 },
                    { color: '#52c41a', percent: 25 },
                    { color: '#faad14', percent: 25 },
                  ]}
                />
              </DemoRow>
              <CopyBlock code={`import { Progress } from '@zjpcy/simple-design';

// 双色分段
<Progress
  segments={[
    { color: '#1890ff', percent: 30 },
    { color: '#52c41a', percent: 40 },
  ]}
/>

// 三色分段
<Progress
  segments={[
    { color: '#1890ff', percent: 25 },
    { color: '#52c41a', percent: 25 },
    { color: '#faad14', percent: 25 },
  ]}
/>`} />
            </Section>
          </div>

          {/* API 文档 */}
          <div id="progress-api">
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
                <Anchor.Link href="#progress-intro" title="组件介绍" />
                <Anchor.Link href="#progress-basic" title="基础用法" />
                <Anchor.Link href="#progress-size" title="不同尺寸" />
                <Anchor.Link href="#progress-status" title="进度状态" />
                <Anchor.Link href="#progress-dynamic" title="动态进度" />
                <Anchor.Link href="#progress-circle" title="圆形进度" />
                <Anchor.Link href="#progress-color" title="自定义颜色" />
                <Anchor.Link href="#progress-steps" title="步骤进度" />
                <Anchor.Link href="#progress-segments" title="分段颜色" />
                <Anchor.Link href="#progress-api" title="API 文档" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressExample;

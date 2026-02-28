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
        <CopyBlock code={`import { Progress } from '@zjpcy/simple-design';

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
        <CopyBlock code={`import { Progress } from '@zjpcy/simple-design';

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
        <CopyBlock code={`import { Progress } from '@zjpcy/simple-design';

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
        <CopyBlock code={`import { Progress } from '@zjpcy/simple-design';

<Progress percent={60} strokeColor="#1890ff" />
<Progress percent={60} strokeColor="#52c41a" />
<Progress percent={60} strokeColor="#faad14" />
<Progress percent={60} strokeColor="#ff4d4f" />
<Progress percent={60} strokeColor="#722ed1" />`} />
      </Section>

      {/* 渐变色 */}
      <Section title="渐变色">
        <p>通过传递渐变对象来创建渐变色进度条，支持线性进度条和圆形进度条。</p>
        <DemoRow title="蓝紫渐变">
          <Progress percent={60} strokeColor={{ from: '#108ee9', to: '#722ed1' }} />
        </DemoRow>
        <DemoRow title="橙红渐变">
          <Progress percent={60} strokeColor={{ from: '#faad14', to: '#ff4d4f' }} />
        </DemoRow>
        <DemoRow title="绿蓝渐变">
          <Progress percent={60} strokeColor={{ from: '#52c41a', to: '#1890ff' }} />
        </DemoRow>
        <DemoRow title="自定义方向">
          <Progress percent={60} strokeColor={{ from: '#1890ff', to: '#722ed1', direction: 'to top right' }} />
        </DemoRow>
        <CopyBlock code={`import { Progress } from '@zjpcy/simple-design';

// 蓝紫渐变
<Progress percent={60} strokeColor={{ from: '#108ee9', to: '#722ed1' }} />

// 橙红渐变
<Progress percent={60} strokeColor={{ from: '#faad14', to: '#ff4d4f' }} />

// 绿蓝渐变
<Progress percent={60} strokeColor={{ from: '#52c41a', to: '#1890ff' }} />

// 自定义方向
<Progress percent={60} strokeColor={{ from: '#1890ff', to: '#722ed1', direction: 'to top right' }} />`} />
      </Section>

      {/* 波浪动画 */}
      <Section title="波浪动画">
        <p>通过设置 `animated: true` 启用波浪动画效果，渐变色会从左到右持续流动。</p>
        <DemoRow title="蓝紫波浪">
          <Progress percent={60} strokeColor={{ from: '#108ee9', to: '#722ed1', animated: true }} />
        </DemoRow>
        <DemoRow title="橙红波浪">
          <Progress percent={60} strokeColor={{ from: '#faad14', to: '#ff4d4f', animated: true }} />
        </DemoRow>
        <DemoRow title="绿蓝波浪">
          <Progress percent={60} strokeColor={{ from: '#52c41a', to: '#1890ff', animated: true }} />
        </DemoRow>
        <DemoRow title="不同尺寸">
          <Flex direction="column" gap="middle" style={{ width: '300px' }}>
            <Progress percent={60} size="small" strokeColor={{ from: '#108ee9', to: '#722ed1', animated: true }} />
            <Progress percent={60} size="default" strokeColor={{ from: '#108ee9', to: '#722ed1', animated: true }} />
            <Progress percent={60} size="large" strokeColor={{ from: '#108ee9', to: '#722ed1', animated: true }} />
          </Flex>
        </DemoRow>
        <CopyBlock code={`import { Progress, Flex } from '@zjpcy/simple-design';

// 蓝紫波浪
<Progress percent={60} strokeColor={{ from: '#108ee9', to: '#722ed1', animated: true }} />

// 橙红波浪
<Progress percent={60} strokeColor={{ from: '#faad14', to: '#ff4d4f', animated: true }} />

// 绿蓝波浪
<Progress percent={60} strokeColor={{ from: '#52c41a', to: '#1890ff', animated: true }} />

// 不同尺寸
<Flex direction="column" gap="middle" style={{ width: '300px' }}>
  <Progress percent={60} size="small" strokeColor={{ from: '#108ee9', to: '#722ed1', animated: true }} />
  <Progress percent={60} size="default" strokeColor={{ from: '#108ee9', to: '#722ed1', animated: true }} />
  <Progress percent={60} size="large" strokeColor={{ from: '#108ee9', to: '#722ed1', animated: true }} />
</Flex>`} />
      </Section>

      {/* 渐变色圆形进度条 */}
      <Section title="渐变色圆形进度条">
        <Flex gap="large" align="center">
          <div>
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>蓝紫渐变</div>
            <Progress type="circle" percent={30} strokeColor={{ from: '#108ee9', to: '#722ed1' }} />
          </div>
          <div>
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>橙红渐变</div>
            <Progress type="circle" percent={50} strokeColor={{ from: '#faad14', to: '#ff4d4f' }} />
          </div>
          <div>
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>绿蓝渐变</div>
            <Progress type="circle" percent={70} strokeColor={{ from: '#52c41a', to: '#1890ff' }} />
          </div>
        </Flex>
        <CopyBlock code={`import { Progress, Flex } from '@zjpcy/simple-design';

<Flex gap="large">
  <Progress type="circle" percent={30} strokeColor={{ from: '#108ee9', to: '#722ed1' }} />
  <Progress type="circle" percent={50} strokeColor={{ from: '#faad14', to: '#ff4d4f' }} />
  <Progress type="circle" percent={70} strokeColor={{ from: '#52c41a', to: '#1890ff' }} />
</Flex>`} />
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
        <CopyBlock code={`import { Progress } from '@zjpcy/simple-design';

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
import { Progress, Button } from '@zjpcy/simple-design';

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
        <CopyBlock code={`import { Progress, Flex } from '@zjpcy/simple-design';

<Flex gap="large">
  <Progress type="circle" percent={0} />
  <Progress type="circle" percent={30} />
  <Progress type="circle" percent={50} />
  <Progress type="circle" percent={70} />
  <Progress type="circle" percent={100} status="success" />
</Flex>`} />
      </Section>

      {/* 圆形进度条 - 自定义内容 */}
      <Section title="圆形进度条 - 自定义内容">
        <Flex gap="large" align="center">
          <div>
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>自定义文案</div>
            <Progress type="circle" percent={75}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>75%</div>
                <div style={{ fontSize: 12, color: '#999' }}>已完成</div>
              </div>
            </Progress>
          </div>
          <div>
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>数据统计</div>
            <Progress type="circle" percent={60} strokeColor="#52c41a">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#52c41a' }}>60</div>
                <div style={{ fontSize: 12, color: '#999' }}>个任务</div>
              </div>
            </Progress>
          </div>
          <div>
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>自定义图标</div>
            <Progress type="circle" percent={100} status="success">
              <svg viewBox="0 0 1024 1024" width="32" height="32" fill="#52c41a">
                <path d="M912 190h-69.9c-9.4 0-18.4 3.7-25.1 10.3L512 505.3 206.8 200.3c-6.7-6.6-15.7-10.3-25.1-10.3H112c-17.7 0-32 14.3-32 32s14.3 32 32 32h62.2l301.3 301.3c6.2 6.2 14.4 9.4 22.6 9.4s16.4-3.1 22.6-9.4l301.3-301.3H912c17.7 0 32-14.3 32-32s-14.3-32-32-32z" />
              </svg>
            </Progress>
          </div>
          <div>
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>分数展示</div>
            <Progress type="circle" percent={85} strokeColor="#faad14">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: '#faad14' }}>85</div>
                <div style={{ fontSize: 12, color: '#999' }}>分</div>
              </div>
            </Progress>
          </div>
        </Flex>
        <CopyBlock code={`import { Progress, Flex } from '@zjpcy/simple-design';

// 自定义文案
<Progress type="circle" percent={75}>
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 24, fontWeight: 'bold' }}>75%</div>
    <div style={{ fontSize: 12, color: '#999' }}>已完成</div>
  </div>
</Progress>

// 数据统计
<Progress type="circle" percent={60} strokeColor="#52c41a">
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 28, fontWeight: 'bold', color: '#52c41a' }}>60</div>
    <div style={{ fontSize: 12, color: '#999' }}>个任务</div>
  </div>
</Progress>

// 自定义图标
<Progress type="circle" percent={100} status="success">
  <svg viewBox="0 0 1024 1024" width="32" height="32" fill="#52c41a">
    <path d="M912 190h-69.9c-9.4 0-18.4 3.7-25.1 10.3L512 505.3 206.8 200.3c-6.7-6.6-15.7-10.3-25.1-10.3H112c-17.7 0-32 14.3-32 32s14.3 32 32 32h62.2l301.3 301.3c6.2 6.2 14.4 9.4 22.6 9.4s16.4-3.1 22.6-9.4l301.3-301.3H912c17.7 0 32-14.3 32-32s-14.3-32-32-32z" />
  </svg>
</Progress>

// 分数展示
<Progress type="circle" percent={85} strokeColor="#faad14">
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#faad14' }}>85</div>
    <div style={{ fontSize: 12, color: '#999' }}>分</div>
  </div>
</Progress>`} />
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
import { Progress, Button, Flex } from '@zjpcy/simple-design';

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

      {/* 步骤进度条 */}
      <Section title="步骤进度条">
        <DemoRow title="5步骤">
          <Progress percent={60} steps={5} />
        </DemoRow>
        <DemoRow title="10步骤">
          <Progress percent={70} steps={10} />
        </DemoRow>
        <DemoRow title="大尺寸步骤">
          <Progress percent={80} steps={8} size="large" />
        </DemoRow>
        <CopyBlock code={`import { Progress } from '@zjpcy/simple-design';

// 5步骤进度条
<Progress percent={60} steps={5} />

// 10步骤进度条
<Progress percent={70} steps={10} />

// 大尺寸步骤进度条
<Progress percent={80} steps={8} size="large" />`} />
      </Section>

      {/* 多段颜色进度条 */}
      <Section title="多段颜色进度条">
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
              { color: 'red', percent: 25 },
            ]}
          />
        </DemoRow>
        <DemoRow title="渐变分段">
          <Progress
            segments={[
              { color: { from: '#1890ff', to: '#40a9ff' }, percent: 40 },
              { color: { from: '#52c41a', to: '#73d13d' }, percent: 35 },
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
/>

// 渐变色分段
<Progress
  segments={[
    { color: { from: '#1890ff', to: '#40a9ff' }, percent: 40 },
    { color: { from: '#52c41a', to: '#73d13d' }, percent: 35 },
  ]}
/>`} />
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
        <CopyBlock code={`import { Progress } from '@zjpcy/simple-design';

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

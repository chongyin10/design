import React, { useState, useEffect } from 'react';
import { Popconfirm, Button, Table, Icon, Flex, Anchor } from '../../components';
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

const PopconfirmExample: React.FC = () => {
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
  const [deleteCount, setDeleteCount] = useState(0);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  const handleDelete = () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setDeleteCount(prev => prev + 1);
        resolve();
      }, 1000);
    });
  };

  const handleConfirm = () => {
    console.log('确认操作');
  };

  const handleCancel = () => {
    console.log('取消操作');
  };

  // API 表格列配置
  const apiColumns: Column[] = [
    { dataIndex: 'property', title: '属性', width: '150px' },
    { dataIndex: 'description', title: '说明', width: '300px' },
    { dataIndex: 'type', title: '类型', width: '350px' },
    { dataIndex: 'default', title: '默认值', width: '100px' },
  ];

  // API 数据源
  const apiDataSource = [
    { property: 'title', description: '确认框标题', type: 'ReactNode', default: "'确认删除吗？'" },
    { property: 'description', description: '确认框描述信息', type: 'ReactNode', default: '-' },
    { property: 'okText', description: '确认按钮文本', type: 'string', default: "'确定'" },
    { property: 'cancelText', description: '取消按钮文本', type: 'string', default: "'取消'" },
    { property: 'okButtonProps', description: '确认按钮的属性配置', type: '{ variant, loading, disabled }', default: '{}' },
    { property: 'cancelButtonProps', description: '取消按钮的属性配置', type: '{ variant, disabled }', default: '{}' },
    { property: 'onConfirm', description: '点击确认按钮的回调，支持异步操作', type: '() => void | Promise<void>', default: '-' },
    { property: 'onCancel', description: '点击取消按钮的回调', type: '() => void', default: '-' },
    { property: 'disabled', description: '是否禁用 Popconfirm', type: 'boolean', default: 'false' },
    { property: 'icon', description: '自定义图标', type: 'ReactNode', default: 'warning-circle' },
    { property: 'placement', description: '气泡框位置', type: 'PopconfirmPlacement', default: "'top'" },
    { property: 'showCancel', description: '是否显示取消按钮', type: 'boolean', default: 'true' },
    { property: 'getContainer', description: '挂载容器，false 表示挂载在当前 DOM', type: 'HTMLElement | (() => HTMLElement) | false', default: '() => document.body' },
    { property: 'className', description: '自定义类名', type: 'string', default: '-' },
    { property: 'style', description: '自定义样式', type: 'React.CSSProperties', default: '-' },
    { property: 'children', description: '触发元素', type: 'React.ReactElement', default: '-' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="popconfirm-intro">Popconfirm 气泡确认框</h1>
          <p>点击元素，弹出气泡式的确认框。目标元素的操作需要用户进一步的确认时，在目标元素附近弹出浮层提示，询问用户。</p>

          {/* 基础用法 */}
          <div id="popconfirm-basic">
            <Section title="基础用法">
              <DemoRow title="删除按钮">
                <Popconfirm
                  title="确认删除吗？"
                  onConfirm={handleConfirm}
                >
                  <Button variant="danger">删除</Button>
                </Popconfirm>
              </DemoRow>
              <CopyBlock code={`import { Popconfirm, Button } from '@zjpcy/simple-design';

<Popconfirm
  title="确认删除吗？"
  onConfirm={() => console.log('确认删除')}
>
  <Button variant="danger">删除</Button>
</Popconfirm>`} />
            </Section>
          </div>

          {/* 带描述 */}
          <div id="popconfirm-desc">
            <Section title="带描述">
              <DemoRow title="详细描述">
                <Popconfirm
                  title="确认删除此项目吗？"
                  description="删除后将无法恢复，请谨慎操作"
                  onConfirm={handleConfirm}
                >
                  <Button variant="danger">删除项目</Button>
                </Popconfirm>
              </DemoRow>
              <CopyBlock code={`import { Popconfirm, Button } from '@zjpcy/simple-design';

<Popconfirm
  title="确认删除此项目吗？"
  description="删除后将无法恢复，请谨慎操作"
  onConfirm={() => console.log('确认删除')}
>
  <Button variant="danger">删除项目</Button>
</Popconfirm>`} />
            </Section>
          </div>

          {/* 自定义按钮文本 */}
          <div id="popconfirm-text">
            <Section title="自定义按钮文本">
              <DemoRow title="自定义文本">
                <Popconfirm
                  title="确认删除吗？"
                  okText="是"
                  cancelText="否"
                  onConfirm={handleConfirm}
                >
                  <Button variant="danger">删除</Button>
                </Popconfirm>
              </DemoRow>
              <CopyBlock code={`import { Popconfirm, Button } from '@zjpcy/simple-design';

<Popconfirm
  title="确认删除吗？"
  okText="是"
  cancelText="否"
  onConfirm={() => console.log('确认删除')}
>
  <Button variant="danger">删除</Button>
</Popconfirm>`} />
            </Section>
          </div>

          {/* 异步操作 */}
          <div id="popconfirm-async">
            <Section title="异步操作">
              <DemoRow title="异步删除">
                <Popconfirm
                  title="确认删除吗？"
                  description="删除操作需要1秒钟"
                  onConfirm={handleDelete}
                >
                  <Button variant="danger">删除 (异步)</Button>
                </Popconfirm>
              </DemoRow>
              <DemoRow title="删除次数">
                <span>已删除 {deleteCount} 次</span>
              </DemoRow>
              <CopyBlock code={`import { Popconfirm, Button } from '@zjpcy/simple-design';

const PopconfirmExample = () => {
  const [count, setCount] = useState(0);

  const handleDelete = () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setCount(prev => prev + 1);
        resolve();
      }, 1000);
    });
  };

  return (
    <Popconfirm
      title="确认删除吗？"
      description="删除操作需要1秒钟"
      onConfirm={handleDelete}
    >
      <Button variant="danger">删除 (异步)</Button>
    </Popconfirm>
  );
};`} />
            </Section>
          </div>

          {/* 不同位置 */}
          <div id="popconfirm-placement">
            <Section title="不同位置">
              <DemoRow title="顶部">
                <Popconfirm
                  title="顶部确认"
                  placement="top"
                  onConfirm={handleConfirm}
                >
                  <Button variant="primary">顶部</Button>
                </Popconfirm>
              </DemoRow>
              <DemoRow title="底部">
                <Popconfirm
                  title="底部确认"
                  placement="bottom"
                  onConfirm={handleConfirm}
                >
                  <Button variant="primary">底部</Button>
                </Popconfirm>
              </DemoRow>
              <DemoRow title="左侧">
                <Popconfirm
                  title="左侧确认"
                  placement="left"
                  onConfirm={handleConfirm}
                >
                  <Button variant="primary">左侧</Button>
                </Popconfirm>
              </DemoRow>
              <DemoRow title="右侧">
                <Popconfirm
                  title="右侧确认"
                  placement="right"
                  onConfirm={handleConfirm}
                >
                  <Button variant="primary">右侧</Button>
                </Popconfirm>
              </DemoRow>
              <CopyBlock code={`import { Popconfirm, Button } from '@zjpcy/simple-design';

<Popconfirm title="顶部" placement="top" onConfirm={handleConfirm}>
  <Button>顶部</Button>
</Popconfirm>

<Popconfirm title="底部" placement="bottom" onConfirm={handleConfirm}>
  <Button>底部</Button>
</Popconfirm>

<Popconfirm title="左侧" placement="left" onConfirm={handleConfirm}>
  <Button>左侧</Button>
</Popconfirm>

<Popconfirm title="右侧" placement="right" onConfirm={handleConfirm}>
  <Button>右侧</Button>
</Popconfirm>`} />
            </Section>
          </div>

          {/* 隐藏取消按钮 */}
          <div id="popconfirm-nocancel">
            <Section title="隐藏取消按钮">
              <DemoRow title="仅确认">
                <Popconfirm
                  title="确认执行此操作？"
                  showCancel={false}
                  onConfirm={handleConfirm}
                >
                  <Button variant="primary">执行</Button>
                </Popconfirm>
              </DemoRow>
              <CopyBlock code={`import { Popconfirm, Button } from '@zjpcy/simple-design';

<Popconfirm
  title="确认执行此操作？"
  showCancel={false}
  onConfirm={handleConfirm}
>
  <Button variant="primary">执行</Button>
</Popconfirm>`} />
            </Section>
          </div>

          {/* 自定义图标 */}
          <div id="popconfirm-icon">
            <Section title="自定义图标">
              <DemoRow title="自定义图标">
                <Popconfirm
                  title="确认删除吗？"
                  icon={<Icon type="delete" style={{ color: '#ff4d4f' }} />}
                  onConfirm={handleConfirm}
                >
                  <Button variant="danger">删除</Button>
                </Popconfirm>
              </DemoRow>
              <CopyBlock code={`import { Popconfirm, Button, Icon } from '@zjpcy/simple-design';

<Popconfirm
  title="确认删除吗？"
  icon={<Icon type="delete" style={{ color: '#ff4d4f' }} />}
  onConfirm={handleConfirm}
>
  <Button variant="danger">删除</Button>
</Popconfirm>`} />
            </Section>
          </div>

          {/* 自定义按钮样式 */}
          <div id="popconfirm-btnstyle">
            <Section title="自定义按钮样式">
              <DemoRow title="危险操作">
                <Popconfirm
                  title="确认删除吗？"
                  okButtonProps={{ variant: 'danger' }}
                  onConfirm={handleConfirm}
                >
                  <Button variant="secondary">删除</Button>
                </Popconfirm>
              </DemoRow>
              <DemoRow title="主要操作">
                <Popconfirm
                  title="确认提交吗？"
                  okButtonProps={{ variant: 'primary' }}
                  cancelButtonProps={{ variant: 'secondary' }}
                  onConfirm={handleConfirm}
                >
                  <Button variant="secondary">提交</Button>
                </Popconfirm>
              </DemoRow>
              <CopyBlock code={`import { Popconfirm, Button } from '@zjpcy/simple-design';

<Popconfirm
  title="确认删除吗？"
  okButtonProps={{ variant: 'danger' }}
  onConfirm={() => console.log('确认删除')}
>
  <Button variant="secondary">删除</Button>
</Popconfirm>

<Popconfirm
  title="确认提交吗？"
  okButtonProps={{ variant: 'primary' }}
  cancelButtonProps={{ variant: 'secondary' }}
  onConfirm={() => console.log('确认提交')}
>
  <Button variant="secondary">提交</Button>
</Popconfirm>`} />
            </Section>
          </div>

          {/* 回调函数 */}
          <div id="popconfirm-callback">
            <Section title="回调函数">
              <DemoRow title="带回调">
                <Popconfirm
                  title="确认操作吗？"
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                >
                  <Button variant="primary">操作</Button>
                </Popconfirm>
              </DemoRow>
              <CopyBlock code={`import { Popconfirm, Button } from '@zjpcy/simple-design';

const PopconfirmExample = () => {
  const handleConfirm = () => {
    console.log('确认操作');
  };

  const handleCancel = () => {
    console.log('取消操作');
  };

  return (
    <Popconfirm
      title="确认操作吗？"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      <Button variant="primary">操作</Button>
    </Popconfirm>
  );
};`} />
            </Section>
          </div>

          {/* API 文档 */}
          <div id="popconfirm-api">
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
                <Anchor.Link href="#popconfirm-intro" title="组件介绍" />
                <Anchor.Link href="#popconfirm-basic" title="基础用法" />
                <Anchor.Link href="#popconfirm-desc" title="带描述" />
                <Anchor.Link href="#popconfirm-text" title="自定义文字" />
                <Anchor.Link href="#popconfirm-async" title="异步操作" />
                <Anchor.Link href="#popconfirm-placement" title="不同位置" />
                <Anchor.Link href="#popconfirm-nocancel" title="隐藏取消" />
                <Anchor.Link href="#popconfirm-icon" title="自定义图标" />
                <Anchor.Link href="#popconfirm-btnstyle" title="按钮样式" />
                <Anchor.Link href="#popconfirm-callback" title="回调函数" />
                <Anchor.Link href="#popconfirm-api" title="API 文档" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopconfirmExample;

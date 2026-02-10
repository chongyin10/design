import React, { useState, useRef } from 'react';
import { Drawer, Button, Flex, Space, Table } from '../../components';
import type { DrawerPlacement } from '../../components/Drawer';
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

const DrawerExample: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState<DrawerPlacement>('right');
  const [width, setWidth] = useState<number | string>(360);
  const [loading, setLoading] = useState(false);
  const [customContainer, setCustomContainer] = useState(false);
  const [destroyOnClose, setDestroyOnClose] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [customHeader, setCustomHeader] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const showDrawer = (p: DrawerPlacement) => {
    setPlacement(p);
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 2000);
  };

  const placements: { value: DrawerPlacement; label: string }[] = [
    { value: 'left', label: '左侧 Left' },
    { value: 'right', label: '右侧 Right' },
    { value: 'top', label: '顶部 Top' },
    { value: 'bottom', label: '底部 Bottom' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Drawer 抽屉</h1>
      <p>屏幕边缘滑出的浮层面板，常用于展示详细信息或执行操作。</p>

      {/* 基础用法 */}
      <Section title="基础用法">
        <p>点击按钮从屏幕边缘滑出浮层面板。</p>
        <DemoRow title="不同位置">
          <Space>
            {placements.map((p) => (
              <Button key={p.value} onClick={() => showDrawer(p.value)}>
                {p.label}
              </Button>
            ))}
          </Space>
        </DemoRow>
        <CopyBlock code={`import { Drawer, Button } from '@idp/design';

const Demo = () => {
  const [visible, setVisible] = useState(false);
  
  return (
    <>
      <Button onClick={() => setVisible(true)}>打开抽屉</Button>
      <Drawer
        title="基础抽屉"
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <p>抽屉内容</p>
      </Drawer>
    </>
  );
};`} />
      </Section>

      {/* 自定义尺寸 */}
      <Section title="自定义尺寸">
        <DemoRow title="不同宽度">
          <Space>
            <Button onClick={() => { setWidth(300); showDrawer('right'); }}>
              300px
            </Button>
            <Button onClick={() => { setWidth(480); showDrawer('right'); }}>
              480px
            </Button>
            <Button onClick={() => { setWidth('50%'); showDrawer('right'); }}>
              50%
            </Button>
          </Space>
        </DemoRow>
        <CopyBlock code={`import { Drawer } from '@idp/design';

// 固定宽度
<Drawer width={300} visible={visible} onClose={onClose} />

// 百分比宽度
<Drawer width="50%" visible={visible} onClose={onClose} />

// 自定义高度（top/bottom位置）
<Drawer placement="top" height={400} visible={visible} onClose={onClose} />`} />
      </Section>

      {/* 加载状态 */}
      <Section title="加载状态">
        <DemoRow title="加载中">
          <Button onClick={() => { setLoading(true); showDrawer('right'); }}>
            打开加载状态的抽屉
          </Button>
        </DemoRow>
        <CopyBlock code={`import { Drawer } from '@idp/design';

<Drawer loading={true} visible={visible} onClose={onClose}>
  <p>内容</p>
</Drawer>`} />
      </Section>

      {/* 自定义容器 */}
      <Section title="自定义容器">
        <DemoRow title="挂载位置">
          <Space>
            <Button onClick={() => { setCustomContainer(false); showDrawer('right'); }}>
              默认挂载到当前DOM
            </Button>
            <Button onClick={() => { setCustomContainer(true); showDrawer('right'); }}>
              挂载到自定义容器
            </Button>
          </Space>
        </DemoRow>
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            height: '400px',
            border: '1px dashed #ccc',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#fafafa',
            marginTop: '16px',
          }}
        >
          <div style={{ padding: '16px', color: '#999' }}>
            自定义容器区域
          </div>
        </div>
        <CopyBlock code={`import { Drawer } from '@idp/design';
import { useRef } from 'react';

const Demo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <>
      <div ref={containerRef} style={{ position: 'relative', height: 400 }}>
        自定义容器
      </div>
      <Drawer
        getContainer={() => containerRef.current}
        visible={visible}
        onClose={onClose}
      />
    </>
  );
};`} />
      </Section>

      {/* 销毁子元素 */}
      <Section title="销毁子元素">
        <DemoRow title="关闭策略">
          <Space>
            <Button onClick={() => { setDestroyOnClose(false); showDrawer('right'); }}>
              关闭后保留子元素
            </Button>
            <Button onClick={() => { setDestroyOnClose(true); showDrawer('right'); }}>
              关闭后销毁子元素
            </Button>
          </Space>
        </DemoRow>
        <CopyBlock code={`import { Drawer } from '@idp/design';

// 关闭后保留子元素（默认）
<Drawer visible={visible} onClose={onClose}>
  <Form /> {/* 表单状态会被保留 */}
</Drawer>

// 关闭后销毁子元素
<Drawer destroyOnClose={true} visible={visible} onClose={onClose}>
  <Form /> {/* 表单状态会被清空 */}
</Drawer>`} />
      </Section>

      {/* 头部和底部 */}
      <Section title="头部和底部">
        <DemoRow title="头部">
          <Space>
            <Button onClick={() => { setShowHeader(true); setCustomHeader(false); showDrawer('right'); }}>
              显示头部
            </Button>
            <Button onClick={() => { setShowHeader(false); setCustomHeader(false); showDrawer('right'); }}>
              隐藏头部
            </Button>
            <Button onClick={() => { setShowHeader(true); setCustomHeader(true); showDrawer('right'); }}>
              自定义头部
            </Button>
          </Space>
        </DemoRow>
        <DemoRow title="底部">
          <Space>
            <Button onClick={() => { setShowFooter(true); showDrawer('right'); }}>
              显示底部
            </Button>
            <Button onClick={() => { setShowFooter(false); showDrawer('right'); }}>
              隐藏底部
            </Button>
          </Space>
        </DemoRow>
        <CopyBlock code={`import { Drawer, Flex, Button } from '@idp/design';

// 自定义头部
<Drawer
  header={(
    <Flex justify="space-between" align="center">
      <span>自定义标题</span>
      <Button size="small">操作</Button>
    </Flex>
  )}
  visible={visible}
  onClose={onClose}
/>

// 自定义底部
<Drawer
  footer={(
    <Flex gap={12} justify="flex-end">
      <Button onClick={onClose}>取消</Button>
      <Button variant="primary" onClick={handleOk}>确认</Button>
    </Flex>
  )}
  visible={visible}
  onClose={onClose}
/>

// 隐藏头部/底部
<Drawer showHeader={false} showFooter={false} visible={visible} onClose={onClose} />`} />
      </Section>

      {/* 遮罩层 */}
      <Section title="遮罩层">
        <DemoRow title="遮罩配置">
          <Button onClick={() => { showDrawer('right'); }}>
            打开无遮罩层的抽屉
          </Button>
        </DemoRow>
        <CopyBlock code={`import { Drawer } from '@idp/design';

// 无遮罩层
<Drawer mask={false} visible={visible} onClose={onClose} />

// 点击遮罩不关闭
<Drawer maskClosable={false} visible={visible} onClose={onClose} />`} />
      </Section>

      {/* API 文档 */}
      <Section title="API">
        <h3>Props</h3>
        <Table
          columns={[
            { title: '属性', dataIndex: 'property', key: 'property' },
            { title: '说明', dataIndex: 'description', key: 'description' },
            { title: '类型', dataIndex: 'type', key: 'type' },
            { title: '默认值', dataIndex: 'default', key: 'default' },
          ]}
          dataSource={[
            { property: 'visible', description: '是否可见', type: 'boolean', default: '-' },
            { property: 'title', description: '抽屉标题', type: 'React.ReactNode', default: '-' },
            { property: 'width', description: '抽屉宽度（placement为left或right时有效）', type: 'number | string', default: '360' },
            { property: 'height', description: '抽屉高度（placement为top或bottom时有效）', type: 'number | string', default: '300' },
            { property: 'placement', description: '抽屉位置', type: '\'left\' | \'right\' | \'top\' | \'bottom\'', default: '\'right\'' },
            { property: 'maskClosable', description: '点击遮罩层是否允许关闭', type: 'boolean', default: 'true' },
            { property: 'mask', description: '是否显示遮罩层', type: 'boolean', default: 'true' },
            { property: 'onClose', description: '关闭回调', type: '() => void', default: '-' },
            { property: 'children', description: '抽屉内容', type: 'React.ReactNode', default: '-' },
            { property: 'className', description: '额外类名', type: 'string', default: '-' },
            { property: 'style', description: '抽屉样式', type: 'React.CSSProperties', default: '-' },
            { property: 'showHeader', description: '是否显示头部', type: 'boolean', default: 'true' },
            { property: 'header', description: '自定义头部内容', type: 'React.ReactNode', default: '-' },
            { property: 'showFooter', description: '是否显示底部', type: 'boolean', default: 'true' },
            { property: 'footer', description: '页脚', type: 'React.ReactNode', default: '-' },
            { property: 'getContainer', description: '指定挂载节点', type: '(() => HTMLElement) | HTMLElement | false', default: 'false' },
            { property: 'destroyOnClose', description: '关闭后是否销毁子元素', type: 'boolean', default: 'false' },
            { property: 'closable', description: '是否显示关闭按钮', type: 'boolean', default: 'true' },
            { property: 'zIndex', description: 'z-index层级', type: 'number', default: '1000' },
            { property: 'loading', description: '是否加载中状态', type: 'boolean', default: 'false' },
          ]}
          rowKey="property"
          pagination={false}
        />
      </Section>

      <Drawer
        title={customHeader ? undefined : `${placements.find(p => p.value === placement)?.label} 抽屉`}
        placement={placement}
        width={placement === 'left' || placement === 'right' ? width : undefined}
        height={placement === 'top' || placement === 'bottom' ? 300 : undefined}
        onClose={handleClose}
        visible={visible}
        loading={loading}
        destroyOnClose={destroyOnClose}
        showHeader={showHeader}
        showFooter={showFooter}
        header={customHeader ? (
          <Flex justify="space-between" align="center" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 500 }}>自定义头部</span>
              <span style={{ padding: '2px 8px', background: '#1890ff', color: '#fff', borderRadius: '4px', fontSize: '12px' }}>Tag</span>
            </div>
            <Button size="small" onClick={handleClose}>关闭</Button>
          </Flex>
        ) : undefined}
        getContainer={customContainer && containerRef.current ? () => containerRef.current! : false}
        footer={
          <Flex gap={12} justify="flex-end">
            <Button onClick={handleClose}>取消</Button>
            <Button variant="primary" loading={loading} onClick={handleOk}>
              确认
            </Button>
          </Flex>
        }
      >
        <div>
          <p>这是一个抽屉组件的示例内容。</p>
          <p>当前位置: {placement}</p>
          <p>头部显示: {showHeader ? '是' : '否'}</p>
          <p>底部显示: {showFooter ? '是' : '否'}</p>
          <p>自定义头部: {customHeader ? '是' : '否'}</p>
          <p>你可以在这里放置任何内容。</p>
          <div style={{ marginTop: '20px' }}>
            <h4>示例表单</h4>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>姓名</label>
              <input type="text" placeholder="请输入姓名" style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>邮箱</label>
              <input type="email" placeholder="请输入邮箱" style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>描述</label>
              <textarea placeholder="请输入描述" rows={4} style={{ width: '100%', padding: '8px' }} />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default DrawerExample;

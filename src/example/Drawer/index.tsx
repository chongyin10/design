import React, { useState, useRef, useEffect } from 'react';
import { Drawer, Button, Flex, Space, Table, Form, Input, Checkbox, Radio, Select, Anchor } from '../../components';
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
  const [width, setWidth] = useState<number | string>(460);
  const [loading, setLoading] = useState(false);
  const [customContainer, setCustomContainer] = useState(false);
  const [destroyOnClose, setDestroyOnClose] = useState(false);
  const [headerMode, setHeaderMode] = useState<'default' | 'false' | 'custom'>('default');
  const [footerMode, setFooterMode] = useState<'default' | 'false'>('default');
  const [resizable, setResizable] = useState(false);
  const [mask, setMask] = useState(true);
  const [currentSize, setCurrentSize] = useState<{ width?: number; height?: number }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'male',
    city: 'beijing',
    interests: ['reading'],
    agreement: false,
    description: ''
  });

  const showDrawer = (p: DrawerPlacement, withMask: boolean = true, withFooter: boolean = true) => {
    setPlacement(p);
    setMask(withMask);
    setFooterMode(withFooter ? 'default' : 'false');
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const placements: { value: DrawerPlacement; label: string }[] = [
    { value: 'left', label: '左侧 Left' },
    { value: 'right', label: '右侧 Right' },
    { value: 'top', label: '顶部 Top' },
    { value: 'bottom', label: '底部 Bottom' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="drawer-intro">Drawer 抽屉</h1>
          <p>屏幕边缘滑出的浮层面板，常用于展示详细信息或执行操作。</p>

          {/* 基础用法 */}
          <div id="drawer-basic">
            <Section title="基础用法">
              <p>点击按钮从屏幕边缘滑出浮层面板。支持受控和非受控两种模式。</p>
              <DemoRow title="基础用法">
                <Space>
                  {placements.map((p) => (
                    <Button key={p.value} onClick={() => showDrawer(p.value, true, footerMode === 'default')}>
                      {p.label}
                    </Button>
                  ))}
                </Space>
              </DemoRow>
              <CopyBlock code={`import { Drawer, Button } from '@zjpcy/simple-design';

const Demo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>打开抽屉</Button>
      <Drawer
        title="基础抽屉"
        open={open}
        onClose={() => setOpen(false)}
      >
        <p>抽屉内容</p>
      </Drawer>
    </>
  );
};`} />
            </Section>
          </div>

          {/* 默认底部 */}
          <div id="drawer-footer">
            <Section title="默认底部">
              <p>默认显示底部，包含"取消"和"确认"按钮，点击"取消"会自动关闭抽屉。</p>
              <DemoRow title="默认 footer">
                <Button onClick={() => setVisible(true)}>
                  打开默认 footer 的抽屉
                </Button>
              </DemoRow>
              <CopyBlock code={`import { Drawer, Button } from '@zjpcy/simple-design';
import { useState } from 'react';

const Demo = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>打开抽屉</Button>
      <Drawer
        title="默认底部"
        open={open}
        onClose={() => setOpen(false)}
        // 默认显示 footer，包含"取消"和"确认"按钮
        // 点击"取消"会自动调用 onClose 关闭抽屉
      >
        <p>这是抽屉内容</p>
      </Drawer>
    </>
  );
};`} />
            </Section>
          </div>

          {/* 自定义尺寸 */}
          <div id="drawer-size">
            <Section title="自定义尺寸">
              <DemoRow title="不同宽度">
                <Space>
                  <Button onClick={() => { setWidth(300); showDrawer('right', true, footerMode === 'default'); }}>
                    300px
                  </Button>
                  <Button onClick={() => { setWidth(480); showDrawer('right', true, footerMode === 'default'); }}>
                    480px
                  </Button>
                  <Button onClick={() => { setWidth('50%'); showDrawer('right', true, footerMode === 'default'); }}>
                    50%
                  </Button>
                </Space>
              </DemoRow>
              <CopyBlock code={`import { Drawer } from '@zjpcy/simple-design';

// 固定宽度
<Drawer width={300} open={open} onClose={onClose} />

// 百分比宽度
<Drawer width="50%" open={open} onClose={onClose} />

// 自定义高度（top/bottom位置）
<Drawer placement="top" height={400} open={open} onClose={onClose} />`} />
            </Section>
          </div>

          {/* 加载状态 */}
          <div id="drawer-loading">
            <Section title="加载状态">
              <DemoRow title="加载中">
                <Button onClick={() => { setLoading(true); showDrawer('right', true, footerMode === 'default'); }}>
                  打开加载状态的抽屉
                </Button>
              </DemoRow>
              <CopyBlock code={`import { Drawer } from '@zjpcy/simple-design';

<Drawer loading={true} open={open} onClose={onClose}>
  <p>内容</p>
</Drawer>`} />
            </Section>
          </div>

          {/* 表单示例 */}
          <div id="drawer-form">
            <Section title="表单示例">
              <p>在 Drawer 中使用 Form、Input、Checkbox、Radio、Select 等表单组件</p>
              <DemoRow title="表单抽屉">
                <Button onClick={() => { setFooterMode('default'); setVisible(true); }}>
                  打开表单抽屉
                </Button>
              </DemoRow>
              <CopyBlock code={`import { Drawer, Form, Input, Checkbox, Radio, Select, Button } from '@zjpcy/simple-design';
import { useState } from 'react';

const Demo = () => {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'male',
    city: 'beijing',
    interests: ['reading'],
    agreement: false,
    description: ''
  });

  return (
    <>
      <Button onClick={() => setVisible(true)}>打开表单抽屉</Button>
      <Drawer
        title="用户信息"
        open={visible}
        onClose={() => setVisible(false)}
        width={520}
        footer={
          <>
            <Button onClick={() => setVisible(false)}>取消</Button>
            <Button variant="primary" onClick={() => console.log('提交', formData)}>
              确认
            </Button>
          </>
        }
      >
        <Form layout="vertical" style={{ width: '100%' }}>
          <Form.Item label="姓名" name="name">
            <Input
              placeholder="请输入姓名"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="邮箱" name="email">
            <Input
              type="email"
              placeholder="请输入邮箱"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="性别" name="gender">
            <Radio.Group value={formData.gender} onChange={(value) => setFormData({ ...formData, gender: value })}>
              <Radio value="male">男</Radio>
              <Radio value="female">女</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="城市" name="city">
            <Select
              placeholder="请选择城市"
              value={formData.city}
              onChange={(value) => setFormData({ ...formData, city: value })}
              style={{ width: '100%' }}
            >
              <Select.Option value="beijing">北京</Select.Option>
              <Select.Option value="shanghai">上海</Select.Option>
              <Select.Option value="guangzhou">广州</Select.Option>
              <Select.Option value="shenzhen">深圳</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="兴趣爱好" name="interests">
            <Checkbox.Group
              value={formData.interests}
              onChange={(checkedValues) => setFormData({ ...formData, interests: checkedValues as string[] })}
            >
              <Checkbox value="reading">阅读</Checkbox>
              <Checkbox value="music">音乐</Checkbox>
              <Checkbox value="sports">运动</Checkbox>
              <Checkbox value="travel">旅游</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item label="用户协议" name="agreement">
            <Checkbox
              checked={formData.agreement}
              onChange={(e) => setFormData({ ...formData, agreement: e.target.checked })}
            >
              我已阅读并同意用户协议
            </Checkbox>
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.Textarea
              placeholder="请输入描述"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value as string })}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};`} />
            </Section>
          </div>

          {/* 自定义容器 */}
          <div id="drawer-container">
            <Section title="自定义容器">
              <DemoRow title="挂载位置">
                <Space>
                  <Button onClick={() => { setCustomContainer(false); showDrawer('right', true, footerMode === 'default'); }}>
                    默认挂载到当前DOM
                  </Button>
                  <Button onClick={() => { setCustomContainer(true); showDrawer('right', true, footerMode === 'default'); }}>
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
              <CopyBlock code={`import { Drawer } from '@zjpcy/simple-design';
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
        open={open}
        onClose={onClose}
      />
    </>
  );
};`} />
            </Section>
          </div>

          {/* 销毁子元素 */}
          <div id="drawer-destroy">
            <Section title="销毁子元素">
              <DemoRow title="关闭策略">
                <Space>
                  <Button onClick={() => { setDestroyOnClose(false); showDrawer('right', true, footerMode === 'default'); }}>
                    关闭后保留子元素
                  </Button>
                  <Button onClick={() => { setDestroyOnClose(true); showDrawer('right', true, footerMode === 'default'); }}>
                    关闭后销毁子元素
                  </Button>
                </Space>
              </DemoRow>
              <CopyBlock code={`import { Drawer } from '@zjpcy/simple-design';

// 关闭后保留子元素（默认）
<Drawer open={open} onClose={onClose}>
  <Form /> {/* 表单状态会被保留 */}
</Drawer>

// 关闭后销毁子元素
<Drawer destroyOnClose={true} open={open} onClose={onClose}>
  <Form /> {/* 表单状态会被清空 */}
</Drawer>`} />
            </Section>
          </div>

          {/* 头部和底部 */}
          <div id="drawer-header-footer">
            <Section title="头部和底部">
              <p>支持自定义头部和底部内容，也可以隐藏头部和底部。</p>
              <DemoRow title="头部">
                <Space>
                  <Button onClick={() => { setHeaderMode('default'); showDrawer('right', true, footerMode === 'default'); }}>
                    显示头部
                  </Button>
                  <Button onClick={() => { setHeaderMode('false'); showDrawer('right', true, footerMode === 'default'); }}>
                    隐藏头部
                  </Button>
                  <Button onClick={() => { setHeaderMode('custom'); showDrawer('right', true, footerMode === 'default'); }}>
                    自定义头部
                  </Button>
                </Space>
              </DemoRow>
              <DemoRow title="底部">
                <Space>
                  <Button onClick={() => { setFooterMode('default'); showDrawer('right', true, true); }}>
                    显示默认底部
                  </Button>
                  <Button onClick={() => { setFooterMode('false'); showDrawer('right', true, false); }}>
                    隐藏底部
                  </Button>
                </Space>
              </DemoRow>
              <CopyBlock code={`import { Drawer, Flex, Button } from '@zjpcy/simple-design';

// 默认底部（推荐）- 不设置footer或设置为undefined
<Drawer
  title="默认底部"
  open={open}
  onClose={onClose}
  // 默认显示 footer，包含"取消"和"确认"按钮
  // 点击"取消"会自动调用onClose关闭抽屉
>
  <p>内容</p>
</Drawer>

// 自定义头部
<Drawer
  header={(
    <Flex justify="space-between" align="center">
      <span>自定义标题</span>
      <Button size="small">操作</Button>
    </Flex>
  )}
  open={open}
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
  open={open}
  onClose={onClose}
/>

// 隐藏底部
<Drawer footer={false} open={open} onClose={onClose} />`} />
            </Section>
          </div>

          {/* 遮罩层 */}
          <div id="drawer-mask">
            <Section title="遮罩层">
              <DemoRow title="遮罩配置">
                <Button onClick={() => { showDrawer('right', false, footerMode === 'default'); }}>
                  打开无遮罩层的抽屉
                </Button>
              </DemoRow>
              <CopyBlock code={`import { Drawer } from '@zjpcy/simple-design';

// 无遮罩层
<Drawer mask={false} open={open} onClose={onClose} />

// 点击遮罩不关闭
<Drawer maskClosable={false} open={open} onClose={onClose} />`} />
            </Section>
          </div>

          {/* 可拖拽调整大小 */}
          <div id="drawer-resizable">
            <Section title="可拖拽调整大小">
              <DemoRow title="拖拽调整">
                <Space>
                  <Button onClick={() => { setResizable(false); showDrawer('right', true, footerMode === 'default'); }}>
                    不可拖拽
                  </Button>
                  <Button onClick={() => { setResizable(true); setPlacement('right'); showDrawer('right', true, footerMode === 'default'); }}>
                    右侧可拖拽
                  </Button>
                  <Button onClick={() => { setResizable(true); setPlacement('left'); showDrawer('left', true, footerMode === 'default'); }}>
                    左侧可拖拽
                  </Button>
                  <Button onClick={() => { setResizable(true); setPlacement('top'); showDrawer('top', true, footerMode === 'default'); }}>
                    顶部可拖拽
                  </Button>
                  <Button onClick={() => { setResizable(true); setPlacement('bottom'); showDrawer('bottom', true, footerMode === 'default'); }}>
                    底部可拖拽
                  </Button>
                </Space>
              </DemoRow>
              {currentSize.width && <p>当前宽度: {currentSize.width}px</p>}
              {currentSize.height && <p>当前高度: {currentSize.height}px</p>}
              <CopyBlock code={`import { Drawer } from '@zjpcy/simple-design';

// 启用拖拽调整大小
<Drawer
  resizable
  open={open}
  onClose={onClose}
  onChange={(size) => console.log('新尺寸:', size)}
  minWidth={200}
  maxWidth={800}
  minHeight={150}
  maxHeight={600}
>
  内容
</Drawer>

// 不同位置的拖拽
<Drawer resizable placement="left" open={open} onClose={onClose} />
<Drawer resizable placement="right" open={open} onClose={onClose} />
<Drawer resizable placement="top" open={open} onClose={onClose} />
<Drawer resizable placement="bottom" open={open} onClose={onClose} />`} />
            </Section>
          </div>

          {/* API 文档 */}
          <div id="drawer-api">
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
                  { property: 'open', description: '是否可见', type: 'boolean', default: '-' },
                  { property: 'title', description: '抽屉标题', type: 'React.ReactNode', default: '-' },
                  { property: 'onClose', description: '关闭回调函数', type: '() => void', default: '-' },
                  { property: 'width', description: '抽屉宽度（placement为left或right时有效）', type: 'number | string', default: '460' },
                  { property: 'height', description: '抽屉高度（placement为top或bottom时有效）', type: 'number | string', default: '300' },
                  { property: 'placement', description: '抽屉位置', type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'" },
                  { property: 'maskClosable', description: '点击遮罩层是否允许关闭', type: 'boolean', default: 'true' },
                  { property: 'mask', description: '是否显示遮罩层', type: 'boolean', default: 'true' },
                  { property: 'children', description: '抽屉内容', type: 'React.ReactNode', default: '-' },
                  { property: 'className', description: '额外类名', type: 'string', default: '-' },
                  { property: 'style', description: '抽屉样式', type: 'React.CSSProperties', default: '-' },
                  { property: 'header', description: '头部内容：false表示不显示，React.ReactNode表示自定义内容，未传值则显示默认的标题和关闭按钮', type: 'React.ReactNode | false', default: '-' },
                  { property: 'footer', description: '页脚：false表示不显示，React.ReactNode表示自定义内容，未传值则显示默认的取消和确认按钮', type: 'React.ReactNode | false', default: '-' },
                  { property: 'getContainer', description: '指定挂载节点', type: '(() => HTMLElement) | HTMLElement | false', default: 'false' },
                  { property: 'destroyOnClose', description: '关闭后是否销毁子元素', type: 'boolean', default: 'false' },
                  { property: 'closable', description: '是否显示关闭按钮', type: 'boolean', default: 'true' },
                  { property: 'zIndex', description: 'z-index层级', type: 'number', default: '1000' },
                  { property: 'loading', description: '是否加载中状态', type: 'boolean', default: 'false' },
                  { property: 'resizable', description: '是否支持拖拽调整大小', type: 'boolean', default: 'false' },
                  { property: 'resizeHandleSize', description: '拖拽手柄大小（像素）', type: 'number', default: '8' },
                  { property: 'minWidth', description: '拖拽时最小宽度', type: 'number', default: '300' },
                  { property: 'maxWidth', description: '拖拽时最大宽度', type: 'number', default: '1000' },
                  { property: 'minHeight', description: '拖拽时最小高度', type: 'number', default: '150' },
                  { property: 'maxHeight', description: '拖拽时最大高度', type: 'number', default: '800' },
                  { property: 'onChange', description: '大小变化回调', type: '(size: { width?: number; height?: number }) => void', default: '-' },
                ]}
                rowKey="property"
                pagination={false}
              />
            </Section>
          </div>

          <Drawer
            title={`${placements.find(p => p.value === placement)?.label} 抽屉`}
            placement={placement}
            width={placement === 'left' || placement === 'right' ? width : undefined}
            height={placement === 'top' || placement === 'bottom' ? 300 : undefined}
            onClose={handleClose}
            open={visible}
            loading={loading}
            destroyOnClose={destroyOnClose}
            resizable={resizable}
            mask={mask}
            onChange={setCurrentSize}
            header={headerMode === 'custom' ? (
              <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 500 }}>自定义头部</span>
                  <span style={{ padding: '2px 8px', background: '#1890ff', color: '#fff', borderRadius: '4px', fontSize: '12px' }}>Tag</span>
                </div>
                <Button size="small" onClick={handleClose}>关闭</Button>
              </Flex>
            ) : headerMode === 'false' ? false : undefined}
            footer={footerMode === 'false' ? false : undefined}
            getContainer={customContainer && containerRef.current ? () => containerRef.current! : false}
          >
            <div>
              <p>这是一个抽屉组件的示例内容。</p>
              <p>当前位置: {placement}</p>
              <p>头部显示: {headerMode === 'false' ? '否' : '是'}</p>
              <p>底部显示: {footerMode === 'false' ? '否' : '是'}</p>
              <p>自定义头部: {headerMode === 'custom' ? '是' : '否'}</p>
              <p>你可以在这里放置任何内容。</p>
              <div style={{ marginTop: '20px' }}>
                <h4>示例表单</h4>
                <Form style={{ width: '100%' }}>
                  <Form.Item label="姓名" name="name" style={{ marginBottom: '16px' }}>
                    <Input
                      placeholder="请输入姓名"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </Form.Item>

                  <Form.Item label="邮箱" name="email" style={{ marginBottom: '16px' }}>
                    <Input
                      type="text"
                      placeholder="请输入邮箱"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Form.Item>

                  <Form.Item label="性别" name="gender" style={{ marginBottom: '16px' }}>
                    <Radio.Group value={formData.gender} onChange={(value) => setFormData({ ...formData, gender: value })}>
                      <Radio value="male">男</Radio>
                      <Radio value="female">女</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item label="城市" name="city" style={{ marginBottom: '16px' }}>
                    <Select
                      placeholder="请选择城市"
                      value={formData.city}
                      onChange={(value) => setFormData({ ...formData, city: value as string })}
                      options={[
                        { value: 'beijing', label: '北京' },
                        { value: 'shanghai', label: '上海' },
                        { value: 'guangzhou', label: '广州' },
                        { value: 'shenzhen', label: '深圳' },
                      ]}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item label="兴趣爱好" name="interests" style={{ marginBottom: '16px' }}>
                    <Checkbox.Group
                      value={formData.interests}
                      onChange={(checkedValues) => setFormData({ ...formData, interests: checkedValues as string[] })}
                    >
                      <Checkbox value="reading">阅读</Checkbox>
                      <Checkbox value="music">音乐</Checkbox>
                      <Checkbox value="sports">运动</Checkbox>
                      <Checkbox value="travel">旅游</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item label="用户协议" name="agreement" style={{ marginBottom: '16px' }}>
                    <Checkbox
                      checked={formData.agreement}
                      onChange={(checked) => setFormData({ ...formData, agreement: checked })}
                    >
                      我已阅读并同意用户协议
                    </Checkbox>
                  </Form.Item>

                  <Form.Item label="描述" name="description" style={{ marginBottom: '16px' }}>
                    <Input.Textarea
                      placeholder="请输入描述"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value as string })}
                    />
                  </Form.Item>
                </Form>
              </div>
            </div>
          </Drawer>
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
                <Anchor.Link href="#drawer-intro" title="组件介绍" />
                <Anchor.Link href="#drawer-basic" title="基础用法" />
                <Anchor.Link href="#drawer-footer" title="默认底部" />
                <Anchor.Link href="#drawer-size" title="自定义尺寸" />
                <Anchor.Link href="#drawer-loading" title="加载状态" />
                <Anchor.Link href="#drawer-form" title="表单示例" />
                <Anchor.Link href="#drawer-container" title="自定义容器" />
                <Anchor.Link href="#drawer-destroy" title="销毁子元素" />
                <Anchor.Link href="#drawer-header-footer" title="头部和底部" />
                <Anchor.Link href="#drawer-mask" title="遮罩层" />
                <Anchor.Link href="#drawer-resizable" title="可拖拽调整" />
                <Anchor.Link href="#drawer-api" title="API 文档" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawerExample;

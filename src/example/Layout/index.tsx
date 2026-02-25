import React, { useState } from 'react';
import { Layout, Table, Icon, Flex, Menu } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Header, Sider, Content, Footer } = Layout;

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

const LayoutExample: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedTop, setCollapsedTop] = useState(false);
  const [collapsedZeroWidth, setCollapsedZeroWidth] = useState(false);
  const [themeColor, setThemeColor] = useState<'light' | 'blue' | 'green'>('light');
  const [selectedMenuKey, setSelectedMenuKey] = useState('1');

  // 菜单数据
  const menuItems = [
    {
      key: '1',
      label: '仪表盘',
      icon: <Icon type="home" size={16} />
    },
    {
      key: '2',
      label: '用户管理',
      icon: <Icon type="user" size={16} />,
      children: [
        { key: '2-1', label: '用户列表', icon: <Icon type="list" size={12} /> },
        { key: '2-2', label: '角色管理', icon: <Icon type="mobile" size={12} /> }
      ]
    },
    {
      key: '3',
      label: '系统设置',
      icon: <Icon type="setting" size={16} />,
      children: [
        { key: '3-1', label: '基本设置', icon: <Icon type="edit" size={12} /> },
        { key: '3-2', label: '安全设置', icon: <Icon type="safety" size={12} /> }
      ]
    },
    {
      key: '4',
      label: '统计分析',
      icon: <Icon type="barChart" size={16} />
    }
  ];

  // API参数列配置
  const apiColumns: Column[] = [
    { dataIndex: 'param', title: '参数名', width: '180px' },
    { dataIndex: 'type', title: '类型', width: '200px' },
    { dataIndex: 'default', title: '默认值', width: '120px' },
    { dataIndex: 'description', title: '描述', width: '300px' }
  ];

  // Layout API参数数据源
  const layoutApiDataSource = [
    { param: 'className', type: 'string', default: '-', description: '自定义类名' },
    { param: 'style', type: 'CSSProperties', default: '-', description: '自定义样式' },
    { param: 'hasSider', type: 'boolean', default: '自动检测', description: '是否包含 Sider（会影响布局）' },
    { param: 'children', type: 'ReactNode', default: '-', description: '子元素' }
  ];

  // Header API参数数据源
  const headerApiDataSource = [
    { param: 'className', type: 'string', default: '-', description: '自定义类名' },
    { param: 'style', type: 'CSSProperties', default: '-', description: '自定义样式' },
    { param: 'height', type: 'string | number', default: '64px', description: '头部高度' },
    { param: 'fixed', type: 'boolean', default: 'false', description: '是否固定头部' },
    { param: 'children', type: 'ReactNode', default: '-', description: '子元素' }
  ];

  // Sider API参数数据源
  const siderApiDataSource = [
    { param: 'className', type: 'string', default: '-', description: '自定义类名' },
    { param: 'style', type: 'CSSProperties', default: '-', description: '自定义样式' },
    { param: 'width', type: 'string | number', default: '200', description: '侧边栏宽度' },
    { param: 'collapsedWidth', type: 'number', default: '64', description: '收缩后的宽度（非零宽度模式）' },
    { param: 'collapsible', type: 'boolean', default: 'false', description: '是否可收缩' },
    { param: 'collapsed', type: 'boolean', default: 'false', description: '是否收缩' },
    { param: 'onCollapse', type: '(collapsed) => void', default: '-', description: '收缩/展开时的回调' },
    { param: 'trigger', type: 'ReactNode', default: '默认图标', description: '收缩按钮的触发器' },
    { param: 'triggerPlacement', type: "'top' | 'bottom'", default: "'bottom'", description: '收缩按钮位置，top 在顶部，bottom 在底部' },
    { param: 'zeroWidthMode', type: 'boolean', default: 'false', description: '是否使用完全收缩模式（收缩时宽度为0，并显示浮动展开按钮）' },
    { param: 'fixed', type: 'boolean', default: 'false', description: '是否固定侧边栏' },
    { param: 'children', type: 'ReactNode', default: '-', description: '子元素' }
  ];

  // Content API参数数据源
  const contentApiDataSource = [
    { param: 'className', type: 'string', default: '-', description: '自定义类名' },
    { param: 'style', type: 'CSSProperties', default: '-', description: '自定义样式' },
    { param: 'children', type: 'ReactNode', default: '-', description: '子元素' }
  ];

  // Footer API参数数据源
  const footerApiDataSource = [
    { param: 'className', type: 'string', default: '-', description: '自定义类名' },
    { param: 'style', type: 'CSSProperties', default: '-', description: '自定义样式' },
    { param: 'height', type: 'string | number', default: '48px', description: '页脚高度' },
    { param: 'fixed', type: 'boolean', default: 'false', description: '是否固定页脚' },
    { param: 'children', type: 'ReactNode', default: '-', description: '子元素' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Layout 页面布局</h1>
      <p>Layout 提供页面级别的布局模式，包含 Header、Content、Footer、Sider 四部分。</p>

      {/* 基础布局 */}
      <Section title="基础布局">
        <p>最简单的布局方式：上-中-下结构</p>
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px', marginBottom: '16px' }}>
          <Layout style={{ minHeight: '300px' }}>
            <Header>Header</Header>
            <Content>Content</Content>
            <Footer>Footer</Footer>
          </Layout>
        </div>
        <CopyBlock code={`import { Layout } from '@zjpcy/simple-design';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Layout>
      <Header>Header</Header>
      <Content>Content</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}`} />
      </Section>

      {/* 侧边栏布局 */}
      <Section title="侧边栏布局">
        <p>包含侧边栏的经典布局方式，支持收缩功能</p>
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px', marginBottom: '16px' }}>
          <Layout style={{ minHeight: '400px' }}>
            <Header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icon type="home" />
              <span>Logo</span>
            </Header>
            <Layout>
              <Sider
                width={200}
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
              >
                <div style={{ color: 'rgba(255, 255, 255, 0.65)', padding: '24px' }}>
                  {collapsed ? 'Collapsed' : 'Sider Menu'}
                </div>
              </Sider>
              <Content>
                <div style={{ padding: '24px', background: '#fff', minHeight: '280px' }}>
                  <p style={{ marginBottom: '16px' }}>这是主要内容区域</p>
                  <p style={{ color: '#666' }}>
                    左侧侧边栏可以点击底部的箭头按钮进行收缩或展开
                  </p>
                </div>
              </Content>
            </Layout>
            <Footer>Footer</Footer>
          </Layout>
        </div>
        <CopyBlock code={`import { Layout } from '@zjpcy/simple-design';

const { Header, Sider, Content, Footer } = Layout;
const [collapsed, setCollapsed] = useState(false);

function App() {
  return (
    <Layout>
      <Header>Header</Header>
      <Layout>
        <Sider
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
        >
          Sider
        </Sider>
        <Content>Content</Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
  );
}`} />
      </Section>

      {/* 收缩按钮位置 */}
      <Section title="收缩按钮位置">
        <p>通过 triggerPlacement 属性可以设置收缩按钮的位置，支持 top（顶部）和 bottom（底部，默认）两种位置</p>
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px', marginBottom: '16px' }}>
          <Layout style={{ minHeight: '400px' }}>
            <Header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icon type="home" />
              <span>Logo</span>
            </Header>
            <Layout>
              <Sider
                width={200}
                collapsible
                collapsed={collapsedTop}
                onCollapse={setCollapsedTop}
                triggerPlacement="top"
              >
                <div style={{ color: 'rgba(255, 255, 255, 0.65)', padding: '24px' }}>
                  {collapsedTop ? 'Collapsed' : 'Sider Menu (Top Trigger)'}
                </div>
              </Sider>
              <Content>
                <div style={{ padding: '24px', background: '#fff', minHeight: '280px' }}>
                  <p style={{ marginBottom: '16px' }}>这是主要内容区域</p>
                  <p style={{ color: '#666' }}>
                    左侧侧边栏的收缩按钮位于顶部，点击顶部箭头按钮进行收缩或展开
                  </p>
                </div>
              </Content>
            </Layout>
            <Footer>Footer</Footer>
          </Layout>
        </div>
        <CopyBlock code={`import { Layout } from '@zjpcy/simple-design';

const { Header, Sider, Content, Footer } = Layout;
const [collapsed, setCollapsed] = useState(false);

function App() {
  return (
    <Layout>
      <Header>Header</Header>
      <Layout>
        <Sider
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          triggerPlacement="top"
        >
          Sider
        </Sider>
        <Content>Content</Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
  );
}`} />
      </Section>

      {/* 零宽度收缩模式 */}
      <Section title="零宽度收缩模式">
        <p>通过 zeroWidthMode 属性启用完全收缩模式。收缩时侧边栏宽度为 0，并在左上角显示浮动展开按钮，点击可重新展开侧边栏</p>
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px', marginBottom: '16px', position: 'relative', minHeight: '400px' }}>
          <Layout style={{ minHeight: '400px' }}>
            <Header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icon type="home" />
              <span>Logo</span>
            </Header>
            <Layout>
              <Sider
                width={200}
                collapsible
                collapsed={collapsedZeroWidth}
                onCollapse={setCollapsedZeroWidth}
                zeroWidthMode
              >
                <div style={{ color: 'rgba(255, 255, 255, 0.65)', padding: '24px' }}>
                  {collapsedZeroWidth ? 'Collapsed' : 'Sider Menu (Zero Width Mode)'}
                </div>
              </Sider>
              <Content>
                <div style={{ padding: '24px', background: '#fff', minHeight: '280px' }}>
                  <p style={{ marginBottom: '16px' }}>这是主要内容区域</p>
                  <p style={{ color: '#666' }}>
                    启用零宽度模式后，点击侧边栏内的收缩按钮可以将侧边栏完全隐藏（宽度为0）。
                    收缩后，左上角会出现一个蓝色的菜单图标按钮，点击它可以重新展开侧边栏。
                  </p>
                </div>
              </Content>
            </Layout>
            <Footer>Footer</Footer>
          </Layout>
        </div>
        <CopyBlock code={`import { Layout } from '@zjpcy/simple-design';

const { Header, Sider, Content, Footer } = Layout;
const [collapsed, setCollapsed] = useState(false);

function App() {
  return (
    <Layout>
      <Header>Header</Header>
      <Layout>
        <Sider
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          zeroWidthMode
        >
          Sider
        </Sider>
        <Content>Content</Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
  );
}`} />
      </Section>

      {/* 自定义布局 */}
      <Section title="自定义布局">
        <p>可以通过 props 自定义各部分的高度、宽度等样式</p>
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px', marginBottom: '16px' }}>
          <Layout style={{ minHeight: '400px' }}>
            <Header height={80} style={{ background: '#1890ff' }}>
              <div style={{ fontSize: '18px', fontWeight: 600 }}>
                Custom Header (80px height)
              </div>
            </Header>
            <Layout>
              <Sider width={240} style={{ background: '#001529' }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.65)', padding: '24px' }}>
                  Custom Sider (240px width)
                </div>
              </Sider>
              <Content>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>自定义配置示例</h3>
                  <ul style={{ lineHeight: '2', color: '#666' }}>
                    <li>Header 高度设置为 80px</li>
                    <li>Sider 宽度设置为 240px</li>
                    <li>Footer 高度保持默认 48px</li>
                  </ul>
                </div>
              </Content>
            </Layout>
            <Footer height={60}>
              Custom Footer (60px height)
            </Footer>
          </Layout>
        </div>
        <CopyBlock code={`import { Layout } from '@zjpcy/simple-design';

const { Header, Sider, Content, Footer } = Layout;

function App() {
  return (
    <Layout>
      <Header height={64} fixed>Fixed Header</Header>
      <Layout>
        <Sider width={250} fixed>Fixed Sider</Sider>
        <Content>Content</Content>
      </Layout>
      <Footer height={48}>Footer</Footer>
    </Layout>
  );
}`} />
      </Section>

      {/* 主题颜色切换 */}
      <Section title="主题颜色切换">
        <p>通过修改 Header 和 Sider 的 background 属性，可以轻松实现主题颜色的切换</p>
        <div style={{ marginBottom: '16px' }}>
          <Flex gap="small" align="center">
            <span>当前主题：</span>
            <button
              onClick={() => setThemeColor('light')}
              style={{
                padding: '6px 16px',
                background: themeColor === 'light' ? '#1890ff' : '#fff',
                color: themeColor === 'light' ? '#fff' : '#666',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              浅色主题
            </button>
            <button
              onClick={() => setThemeColor('blue')}
              style={{
                padding: '6px 16px',
                background: themeColor === 'blue' ? '#1890ff' : '#fff',
                color: themeColor === 'blue' ? '#fff' : '#666',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              蓝色主题
            </button>
            <button
              onClick={() => setThemeColor('green')}
              style={{
                padding: '6px 16px',
                background: themeColor === 'green' ? '#52c41a' : '#fff',
                color: themeColor === 'green' ? '#fff' : '#666',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              绿色主题
            </button>
          </Flex>
        </div>
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px', marginBottom: '16px' }}>
          <Layout style={{ minHeight: '400px' }}>
            <Header style={{ display: 'flex', alignItems: 'center', gap: '12px', background: themeColor === 'light' ? '#001529' : themeColor === 'blue' ? '#1890ff' : '#52c41a' }}>
              <Icon type="home" />
              <span style={{ fontWeight: 600 }}>Logo</span>
            </Header>
            <Layout>
              <Sider
                width={200}
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                style={{ background: themeColor === 'light' ? '#001529' : themeColor === 'blue' ? '#1890ff' : '#52c41a' }}
              >
                <div style={{ color: 'rgba(255, 255, 255, 0.65)', padding: '24px' }}>
                  {collapsed ? 'Collapsed' : 'Sider Menu'}
                </div>
              </Sider>
              <Content>
                <div style={{ padding: '24px', background: '#fff', minHeight: '280px' }}>
                  <p style={{ marginBottom: '16px' }}>这是主要内容区域</p>
                  <p style={{ color: '#666' }}>
                    点击上方的主题按钮可以切换 Header 和 Sider 的背景颜色
                  </p>
                </div>
              </Content>
            </Layout>
            <Footer>Footer</Footer>
          </Layout>
        </div>
        <CopyBlock code={`import { Layout } from '@zjpcy/simple-design';

const { Header, Sider, Content, Footer } = Layout;
const [collapsed, setCollapsed] = useState(false);
const [themeColor, setThemeColor] = useState<'light' | 'blue' | 'green'>('light');

function App() {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setThemeColor('light')}>浅色主题</button>
        <button onClick={() => setThemeColor('blue')}>蓝色主题</button>
        <button onClick={() => setThemeColor('green')}>绿色主题</button>
      </div>
      <Layout>
        <Header style={{ background: themeColor === 'light' ? '#001529' : themeColor === 'blue' ? '#1890ff' : '#52c41a' }}>
          Header
        </Header>
        <Layout>
          <Sider
            width={200}
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            style={{ background: themeColor === 'light' ? '#001529' : themeColor === 'blue' ? '#1890ff' : '#52c41a' }}
          >
            Sider
          </Sider>
          <Content>Content</Content>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
    </div>
  );
}`} />
      </Section>

      {/* 结合 Menu 组件 */}
      <Section title="结合 Menu 组件">
        <p>在 Layout.Sider 中集成 Menu 组件，实现常见的侧边导航布局</p>
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px', marginBottom: '16px' }}>
          <Layout style={{ minHeight: '500px' }}>
            <Header style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#001529' }}>
              <Icon type="home" />
              <span style={{ fontWeight: 600 }}>管理系统</span>
            </Header>
            <Layout>
              <Sider
                width={240}
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
              >
                <Menu
                  mode="vertical"
                  items={menuItems}
                  selectedKey={selectedMenuKey}
                  collapsed={collapsed}
                  theme="dark"
                  onChange={(_info, key) => setSelectedMenuKey(key)}
                />
              </Sider>
              <Content>
                <div style={{ padding: '24px', background: '#fff', minHeight: '400px' }}>
                  <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>
                    {menuItems.find(item => item.key === selectedMenuKey)?.label || '仪表盘'}
                  </h3>
                  <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '4px', marginBottom: '16px' }}>
                    <p style={{ marginBottom: '12px' }}>当前选中的菜单：<strong>{selectedMenuKey}</strong></p>
                    <p style={{ color: '#666', lineHeight: '1.8' }}>
                      这是一个完整的后台管理系统布局示例，包含：
                    </p>
                    <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#666' }}>
                      <li>固定头部，显示系统 Logo</li>
                      <li>侧边栏集成 Menu 组件，支持多级菜单</li>
                      <li>侧边栏支持收缩/展开功能</li>
                      <li>内容区域展示选中菜单的相关内容</li>
                      <li>支持点击菜单项切换内容</li>
                    </ul>
                  </div>
                  <div style={{ padding: '16px', border: '1px solid #e8e8e8', borderRadius: '4px' }}>
                    <h4 style={{ marginBottom: '12px' }}>功能说明：</h4>
                    <p style={{ color: '#666', marginBottom: '8px' }}>
                      点击左侧菜单项可以切换当前页面的内容显示。
                    </p>
                    <p style={{ color: '#666', marginBottom: '8px' }}>
                      点击底部的箭头按钮可以收缩或展开侧边栏。
                    </p>
                    <p style={{ color: '#666' }}>
                      Menu 组件支持多级菜单，可以更好地组织系统功能模块。
                    </p>
                  </div>
                </div>
              </Content>
            </Layout>
            <Footer style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.45)' }}>
              © 2025 管理系统. All rights reserved.
            </Footer>
          </Layout>
        </div>
        <CopyBlock code={`import { Layout, Menu, Icon } from '@zjpcy/simple-design';
import { useState } from 'react';

const { Header, Sider, Content, Footer } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState('1');

  const menuItems = [
    {
      key: '1',
      label: '仪表盘',
      icon: <Icon type="home" size={16} />
    },
    {
      key: '2',
      label: '用户管理',
      icon: <Icon type="user" size={16} />,
      children: [
        { key: '2-1', label: '用户列表' },
        { key: '2-2', label: '角色管理' }
      ]
    },
    {
      key: '3',
      label: '系统设置',
      icon: <Icon type="setting" size={16} />
    }
  ];

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Icon type="home" />
        <span>管理系统</span>
      </Header>
      <Layout>
        <Sider
          width={240}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
        >
          <Menu
            mode="vertical"
            items={menuItems}
            selectedKey={selectedMenuKey}
            collapsed={collapsed}
            theme="dark"
            onChange={(_info, key) => setSelectedMenuKey(key)}
          />
        </Sider>
        <Content>
          <div style={{ padding: '24px' }}>
            {/* 根据选中菜单显示不同内容 */}
            {selectedMenuKey === '1' && <div>仪表盘内容</div>}
            {selectedMenuKey === '2' && <div>用户管理内容</div>}
            {selectedMenuKey === '3' && <div>系统设置内容</div>}
          </div>
        </Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
  );
}`} />
      </Section>

      {/* API 文档 */}
      <Section title="API 文档">
        <h3 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: 600 }}>
          Layout
        </h3>
        <div style={{ marginBottom: '32px' }}>
          <Table columns={apiColumns} dataSource={layoutApiDataSource} />
        </div>

        <h3 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: 600 }}>
          Layout.Header
        </h3>
        <div style={{ marginBottom: '32px' }}>
          <Table columns={apiColumns} dataSource={headerApiDataSource} />
        </div>

        <h3 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: 600 }}>
          Layout.Sider
        </h3>
        <div style={{ marginBottom: '32px' }}>
          <Table columns={apiColumns} dataSource={siderApiDataSource} />
        </div>

        <h3 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: 600 }}>
          Layout.Content
        </h3>
        <div style={{ marginBottom: '32px' }}>
          <Table columns={apiColumns} dataSource={contentApiDataSource} />
        </div>

        <h3 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: 600 }}>
          Layout.Footer
        </h3>
        <Table columns={apiColumns} dataSource={footerApiDataSource} />
      </Section>
    </div>
  );
};

export default LayoutExample;

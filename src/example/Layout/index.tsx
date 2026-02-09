import React, { useState } from 'react';
import { Layout, Table, Icon } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Header, Sider, Content, Footer } = Layout;

const LayoutExample: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedTop, setCollapsedTop] = useState(false);
  const [collapsedZeroWidth, setCollapsedZeroWidth] = useState(false);

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

  const basicLayoutCode = `import { Layout } from 'idp-design';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Layout>
      <Layout.Header>Header</Layout.Header>
      <Layout.Content>Content</Layout.Content>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
  );
}`;

  const siderLayoutCode = `import { Layout } from 'idp-design';

const { Header, Sider, Content, Footer } = Layout;
const [collapsed, setCollapsed] = useState(false);

function App() {
  return (
    <Layout>
      <Layout.Header>Header</Layout.Header>
      <Layout>
        <Layout.Sider
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
        >
          Sider
        </Layout.Sider>
        <Layout.Content>Content</Layout.Content>
      </Layout>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
  );
}`;

  const triggerPlacementCode = `import { Layout } from 'idp-design';

const { Header, Sider, Content, Footer } = Layout;
const [collapsed, setCollapsed] = useState(false);

function App() {
  return (
    <Layout>
      <Layout.Header>Header</Layout.Header>
      <Layout>
        <Layout.Sider
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          triggerPlacement="top"
        >
          Sider
        </Layout.Sider>
        <Layout.Content>Content</Layout.Content>
      </Layout>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
  );
}`;

  const zeroWidthModeCode = `import { Layout } from 'idp-design';

const { Header, Sider, Content, Footer } = Layout;
const [collapsed, setCollapsed] = useState(false);

function App() {
  return (
    <Layout>
      <Layout.Header>Header</Layout.Header>
      <Layout>
        <Layout.Sider
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          zeroWidthMode
        >
          Sider
        </Layout.Sider>
        <Layout.Content>Content</Layout.Content>
      </Layout>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
  );
}`;

  const customLayoutCode = `import { Layout } from 'idp-design';

const { Header, Sider, Content, Footer } = Layout;

function App() {
  return (
    <Layout>
      <Layout.Header height={64} fixed>Fixed Header</Layout.Header>
      <Layout>
        <Layout.Sider width={250} fixed>Fixed Sider</Layout.Sider>
        <Layout.Content>Content</Layout.Content>
      </Layout>
      <Layout.Footer height={48}>Footer</Layout.Footer>
    </Layout>
  );
}`;

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px', fontWeight: 600 }}>
        Layout 页面布局
      </h1>

      {/* 基础布局 */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: 600 }}>
          基础布局
        </h2>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          最简单的布局方式：上-中-下结构
        </p>
        <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px', marginBottom: '16px' }}>
          <Layout style={{ minHeight: '300px' }}>
            <Header>Header</Header>
            <Content>Content</Content>
            <Footer>Footer</Footer>
          </Layout>
        </div>
        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
          {basicLayoutCode}
        </SyntaxHighlighter>
      </div>

      {/* 侧边栏布局 */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: 600 }}>
          侧边栏布局
        </h2>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          包含侧边栏的经典布局方式，支持收缩功能
        </p>
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
        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
          {siderLayoutCode}
        </SyntaxHighlighter>
      </div>

      {/* 收缩按钮位置 */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: 600 }}>
          收缩按钮位置
        </h2>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          通过 triggerPlacement 属性可以设置收缩按钮的位置，支持 top（顶部）和 bottom（底部，默认）两种位置
        </p>
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
        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
          {triggerPlacementCode}
        </SyntaxHighlighter>
      </div>

      {/* 零宽度收缩模式 */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: 600 }}>
          零宽度收缩模式
        </h2>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          通过 zeroWidthMode 属性启用完全收缩模式。收缩时侧边栏宽度为 0，并在左上角显示浮动展开按钮，点击可重新展开侧边栏
        </p>
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
        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
          {zeroWidthModeCode}
        </SyntaxHighlighter>
      </div>

      {/* 自定义布局 */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: 600 }}>
          自定义布局
        </h2>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          可以通过 props 自定义各部分的高度、宽度等样式
        </p>
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
        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
          {customLayoutCode}
        </SyntaxHighlighter>
      </div>

      {/* API 文档 */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '24px', fontWeight: 600 }}>
          API 文档
        </h2>

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
      </div>
    </div>
  );
};

export default LayoutExample;

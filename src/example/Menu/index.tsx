import React, { useState, useEffect } from 'react';
import { Menu, Icon, Flex, Table, Anchor } from '../../components';
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

const MenuExample: React.FC = () => {
  // 用于演示受控组件模式的state
  const [controlledSelectedKey, setControlledSelectedKey] = useState('1-1-1');
  // 用于演示折叠模式的state
  const [collapsed, setCollapsed] = useState(false);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  // 菜单数据
  const menuItems = [
    {
      key: '1',
      label: '系统管理',
      icon: <Icon type="setting" size={16} />,
      children: [
        {
          key: '1-1',
          label: '用户管理',
          icon: <Icon type="user" size={14} />,
          children: [
            { key: '1-1-1', label: '用户列表', icon: <Icon type="list" size={12} /> },
            { key: '1-1-2', label: '角色管理', icon: <Icon type="mobile" size={12} /> }
          ]
        },
        {
          key: '1-2',
          label: '权限管理',
          icon: <Icon type="safety" size={14} />,
          children: [
            { key: '1-2-1', label: '权限配置', icon: <Icon type="key" size={12} /> },
            { key: '1-2-2', label: '权限分配', icon: <Icon type="share" size={12} /> }
          ]
        }
      ]
    },
    {
      key: '2',
      label: '内容管理',
      icon: <Icon type="fileText" size={16} />,
      children: [
        {
          key: '2-1',
          label: '文章管理',
          icon: <Icon type="book" size={14} />,
          children: [
            { key: '2-1-1', label: '文章列表', icon: <Icon type="unorderedList" size={12} /> },
            { key: '2-1-2', label: '文章分类', icon: <Icon type="folder" size={12} /> }
          ]
        },
        {
          key: '2-2',
          label: '媒体库',
          icon: <Icon type="picture" size={14} />,
          children: [
            { key: '2-2-1', label: '图片管理', icon: <Icon type="image" size={12} /> },
            { key: '2-2-2', label: '文件管理', icon: <Icon type="file" size={12} /> }
          ]
        }
      ]
    }
  ];

  // 内联菜单数据 - 包含带 icon 和无 icon 的菜单项，用于测试折叠模式
  const inlineMenuItems = [
    {
      key: '1',
      label: '首页',
      icon: <Icon type="home" size={16} />
    },
    {
      key: '2',
      label: '产品',
      icon: <Icon type="appstore" size={16} />,
      children: [
        { key: '2-1', label: '产品列表' },
        { key: '2-2', label: '产品分类' }
      ]
    },
    {
      key: '3',
      label: '关于',
      icon: <Icon type="infoCircle" size={16} />
    },
    {
      key: '4',
      label: '无图标项',
      // 无 icon，折叠时显示首字母
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="menu-intro">Menu 菜单</h1>
          <p>菜单导航组件，支持多种模式和交互方式，为页面和功能提供导航。</p>

          {/* 垂直菜单 */}
          <div id="menu-vertical">
            <Section title="垂直菜单 (Vertical)">
              <p style={{ marginBottom: '16px', color: '#666' }}>适合侧边栏导航的垂直菜单，支持多级嵌套。</p>
              <DemoRow title="垂直菜单">
                <div style={{ border: '1px solid #e1e1e1', borderRadius: '8px', padding: '16px' }}>
                  <Menu
                    mode="vertical"
                    items={menuItems}
                    onChange={(info, key) => console.log('菜单项点击:', info, key)}
                  />
                </div>
              </DemoRow>
              <CopyBlock code={`import { Menu, Icon } from '@zjpcy/simple-design';

const menuItems = [
  {
    key: '1',
    label: '系统管理',
    icon: <Icon type="setting" size={16} />,
    children: [
      {
        key: '1-1',
        label: '用户管理',
        children: [
          { key: '1-1-1', label: '用户列表' }
        ]
      }
    ]
  }
];

<Menu
  mode="vertical"
  items={menuItems}
  onChange={(info, key) => console.log('菜单项点击:', info, key)}
/>`} />
            </Section>
          </div>

          {/* 垂直菜单折叠模式 */}
          <div id="menu-collapsed">
            <Section title="垂直菜单折叠模式 (Collapsed)">
              <p style={{ marginBottom: '16px', color: '#666' }}>垂直菜单支持折叠模式，折叠后只显示图标或首字符，鼠标悬停显示完整标签。</p>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={collapsed}
                    onChange={(e) => setCollapsed(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>折叠模式</span>
                </label>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  当前状态: {collapsed ? '已折叠' : '已展开'}
                </span>
              </div>
              <DemoRow title="折叠菜单">
                <div style={{ border: '1px solid #e1e1e1', borderRadius: '8px', padding: '16px' }}>
                  <Menu
                    mode="vertical"
                    items={menuItems}
                    collapsed={collapsed}
                    onChange={(info, key) => console.log('菜单项点击:', info, key)}
                  />
                </div>
              </DemoRow>
              <CopyBlock code={`const [collapsed, setCollapsed] = useState(false);

// 折叠开关
<label>
  <input
    type="checkbox"
    checked={collapsed}
    onChange={(e) => setCollapsed(e.target.checked)}
  />
  折叠模式
</label>

<Menu
  mode="vertical"
  items={menuItems}
  collapsed={collapsed}
  onChange={(info, key) => console.log('菜单项点击:', info, key)}
/>`} />
            </Section>
          </div>

          {/* 水平菜单 */}
          <div id="menu-horizontal">
            <Section title="水平菜单 (Horizontal)">
              <p style={{ marginBottom: '16px', color: '#666' }}>适合顶部导航的水平菜单，支持点击触发子菜单。</p>
              <DemoRow title="水平菜单">
                <div style={{ border: '1px solid #e1e1e1', borderRadius: '8px', padding: '16px', flex: 1 }}>
                  <Menu mode="horizontal" items={inlineMenuItems} onChange={(info, key) => console.log(info, key)} />
                </div>
              </DemoRow>
              <CopyBlock code={`<Menu mode="horizontal" items={menuItems} />`} />
            </Section>
          </div>

          {/* 内联菜单 */}
          <div id="menu-inline">
            <Section title="内联菜单 (Inline)">
              <p style={{ marginBottom: '16px', color: '#666' }}>垂直排列的内联菜单，子菜单内嵌展开。</p>
              <DemoRow title="内联菜单">
                <div style={{ border: '1px solid #e1e1e1', borderRadius: '8px', padding: '16px', width: 'auto' }}>
                  <Menu mode="inline" items={inlineMenuItems} />
                </div>
              </DemoRow>
              <CopyBlock code={`<Menu mode="inline" items={menuItems} />`} />
            </Section>
          </div>

          {/* 扁平垂直菜单 */}
          <div id="menu-vertical-flat">
            <Section title="扁平垂直菜单 (Vertical Flat)">
              <p style={{ marginBottom: '16px', color: '#666' }}>子菜单直接扁平化展示的垂直菜单，没有展开/关闭功能，所有层级一目了然。</p>
              <DemoRow title="扁平菜单">
                <div style={{ border: '1px solid #e1e1e1', borderRadius: '8px', padding: '16px', width: 'auto' }}>
                  <Menu mode="vertical-flat" items={inlineMenuItems} />
                </div>
              </DemoRow>
              <CopyBlock code={`<Menu mode="vertical-flat" items={menuItems} />`} />
            </Section>
          </div>

          {/* 受控组件模式 */}
          <div id="menu-controlled">
            <Section title="受控组件模式 (selectedKey)">
              <p style={{ marginBottom: '16px', color: '#666' }}>使用 selectedKey 属性控制菜单的选中状态，当选中子项目时会自动展开父级菜单。</p>
              <DemoRow title="受控菜单">
                <div style={{ border: '1px solid #e1e1e1', borderRadius: '8px', padding: '16px' }}>
                  <Menu
                    mode="vertical"
                    items={menuItems}
                    selectedKey={controlledSelectedKey}
                    onChange={(info, key) => {
                      setControlledSelectedKey(key);
                      console.log('菜单项点击:', info, key);
                    }}
                  />
                </div>
              </DemoRow>
              <CopyBlock code={`const [selectedKey, setSelectedKey] = useState('1-1-1');

<Menu
  mode="vertical"
  items={menuItems}
  selectedKey={selectedKey}
  onChange={(info, key) => {
    setSelectedKey(key);
    console.log('菜单项点击:', info, key);
  }}
/>`} />
            </Section>
          </div>

          {/* 主题示例 */}
          <div id="menu-theme">
            <Section title="主题效果">
              <p style={{ marginBottom: '16px', color: '#666' }}>通过 theme 属性设置菜单主题，默认为深色主题，子目录自动切换为浅色效果。</p>
              <DemoRow title="深色主题（根目录）">
                <div style={{ border: '1px solid #e1e1e1', borderRadius: '8px', padding: '16px', background: '#001529' }}>
                  <Menu
                    mode="vertical"
                    theme="dark"
                    items={menuItems}
                    onChange={(info, key) => console.log('菜单项点击:', info, key)}
                  />
                </div>
              </DemoRow>
              <CopyBlock code={`<Menu
  mode="vertical"
  theme="dark"
  items={menuItems}
  onChange={(info, key) => console.log('菜单项点击:', info, key)}
/>`} />
            </Section>
          </div>

          {/* API 文档 */}
          <div id="menu-api">
            <Section title="API">
              <h3 style={{ marginBottom: '16px' }}>Menu Props</h3>
              <div style={{ border: '1px solid #e1e1e1', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
                <Table
                  dataSource={[
                    { property: 'mode', description: '菜单模式', type: '"horizontal" | "vertical" | "inline" | "vertical-flat"', default: '"vertical"' },
                    { property: 'items', description: '菜单项数组', type: 'MenuItem[]', default: '-' },
                    { property: 'selectedKey', description: '当前选中的菜单项 key（受控模式）', type: 'string', default: '-' },
                    { property: 'defaultOpenKeys', description: '默认展开的菜单项 key 数组', type: 'string[]', default: '[]' },
                    { property: 'openKeys', description: '展开的菜单项 key 数组（受控模式）', type: 'string[]', default: '-' },
                    { property: 'collapsed', description: '垂直菜单的折叠状态', type: 'boolean', default: 'false' },
                    { property: 'theme', description: '菜单主题，根目录使用传入的主题，子目录自动切换为浅色', type: '"light" | "dark"', default: '"light"' },
                    { property: 'onChange', description: '菜单项点击回调', type: '(info: MenuItem, key: string) => void', default: '-' },
                    { property: 'onOpenChange', description: '展开/折叠回调', type: '(openKeys: string[]) => void', default: '-' }
                  ]}
                  columns={[
                    { dataIndex: 'property', title: '属性', width: '120px' },
                    { dataIndex: 'description', title: '说明' },
                    { dataIndex: 'type', title: '类型', width: 'auto' },
                    { dataIndex: 'default', title: '默认值', width: '100px' }
                  ]}
                  bordered
                  rowKey="property"
                  pagination={false}
                />
              </div>

              <h3 style={{ marginBottom: '16px' }}>MenuItem Props</h3>
              <div style={{ border: '1px solid #e1e1e1', borderRadius: '8px', padding: '16px' }}>
                <Table
                  dataSource={[
                    { property: 'key', description: '唯一标识', type: 'string', default: '-' },
                    { property: 'label', description: '显示文本', type: 'string', default: '-' },
                    { property: 'icon', description: '图标', type: 'React.ReactNode', default: '-' },
                    { property: 'children', description: '子菜单项数组', type: 'MenuItem[]', default: '-' },
                    { property: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' }
                  ]}
                  columns={[
                    { dataIndex: 'property', title: '属性', width: '120px' },
                    { dataIndex: 'description', title: '说明' },
                    { dataIndex: 'type', title: '类型', width: 'auto' },
                    { dataIndex: 'default', title: '默认值', width: '100px' }
                  ]}
                  bordered
                  rowKey="property"
                  pagination={false}
                />
              </div>
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
                <Anchor.Link href="#menu-intro" title="组件介绍" />
                <Anchor.Link href="#menu-vertical" title="垂直菜单" />
                <Anchor.Link href="#menu-collapsed" title="折叠模式" />
                <Anchor.Link href="#menu-horizontal" title="水平菜单" />
                <Anchor.Link href="#menu-inline" title="内联菜单" />
                <Anchor.Link href="#menu-vertical-flat" title="扁平垂直菜单" />
                <Anchor.Link href="#menu-controlled" title="受控模式" />
                <Anchor.Link href="#menu-theme" title="主题效果" />
                <Anchor.Link href="#menu-api" title="API 文档" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuExample;

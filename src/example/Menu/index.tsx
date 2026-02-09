import React, { useState } from 'react';
import { Menu, Icon, Flex } from '../../components';
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

  // 内联菜单数据
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
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Menu 菜单</h1>
      <p>菜单导航组件，支持多种模式和交互方式，为页面和功能提供导航。</p>

      {/* 垂直菜单 */}
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
        <CopyBlock code={`import { Menu, Icon } from '@idp/design';

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

      {/* 垂直菜单折叠模式 */}
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

      {/* 水平菜单 */}
      <Section title="水平菜单 (Horizontal)">
        <p style={{ marginBottom: '16px', color: '#666' }}>适合顶部导航的水平菜单，支持点击触发子菜单。</p>
        <DemoRow title="水平菜单">
          <div style={{ border: '1px solid #e1e1e1', borderRadius: '8px', padding: '16px', flex: 1 }}>
            <Menu mode="horizontal" items={inlineMenuItems} onChange={(info, key) => console.log(info, key)} />
          </div>
        </DemoRow>
        <CopyBlock code={`<Menu mode="horizontal" items={menuItems} />`} />
      </Section>

      {/* 内联菜单 */}
      <Section title="内联菜单 (Inline)">
        <p style={{ marginBottom: '16px', color: '#666' }}>垂直排列的内联菜单，子菜单内嵌展开。</p>
        <DemoRow title="内联菜单">
          <div style={{ border: '1px solid #e1e1e1', borderRadius: '8px', padding: '16px', width: '200px' }}>
            <Menu mode="inline" items={inlineMenuItems} />
          </div>
        </DemoRow>
        <CopyBlock code={`<Menu mode="inline" items={menuItems} />`} />
      </Section>

      {/* 受控组件模式 */}
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

      {/* API 文档 */}
      <Section title="API">
        <h3 style={{ marginBottom: '16px' }}>Menu Props</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>属性</th>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>说明</th>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>类型</th>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>默认值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>mode</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>菜单模式</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>"horizontal" | "vertical" | "inline"</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>"vertical"</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>items</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>菜单项数组</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>MenuItem[]</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>selectedKey</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>当前选中的菜单项 key（受控模式）</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>string</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>defaultOpenKeys</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>默认展开的菜单项 key 数组</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>string[]</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>[]</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>openKeys</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>展开的菜单项 key 数组（受控模式）</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>string[]</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>collapsed</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>垂直菜单的折叠状态</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>boolean</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>false</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>onChange</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>菜单项点击回调</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>{'(info: MenuItem, key: string) => void'}</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>onOpenChange</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>展开/折叠回调</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>{'(openKeys: string[]) => void'}</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ marginBottom: '16px' }}>MenuItem Props</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>属性</th>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>说明</th>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>类型</th>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>默认值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>key</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>唯一标识</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>string</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>label</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>显示文本</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>string</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>icon</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>图标</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>React.ReactNode</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>children</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>子菜单项数组</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>MenuItem[]</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>disabled</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>是否禁用</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>boolean</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>false</td>
            </tr>
          </tbody>
        </table>
      </Section>
    </div>
  );
};

export default MenuExample;

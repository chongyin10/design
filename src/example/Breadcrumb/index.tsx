import React, { useEffect, useState } from 'react';
import { Breadcrumb, Table, Icon, Anchor } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const BreadcrumbExample: React.FC = () => {
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  // API参数列配置
  const apiColumns: Column[] = [
    { dataIndex: 'param', title: '参数名', width: '150px' },
    { dataIndex: 'type', title: '类型', width: '300px' },
    { dataIndex: 'default', title: '默认值', width: '150px' },
    { dataIndex: 'description', title: '描述', width: '300px' }
  ];

  // API参数数据源
  const apiDataSource = [
    { param: 'items', type: 'BreadcrumbItem[]', default: '-', description: '面包屑项数组，每个项包含label和可选的href属性' },
    { param: 'separator', type: 'string', default: '"/"', description: '分隔符，默认为斜杠' },
    { param: 'className', type: 'string', default: '-', description: '自定义 CSS 类名' }
  ];

  // BreadcrumbItem类型定义
  const itemApiDataSource = [
    { param: 'label', type: 'React.ReactNode', default: '-', description: '面包屑项显示的内容，支持字符串、图标或其他React节点' },
    { param: 'href', type: 'string', default: '-', description: '可选的链接地址，如果提供则该项可点击' }
  ];

  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '产品中心', href: '/products' },
    { label: '手机数码' },
  ];

  const breadcrumbItems2 = [
    { label: '文档', href: '/docs' },
    { label: '组件', href: '/docs/components' },
    { label: '基础组件', href: '/docs/components/basic' },
    { label: '面包屑' },
  ];

  const breadcrumbItems3 = [
    { label: '用户管理', href: '/users' },
    { label: '用户列表', href: '/users/list' },
    { label: '用户详情' },
  ];

  // 带图标的面包屑示例
  const breadcrumbItemsWithIcons = [
    { 
      label: (
        <>
          <Icon type="home" size={14} style={{ marginRight: '4px' }} />
          首页
        </>
      ), 
      href: '/' 
    },
    { 
      label: (
        <>
          <Icon type="folder" size={14} style={{ marginRight: '4px' }} />
          文档
        </>
      ), 
      href: '/docs' 
    },
    { 
      label: (
        <>
          <Icon type="fileText" size={14} style={{ marginRight: '4px' }} />
          组件文档
        </>
      ), 
      href: '/docs/components' 
    },
    { 
      label: (
        <>
          <Icon type="breadcrumb" size={14} style={{ marginRight: '4px' }} />
          面包屑
        </>
      ) 
    },
  ];

  // 纯图标面包屑示例
  const breadcrumbItemsOnlyIcons = [
    { 
      label: <Icon type="home" size={16} />, 
      href: '/' 
    },
    { 
      label: <Icon type="folder" size={16} />, 
      href: '/docs' 
    },
    { 
      label: <Icon type="fileText" size={16} />, 
      href: '/docs/components' 
    },
    { 
      label: <Icon type="breadcrumb" size={16} /> 
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 id="breadcrumb-intro">Breadcrumb 组件</h2>
          <p>面包屑导航组件，用于显示当前页面在网站中的位置路径。</p>

          {/* 基本使用示例 */}
          <div id="breadcrumb-basic" style={{ marginBottom: '40px' }}>
        <h3>基本使用</h3>
        <p>展示不同场景下的面包屑导航。</p>
        
        <h4>三级面包屑</h4>
        <div style={{ marginBottom: '20px' }}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`const breadcrumbItems = [
  { label: '首页', href: '/' },
  { label: '产品中心', href: '/products' },
  { label: '手机数码' }
];

<Breadcrumb items={breadcrumbItems} />`}
        </SyntaxHighlighter>
        
        <h4>多级面包屑</h4>
        <div style={{ marginBottom: '20px' }}>
          <Breadcrumb items={breadcrumbItems2} />
        </div>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`const breadcrumbItems = [
  { label: '文档', href: '/docs' },
  { label: '组件', href: '/docs/components' },
  { label: '基础组件', href: '/docs/components/basic' },
  { label: '面包屑' }
];

<Breadcrumb items={breadcrumbItems} />`}
        </SyntaxHighlighter>
        
        <h4>自定义分隔符</h4>
        <div style={{ marginBottom: '20px' }}>
          <Breadcrumb items={breadcrumbItems3} separator="→" />
        </div>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`const breadcrumbItems = [
  { label: '用户管理', href: '/users' },
  { label: '用户列表', href: '/users/list' },
  { label: '用户详情' }
];

<Breadcrumb items={breadcrumbItems} separator="→" />`}
        </SyntaxHighlighter>
        
        <h4>带图标的面包屑</h4>
        <div style={{ marginBottom: '20px' }}>
          <Breadcrumb items={breadcrumbItemsWithIcons} />
        </div>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`const breadcrumbItems = [
  { 
    label: (
      <>
        <Icon type="home" size={14} style={{ marginRight: '4px' }} />
        首页
      </>
    ), 
    href: '/' 
  },
  { 
    label: (
      <>
        <Icon type="folder" size={14} style={{ marginRight: '4px' }} />
        文档
      </>
    ), 
    href: '/docs' 
  },
  { 
    label: (
      <>
        <Icon type="fileText" size={14} style={{ marginRight: '4px' }} />
        组件文档
      </>
    ), 
    href: '/docs/components' 
  },
  { 
    label: (
      <>
        <Icon type="breadcrumb" size={14} style={{ marginRight: '4px' }} />
        面包屑
      </>
    ) 
  }
];

<Breadcrumb items={breadcrumbItems} />`}
        </SyntaxHighlighter>
        
        <h4>纯图标面包屑</h4>
        <div style={{ marginBottom: '20px' }}>
          <Breadcrumb items={breadcrumbItemsOnlyIcons} separator="→" />
        </div>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`const breadcrumbItems = [
  { label: <Icon type="home" size={16} />, href: '/' },
  { label: <Icon type="folder" size={16} />, href: '/docs' },
  { label: <Icon type="fileText" size={16} />, href: '/docs/components' },
  { label: <Icon type="breadcrumb" size={16} /> }
];

<Breadcrumb items={breadcrumbItems} separator="→" />`}
        </SyntaxHighlighter>
          </div>

          {/* API 文档 */}
          <div id="breadcrumb-api" style={{ marginBottom: '40px' }}>
        <h3>API 文档</h3>
        <p>Breadcrumb 组件的属性配置。</p>
        
        <h4>Breadcrumb Props</h4>
        <Table columns={apiColumns} dataSource={apiDataSource} />
        
        <h4>BreadcrumbItem 类型</h4>
        <Table columns={apiColumns} dataSource={itemApiDataSource} />
          </div>

          {/* 安装和使用说明 */}
          <div id="breadcrumb-install" style={{ marginBottom: '40px' }}>
        <h3>安装和使用</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>1. 安装依赖</h4>
          <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
            {`npm i @zjpcy/simple-design`}
          </SyntaxHighlighter>
        </div>
        
        <div>
          <h4>2. 引用组件</h4>
          <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`// 方式一：单独引入
import Breadcrumb from '@zjpcy/simple-design/lib/Breadcrumb';
import '@zjpcy/simple-design/lib/Breadcrumb/Breadcrumb.css';

// 方式二：批量引入
import { Breadcrumb } from '@zjpcy/simple-design';
import '@zjpcy/simple-design/lib/index.css';`}
          </SyntaxHighlighter>
        </div>
          </div>

          {/* 样式说明 */}
          <div id="breadcrumb-style">
        <h3>样式说明</h3>
        <p>面包屑组件遵循 A / B / C 的格式，其中：</p>
        <ul>
          <li>A 和 B（前面的项目）使用浅色字体 (#666)</li>
          <li>C（最后一个项目）使用深色字体 (#000) 并加粗</li>
          <li>分隔符使用更浅的颜色 (#999)</li>
          <li>可点击的项目在悬停时会变深并有下划线效果</li>
        </ul>
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
                <Anchor.Link href="#breadcrumb-intro" title="组件介绍" />
                <Anchor.Link href="#breadcrumb-basic" title="基本使用" />
                <Anchor.Link href="#breadcrumb-api" title="API 文档" />
                <Anchor.Link href="#breadcrumb-install" title="安装和使用" />
                <Anchor.Link href="#breadcrumb-style" title="样式说明" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbExample;
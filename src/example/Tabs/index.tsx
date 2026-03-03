import React, { useState, useEffect } from 'react';
import { Tabs, Table, Button, Flex, Anchor } from '../../components';
import type { TabItem } from '../../components/Tabs/types';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const TabsExample: React.FC = () => {
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  const baseItems: TabItem[] = [
    { key: 'overview', label: '概览', content: <div>这里是概览内容</div> },
    { key: 'detail', label: '详情', content: <div>这里是详情内容</div> },
    { key: 'setting', label: '设置', content: <div>这里是设置内容</div> }
  ];

  const [customTabs, setCustomTabs] = useState<TabItem[]>([
    { key: 'tab-1', label: '客户管理', content: <div>客户列表和管理界面</div>, closable: true },
    { key: 'tab-2', label: '订单查询', content: <div>订单查询和统计</div>, closable: true },
    { key: 'tab-3', label: '产品管理', content: <div>订单查询和统计</div>, closable: true },
    { key: 'tab-4', label: '订单查询-1', content: <div>订单查询和统计</div>, closable: true },
    { key: 'tab-5', label: '订单查询-2', content: <div>订单查询和统计</div>, closable: true },
    { key: 'tab-6', label: '订单查询-3', content: <div>订单查询和统计</div>, closable: true },
    { key: 'tab-7', label: '订单查询-4', content: <div>订单查询和统计</div>, closable: true },
    { key: 'tab-8', label: '订单查询-5', content: <div>订单查询和统计</div>, closable: true },
    { key: 'tab-9', label: '订单查询-6', content: <div>订单查询和统计</div>, closable: true }
  ]);

  const handleAddTab = () => {
    const newTabIndex = customTabs.length + 1;
    const newTab: TabItem = {
      key: `tab-${newTabIndex}`,
      label: `新标签${newTabIndex}`,
      content: <div>这是新添加的标签页内容 {newTabIndex}</div>,
      closable: true
    };
    setCustomTabs(prev => [...prev, newTab]);
  };

  const handleCloseCustomTab = (key: string) => {
    setCustomTabs(prev => prev.filter(item => item.key !== key));
  };

  const layoutItems: TabItem[] = [
    { key: '1', label: '数据监控', content: <div style={{ padding: '20px' }}>数据监控面板内容区域</div> },
    { key: '2', label: '告警管理', content: <div style={{ padding: '20px' }}>告警管理配置区域</div> },
    { key: '3', label: '系统设置', content: <div style={{ padding: '20px' }}>系统设置参数区域</div> }
  ];

  const disabledItems: TabItem[] = [
    { key: 'tab-a', label: '标签一', content: <div>内容 A</div> },
    { key: 'tab-b', label: '标签二', content: <div>内容 B</div>, disabled: true },
    { key: 'tab-c', label: '标签三', content: <div>内容 C</div> }
  ];

  const [closableItems, setClosableItems] = useState<TabItem[]>([
    { key: 'tab-1', label: '看板', content: <div>看板内容区域</div>, closable: true },
    { key: 'tab-2', label: '订单', content: <div>订单内容区域</div>, closable: true },
    { key: 'tab-3', label: '报表', content: <div>报表内容区域</div>, closable: true }
  ]);

  const [cardTabs, setCardTabs] = useState<TabItem[]>([
    { key: 'card-1', label: '工作台', content: <div style={{ padding: '20px' }}>工作台内容区域，展示日常工作概览和快捷操作</div> },
    { key: 'card-2', label: '消息', content: <div style={{ padding: '20px' }}>消息中心，查看系统通知和消息</div> },
    { key: 'card-3', label: '日程', content: <div style={{ padding: '20px' }}>日程安排，管理个人和团队日程</div> }
  ]);

  const [draggableTabs, setDraggableTabs] = useState<TabItem[]>([
    { key: 'drag-1', label: '数据分析', content: <div style={{ padding: '20px' }}>数据分析仪表板</div> },
    { key: 'drag-2', label: '用户管理', content: <div style={{ padding: '20px' }}>用户管理系统</div> },
    { key: 'drag-3', label: '权限配置', content: <div style={{ padding: '20px' }}>权限配置中心</div> },
    { key: 'drag-4', label: '系统日志', content: <div style={{ padding: '20px' }}>系统日志查看</div> }
  ]);

  const handleAddCardTab = () => {
    const newTabIndex = cardTabs.length + 1;
    const newTab: TabItem = {
      key: `card-${newTabIndex}`,
      label: `新页面${newTabIndex}`,
      content: <div style={{ padding: '20px' }}>这是新添加的标签页内容 {newTabIndex}</div>,
      closable: true
    };
    setCardTabs(prev => [...prev, newTab]);
  };

  const handleCloseCardTab = (key: string) => {
    setCardTabs(prev => prev.filter(item => item.key !== key));
  };

  const handleClose = (key: string) => {
    setClosableItems(prev => prev.filter(item => item.key !== key));
  };

  const apiColumns: Column[] = [
    { dataIndex: 'name', title: '属性名', width: '160px' },
    { dataIndex: 'type', title: '类型', width: '260px' },
    { dataIndex: 'default', title: '默认值', width: '160px' },
    { dataIndex: 'description', title: '描述' }
  ];

  const apiDataSource = [
    { name: 'items', type: 'TabItem[]', default: '[]', description: '选项卡配置数组' },
    { name: 'activeKey', type: 'string', default: '-', description: '当前激活的选项卡 Key（受控）' },
    { name: 'defaultActiveKey', type: 'string', default: '-', description: '默认激活的选项卡 Key（非受控）' },
    { name: 'onChange', type: '(key: string) => void', default: '-', description: '切换选项卡回调' },
    { name: 'onClose', type: '(key: string) => void', default: '-', description: '关闭选项卡回调' },
    { name: 'tabsClosable', type: 'boolean', default: 'false', description: '全局可关闭开关' },
    { name: 'tabPlacement', type: "'top' | 'start' | 'end' | 'bottom'", default: "'top'", description: '标签页位置（仅 line 类型支持垂直布局）' },
    { name: 'type', type: "'line' | 'card'", default: "'line'", description: '标签页类型（card 类型仅支持顶部布局）' },
    { name: 'onAdd', type: '() => void', default: '-', description: '增加标签页回调（仅 card 类型支持）' },
    { name: 'className', type: 'string', default: '-', description: '自定义类名' },
    { name: 'style', type: 'React.CSSProperties', default: '-', description: '容器样式' },
    { name: 'contentClassName', type: 'string', default: '-', description: '内容区域自定义类名' },
    { name: 'contentStyle', type: 'React.CSSProperties', default: '-', description: '内容区域样式' },
    { name: 'draggable', type: 'boolean', default: 'false', description: '是否启用拖拽功能（仅支持顶部和底部的 line 类型）' },
    { name: 'onDragEnd', type: '(items: TabItem[]) => void', default: '-', description: '拖拽结束回调，返回新的 items 顺序' }
  ];

  const itemApiDataSource = [
    { name: 'key', type: 'string', default: '-', description: '选项卡唯一标识' },
    { name: 'label', type: 'React.ReactNode', default: '-', description: '选项卡标题' },
    { name: 'content', type: 'React.ReactNode', default: '-', description: '选项卡内容' },
    { name: 'disabled', type: 'boolean', default: 'false', description: '是否禁用' },
    { name: 'closable', type: 'boolean', default: 'false', description: '是否可关闭' },
    { name: 'icon', type: 'React.ReactNode', default: '-', description: '选项卡图标' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 id="tabs-intro">Tabs 组件</h2>
          <p>用于在同级区域中收纳并展示大块内容，保持界面整洁，卡片式页签支持可关闭。</p>

          {/* 基本使用 */}
          <div style={{ marginBottom: '40px' }} id="tabs-basic">
            <h3>基本使用</h3>
        <p>最通用的卡片式 Tabs。</p>

        <h4>基础 Tabs</h4>
        <div style={{ marginBottom: '20px' }}>
          <Tabs items={baseItems} />
        </div>

        <h4>禁用状态</h4>
        <div style={{ marginBottom: '20px' }}>
          <Tabs items={disabledItems} />
        </div>

        <h4>可关闭 Tabs</h4>
        <div style={{ marginBottom: '20px' }}>
          <Tabs items={closableItems} onClose={handleClose} tabsClosable />
        </div>

        <h4>卡片式页签</h4>
        <div style={{ marginBottom: '20px' }}>
          <Tabs items={baseItems} type="card" />
        </div>

        <h4>卡片式页签（带增加和关闭）</h4>
        <div style={{ marginBottom: '20px' }}>
          <Tabs
            items={cardTabs}
            type="card"
            onClose={handleCloseCardTab}
            onAdd={handleAddCardTab}
          />
        </div>

        <h4>可拖拽标签页</h4>
        <div style={{ marginBottom: '20px' }}>
          <Tabs
            items={draggableTabs}
            draggable
            onDragEnd={(newItems) => setDraggableTabs(newItems)}
          />
        </div>

        <h4>容器内部使用</h4>
        <div style={{ marginBottom: '20px', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px', background: '#fff' }}>
          <Tabs
            items={baseItems}
            contentStyle={{ minHeight: '80px' }}
          />
        </div>

        <h4>自定义内容区域样式</h4>
        <div style={{ marginBottom: '20px' }}>
          <Tabs
            items={baseItems}
            contentClassName="custom-tabs-content"
            contentStyle={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
              padding: '24px',
              borderRadius: '0 0 8px 8px',
              minHeight: '100px'
            }}
          />
        </div>

        <h4>自定义操作区</h4>
        <div style={{ marginBottom: '20px' }}>
          <Flex align="center" justify="space-between" gap={12} style={{ marginBottom: '12px' }}>
            <span>业务标签</span>
            <Button size="small" variant="primary" onClick={handleAddTab}>新增</Button>
          </Flex>
          <Tabs 
            items={customTabs} 
            onClose={handleCloseCustomTab}
            tabsClosable
          />
        </div>
          </div>

          {/* 布局方向 */}
          <div style={{ marginBottom: '40px' }} id="tabs-layout">
        <h3>布局方向</h3>
        <p>通过 tabPlacement 属性可以设置标签页的位置。</p>

        <h4>顶部布局 (默认)</h4>
        <div style={{ marginBottom: '20px' }}>
          <Tabs 
            items={layoutItems} 
            defaultActiveKey="1"
            contentStyle={{ minHeight: '120px' }}
          />
        </div>

        <h4>底部布局</h4>
        <div style={{ marginBottom: '20px' }}>
          <Tabs 
            items={layoutItems} 
            tabPlacement="bottom"
            defaultActiveKey="1"
            contentStyle={{ minHeight: '120px' }}
          />
        </div>

        <h4>左侧布局</h4>
        <div style={{ marginBottom: '20px' }}>
          <Tabs 
            items={layoutItems} 
            tabPlacement="start"
            defaultActiveKey="1"
            contentStyle={{ minHeight: '200px' }}
          />
        </div>

        <h4>右侧布局</h4>
        <div style={{ marginBottom: '20px' }}>
          <Tabs 
            items={layoutItems} 
            tabPlacement="end"
            defaultActiveKey="1"
            contentStyle={{ minHeight: '200px' }}
          />
        </div>

        <h4>代码示例</h4>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`// 顶部布局 (默认)
<Tabs 
  items={items}
  tabPlacement="top" // 可省略
/>

// 底部布局
<Tabs 
  items={items}
  tabPlacement="bottom"
/>

// 左侧布局
<Tabs 
  items={items}
  tabPlacement="start"
/>

// 右侧布局
<Tabs 
  items={items}
  tabPlacement="end"
/>`}
        </SyntaxHighlighter>
          </div>

          {/* API 文档 */}
          <div style={{ marginBottom: '40px' }} id="tabs-api">
        <h3>API 文档</h3>
        <p>Tabs 的属性配置。</p>

        <h4>Tabs Props</h4>
        <Table columns={apiColumns} dataSource={apiDataSource} />

        <h4>TabItem</h4>
        <Table columns={apiColumns} dataSource={itemApiDataSource} />
          </div>

          {/* 代码示例 */}
          <div style={{ marginBottom: '40px' }} id="tabs-examples">
        <h3>代码示例</h3>
        
        <h4>基础使用</h4>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`import { Tabs } from '@zjpcy/simple-design';

const items = [
  { key: 'overview', label: '概览', content: <div>概览内容</div> },
  { key: 'detail', label: '详情', content: <div>详情内容</div> },
  { key: 'setting', label: '设置', content: <div>设置内容</div> }
];

<Tabs items={items} />`}
        </SyntaxHighlighter>

        <h4 style={{ marginTop: '20px' }}>动态添加标签页</h4>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`import { useState } from 'react';
import { Tabs, Button } from '@zjpcy/simple-design';
import type { TabItem } from '@zjpcy/simple-design/lib/Tabs/types';

const DynamicTabsExample = () => {
  const [tabs, setTabs] = useState<TabItem[]>([
    { key: 'tab-1', label: '标签1', content: <div>内容1</div>, closable: true },
    { key: 'tab-2', label: '标签2', content: <div>内容2</div>, closable: true }
  ]);

  const handleAddTab = () => {
    const newIndex = tabs.length + 1;
    const newTab: TabItem = {
      key: \`tab-\${newIndex}\`,
      label: \`新标签\${newIndex}\`,
      content: <div>新内容 {newIndex}</div>,
      closable: true
    };
    setTabs(prev => [...prev, newTab]);
  };

  const handleCloseTab = (key: string) => {
    setTabs(prev => prev.filter(item => item.key !== key));
  };

  return (
    <div>
      <Button onClick={handleAddTab}>新增标签页</Button>
      <Tabs 
        items={tabs}
        onClose={handleCloseTab}
        tabsClosable
      />
    </div>
  );
};`}
        </SyntaxHighlighter>

        <h4 style={{ marginTop: '20px' }}>可拖拽标签页</h4>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`import { useState } from 'react';
import { Tabs } from '@zjpcy/simple-design';
import type { TabItem } from '@zjpcy/simple-design/lib/Tabs/types';

const DraggableTabsExample = () => {
  const [tabs, setTabs] = useState<TabItem[]>([
    { key: 'tab-1', label: '标签1', content: <div>内容1</div> },
    { key: 'tab-2', label: '标签2', content: <div>内容2</div> },
    { key: 'tab-3', label: '标签3', content: <div>内容3</div> },
    { key: 'tab-4', label: '标签4', content: <div>内容4</div> }
  ]);

  const handleDragEnd = (newItems: TabItem[]) => {
    setTabs(newItems);
    console.log('新的标签顺序:', newItems.map(item => item.label));
  };

  return (
    <Tabs 
      items={tabs}
      draggable  // 启用拖拽功能
      onDragEnd={handleDragEnd}  // 拖拽结束回调
    />
  );
};`}
        </SyntaxHighlighter>

        <h4 style={{ marginTop: '20px' }}>自定义内容区域样式</h4>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`// 通过 contentClassName 设置内容区域自定义类名
// 通过 contentStyle 设置内容区域内联样式
// 优先级：外部定义CSS > contentClassName > contentStyle > 内部样式

<Tabs
  items={items}
  contentClassName="my-custom-content"  // 自定义类名
  contentStyle={{
    background: '#f5f7fa',
    padding: '24px',
    minHeight: '120px'
  }}
/>`}
        </SyntaxHighlighter>
          </div>

          {/* 安装和使用说明 */}
          <div style={{ marginBottom: '40px' }} id="tabs-install">
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
import Tabs from '@zjpcy/simple-design/lib/Tabs';
import '@zjpcy/simple-design/lib/Tabs/Tabs.css';

// 方式二：批量引入
import { Tabs } from '@zjpcy/simple-design';
import '@zjpcy/simple-design/lib/index.css';`}
          </SyntaxHighlighter>
        </div>
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
                <Anchor.Link href="#tabs-intro" title="组件介绍" />
                <Anchor.Link href="#tabs-basic" title="基本使用" />
                <Anchor.Link href="#tabs-layout" title="布局方向" />
                <Anchor.Link href="#tabs-api" title="API 文档" />
                <Anchor.Link href="#tabs-examples" title="代码示例" />
                <Anchor.Link href="#tabs-install" title="安装使用" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabsExample;

import React, { useState, useEffect } from 'react';
import { Dropdown, Table, Button, Anchor } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DropdownExample: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string>('未选择');
  const [controlledOpen, setControlledOpen] = useState(false);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  // 处理 onChange 事件
  const handleChange = (item: any) => {
    setSelectedItem(`选择了: ${item.label}`);
    console.log('选中的菜单项:', item);
  };

  // 处理受控组件的显示状态变化
  const handleControlledVisibleChange = (visible: boolean) => {
    setControlledOpen(visible);
  };

  // API参数列配置
  const apiColumns: Column[] = [
    { dataIndex: 'param', title: '参数名', width: '150px' },
    { dataIndex: 'type', title: '类型', width: '300px' },
    { dataIndex: 'default', title: '默认值', width: '150px' },
    { dataIndex: 'description', title: '描述', width: '300px' }
  ];

  // API参数数据源
  const apiDataSource = [
    { param: 'items', type: 'DropdownItem[]', default: '-', description: '下拉菜单项数组' },
    { param: 'type', type: "'text' | 'button'", default: "'text'", description: '触发器的类型，text为纯文本样式（无边框透明背景），button为按钮样式' },
    { param: 'children', type: 'React.ReactNode', default: '-', description: '触发器显示的内容' },
    { param: 'trigger', type: "'click' | 'hover'", default: "'click'", description: '触发方式，click为点击触发，hover为悬停触发' },
    { param: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'", description: '下拉菜单的位置' },
    { param: 'disabled', type: 'boolean', default: 'false', description: '是否禁用下拉菜单' },
    { param: 'open', type: 'boolean', default: '-', description: '受控参数，控制下拉菜单的显示状态，true为显示，false为隐藏' },
    { param: 'ellipsis', type: 'boolean', default: 'true', description: '文本溢出处理，true时超出显示...，false时正常显示' },
    { param: 'className', type: 'string', default: '-', description: '自定义 CSS 类名' },
    { param: 'style', type: 'React.CSSProperties', default: '-', description: '自定义样式' },
    { param: 'contentStyles', type: 'React.CSSProperties', default: '-', description: '下拉菜单内容区域的自定义样式，可修改高度、宽度、背景色等' },
    { param: 'getContainer', type: '() => HTMLElement', default: '-', description: '挂载DOM节点，下拉菜单渲染父节点，默认渲染到body上' },
    { param: 'onVisibleChange', type: '(visible: boolean) => void', default: '-', description: '下拉菜单显示/隐藏的回调函数' },
    { param: 'onChange', type: '(item: DropdownItem) => void', default: '-', description: '选中菜单项的回调函数，返回选中的菜单项' }
  ];

  // DropdownItem类型定义
  const itemApiDataSource = [
    { param: 'key', type: 'string', default: '-', description: '菜单项的唯一标识' },
    { param: 'label', type: 'React.ReactNode', default: '-', description: '菜单项显示的内容' },
    { param: 'disabled', type: 'boolean', default: 'false', description: '是否禁用该菜单项' },
    { param: 'onClick', type: '() => void', default: '-', description: '点击菜单项的回调函数' },
    { param: 'icon', type: 'string | React.ReactNode', default: '-', description: '菜单项图标' }
  ];

  // 基础下拉菜单项
  const basicItems = [
    { key: '1', label: '菜单项111111111', onClick: () => console.log('点击了菜单项1') },
    { key: '2', label: '菜单项2', onClick: () => console.log('点击了菜单项2') },
    { key: '3', label: '菜单项3', onClick: () => console.log('点击了菜单项3') }
  ];

  // 带图标的下拉菜单项
  const iconItems = [
    { key: '1', label: '编辑', icon: 'edit', onClick: () => console.log('点击了编辑') },
    { key: '2', label: '复制', icon: 'copy', onClick: () => console.log('点击了复制') },
    { key: '3', label: '删除', icon: 'delete', onClick: () => console.log('点击了删除') },
    { key: '4', label: '分享', icon: 'share', onClick: () => console.log('点击了分享') }
  ];

  // 带禁用项的下拉菜单
  const disabledItems = [
    { key: '1', label: '可用菜单项', onClick: () => console.log('点击了可用菜单项') },
    { key: '2', label: '禁用菜单项', disabled: true },
    { key: '3', label: '另一个可用菜单项', onClick: () => console.log('点击了另一个可用菜单项') }
  ];

  // 按钮类型的下拉菜单项
  const buttonItems = [
    { key: '1', label: '操作1', onClick: () => console.log('点击了操作1') },
    { key: '2', label: '操作2', onClick: () => console.log('点击了操作2') },
    { key: '3', label: '操作3', onClick: () => console.log('点击了操作3') }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="dropdown-intro">Dropdown 下拉菜单</h1>
          <p>向下弹出的组件列表功能，支持文本和按钮两种触发器类型。</p>

          <div id="dropdown-basic">
            <h2 style={{ marginTop: '32px', marginBottom: '16px', color: '#333' }}>基础用法</h2>
            <p>基本的下拉菜单，默认使用文本类型触发器，点击显示下拉菜单。</p>

            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
              <Dropdown items={basicItems}>
                文本类型下拉菜单（默认）
              </Dropdown>
            </div>

            <SyntaxHighlighter language="jsx" style={vscDarkPlus}>
              {`<Dropdown items={[
  { key: '1', label: '菜单项1', onClick: () => console.log('点击了菜单项1') },
  { key: '2', label: '菜单项2', onClick: () => console.log('点击了菜单项2') },
  { key: '3', label: '菜单项3', onClick: () => console.log('点击了菜单项3') }
]}>
  文本类型下拉菜单（默认）
</Dropdown>`}
            </SyntaxHighlighter>
          </div>

          <div id="dropdown-text">
            <h2 style={{ marginTop: '32px', marginBottom: '16px', color: '#333' }}>文本类型</h2>
            <p>使用纯文本作为触发器，无边框透明背景，适合在文本内容中使用。</p>

            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span>这是一个段落，包含</span>
                <Dropdown items={basicItems} type="text">
                  文本下拉菜单
                </Dropdown>
                <span>和其他文本内容。</span>
              </div>
            </div>

            <SyntaxHighlighter language="jsx" style={vscDarkPlus}>
              {`<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
  <span>这是一个段落，包含</span>
  <Dropdown items={basicItems} type="text">
    文本下拉菜单
  </Dropdown>
  <span>和其他文本内容。</span>
</div>`}
            </SyntaxHighlighter>
          </div>

          <div id="dropdown-button">
            <h2 style={{ marginTop: '32px', marginBottom: '16px', color: '#333' }}>按钮类型</h2>
            <p>使用按钮作为触发器。</p>

            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
              <Dropdown items={buttonItems} type="button">
                按钮下拉菜单
              </Dropdown>
            </div>

            <SyntaxHighlighter language="jsx" style={vscDarkPlus}>
              {`<Dropdown 
  items={[
    { key: '1', label: '操作1', onClick: () => console.log('点击了操作1') },
    { key: '2', label: '操作2', onClick: () => console.log('点击了操作2') },
    { key: '3', label: '操作3', onClick: () => console.log('点击了操作3') }
  ]} 
  type="button"
>
  按钮下拉菜单
</Dropdown>`}
            </SyntaxHighlighter>
          </div>

          <div id="dropdown-icon">
            <h2 style={{ marginTop: '32px', marginBottom: '16px', color: '#333' }}>带图标的下拉菜单</h2>
            <p>菜单项可以包含图标。</p>

            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
              <Dropdown items={iconItems}>
                带图标的下拉菜单
              </Dropdown>
            </div>

            <SyntaxHighlighter language="jsx" style={vscDarkPlus}>
              {`<Dropdown items={[
  { key: '1', label: '编辑', icon: 'edit', onClick: () => console.log('点击了编辑') },
  { key: '2', label: '复制', icon: 'copy', onClick: () => console.log('点击了复制') },
  { key: '3', label: '删除', icon: 'delete', onClick: () => console.log('点击了删除') },
  { key: '4', label: '分享', icon: 'share', onClick: () => console.log('点击了分享') }
]}>
  带图标的下拉菜单
</Dropdown>`}
            </SyntaxHighlighter>
          </div>

          <div id="dropdown-disabled">
            <h2 style={{ marginTop: '32px', marginBottom: '16px', color: '#333' }}>禁用状态</h2>
            <p>可以禁用整个下拉菜单或单个菜单项。</p>

            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Dropdown items={disabledItems}>
                  包含禁用项
                </Dropdown>

                <Dropdown items={basicItems} disabled>
                  禁用下拉菜单
                </Dropdown>
              </div>
            </div>

            <SyntaxHighlighter language="jsx" style={vscDarkPlus}>
              {`// 包含禁用项
<Dropdown items={[
  { key: '1', label: '可用菜单项', onClick: () => console.log('点击了可用菜单项') },
  { key: '2', label: '禁用菜单项', disabled: true },
  { key: '3', label: '另一个可用菜单项', onClick: () => console.log('点击了另一个可用菜单项') }
]}>
  包含禁用项
</Dropdown>

// 禁用整个下拉菜单
<Dropdown items={basicItems} disabled>
  禁用下拉菜单
</Dropdown>`}
            </SyntaxHighlighter>
          </div>

          <div id="dropdown-hover">
            <h2 style={{ marginTop: '32px', marginBottom: '16px', color: '#333' }}>悬停触发</h2>
            <p>使用悬停方式触发下拉菜单。</p>

            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
              <Dropdown items={basicItems} trigger="hover">
                悬停触发下拉菜单
              </Dropdown>
            </div>

            <SyntaxHighlighter language="jsx" style={vscDarkPlus}>
              {`<Dropdown 
  items={[
    { key: '1', label: '菜单项1', onClick: () => console.log('点击了菜单项1') },
    { key: '2', label: '菜单项2', onClick: () => console.log('点击了菜单项2') },
    { key: '3', label: '菜单项3', onClick: () => console.log('点击了菜单项3') }
  ]} 
  trigger="hover"
>
  悬停触发下拉菜单
</Dropdown>`}
            </SyntaxHighlighter>
          </div>

          <div id="dropdown-onchange">
            <h2 style={{ marginTop: '32px', marginBottom: '16px', color: '#333' }}>onChange 事件</h2>
            <p>监听菜单项选择事件，返回选中的菜单项。</p>

            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
              <div style={{ marginBottom: '16px' }}>
                <strong>当前选择:</strong> {selectedItem}
              </div>
              <Dropdown items={basicItems} onChange={handleChange}>
                选择菜单项
              </Dropdown>
            </div>

            <SyntaxHighlighter language="jsx" style={vscDarkPlus}>
              {`import React, { useState } from 'react';
import { Dropdown } from '../../components';

const Example = () => {
  const [selectedItem, setSelectedItem] = useState('未选择');
  
  const handleChange = (item) => {
    setSelectedItem(\`选择了: \${item.label}\`);
    console.log('选中的菜单项:', item);
  };

  const basicItems = [
    { key: '1', label: '菜单项1' },
    { key: '2', label: '菜单项2' },
    { key: '3', label: '菜单项3' }
  ];

  return (
    <div>
      <div>当前选择: {selectedItem}</div>
      <Dropdown items={basicItems} onChange={handleChange}>
        选择菜单项
      </Dropdown>
    </div>
  );
};`}
            </SyntaxHighlighter>
          </div>

          <div id="dropdown-controlled">
            <h2 style={{ marginTop: '32px', marginBottom: '16px', color: '#333' }}>受控组件模式</h2>
            <p>使用 open 参数控制下拉菜单的显示状态。</p>

            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
              <div style={{ marginBottom: '16px' }}>
                <strong>当前状态:</strong> {controlledOpen ? '显示' : '隐藏'}
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setControlledOpen(true)}
                >
                  显示下拉菜单
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setControlledOpen(false)}
                >
                  隐藏下拉菜单
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setControlledOpen(!controlledOpen)}
                >
                  切换显示状态
                </Button>
              </div>
              <div style={{ marginTop: '16px' }}>
                <Dropdown
                  items={basicItems}
                  open={controlledOpen}
                  onVisibleChange={handleControlledVisibleChange}
                >
                  受控下拉菜单
                </Dropdown>
              </div>
            </div>

            <SyntaxHighlighter language="jsx" style={vscDarkPlus}>
              {`import React, { useState } from 'react';
import { Dropdown, Button } from '../../components';

const Example = () => {
  const [open, setOpen] = useState(false);
  
  const handleVisibleChange = (visible) => {
    setOpen(visible);
  };

  const basicItems = [
    { key: '1', label: '菜单项1' },
    { key: '2', label: '菜单项2' },
    { key: '3', label: '菜单项3' }
  ];

  return (
    <div>
      <div>当前状态: {open ? '显示' : '隐藏'}</div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <Button onClick={() => setOpen(true)}>显示下拉菜单</Button>
        <Button onClick={() => setOpen(false)}>隐藏下拉菜单</Button>
        <Button onClick={() => setOpen(!open)}>切换显示状态</Button>
      </div>
      <Dropdown 
        items={basicItems} 
        open={open}
        onVisibleChange={handleVisibleChange}
      >
        受控下拉菜单
      </Dropdown>
    </div>
  );
};`}
            </SyntaxHighlighter>
          </div>

          <div id="dropdown-content">
            <h2 style={{ marginTop: '32px', marginBottom: '16px', color: '#333' }}>自定义内容区域样式</h2>
            <p>使用 contentStyles 参数自定义下拉菜单内容区域的样式。</p>

            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Dropdown
                  items={basicItems}
                  contentStyles={{
                    width: '200px',
                    backgroundColor: '#f0f8ff',
                    maxHeight: '150px',
                    overflow: 'auto'
                  }}
                >
                  自定义宽度和背景色
                </Dropdown>

                <Dropdown
                  items={basicItems}
                  contentStyles={{
                    minWidth: '180px',
                    backgroundColor: '#fff0f5',
                    border: '2px solid #ff69b4',
                    borderRadius: '8px'
                  }}
                >
                  自定义边框和圆角
                </Dropdown>

                <Dropdown
                  items={basicItems}
                  contentStyles={{
                    width: '160px',
                    backgroundColor: '#f5f5f5',
                    fontSize: '14px',
                    color: '#333'
                  }}
                >
                  自定义字体和颜色
                </Dropdown>
              </div>
            </div>

            <SyntaxHighlighter language="jsx" style={vscDarkPlus}>
              {`// 自定义宽度和背景色
<Dropdown 
  items={basicItems} 
  contentStyles={{
    width: '200px',
    backgroundColor: '#f0f8ff',
    maxHeight: '150px',
    overflow: 'auto'
  }}
>
  自定义宽度和背景色
</Dropdown>

// 自定义边框和圆角
<Dropdown 
  items={basicItems} 
  contentStyles={{
    minWidth: '180px',
    backgroundColor: '#fff0f5',
    border: '2px solid #ff69b4',
    borderRadius: '8px'
  }}
>
  自定义边框和圆角
</Dropdown>

// 自定义字体和颜色
<Dropdown 
  items={basicItems} 
  contentStyles={{
    width: '160px',
    backgroundColor: '#f5f5f5',
    fontSize: '14px',
    color: '#333'
  }}
>
  自定义字体和颜色
</Dropdown>`}
            </SyntaxHighlighter>
          </div>

          <div id="dropdown-ellipsis">
            <h2 style={{ marginTop: '32px', marginBottom: '16px', color: '#333' }}>自定义宽度下的文本溢出处理</h2>
            <p>在 contentStyles 中设置固定宽度时，ellipsis 参数依然生效。</p>

            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexDirection: 'column' }}>
                <div style={{ maxWidth: '300px' }}>
                  <h4>contentStyles + ellipsis=true: 固定宽度内显示省略号</h4>
                  <Dropdown
                    items={[
                      { key: '1', label: '这是一个很长很长的菜单项标题，会在设定的宽度内显示省略号', onClick: () => console.log('点击了长文本菜单项') },
                      { key: '2', label: '短菜单项', onClick: () => console.log('点击了短文本菜单项') }
                    ]}
                    contentStyles={{ width: '150px' }}
                  >
                    固定宽度省略模式
                  </Dropdown>
                </div>

                <div style={{ maxWidth: '300px', marginTop: '20px' }}>
                  <h4>contentStyles + ellipsis=false: 固定宽度内正常换行</h4>
                  <Dropdown
                    items={[
                      { key: '1', label: '这是一个很长很长的菜单项标题，会在设定的宽度内换行显示', onClick: () => console.log('点击了长文本菜单项') },
                      { key: '2', label: '短菜单项', onClick: () => console.log('点击了短文本菜单项') }
                    ]}
                    contentStyles={{ width: '150px' }}
                    ellipsis={false}
                  >
                    固定宽度不省略模式
                  </Dropdown>
                </div>
              </div>
            </div>

            <SyntaxHighlighter language="jsx" style={vscDarkPlus}>
              {`// ellipsis=true (默认)
<Dropdown 
  items={[{ key: '1', label: '这是一个很长很长的菜单项标题，会超出容器宽度并显示省略号' }]}
>
  默认省略模式
</Dropdown>

// ellipsis=false
<Dropdown 
  items={[{ key: '1', label: '这是一个很长很长的菜单项标题，会超出容器宽度并显示省略号' }]}
  ellipsis={false}
>
  不省略模式
</Dropdown>`}
            </SyntaxHighlighter>
          </div>

          <div id="dropdown-placement">
            <h2 style={{ marginTop: '32px', marginBottom: '16px', color: '#333' }}>不同位置</h2>
            <p>下拉菜单可以显示在不同位置。</p>

            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Dropdown items={basicItems} placement="bottom">
                  底部 (默认)
                </Dropdown>

                <Dropdown items={basicItems} placement="top">
                  顶部
                </Dropdown>

                <Dropdown items={basicItems} placement="left">
                  左侧
                </Dropdown>

                <Dropdown items={basicItems} placement="right">
                  右侧
                </Dropdown>
              </div>
            </div>

            <SyntaxHighlighter language="jsx" style={vscDarkPlus}>
              {`<Dropdown items={basicItems} placement="bottom">
  底部 (默认)
</Dropdown>

<Dropdown items={basicItems} placement="top">
  顶部
</Dropdown>

<Dropdown items={basicItems} placement="left">
  左侧
</Dropdown>

<Dropdown items={basicItems} placement="right">
  右侧
</Dropdown>`}
            </SyntaxHighlighter>
          </div>

          <div id="dropdown-container">
            <h2 style={{ marginTop: '32px', marginBottom: '16px', color: '#333' }}>自定义挂载容器</h2>
            <p>使用 getContainer 参数可以将下拉菜单渲染到指定的 DOM 节点中。</p>

            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div id="custom-container" style={{ border: '2px dashed #d9d9d9', padding: '20px', borderRadius: '6px', minHeight: '100px' }}>
                  <p>自定义容器区域</p>
                  <Dropdown
                    items={basicItems}
                    getContainer={() => document.getElementById('custom-container')!}
                  >
                    渲染到自定义容器
                  </Dropdown>
                </div>

                <Dropdown items={basicItems}>
                  默认渲染到body
                </Dropdown>
              </div>
            </div>

            <SyntaxHighlighter language="jsx" style={vscDarkPlus}>
              {`// 渲染到自定义容器
<div id="custom-container" style={{ border: '2px dashed #d9d9d9', padding: '20px' }}>
  <p>自定义容器区域</p>
  <Dropdown 
    items={basicItems} 
    getContainer={() => document.getElementById('custom-container')}
  >
    渲染到自定义容器
  </Dropdown>
</div>

// 默认渲染到body
<Dropdown items={basicItems}>
  默认渲染到body
</Dropdown>`}
            </SyntaxHighlighter>
          </div>

          <div id="dropdown-api">
            <h2 style={{ marginTop: '32px', marginBottom: '16px', color: '#333' }}>API</h2>
            <Table columns={apiColumns} dataSource={apiDataSource} />

            <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>DropdownItem 属性</h3>
            <Table columns={apiColumns} dataSource={itemApiDataSource} />
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
                <Anchor.Link href="#dropdown-intro" title="组件介绍" />
                <Anchor.Link href="#dropdown-basic" title="基础用法" />
                <Anchor.Link href="#dropdown-text" title="文本类型" />
                <Anchor.Link href="#dropdown-button" title="按钮类型" />
                <Anchor.Link href="#dropdown-icon" title="带图标" />
                <Anchor.Link href="#dropdown-disabled" title="禁用状态" />
                <Anchor.Link href="#dropdown-hover" title="悬停触发" />
                <Anchor.Link href="#dropdown-onchange" title="onChange 事件" />
                <Anchor.Link href="#dropdown-controlled" title="受控模式" />
                <Anchor.Link href="#dropdown-content" title="自定义样式" />
                <Anchor.Link href="#dropdown-ellipsis" title="文本溢出" />
                <Anchor.Link href="#dropdown-placement" title="不同位置" />
                <Anchor.Link href="#dropdown-container" title="自定义容器" />
                <Anchor.Link href="#dropdown-api" title="API 文档" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownExample;

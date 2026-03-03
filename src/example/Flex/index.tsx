import React, { useState, useEffect } from 'react';
import { Flex, Button, Input, Table, Anchor } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const FlexExample: React.FC = () => {
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
    { param: 'children', type: 'React.ReactNode', default: '-', description: '子组件内容' },
    { param: 'layout', type: "'horizontal' | 'column'", default: 'horizontal', description: '快速设置布局方向，horizontal 为水平布局，column 为列布局' },
    { param: 'direction', type: "'row' | 'row-reverse' | 'column' | 'column-reverse'", default: 'row', description: 'flex-direction 属性，优先级高于 layout' },
    { param: 'justify', type: "'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'", default: 'flex-start', description: 'justify-content 属性' },
    { param: 'align', type: "'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'", default: 'stretch', description: 'align-items 属性' },
    { param: 'wrap', type: "'nowrap' | 'wrap' | 'wrap-reverse'", default: 'nowrap', description: 'flex-wrap 属性' },
    { param: 'gap', type: 'string | number', default: '-', description: 'gap 属性，支持数值(px)和字符串' },
    { param: 'className', type: 'string', default: '-', description: '自定义 CSS 类名' },
    { param: 'style', type: 'React.CSSProperties', default: '-', description: '自定义内联样式' }
  ];

  // 交互式示例状态
  const [layout, setLayout] = useState<'horizontal' | 'column'>('horizontal');
  const [justify, setJustify] = useState<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'>('flex-start');
  const [align, setAlign] = useState<'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'>('stretch');
  const [wrap, setWrap] = useState<'nowrap' | 'wrap' | 'wrap-reverse'>('nowrap');
  const [gap, setGap] = useState<string>('10');
  const [direction, setDirection] = useState<'row' | 'row-reverse' | 'column' | 'column-reverse' | undefined>(undefined);
  const [itemCount, setItemCount] = useState<string>('8');

  // 生成演示用的项目
  const generateItems = (count: number) => {
    return [...Array(count)].map((_, index) => (
      <div key={index} style={{ 
        width: '80px', 
        height: index % 2 === 0 ? '80px' : '60px', 
        background: ['#4096ff', '#67c23a', '#e6a23c', '#f56c6c', '#909399'][index % 5], 
        borderRadius: '4px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        {index + 1}
      </div>
    ));
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="flex-intro">Flex 组件</h1>
          <p>通用的 flex 布局组件，提供灵活的布局方式。</p>
          
          {/* 交互式示例 */}
          <div id="flex-interactive" style={{ marginBottom: '40px', marginTop: '40px', padding: '20px', background: '#f5f7fa', borderRadius: '8px' }}>
            <h3>交互式示例</h3>
            <p>通过下方的按钮和输入框，实时调整 flex 布局的各项属性。</p>
            
            {/* 控制面板 */}
            <div style={{ marginBottom: '20px' }}>
              {/* 项目数量控制 */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>项目数量</h4>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Input 
                    type="text" 
                    value={itemCount} 
                    onChange={(e) => setItemCount(e.target.value)}
                    style={{ width: '120px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#606266' }}>个项目</span>
                </div>
              </div>

              {/* Layout 控制 */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>Layout</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Button 
                    variant={layout === 'horizontal' ? 'primary' : 'secondary'} 
                    onClick={() => {
                      setLayout('horizontal');
                      setDirection(undefined);
                    }}
                    size="small"
                  >
                    horizontal
                  </Button>
                  <Button 
                    variant={layout === 'column' ? 'primary' : 'secondary'} 
                    onClick={() => {
                      setLayout('column');
                      setDirection(undefined);
                    }}
                    size="small"
                  >
                    column
                  </Button>
                </div>
              </div>
              
              {/* Direction 控制 */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>Direction (优先级高于Layout)</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Button 
                    variant={direction === 'row' ? 'primary' : 'secondary'} 
                    onClick={() => setDirection('row')}
                    size="small"
                  >
                    row
                  </Button>
                  <Button 
                    variant={direction === 'row-reverse' ? 'primary' : 'secondary'} 
                    onClick={() => setDirection('row-reverse')}
                    size="small"
                  >
                    row-reverse
                  </Button>
                  <Button 
                    variant={direction === 'column' ? 'primary' : 'secondary'} 
                    onClick={() => setDirection('column')}
                    size="small"
                  >
                    column
                  </Button>
                  <Button 
                    variant={direction === 'column-reverse' ? 'primary' : 'secondary'} 
                    onClick={() => setDirection('column-reverse')}
                    size="small"
                  >
                    column-reverse
                  </Button>
                  <Button 
                    variant={direction === undefined ? 'primary' : 'secondary'} 
                    onClick={() => setDirection(undefined)}
                    size="small"
                  >
                    default
                  </Button>
                </div>
              </div>
              
              {/* Justify Content 控制 */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>Justify Content</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Button 
                    variant={justify === 'flex-start' ? 'primary' : 'secondary'} 
                    onClick={() => setJustify('flex-start')}
                    size="small"
                  >
                    flex-start
                  </Button>
                  <Button 
                    variant={justify === 'center' ? 'primary' : 'secondary'} 
                    onClick={() => setJustify('center')}
                    size="small"
                  >
                    center
                  </Button>
                  <Button 
                    variant={justify === 'flex-end' ? 'primary' : 'secondary'} 
                    onClick={() => setJustify('flex-end')}
                    size="small"
                  >
                    flex-end
                  </Button>
                  <Button 
                    variant={justify === 'space-between' ? 'primary' : 'secondary'} 
                    onClick={() => setJustify('space-between')}
                    size="small"
                  >
                    space-between
                  </Button>
                  <Button 
                    variant={justify === 'space-around' ? 'primary' : 'secondary'} 
                    onClick={() => setJustify('space-around')}
                    size="small"
                  >
                    space-around
                  </Button>
                  <Button 
                    variant={justify === 'space-evenly' ? 'primary' : 'secondary'} 
                    onClick={() => setJustify('space-evenly')}
                    size="small"
                  >
                    space-evenly
                  </Button>
                </div>
              </div>
              
              {/* Align Items 控制 */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>Align Items</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Button 
                    variant={align === 'stretch' ? 'primary' : 'secondary'} 
                    onClick={() => setAlign('stretch')}
                    size="small"
                  >
                    stretch
                  </Button>
                  <Button 
                    variant={align === 'center' ? 'primary' : 'secondary'} 
                    onClick={() => setAlign('center')}
                    size="small"
                  >
                    center
                  </Button>
                  <Button 
                    variant={align === 'flex-start' ? 'primary' : 'secondary'} 
                    onClick={() => setAlign('flex-start')}
                    size="small"
                  >
                    flex-start
                  </Button>
                  <Button 
                    variant={align === 'flex-end' ? 'primary' : 'secondary'} 
                    onClick={() => setAlign('flex-end')}
                    size="small"
                  >
                    flex-end
                  </Button>
                  <Button 
                    variant={align === 'baseline' ? 'primary' : 'secondary'} 
                    onClick={() => setAlign('baseline')}
                    size="small"
                  >
                    baseline
                  </Button>
                </div>
              </div>
              
              {/* Flex Wrap 控制 */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>Flex Wrap</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Button 
                    variant={wrap === 'nowrap' ? 'primary' : 'secondary'} 
                    onClick={() => setWrap('nowrap')}
                    size="small"
                  >
                    nowrap
                  </Button>
                  <Button 
                    variant={wrap === 'wrap' ? 'primary' : 'secondary'} 
                    onClick={() => setWrap('wrap')}
                    size="small"
                  >
                    wrap
                  </Button>
                  <Button 
                    variant={wrap === 'wrap-reverse' ? 'primary' : 'secondary'} 
                    onClick={() => setWrap('wrap-reverse')}
                    size="small"
                  >
                    wrap-reverse
                  </Button>
                </div>
              </div>
              
              {/* Gap 控制 */}
              <div>
                <h4 style={{ margin: '0 0 8px 0' }}>Gap (px)</h4>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Input.Number 
                    value={gap} 
                    onChange={(e) => setGap(e.target.value)}
                    style={{ width: '100px' }}
                  />
                  <span style={{ color: '#606266', fontSize: '14px' }}>当前值: {gap}px</span>
                </div>
              </div>
            </div>
            
            {/* 演示区域 */}
            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e4e7ed' }}>
              <h4 style={{ margin: '0 0 16px 0' }}>演示效果</h4>
              <div style={{ background: '#fafafa', padding: '20px', borderRadius: '4px', minHeight: '120px' }}>
                <Flex 
                  layout={layout}
                  direction={direction}
                  justify={justify} 
                  align={align} 
                  wrap={wrap} 
                  gap={Number(gap)}
                >
                  {generateItems(Number(itemCount) || 1)}
                </Flex>
              </div>
            </div>
            
            {/* 当前配置 */}
            <div style={{ marginTop: '20px', padding: '12px', background: '#ffffff', borderRadius: '6px', border: '1px solid #e4e7ed' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>当前配置</h4>
              <div style={{ fontSize: '14px', color: '#303133' }}>
                <code>layout: <span style={{ color: '#4096ff' }}>{layout}</span>, </code>
                {direction && <code>direction: <span style={{ color: '#4096ff' }}>{direction}</span>, </code>}
                <code>justify: <span style={{ color: '#4096ff' }}>{justify}</span>, </code>
                <code>align: <span style={{ color: '#4096ff' }}>{align}</span>, </code>
                <code>wrap: <span style={{ color: '#4096ff' }}>{wrap}</span>, </code>
                <code>gap: <span style={{ color: '#4096ff' }}>{gap}px</span></code>
              </div>
            </div>
          </div>
          
          {/* 多层次嵌套示例 */}
          <div id="flex-nested" style={{ marginBottom: '40px', padding: '20px', background: '#f5f7fa', borderRadius: '8px' }}>
            <h3>多层次嵌套示例</h3>
            <p>展示 Flex 组件的多层次嵌套使用，实现复杂的布局结构。</p>
            
            {/* 嵌套布局演示 */}
            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e4e7ed', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 16px 0' }}>演示效果</h4>
              <div style={{ background: '#fafafa', padding: '20px', borderRadius: '4px' }}>
                {/* 外层 Flex：水平布局，两端对齐 */}
                <Flex layout="horizontal" justify="space-between" gap={16} style={{ background: '#e6f7ff', padding: '20px', borderRadius: '8px' }}>
                  {/* 左侧垂直布局 */}
                  <Flex layout="column" justify="center" align="center" gap={10} style={{ background: '#fff2e8', padding: '16px', borderRadius: '6px', width: '150px' }}>
                    <div style={{ width: '80px', height: '80px', background: '#4096ff', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '16px', fontWeight: 'bold' }}>1</div>
                    <div style={{ width: '80px', height: '80px', background: '#67c23a', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '16px', fontWeight: 'bold' }}>2</div>
                  </Flex>
                  
                  {/* 中间垂直布局，包含嵌套的水平布局 */}
                  <Flex layout="column" justify="space-around" align="center" gap={10} style={{ background: '#f0f9eb', padding: '16px', borderRadius: '6px', flex: 1 }}>
                    <div style={{ width: '120px', height: '40px', background: '#e6a23c', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>标题区域</div>
                    
                    {/* 嵌套的水平布局，换行 */}
                    <Flex layout="horizontal" wrap="wrap" justify="center" gap={8} style={{ width: '100%' }}>
                      {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} style={{ width: '60px', height: '60px', background: '#f56c6c', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>{item}</div>
                      ))}
                    </Flex>
                  </Flex>
                  
                  {/* 右侧垂直布局，底部对齐 */}
                  <Flex layout="column" justify="flex-end" align="center" gap={10} style={{ background: '#f6ffed', padding: '16px', borderRadius: '6px', width: '120px' }}>
                    <div style={{ width: '80px', height: '40px', background: '#909399', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>按钮</div>
                    <div style={{ width: '80px', height: '40px', background: '#4096ff', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>按钮</div>
                  </Flex>
                </Flex>
              </div>
            </div>
            
            {/* 嵌套布局代码示例 */}
            <div>
              <h4 style={{ margin: '0 0 16px 0' }}>代码示例</h4>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0' }}>
{`// 外层 Flex：水平布局，两端对齐
<Flex layout="horizontal" justify="space-between" gap={16}>
  {/* 左侧垂直布局 */}
  <Flex layout="column" justify="center" align="center" gap={10}>
    <div>Item 1</div>
    <div>Item 2</div>
  </Flex>
  
  {/* 中间垂直布局，包含嵌套的水平布局 */}
  <Flex layout="column" justify="space-around" align="center" gap={10}>
    <div>标题区域</div>
    
    {/* 嵌套的水平布局，换行 */}
    <Flex layout="horizontal" wrap="wrap" justify="center" gap={8}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item}>Item {item}</div>
      ))}
    </Flex>
  </Flex>
  
  {/* 右侧垂直布局，底部对齐 */}
  <Flex layout="column" justify="flex-end" align="center" gap={10}>
    <div>按钮</div>
    <div>按钮</div>
  </Flex>
</Flex>`}
              </SyntaxHighlighter>
            </div>
          </div>
          
          {/* API 文档 */}
          <div id="flex-api" style={{ marginBottom: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
            <h3>API 参数</h3>
            <Table pagination={false} columns={apiColumns} dataSource={apiDataSource} />
          </div>
          
          {/* 代码示例 */}
          <div id="flex-code" style={{ marginBottom: '40px' }}>
            <h3>代码示例</h3>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0' }}>
{`import { Flex } from '@zjpcy/simple-design';

// 基本用法
<Flex gap={10}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>

// 垂直布局
<Flex direction="column" gap={10}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>

// 居中对齐
<Flex justify="center" align="center">
  <div>居中内容</div>
</Flex>

// 两端对齐
<Flex justify="space-between">
  <div>左侧内容</div>
  <div>右侧内容</div>
</Flex>

// 换行布局
<Flex wrap="wrap" gap={10}>
  {[...Array(10)].map((_, index) => (
    <div key={index}>Item {index + 1}</div>
  ))}
</Flex>

// 复合使用
<Flex 
  direction="row" 
  justify="space-between" 
  align="center" 
  gap={10}
>
  <div>标题</div>
  <div>操作区域</div>
</Flex>`}
            </SyntaxHighlighter>
          </div>
          
          {/* 在其他项目中引用示例 */}
          <div id="flex-reference">
            <h3>在其他项目中引用</h3>
            <div style={{ margin: '15px 0' }}>
              <h4>1. 安装</h4>
              <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
                {`npm i @zjpcy/simple-design`}
              </SyntaxHighlighter>
            </div>
            <div>
              <h4>2. 引用组件</h4>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`// 方式一：单独引入
import Flex from '@zjpcy/simple-design/lib/Flex';
import '@zjpcy/simple-design/lib/Flex/Flex.css';

// 方式二：批量引入
import { Flex } from '@zjpcy/simple-design';
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
                <Anchor.Link href="#flex-intro" title="组件介绍" />
                <Anchor.Link href="#flex-interactive" title="交互式示例" />
                <Anchor.Link href="#flex-nested" title="嵌套示例" />
                <Anchor.Link href="#flex-api" title="API 参数" />
                <Anchor.Link href="#flex-code" title="代码示例" />
                <Anchor.Link href="#flex-reference" title="引用示例" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlexExample;

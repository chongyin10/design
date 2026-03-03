import React, { useState, useEffect } from 'react';
import { Rate, Table, Anchor } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const RateExample: React.FC = () => {
  const [value, setValue] = useState<string>('0');
  const [halfValue, setHalfValue] = useState<string>('0');
  const [chatsValue, setChatsValue] = useState<string>('');
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  // API参数列配置
  const apiColumns: Column[] = [
    { dataIndex: 'param', title: '参数名', width: '150px' },
    { dataIndex: 'type', title: '类型', width: '200px' },
    { dataIndex: 'default', title: '默认值', width: '150px' },
    { dataIndex: 'description', title: '描述', width: '350px' }
  ];

  // API参数数据源
  const apiDataSource = [
    { param: 'value', type: 'string', default: '0', description: '当前评分值，字符串类型。普通模式为数字字符串（如"3.5"），chats模式为字符拼接（如"ABC"）' },
    { param: 'count', type: 'number', default: '5', description: '星星总数' },
    { param: 'allowHalf', type: 'boolean', default: 'true', description: '是否允许半星' },
    { param: 'disabled', type: 'boolean', default: 'false', description: '是否只读' },
    { param: 'color', type: 'string', default: '#1677ff', description: '自定义颜色' },
    { param: 'onChange', type: 'function', default: '-', description: '评分变化回调，返回值为字符串类型' },
    { param: 'className', type: 'string', default: '-', description: '自定义类名' },
    { param: 'size', type: 'number', default: '24', description: '星星大小' },
    { param: 'chats', type: 'string[]', default: '-', description: '自定义字符数组，优先级最高，只支持整星' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="rate-intro">Rate 评分</h1>
          <p>评分组件，用于对事物进行评分或评价。</p>
          
          {/* 基本使用示例 */}
          <div id="rate-basic" style={{ marginBottom: '40px' }}>
            <h2>基本使用</h2>
            <p>展示不同场景下的评分组件。</p>
            
            <h3>基础评分</h3>
            <div style={{ marginBottom: '20px' }}>
              <Rate value={value} onChange={setValue} />
              <span style={{ marginLeft: '10px' }}>{value} 星</span>
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`import { useState } from 'react';
import { Rate } from '@zjpcy/simple-design';

const [value, setValue] = useState<string>('0');

<Rate value={value} onChange={setValue} />`}
            </SyntaxHighlighter>
          </div>
          
          {/* 半星评分 */}
          <div id="rate-half" style={{ marginBottom: '40px' }}>
            <h2>半星评分</h2>
            <div style={{ marginBottom: '20px' }}>
              <Rate value={halfValue} onChange={setHalfValue} allowHalf />
              <span style={{ marginLeft: '10px' }}>{halfValue} 星</span>
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`const [halfValue, setHalfValue] = useState<string>('0');

<Rate value={halfValue} onChange={setHalfValue} allowHalf />`}
            </SyntaxHighlighter>
          </div>
          
          {/* 禁用状态 */}
          <div id="rate-disabled" style={{ marginBottom: '40px' }}>
            <h2>禁用状态</h2>
            <div style={{ marginBottom: '20px' }}>
              <Rate value="3.5" disabled />
              <span style={{ marginLeft: '10px' }}>3.5 星（只读）</span>
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`<Rate value="3.5" disabled />`}
            </SyntaxHighlighter>
          </div>
          
          {/* 自定义颜色 */}
          <div id="rate-color" style={{ marginBottom: '40px' }}>
            <h2>自定义颜色</h2>
            <div style={{ marginBottom: '20px' }}>
              <Rate value={value} onChange={setValue} color="#ff4d4f" />
              <span style={{ marginLeft: '10px' }}>红色主题</span>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Rate value={value} onChange={setValue} color="#52c41a" />
              <span style={{ marginLeft: '10px' }}>绿色主题</span>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Rate value={value} onChange={setValue} color="#faad14" />
              <span style={{ marginLeft: '10px' }}>橙色主题</span>
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`<Rate value={value} onChange={setValue} color="#ff4d4f" />
<Rate value={value} onChange={setValue} color="#52c41a" />
<Rate value={value} onChange={setValue} color="#faad14" />`}
            </SyntaxHighlighter>
          </div>
          
          {/* 自定义大小 */}
          <div id="rate-size" style={{ marginBottom: '40px' }}>
            <h2>自定义大小</h2>
            <div style={{ marginBottom: '20px' }}>
              <Rate value={value} onChange={setValue} size={16} />
              <span style={{ marginLeft: '10px' }}>小号 (16px)</span>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Rate value={value} onChange={setValue} size={24} />
              <span style={{ marginLeft: '10px' }}>中号 (24px)</span>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Rate value={value} onChange={setValue} size={32} />
              <span style={{ marginLeft: '10px' }}>大号 (32px)</span>
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`<Rate value={value} onChange={setValue} size={16} />
<Rate value={value} onChange={setValue} size={24} />
<Rate value={value} onChange={setValue} size={32} />`}
            </SyntaxHighlighter>
          </div>
          
          {/* 自定义字符模式 */}
          <div id="rate-chats" style={{ marginBottom: '40px' }}>
            <h2>自定义字符模式</h2>
            <div style={{ marginBottom: '20px' }}>
              <Rate
                value={chatsValue}
                onChange={setChatsValue}
                chats={['A', 'B', 'C', 'D', 'E']}
              />
              <span style={{ marginLeft: '10px' }}>{chatsValue || '未选择'} (长度: {chatsValue.length} / 5)</span>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Rate
                value={chatsValue}
                onChange={setChatsValue}
                chats={['1', '2', '3', '4', '5']}
              />
              <span style={{ marginLeft: '10px' }}>{chatsValue || '未选择'} (长度: {chatsValue.length} / 5)</span>
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`const [chatsValue, setChatsValue] = useState<string>('');

<Rate
  value={chatsValue}
  onChange={setChatsValue}
  chats={['A', 'B', 'C', 'D', 'E']}
/>

<Rate
  value={chatsValue}
  onChange={setChatsValue}
  chats={['1', '2', '3', '4', '5']}
/>`}
            </SyntaxHighlighter>
          </div>

          {/* API 文档 */}
          <div id="rate-api" style={{ marginBottom: '40px' }}>
            <h2>API 文档</h2>
            <p>Rate 组件的属性配置。</p>
            
            <h3>Rate Props</h3>
            <Table columns={apiColumns} dataSource={apiDataSource} />
          </div>

          {/* 安装和使用说明 */}
          <div id="rate-install" style={{ marginBottom: '40px' }}>
            <h2>安装和使用</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <h3>1. 安装依赖</h3>
              <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
                {`npm i @zjpcy/simple-design`}
              </SyntaxHighlighter>
            </div>
            
            <div>
              <h3>2. 引用组件</h3>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`// 方式一：单独引入
import Rate from '@zjpcy/simple-design/lib/Rate';
import '@zjpcy/simple-design/lib/Rate/Rate.css';

// 方式二：批量引入
import { Rate } from '@zjpcy/simple-design';
import '@zjpcy/simple-design/lib/index.css';`}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* 样式说明 */}
          <div id="rate-style">
            <h2>样式说明</h2>
            <p>评分组件支持多种自定义样式：</p>
            <ul>
              <li>支持自定义颜色，通过 color 属性设置</li>
              <li>支持自定义大小，通过 size 属性设置</li>
              <li>支持自定义字符模式，通过 chats 属性设置字符数组</li>
              <li>支持半星评分，通过 allowHalf 属性控制</li>
              <li>支持禁用状态，通过 disabled 属性控制</li>
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
                <Anchor.Link href="#rate-intro" title="组件介绍" />
                <Anchor.Link href="#rate-basic" title="基本使用" />
                <Anchor.Link href="#rate-half" title="半星评分" />
                <Anchor.Link href="#rate-disabled" title="禁用状态" />
                <Anchor.Link href="#rate-color" title="自定义颜色" />
                <Anchor.Link href="#rate-size" title="自定义大小" />
                <Anchor.Link href="#rate-chats" title="自定义字符" />
                <Anchor.Link href="#rate-api" title="API 文档" />
                <Anchor.Link href="#rate-install" title="安装使用" />
                <Anchor.Link href="#rate-style" title="样式说明" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateExample;

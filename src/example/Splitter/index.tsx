import React, { useState, useEffect } from 'react';
import { Splitter, Table, Anchor } from '../../components';
import { Section } from '../components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const codeStyle = { borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' };

const demoBoxStyle: React.CSSProperties = {
  padding: '20px',
  background: '#fafafa',
  border: '1px solid #e8e8e8',
  borderRadius: '4px',
  marginBottom: '16px',
};

const SplitterExample: React.FC = () => {
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
  const [sizes, setSizes] = useState<number[]>([]);

  useEffect(() => {
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  // API 表格列定义
  const apiColumns = [
    { title: '属性', dataIndex: 'prop', key: 'prop' },
    { title: '说明', dataIndex: 'desc', key: 'desc' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '默认值', dataIndex: 'default', key: 'default' },
  ];

  // Splitter Props 数据
  const splitterApiData = [
    { key: '1', prop: 'layout', desc: '布局方向', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
    { key: '2', prop: 'splitterSize', desc: '分割条大小（像素）', type: 'number', default: '10' },
    { key: '3', prop: 'lineColor', desc: '拖拽线颜色', type: 'string', default: '-' },
    { key: '4', prop: 'lineHoverColor', desc: '悬停/拖拽时的颜色', type: 'string', default: '-' },
    { key: '5', prop: 'disabled', desc: '是否禁用拖拽', type: 'boolean', default: 'false' },
    { key: '6', prop: 'onResize', desc: '拖拽时的回调', type: '(sizes: number[], index: number) => void', default: '-' },
    { key: '7', prop: 'onResizeEnd', desc: '拖拽结束后的回调', type: '(sizes: number[]) => void', default: '-' },
    { key: '8', prop: 'className', desc: '自定义类名', type: 'string', default: "''" },
    { key: '9', prop: 'style', desc: '自定义样式', type: 'React.CSSProperties', default: '-' },
    { key: '10', prop: 'children', desc: '面板内容，通过 style 设置宽度', type: 'React.ReactNode[]', default: '-' },
  ];

  // PanelContent Props 数据
  const panelContentApiData = [
    { key: '1', prop: 'title', desc: '面板标题', type: 'string', default: '-' },
    { key: '2', prop: 'color', desc: '背景颜色', type: 'string', default: '-' },
    { key: '3', prop: 'children', desc: '面板内容', type: 'React.ReactNode', default: '-' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="splitter-intro">Splitter 分割面板（简洁版）</h1>
          <p>通过 children 内联样式设置面板宽度，未设置宽度的面板自动均分剩余空间。</p>

          {/* 基础用法 */}
          <div id="splitter-basic">
            <Section title="基础用法 - 两个面板平分">
              <p>未设置宽度时，两个面板自动平分容器宽度</p>
              <div style={{ ...demoBoxStyle, height: 200 }}>
                <Splitter>
                  <Splitter.PanelContent title="左侧面板" color="#f0f2f5">
                    未设置宽度，自动平分
                  </Splitter.PanelContent>
                  <Splitter.PanelContent title="右侧面板" color="#e6f7ff">
                    未设置宽度，自动平分
                  </Splitter.PanelContent>
                </Splitter>
              </div>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={codeStyle}>
{`<Splitter>
  <Splitter.PanelContent title="左侧面板" color="#f0f2f5">
    未设置宽度，自动平分
  </Splitter.PanelContent>
  <Splitter.PanelContent title="右侧面板" color="#e6f7ff">
    未设置宽度，自动平分
  </Splitter.PanelContent>
</Splitter>`}
              </SyntaxHighlighter>
            </Section>
          </div>

          {/* 三个面板 */}
          <div id="splitter-three">
            <Section title="三个面板平分">
              <p>三个面板均未设置宽度，自动三等分</p>
              <div style={{ ...demoBoxStyle, height: 200 }}>
                <Splitter>
                  <Splitter.PanelContent title="面板 A" color="#fff0f6">
                    33.3%
                  </Splitter.PanelContent>
                  <Splitter.PanelContent title="面板 B" color="#f9f0ff">
                    33.3%
                  </Splitter.PanelContent>
                  <Splitter.PanelContent title="面板 C" color="#fff2e8">
                    33.3%
                  </Splitter.PanelContent>
                </Splitter>
              </div>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={codeStyle}>
{`<Splitter>
  <Splitter.PanelContent title="面板 A" color="#fff0f6">33.3%</Splitter.PanelContent>
  <Splitter.PanelContent title="面板 B" color="#f9f0ff">33.3%</Splitter.PanelContent>
  <Splitter.PanelContent title="面板 C" color="#fff2e8">33.3%</Splitter.PanelContent>
</Splitter>`}
              </SyntaxHighlighter>
            </Section>
          </div>

          {/* 固定宽度 + 自适应 */}
          <div id="splitter-fixed">
            <Section title="固定宽度 + 自适应">
              <p>左侧面板固定 200px，右侧面板自适应剩余空间</p>
              <div style={{ ...demoBoxStyle, height: 200 }}>
                <Splitter>
                  <div style={{ width: 200 }}>
                    <Splitter.PanelContent title="固定 200px" color="#f0f2f5">
                      width: 200
                    </Splitter.PanelContent>
                  </div>
                  <Splitter.PanelContent title="自适应" color="#e6f7ff">
                    剩余空间
                  </Splitter.PanelContent>
                </Splitter>
              </div>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={codeStyle}>
{`<Splitter>
  <div style={{ width: 200 }}>
    <Splitter.PanelContent title="固定 200px" color="#f0f2f5">
      width: 200
    </Splitter.PanelContent>
  </div>
  <Splitter.PanelContent title="自适应" color="#e6f7ff">
    剩余空间
  </Splitter.PanelContent>
</Splitter>`}
              </SyntaxHighlighter>
            </Section>
          </div>

          {/* 百分比宽度 */}
          <div id="splitter-percent">
            <Section title="百分比宽度">
              <p>左侧面板 30%，右侧面板 70%</p>
              <div style={{ ...demoBoxStyle, height: 200 }}>
                <Splitter>
                  <Splitter.PanelContent title="30%" color="#fff0f6">
                    width: '30%'
                  </Splitter.PanelContent>
                  <Splitter.PanelContent title="70%" color="#f9f0ff">
                    剩余空间
                  </Splitter.PanelContent>
                </Splitter>
              </div>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={codeStyle}>
{`<Splitter>
  <Splitter.PanelContent title="30%" color="#fff0f6">width: '30%'</Splitter.PanelContent>
  <Splitter.PanelContent title="70%" color="#f9f0ff">剩余空间</Splitter.PanelContent>
</Splitter>`}
              </SyntaxHighlighter>
            </Section>
          </div>

          {/* 混合布局 */}
          <div id="splitter-mixed">
            <Section title="混合布局 - 固定 + 自适应 + 固定">
              <p>左右固定宽度，中间自适应</p>
              <div style={{ ...demoBoxStyle, height: 200 }}>
                <Splitter>
                  <div style={{ width: 150 }}>
                    <Splitter.PanelContent title="左固定 150px" color="#f0f2f5">
                      width: 150
                    </Splitter.PanelContent>
                  </div>
                  <Splitter.PanelContent title="中间自适应" color="#e6f7ff">
                    自动填充
                  </Splitter.PanelContent>
                  <div style={{ width: 150 }}>
                    <Splitter.PanelContent title="右固定 150px" color="#f6ffed">
                      width: 150
                    </Splitter.PanelContent>
                  </div>
                </Splitter>
              </div>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={codeStyle}>
{`<Splitter>
  <div style={{ width: 150 }}>
    <Splitter.PanelContent title="左固定 150px" color="#f0f2f5">width: 150</Splitter.PanelContent>
  </div>
  <Splitter.PanelContent title="中间自适应" color="#e6f7ff">自动填充</Splitter.PanelContent>
  <div style={{ width: 150 }}>
    <Splitter.PanelContent title="右固定 150px" color="#f6ffed">width: 150</Splitter.PanelContent>
  </div>
</Splitter>`}
              </SyntaxHighlighter>
            </Section>
          </div>

          {/* 复杂布局 */}
          <div id="splitter-complex">
            <Section title="多面板复杂布局">
              <p>导航固定 200px，主内容区 50%，右侧自适应</p>
              <div style={{ ...demoBoxStyle, height: 300 }}>
                <Splitter>
                  <div style={{ width: 200 }}>
                    <Splitter.PanelContent title="导航" color="#f0f2f5">
                      width: 200
                    </Splitter.PanelContent>
                  </div>
                  <div style={{ width: '50%' }}>
                    <Splitter.PanelContent title="主内容" color="#e6f7ff">
                      width: '50%'
                    </Splitter.PanelContent>
                  </div>
                  <Splitter.PanelContent title="属性面板" color="#f6ffed">
                    剩余空间
                  </Splitter.PanelContent>
                </Splitter>
              </div>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={codeStyle}>
{`<Splitter>
  <div style={{ width: 200 }}>
    <Splitter.PanelContent title="导航" color="#f0f2f5">width: 200</Splitter.PanelContent>
  </div>
  <div style={{ width: '50%' }}>
    <Splitter.PanelContent title="主内容" color="#e6f7ff">width: '50%'</Splitter.PanelContent>
  </div>
  <Splitter.PanelContent title="属性面板" color="#f6ffed">剩余空间</Splitter.PanelContent>
</Splitter>`}
              </SyntaxHighlighter>
            </Section>
          </div>

          {/* 垂直布局 */}
          <div id="splitter-vertical">
            <Section title="垂直布局">
              <p>使用 layout="vertical" 实现上下分隔</p>
              <div style={{ ...demoBoxStyle, height: 400 }}>
                <Splitter layout="vertical">
                  <div style={{ height: 100 }}>
                    <Splitter.PanelContent title="顶部固定 100px" color="#fff0f6">
                      height: 100
                    </Splitter.PanelContent>
                  </div>
                  <Splitter.PanelContent title="中间自适应" color="#f9f0ff">
                    自动填充
                  </Splitter.PanelContent>
                  <div style={{ height: '30%' }}>
                    <Splitter.PanelContent title="底部 30%" color="#fff2e8">
                      height: '30%'
                    </Splitter.PanelContent>
                  </div>
                </Splitter>
              </div>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={codeStyle}>
{`<Splitter layout="vertical">
  <div style={{ height: 100 }}>
    <Splitter.PanelContent title="顶部固定 100px" color="#fff0f6">height: 100</Splitter.PanelContent>
  </div>
  <Splitter.PanelContent title="中间自适应" color="#f9f0ff">自动填充</Splitter.PanelContent>
  <div style={{ height: '30%' }}>
    <Splitter.PanelContent title="底部 30%" color="#fff2e8">height: '30%'</Splitter.PanelContent>
  </div>
</Splitter>`}
              </SyntaxHighlighter>
            </Section>
          </div>

          {/* 事件回调 */}
          <div id="splitter-event">
            <Section title="拖拽回调">
              <p>onResize 和 onResizeEnd 回调获取面板尺寸</p>
              <div style={{ ...demoBoxStyle, height: 200 }}>
                <Splitter
                  onResize={(newSizes) => setSizes(newSizes)}
                  onResizeEnd={(finalSizes) => console.log('最终尺寸:', finalSizes)}
                >
                  <Splitter.PanelContent title="左侧面板" color="#e6f7ff">
                    {sizes[0] && <p>当前: {sizes[0].toFixed(0)}px</p>}
                  </Splitter.PanelContent>
                  <Splitter.PanelContent title="右侧面板" color="#f6ffed">
                    {sizes[1] && <p>当前: {sizes[1].toFixed(0)}px</p>}
                  </Splitter.PanelContent>
                </Splitter>
              </div>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={codeStyle}>
{`const [sizes, setSizes] = React.useState<number[]>([]);

<Splitter
  onResize={(newSizes) => setSizes(newSizes)}
  onResizeEnd={(finalSizes) => console.log('最终尺寸:', finalSizes)}
>
  <Splitter.PanelContent title="左侧面板" color="#e6f7ff">
    {sizes[0] && <p>当前: {sizes[0].toFixed(0)}px</p>}
  </Splitter.PanelContent>
  <Splitter.PanelContent title="右侧面板" color="#f6ffed">
    {sizes[1] && <p>当前: {sizes[1].toFixed(0)}px</p>}
  </Splitter.PanelContent>
</Splitter>`}
              </SyntaxHighlighter>
            </Section>
          </div>

          {/* 嵌套使用 */}
          <div id="splitter-nested">
            <Section title="嵌套使用">
              <p>嵌套 Splitter 实现复杂布局</p>
              <div style={{ ...demoBoxStyle, height: 400 }}>
                <Splitter>
                  <div style={{ width: 200 }}>
                    <Splitter.PanelContent title="左侧导航" color="#f0f2f5" />
                  </div>
                  <Splitter layout="vertical">
                    <div style={{ height: '30%' }}>
                      <Splitter.PanelContent title="顶部" color="#e6f7ff" />
                    </div>
                    <Splitter.PanelContent title="底部" color="#f6ffed" />
                  </Splitter>
                </Splitter>
              </div>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={codeStyle}>
{`<Splitter>
  <div style={{ width: 200 }}>
    <Splitter.PanelContent title="左侧导航" color="#f0f2f5" />
  </div>
  <Splitter layout="vertical">
    <div style={{ height: '30%' }}>
      <Splitter.PanelContent title="顶部" color="#e6f7ff" />
    </div>
    <Splitter.PanelContent title="底部" color="#f6ffed" />
  </Splitter>
</Splitter>`}
              </SyntaxHighlighter>
            </Section>
          </div>

          {/* API 文档 */}
          <div id="splitter-api">
            <Section title="API">
              <h3>Splitter Props</h3>
              <div style={{ marginBottom: '16px' }}>
                <Table columns={apiColumns} dataSource={splitterApiData} bordered />
              </div>

              <h3>PanelContent Props</h3>
              <div style={{ marginBottom: '16px' }}>
                <Table columns={apiColumns} dataSource={panelContentApiData} bordered />
              </div>

              <h3>使用说明</h3>
              <ul>
                <li>使用 <code>{'<Splitter.PanelContent>'}</code> 快速创建带标题和样式的面板</li>
                <li>水平布局时，在子元素上设置 <code>style={'{'} width: 200 {'}'}</code> 或 <code>style={'{'} width: '30%' {'}'}</code></li>
                <li>垂直布局时，在子元素上设置 <code>style={'{'} height: 100 {'}'}</code> 或 <code>style={'{'} height: '40%' {'}'}</code></li>
                <li>未设置宽度的子元素将自动均分剩余空间</li>
                <li>所有子元素都会被包裹在可拖拽的面板容器中</li>
              </ul>
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
                <Anchor.Link href="#splitter-intro" title="组件介绍" />
                <Anchor.Link href="#splitter-basic" title="基础用法" />
                <Anchor.Link href="#splitter-three" title="三个面板" />
                <Anchor.Link href="#splitter-fixed" title="固定宽度" />
                <Anchor.Link href="#splitter-percent" title="百分比" />
                <Anchor.Link href="#splitter-mixed" title="混合布局" />
                <Anchor.Link href="#splitter-complex" title="复杂布局" />
                <Anchor.Link href="#splitter-vertical" title="垂直布局" />
                <Anchor.Link href="#splitter-event" title="事件回调" />
                <Anchor.Link href="#splitter-nested" title="嵌套使用" />
                <Anchor.Link href="#splitter-api" title="API 文档" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitterExample;

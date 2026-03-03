import React, { useState, useEffect } from 'react';
import { Flex, Button, Input, Table, Anchor } from '../../components';
import Tooltip from '../../components/Tooltip';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Column } from '../../components/Table';

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

const TooltipExample: React.FC = () => {
  const [controlledOpen, setControlledOpen] = useState(false);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="tooltip-intro">Tooltip 提示框</h1>
          <p>简洁美观的气泡提示框组件，支持多种位置和触发方式，鼠标移入立即显示，无延迟。</p>

          {/* 基础用法 */}
          <div id="tooltip-basic">
            <Section title="基础用法">
              <p>鼠标移入到元素上，即可看到气泡提示框。</p>
              <DemoRow title="基础 Tooltip">
                <Tooltip title="这是一段提示文字">
                  <Button>鼠标移入</Button>
                </Tooltip>
              </DemoRow>
              <CopyBlock code={`import { Tooltip, Button } from '@zjpcy/simple-design';

<Tooltip title="这是一段提示文字">
  <Button>鼠标移入</Button>
</Tooltip>`} />

              <DemoRow title="多种元素">
                <Tooltip title="提示文字">
                  <span style={{ display: 'inline-block', padding: '8px 16px', border: '1px solid #d9d9d9', borderRadius: '4px', cursor: 'pointer' }}>
                    文字提示
                  </span>
                </Tooltip>
                <Tooltip title="链接提示">
                  <a href="#" style={{ color: '#1890ff', marginLeft: '16px' }}>链接提示</a>
                </Tooltip>
              </DemoRow>
              <CopyBlock code={`<Tooltip title="提示文字">
  <span>文字提示</span>
</Tooltip>

<Tooltip title="链接提示">
  <a href="#">链接提示</a>
</Tooltip>`} />
            </Section>
          </div>

          {/* 不同位置 */}
          <div id="tooltip-placement">
            <Section title="不同位置">
              <p>通过 placement 属性设置提示框的位置，支持 top、bottom、left、right 四个方向。</p>
              <Flex gap="large" style={{ marginBottom: '16px' }}>
                <Tooltip title="上方的提示框" placement="top">
                  <Button>上边</Button>
                </Tooltip>
                <Tooltip title="下方的提示框" placement="bottom">
                  <Button>下边</Button>
                </Tooltip>
                <Tooltip title="左边的提示框" placement="left">
                  <Button>左边</Button>
                </Tooltip>
                <Tooltip title="右边的提示框" placement="right">
                  <Button>右边</Button>
                </Tooltip>
              </Flex>
              <CopyBlock code={`<Tooltip title="上方的提示框" placement="top">
  <Button>上边</Button>
</Tooltip>
<Tooltip title="下方的提示框" placement="bottom">
  <Button>下边</Button>
</Tooltip>
<Tooltip title="左边的提示框" placement="left">
  <Button>左边</Button>
</Tooltip>
<Tooltip title="右边的提示框" placement="right">
  <Button>右边</Button>
</Tooltip>`} />
            </Section>
          </div>

          {/* 触发方式 */}
          <div id="tooltip-trigger">
            <Section title="触发方式">
              <p>通过 trigger 属性设置触发方式，支持 hover（悬停）和 click（点击）两种方式。click 触发方式下，点击外部区域会自动关闭提示框。</p>
              <DemoRow title="点击触发">
                <Tooltip title="点击显示的提示框" trigger="click">
                  <Button variant="primary">点击我</Button>
                </Tooltip>
              </DemoRow>
              <CopyBlock code={`<Tooltip title="点击显示的提示框" trigger="click">
  <Button>点击我</Button>
</Tooltip>`} />

              <DemoRow title="悬停触发（默认）">
                <Tooltip title="悬停显示的提示框" trigger="hover">
                  <Button>悬停我</Button>
                </Tooltip>
              </DemoRow>
              <CopyBlock code={`<Tooltip title="悬停显示的提示框" trigger="hover">
  <Button>悬停我</Button>
</Tooltip>`} />
            </Section>
          </div>

          {/* 延迟显示 */}
          <div id="tooltip-delay">
            <Section title="延迟显示">
              <p>通过 delay 属性设置提示框的显示延迟时间，单位为毫秒，默认为 300ms。</p>
              <DemoRow title="延迟 1000ms">
                <Tooltip title="1秒后显示" delay={1000}>
                  <Button>延迟显示</Button>
                </Tooltip>
              </DemoRow>
              <CopyBlock code={`<Tooltip title="1秒后显示" delay={1000}>
  <Button>延迟显示</Button>
</Tooltip>`} />

              <DemoRow title="立即显示">
                <Tooltip title="立即显示" delay={0}>
                  <Button>立即显示</Button>
                </Tooltip>
              </DemoRow>
              <CopyBlock code={`<Tooltip title="立即显示" delay={0}>
  <Button>立即显示</Button>
</Tooltip>`} />
            </Section>
          </div>

          {/* 受控模式 */}
          <div id="tooltip-controlled">
            <Section title="受控模式">
              <p>通过 open 属性可以控制提示框的显示状态，此时组件变为受控组件。</p>
              <DemoRow title="受控模式">
                <Tooltip title="受控提示框" open={controlledOpen} trigger="click">
                  <Button variant="primary" onClick={() => setControlledOpen(!controlledOpen)}>
                    点击切换状态: {controlledOpen ? '打开' : '关闭'}
                  </Button>
                </Tooltip>
              </DemoRow>
              <CopyBlock code={`const [open, setOpen] = useState(false);

<Tooltip title="受控提示框" open={open} trigger="click">
  <Button onClick={() => setOpen(!open)}>
    点击切换状态
  </Button>
</Tooltip>`} />
            </Section>
          </div>

          {/* 自定义样式 */}
          <div id="tooltip-custom">
            <Section title="自定义样式">
              <p>通过 backgroundColor 和 style 属性可以自定义提示框的背景颜色和样式。</p>
              <DemoRow title="自定义背景色">
                <Tooltip title="自定义背景颜色" backgroundColor="#ff6b6b">
                  <Button>红色背景</Button>
                </Tooltip>
              </DemoRow>
              <CopyBlock code={`<Tooltip title="自定义背景颜色" backgroundColor="#ff6b6b">
  <Button>红色背景</Button>
</Tooltip>`} />

              <DemoRow title="完整自定义样式">
                <Tooltip 
                  title="自定义样式" 
                  backgroundColor="#4ecdc4"
                  style={{ fontSize: '16px', padding: '12px 16px', borderRadius: '8px' }}
                >
                  <Button>自定义样式</Button>
                </Tooltip>
              </DemoRow>
              <CopyBlock code={`<Tooltip 
  title="自定义样式" 
  backgroundColor="#4ecdc4"
  style={{ fontSize: '16px', padding: '12px 16px', borderRadius: '8px' }}
>
  <Button>自定义样式</Button>
</Tooltip>`} />
            </Section>
          </div>

          {/* 长文本 */}
          <div id="tooltip-longtext">
            <Section title="长文本支持">
              <p>提示框支持长文本显示，会自动换行，最大宽度为 350px。</p>
              <DemoRow title="长文本提示">
                <Tooltip title="这是一段非常长的提示文字，用于测试 Tooltip 组件对长文本的支持情况。提示框会自动换行显示，保持美观的样式。">
                  <Button>长文本提示</Button>
                </Tooltip>
              </DemoRow>
              <CopyBlock code={`<Tooltip title="这是一段非常长的提示文字，用于测试 Tooltip 组件对长文本的支持情况。提示框会自动换行显示，保持美观的样式。">
  <Button>长文本提示</Button>
</Tooltip>`} />
            </Section>
          </div>

          {/* 实际应用场景 */}
          <div id="tooltip-scenarios">
            <Section title="实际应用场景">
              <p>Tooltip 组件在实际项目中的常见使用场景。</p>

              <h3>1. 表单字段说明</h3>
              <DemoRow title="表单提示">
                <Flex gap="small" align="center">
                  <label style={{ fontWeight: 500 }}>用户名：</label>
                  <Input placeholder="请输入用户名" style={{ width: '200px' }} />
                  <Tooltip title="用户名将用于登录系统，建议使用字母和数字的组合，长度为3-20个字符">
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', background: '#1890ff', color: '#fff', fontSize: '14px', cursor: 'help' }}>?</span>
                  </Tooltip>
                </Flex>
              </DemoRow>
              <CopyBlock code={`<Flex gap="small" align="center">
  <label>用户名：</label>
  <Input placeholder="请输入用户名" />
  <Tooltip title="用户名将用于登录系统">
    <span style={{ cursor: 'help' }}>?</span>
  </Tooltip>
</Flex>`} />

              <h3>2. 操作按钮说明</h3>
              <DemoRow title="按钮提示">
                <Flex gap="small">
                  <Tooltip title="编辑当前行的数据">
                    <Button variant="primary" size="small">编辑</Button>
                  </Tooltip>
                  <Tooltip title="删除当前行的数据，此操作不可恢复">
                    <Button variant="danger" size="small">删除</Button>
                  </Tooltip>
                  <Tooltip title="导出数据为 Excel 文件">
                    <Button size="small">导出</Button>
                  </Tooltip>
                </Flex>
              </DemoRow>
              <CopyBlock code={`<Flex gap="small">
  <Tooltip title="编辑当前行的数据">
    <Button variant="primary" size="small">编辑</Button>
  </Tooltip>
  <Tooltip title="删除当前行的数据，此操作不可恢复">
    <Button variant="danger" size="small">删除</Button>
  </Tooltip>
  <Tooltip title="导出数据为 Excel 文件">
    <Button size="small">导出</Button>
  </Tooltip>
</Flex>`} />

              <h3>3. 图标说明</h3>
              <DemoRow title="图标提示">
                <Tooltip title="刷新数据">
                  <Button variant="secondary">🔄</Button>
                </Tooltip>
                <Tooltip title="下载文件">
                  <Button variant="secondary">⬇️</Button>
                </Tooltip>
                <Tooltip title="打印">
                  <Button variant="secondary">🖨️</Button>
                </Tooltip>
              </DemoRow>
              <CopyBlock code={`<Tooltip title="刷新数据">
  <Button variant="secondary">🔄</Button>
</Tooltip>
<Tooltip title="下载文件">
  <Button variant="secondary">⬇️</Button>
</Tooltip>
<Tooltip title="打印">
  <Button variant="secondary">🖨️</Button>
</Tooltip>`} />
            </Section>
          </div>

          {/* API 文档 */}
          <div id="tooltip-api">
            <Section title="API">
              <h3>Tooltip Props</h3>
              {(() => {
                const columns: Column[] = [
                  { dataIndex: 'property', title: '属性', width: '120px' },
                  { dataIndex: 'description', title: '说明', width: '200px' },
                  { dataIndex: 'type', title: '类型', width: '280px' },
                  { dataIndex: 'default', title: '默认值', width: '100px' }
                ];

                const dataSource = [
                  { property: 'title', description: '提示框内容', type: 'ReactNode', default: '-' },
                  { property: 'placement', description: '提示框出现的位置', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'" },
                  { property: 'trigger', description: '触发方式', type: "'hover' | 'click'", default: "'hover'" },
                  { property: 'delay', description: '显示延迟时间（毫秒）', type: 'number', default: '300' },
                  { property: 'open', description: '控制提示框显示状态（受控模式）', type: 'boolean', default: '-' },
                  { property: 'backgroundColor', description: '自定义背景颜色', type: 'string', default: '-' },
                  { property: 'style', description: '自定义样式对象', type: 'CSSProperties', default: '-' },
                  { property: 'className', description: '自定义类名', type: 'string', default: '-' }
                ];

                return (
                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    bordered
                  />
                );
              })()}
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
                <Anchor.Link href="#tooltip-intro" title="组件介绍" />
                <Anchor.Link href="#tooltip-basic" title="基础用法" />
                <Anchor.Link href="#tooltip-placement" title="不同位置" />
                <Anchor.Link href="#tooltip-trigger" title="触发方式" />
                <Anchor.Link href="#tooltip-delay" title="延迟显示" />
                <Anchor.Link href="#tooltip-controlled" title="受控模式" />
                <Anchor.Link href="#tooltip-custom" title="自定义样式" />
                <Anchor.Link href="#tooltip-longtext" title="长文本" />
                <Anchor.Link href="#tooltip-scenarios" title="应用场景" />
                <Anchor.Link href="#tooltip-api" title="API 文档" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TooltipExample;

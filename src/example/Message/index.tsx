import React, { useEffect, useState } from 'react';
import { message, Anchor } from '../../components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MessageExample: React.FC = () => {
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  const handleSuccessClick = () => {
    message.success('操作成功！', 3000);
  };

  const handleWarningClick = () => {
    message.warning('警告：请检查输入！', 4000);
  };

  const handleErrorClick = () => {
    message.error('操作失败，请重试！', 5000);
  };

  const handleMultipleClick = () => {
    message.success('第一条消息');
    setTimeout(() => message.warning('第二条消息'), 500);
    setTimeout(() => message.error('第三条消息'), 1000);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="message-intro">Message 消息提示</h1>
          <p>轻量级消息提示框，用于显示成功、警告和错误信息。无需 MessageProvider，直接导入即可使用。</p>

          {/* 推荐用法 */}
          <div id="message-basic">
            <div style={{ marginBottom: '40px', display: 'block' }}>
              <h2>推荐用法：直接使用全局 message</h2>
              <p>无需 Provider，无需 useMessage hook，直接导入使用。</p>

              <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={handleSuccessClick}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#52c41a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  显示成功消息
                </button>
                
                <button
                  onClick={handleWarningClick}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#faad14',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  显示警告消息
                </button>
                
                <button
                  onClick={handleErrorClick}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f5222d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  显示错误消息
                </button>

                <button
                  onClick={handleMultipleClick}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1890ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  显示多条消息
                </button>
              </div>
            </div>
          </div>

          {/* 代码示例 */}
          <div id="message-code">
            <div style={{ marginBottom: '40px', display: 'block' }}>
              <h2>代码示例（推荐）</h2>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0' }}>
                {`// 推荐：直接使用全局 message，无需 Provider
import { message } from '@zjpcy/simple-design';

// 在任何地方直接使用
message.success('操作成功！', 3000);
message.warning('警告信息', 4000);
message.error('错误提示', 5000);
message.close(); // 关闭所有消息

// 类组件中使用
class MyComponent extends React.Component {
  handleClick = () => {
    message.success('操作成功！');
  };
}`}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* 向后兼容 */}
          <div id="message-hook">
            <div style={{ marginBottom: '40px', display: 'block' }}>
              <h2>向后兼容：useMessage（可选）</h2>
              <p>如果之前使用了 useMessage，仍然可以继续使用，会自动返回全局 message 实例。</p>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0' }}>
                {`// 向后兼容：useMessage 仍然可用
import { useMessage } from '@zjpcy/simple-design';

const Component = () => {
  const message = useMessage(); // 现在不会报错，返回全局 message
  
  const handleClick = () => {
    message.success('操作成功！');
  };
  
  return <button onClick={handleClick}>点击</button>;
};`}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* API 文档 */}
          <div id="message-api">
            <div style={{ marginBottom: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
              <h2>message 实例 API</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', width: '150px' }}>方法名</th>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>说明</th>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>参数</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>message.success(content, duration)</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>显示成功消息</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>content: ReactNode, duration?: number (默认 3000ms)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>message.warning(content, duration)</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>显示警告消息</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>content: ReactNode, duration?: number (默认 3000ms)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>message.error(content, duration)</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>显示错误消息</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>content: ReactNode, duration?: number (默认 3000ms)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>message.close()</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>关闭所有消息</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>无</td>
                  </tr>
                </tbody>
              </table>

              <h2>Message 组件 Props（高级用法）</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>参数名</th>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>类型</th>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>默认值</th>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>描述</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>type</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>'success' | 'warning' | 'error'</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>-</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>消息类型</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>content</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>ReactNode</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>-</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>消息内容</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>duration</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>number</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>3000</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>消息自动关闭时长（毫秒）</td>
                  </tr>
                </tbody>
              </table>
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
                <Anchor.Link href="#message-intro" title="组件介绍" />
                <Anchor.Link href="#message-basic" title="基础用法" />
                <Anchor.Link href="#message-code" title="代码示例" />
                <Anchor.Link href="#message-hook" title="useMessage" />
                <Anchor.Link href="#message-api" title="API 文档" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageExample;

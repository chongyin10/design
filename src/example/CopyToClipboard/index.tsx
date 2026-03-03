import React, { useState, useEffect } from 'react';
import { Table, Button, Anchor } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyToClipboard, { useOnCopy as useCopy } from '../../components/CopyToClipboard';

const CopyToClipboardExample: React.FC = () => {
  const [copyStatus, setCopyStatus] = useState('');
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

  // API参数数据源 - CopyToClipboard组件
  const apiDataSource = [
    { param: 'url', type: 'string', default: '-', description: '需要复制的URL或文本内容' },
    { param: 'onCopyStatusChange', type: '(status: "success" | "error") => void', default: '-', description: '复制状态变化回调' },
    { param: 'children', type: 'React.ReactNode', default: '-', description: '自定义子元素' }
  ];

  // API参数数据源 - useCopy钩子
  const useCopyApiDataSource = [
    { param: 'url', type: 'string', default: '-', description: '需要复制的URL或文本内容' },
    { param: 'return', type: 'Promise<void>', default: '-', description: '复制操作的Promise' }
  ];

  // 使用useCopy钩子的状态
  const [hookCopyStatus, setHookCopyStatus] = useState('');
  const copyFn = useCopy();

  const handleHookCopy = async () => {
    try {
      await copyFn('https://example.com/use-copy');
      setHookCopyStatus('复制成功！');
    } catch (error) {
      setHookCopyStatus('复制失败！');
    }
    setTimeout(() => setHookCopyStatus(''), 2000);
  };

  const handleCopyStatusChange = (status: string) => {
    if (status === 'success') {
      setCopyStatus('复制成功！');
    } else {
      setCopyStatus('复制失败！');
    }
    setTimeout(() => setCopyStatus(''), 2000);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="copytoclipboard-intro">CopyToClipboard 组件</h1>
          <p>用于将文本复制到剪贴板的组件，支持自定义样式和状态回调。</p>
          
          {/* 基本使用示例 */}
          <div id="copytoclipboard-basic">
            <h2 style={{ marginTop: '32px', marginBottom: '16px', color: '#333' }}>基本使用</h2>
            <p>展示不同样式的复制按钮。</p>
            
            <h4>文本链接样式</h4>
            <div style={{ marginBottom: '20px' }}>
              <CopyToClipboard 
                url="https://example.com" 
                onCopyStatusChange={handleCopyStatusChange}
              >
                <span style={{ 
                  color: '#1890ff', 
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}>
                  复制链接
                </span>
              </CopyToClipboard>
              {copyStatus && (
                <span style={{ marginLeft: '10px', color: copyStatus.includes('成功') ? 'green' : 'red' }}>
                  {copyStatus}
                </span>
              )}
            </div>
            
            <h4>按钮样式</h4>
            <div style={{ marginBottom: '20px' }}>
              <CopyToClipboard 
                url="https://example.com/custom" 
                onCopyStatusChange={handleCopyStatusChange}
              >
                <Button variant="primary" size="medium">
                  点击复制自定义链接
                </Button>
              </CopyToClipboard>
            </div>
            
            <h4>带样式的链接</h4>
            <div style={{ marginBottom: '20px' }}>
              <CopyToClipboard 
                url="https://example.com/styled" 
                onCopyStatusChange={handleCopyStatusChange}
              >
                <span style={{ 
                  display: 'inline-block',
                  padding: '8px 16px', 
                  backgroundColor: '#52c41a', 
                  color: 'white', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}>
                  复制带样式的链接
                </span>
              </CopyToClipboard>
            </div>

            <h4>使用 useCopy 钩子</h4>
            <div style={{ marginBottom: '20px' }}>
              <Button 
                variant="secondary" 
                onClick={handleHookCopy}
              >
                使用 useCopy 复制链接
              </Button>
              {hookCopyStatus && (
                <span style={{ marginLeft: '10px', color: hookCopyStatus.includes('成功') ? 'green' : 'red' }}>
                  {hookCopyStatus}
                </span>
              )}
            </div>
          </div>
          
          {/* API 文档 */}
          <div id="copytoclipboard-api" style={{ marginBottom: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
            <h2>API 参数</h2>
            
            <h4>1. CopyToClipboard 组件</h4>
            <Table pagination={false} columns={apiColumns} dataSource={apiDataSource} />
            
            <h4 style={{ marginTop: '20px' }}>2. useCopy 钩子</h4>
            <Table pagination={false} columns={apiColumns} dataSource={useCopyApiDataSource} />
          </div>
          
          {/* 代码示例 */}
          <div id="copytoclipboard-code" style={{ marginBottom: '40px' }}>
            <h2>代码示例</h2>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0' }}>
{`import { CopyToClipboard } from '@zjpcy/simple-design';

// 文本链接样式
<CopyToClipboard 
  url="https://example.com" 
  onCopyStatusChange={(status) => {
    if (status === 'success') {
      console.log('复制成功！');
    } else {
      console.log('复制失败！');
    }
  }}
>
  <span style={{ 
    color: '#1890ff', 
    cursor: 'pointer',
    textDecoration: 'underline'
  }}>
    复制链接
  </span>
</CopyToClipboard>

// 按钮样式
<CopyToClipboard 
  url="https://example.com/custom" 
  onCopyStatusChange={(status) => {
    console.log('复制状态:', status);
  }}
>
  <Button variant="primary" size="middle">
    点击复制自定义链接
  </Button>
</CopyToClipboard>

// 带样式的链接
<CopyToClipboard 
  url="https://example.com/styled" 
  onCopyStatusChange={(status) => {
    console.log('复制状态:', status);
  }}
>
  <span style={{ 
    display: 'inline-block',
    padding: '8px 16px', 
    backgroundColor: '#52c41a', 
    color: 'white', 
    borderRadius: '4px',
    cursor: 'pointer',
    userSelect: 'none'
  }}>
    复制带样式的链接
  </span>
</CopyToClipboard>

// 使用 useCopy 钩子
import { useCopy } from '@zjpcy/simple-design';

const MyComponent = () => {
  const copyUrl = useCopy();
  const [copyStatus, setCopyStatus] = useState('');

  const handleCopy = async () => {
    try {
      await copyUrl('https://example.com/use-copy');
      setCopyStatus('复制成功！');
    } catch (error) {
      setCopyStatus('复制失败！');
    }
    setTimeout(() => setCopyStatus(''), 2000);
  };

  return (
    <div>
      <Button variant="secondary" onClick={handleCopy}>
        使用 useCopy 复制链接
      </Button>
      {copyStatus && <span style={{ marginLeft: '10px' }}>{copyStatus}</span>}
    </div>
  );
};`}
            </SyntaxHighlighter>
          </div>
          
          {/* 在其他项目中引用示例 */}
          <div id="copytoclipboard-reference">
            <h2>在其他项目中引用</h2>
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
import CopyToClipboard from '@zjpcy/simple-design/lib/CopyToClipboard';
import '@zjpcy/simple-design/lib/CopyToClipboard/CopyToClipboard.css';

// 方式二：批量引入
import { CopyToClipboard } from '@zjpcy/simple-design';
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
                <Anchor.Link href="#copytoclipboard-intro" title="组件介绍" />
                <Anchor.Link href="#copytoclipboard-basic" title="基本使用" />
                <Anchor.Link href="#copytoclipboard-api" title="API 参数" />
                <Anchor.Link href="#copytoclipboard-code" title="代码示例" />
                <Anchor.Link href="#copytoclipboard-reference" title="引用示例" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyToClipboardExample;

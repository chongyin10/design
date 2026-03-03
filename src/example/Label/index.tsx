import React, { useState, useEffect } from 'react';
import Label from '../../components/Label';
import { Table, Anchor } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const LabelExample: React.FC = () => {
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
    { param: 'title', type: 'ReactNode', default: '-', description: '标签内容' },
    { param: 'indicatorColor', type: 'string', default: 'blue', description: '左侧指示器颜色' },
    { param: 'indicatorWidth', type: 'string | number', default: '3px', description: '左侧指示器宽度' },
    { param: 'indicatorHeight', type: 'string | number', default: '100%', description: '左侧指示器高度（内容上下居中）' },
    { param: 'paddingRight', type: 'string | number', default: '8px', description: '右侧内边距' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="label-intro">Label 组件</h1>
          <p>简单的标签展示组件，支持自定义左侧指示器样式。</p>

          {/* 基本使用示例 */}
          <div id="label-basic">
            <div style={{ marginBottom: '40px' }}>
              <h2>基本使用</h2>
              <p>展示不同内容的标签。</p>

              <h3>文本标签</h3>
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Label title="默认标签" />
                <Label title="标题文本" />
                <Label title="说明信息" />
              </div>

              <h3>自定义指示器颜色</h3>
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Label title="红色指示器" indicatorColor="#ff4d4f" />
                <Label title="绿色指示器" indicatorColor="#52c41a" />
                <Label title="蓝色指示器" indicatorColor="#1890ff" />
                <Label title="橙色指示器" indicatorColor="#fa8c16" />
              </div>

              <h3>自定义指示器宽高</h3>
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Label title="宽指示器" indicatorWidth={6} />
                <Label title="窄指示器" indicatorWidth={1} />
                <Label title="高指示器" indicatorHeight="80%" />
                <Label title="矮指示器" indicatorHeight="40%" />
                <Label title="完全自定义" indicatorColor="#722ed1" indicatorWidth={4} indicatorHeight={12} />
              </div>

              <h3>自定义右侧内边距</h3>
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Label title="默认边距" />
                <Label title="大边距" paddingRight={24} />
                <Label title="超大边距" paddingRight={40} />
              </div>
            </div>
          </div>

          {/* API 文档 */}
          <div id="label-api">
            <h2>API 参数</h2>
            <Table pagination={false} columns={apiColumns} dataSource={apiDataSource} />
          </div>

          {/* 代码示例 */}
          <div id="label-code">
            <div style={{ marginBottom: '40px' }}>
              <h2>代码示例</h2>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0' }}>
{`import { Label } from '@zjpcy/simple-design';

// 基本用法
<Label title="默认标签" />

// 自定义指示器颜色
<Label title="红色指示器" indicatorColor="#ff4d4f" />
<Label title="绿色指示器" indicatorColor="#52c41a" />

// 自定义指示器宽度
<Label title="宽指示器" indicatorWidth={6} />
<Label title="窄指示器" indicatorWidth={1} />

// 自定义指示器高度（自动上下居中）
<Label title="高指示器" indicatorHeight="80%" />
<Label title="矮指示器" indicatorHeight="40%" />

// 完全自定义
<Label
  title="完全自定义"
  indicatorColor="#722ed1"
  indicatorWidth={4}
  indicatorHeight={12}
  paddingRight={24}
/>`}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* 在其他项目中引用示例 */}
          <div id="label-reference">
            <div>
              <h2>在其他项目中引用</h2>
              <div style={{ margin: '15px 0' }}>
                <h3>1. 安装</h3>
                <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
                  {`npm i @zjpcy/simple-design`}
                </SyntaxHighlighter>
              </div>
              <div>
                <h3>2. 引用组件</h3>
                <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`// 方式一：单独引入
import Label from '@zjpcy/simple-design/lib/Label';
import '@zjpcy/simple-design/lib/Label/Label.css';

// 方式二：批量引入
import { Label } from '@zjpcy/simple-design';
import '@zjpcy/simple-design/lib/index.css';`}
                </SyntaxHighlighter>
              </div>
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
                <Anchor.Link href="#label-intro" title="组件介绍" />
                <Anchor.Link href="#label-basic" title="基本使用" />
                <Anchor.Link href="#label-api" title="API 参数" />
                <Anchor.Link href="#label-code" title="代码示例" />
                <Anchor.Link href="#label-reference" title="引用示例" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelExample;

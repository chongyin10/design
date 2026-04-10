import React, { useState, useEffect } from 'react';
import { Card, Button, Icon, Flex, Anchor, Table } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CardExample: React.FC = () => {
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);

    // 模拟加载完成
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // API参数列配置
  const apiColumns: Column[] = [
    { dataIndex: 'param', title: '参数名', width: '150px' },
    { dataIndex: 'type', title: '类型', width: '300px' },
    { dataIndex: 'default', title: '默认值', width: '150px' },
    { dataIndex: 'description', title: '描述', width: '300px' }
  ];

  // Card API参数数据源
  const cardApiDataSource = [
    { param: 'title', type: 'ReactNode', default: '-', description: '卡片标题' },
    { param: 'extra', type: 'ReactNode', default: '-', description: '标题右侧额外内容' },
    { param: 'children', type: 'ReactNode', default: '-', description: '卡片内容' },
    { param: 'footer', type: 'ReactNode', default: '-', description: '底部内容' },
    { param: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: '卡片尺寸' },
    { param: 'bordered', type: 'boolean', default: 'true', description: '是否显示边框' },
    { param: 'hoverable', type: 'boolean', default: 'false', description: '悬停效果' },
    { param: 'loading', type: 'boolean', default: 'false', description: '加载状态' },
    { param: 'cover', type: 'ReactNode', default: '-', description: '封面图片' },
    { param: 'className', type: 'string', default: '-', description: '自定义类名' },
    { param: 'style', type: 'React.CSSProperties', default: '-', description: '自定义样式' },
    { param: 'headerStyle', type: 'React.CSSProperties', default: '-', description: '头部样式' },
    { param: 'bodyStyle', type: 'React.CSSProperties', default: '-', description: '内容区域样式' },
    { param: 'footerStyle', type: 'React.CSSProperties', default: '-', description: '底部样式' },
    { param: 'onClick', type: '() => void', default: '-', description: '点击卡片的事件' }
  ];

  // Card.Meta API参数数据源
  const metaApiDataSource = [
    { param: 'avatar', type: 'ReactNode', default: '-', description: '头像/图标' },
    { param: 'title', type: 'ReactNode', default: '-', description: '标题' },
    { param: 'description', type: 'ReactNode', default: '-', description: '描述' },
    { param: 'className', type: 'string', default: '-', description: '自定义类名' },
    { param: 'style', type: 'React.CSSProperties', default: '-', description: '自定义样式' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="card-intro">Card 卡片</h1>
          <p>通用卡片容器，支持头部、内容区和底部，采用黄金分割比例设计。</p>

          {/* 基本使用示例 */}
          <div id="card-basic" style={{ marginBottom: '40px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '16px', color: '#333' }}>基本使用</h2>
            <p>展示卡片组件的基本使用方式。</p>
            
            <div style={{ marginBottom: '20px' }}>
              <h4>默认卡片</h4>
              <Card title="默认卡片" style={{ width: 300 }}>
                <p>这是卡片的内容区域</p>
                <p>可以放置任意内容</p>
              </Card>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4>带底部</h4>
              <Card
                title="带底部的卡片"
                style={{ width: 300 }}
                footer={
                  <Flex justify="space-between" align="center">
                    <Button variant="secondary" size="small">取消</Button>
                    <Button variant="primary" size="small">确认</Button>
                  </Flex>
                }
              >
                <p>卡片内容区域</p>
              </Card>
            </div>

            <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
{`import { Card, Button, Flex } from '@zjpcy/simple-design';

// 默认卡片
<Card title="默认卡片" style={{ width: 300 }}>
  <p>这是卡片的内容区域</p>
</Card>

// 带底部的卡片
<Card
  title="带底部的卡片"
  style={{ width: 300 }}
  footer={
    <Flex justify="space-between" align="center">
      <Button variant="secondary" size="small">取消</Button>
      <Button variant="primary" size="small">确认</Button>
    </Flex>
  }
>
  <p>卡片内容区域</p>
</Card>`}
            </SyntaxHighlighter>
          </div>

          {/* 尺寸变体 */}
          <div id="card-size" style={{ marginBottom: '40px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '16px', color: '#333' }}>尺寸变体</h2>
            <p>支持小、中、大三种尺寸，满足不同场景需求。</p>
            
            <Flex gap="large" align="flex-start">
              <Card title="小尺寸" size="small" style={{ width: 200 }}>
                <p>小尺寸卡片</p>
              </Card>
              <Card title="默认尺寸" size="default" style={{ width: 200 }}>
                <p>默认尺寸卡片</p>
              </Card>
              <Card title="大尺寸" size="large" style={{ width: 200 }}>
                <p>大尺寸卡片</p>
              </Card>
            </Flex>

            <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
{`<Card title="小尺寸" size="small" style={{ width: 200 }}>
  <p>小尺寸卡片</p>
</Card>
<Card title="默认尺寸" size="default" style={{ width: 200 }}>
  <p>默认尺寸卡片</p>
</Card>
<Card title="大尺寸" size="large" style={{ width: 200 }}>
  <p>大尺寸卡片</p>
</Card>`}
            </SyntaxHighlighter>
          </div>

          {/* 封面卡片 */}
          <div id="card-cover" style={{ marginBottom: '40px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '16px', color: '#333' }}>封面卡片</h2>
            <p>可以设置封面图片的卡片。</p>
            
            <Card
              style={{ width: 300 }}
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
            >
              <Card.Meta
                avatar={<Icon type="user" size={32} color="#1890ff" />}
                title="卡片标题"
                description="这是卡片的描述信息"
              />
            </Card>

            <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
{`<Card
  style={{ width: 300 }}
  cover={
    <img
      alt="example"
      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
    />
  }
>
  <Card.Meta
    avatar={<Icon type="user" size={32} color="#1890ff" />}
    title="卡片标题"
    description="这是卡片的描述信息"
  />
</Card>`}
            </SyntaxHighlighter>
          </div>

          {/* 加载状态 */}
          <div id="card-loading" style={{ marginBottom: '40px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '16px', color: '#333' }}>加载状态</h2>
            <p>显示卡片内容的加载状态。</p>
            
            <Flex gap="large" align="flex-start">
              <Card title="加载中" loading style={{ width: 300 }}>
                <p>这是实际内容</p>
              </Card>
              <Card
                title="正常状态"
                style={{ width: 300 }}
                extra={<Button size="small" onClick={() => setLoading(!loading)}>切换</Button>}
              >
                <p>点击按钮切换加载状态</p>
              </Card>
            </Flex>

            <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
{`<Card title="加载中" loading style={{ width: 300 }}>
  <p>这是实际内容</p>
</Card>`}
            </SyntaxHighlighter>
          </div>

          {/* 悬停效果 */}
          <div id="card-hoverable" style={{ marginBottom: '40px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '16px', color: '#333' }}>悬停效果</h2>
            <p>鼠标悬停时的阴影效果。</p>
            
            <Flex gap="large" align="flex-start">
              <Card title="无悬停效果" style={{ width: 200 }}>
                <p>普通卡片</p>
              </Card>
              <Card title="悬停效果" hoverable style={{ width: 200 }}>
                <p>鼠标移上来试试</p>
              </Card>
            </Flex>

            <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
{`<Card title="悬停效果" hoverable style={{ width: 200 }}>
  <p>鼠标移上来试试</p>
</Card>`}
            </SyntaxHighlighter>
          </div>

          {/* 无边框 */}
          <div id="card-no-border" style={{ marginBottom: '40px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '16px', color: '#333' }}>无边框</h2>
            <p>去掉边框的卡片样式。</p>
            
            <div style={{ background: '#f5f5f5', padding: '24px', borderRadius: '8px' }}>
              <Card title="无边框卡片" bordered={false} style={{ width: 300 }}>
                <p>在灰色背景上无边框卡片更合适</p>
              </Card>
            </div>

            <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
{`<Card title="无边框卡片" bordered={false} style={{ width: 300 }}>
  <p>在灰色背景上无边框卡片更合适</p>
</Card>`}
            </SyntaxHighlighter>
          </div>

          {/* 复杂示例 */}
          <div id="card-complex" style={{ marginBottom: '40px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '16px', color: '#333' }}>复杂示例</h2>
            <p>组合使用各种功能的完整示例。</p>
            
            <Card
              title="用户信息卡片"
              style={{ width: 400 }}
              extra={<Button variant="link">更多</Button>}
              hoverable
              footer={
                <Flex justify="space-around">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>128</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>文章</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>256</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>关注</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#faad14' }}>1.2k</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>粉丝</div>
                  </div>
                </Flex>
              }
            >
              <Flex align="center" gap="middle">
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#fff'
                }}>
                  U
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 500 }}>用户名</div>
                  <div style={{ fontSize: '14px', color: '#999', marginTop: '4px' }}>前端工程师 | 杭州</div>
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                    热爱编程，专注于前端技术栈，喜欢分享技术文章。
                  </div>
                </div>
              </Flex>
            </Card>

            <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
{`<Card
  title="用户信息卡片"
  style={{ width: 400 }}
  extra={<Button variant="link">更多</Button>}
  hoverable
  footer={
    <Flex justify="space-around">
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>128</div>
        <div style={{ fontSize: '12px', color: '#999' }}>文章</div>
      </div>
      {/* ... */}
    </Flex>
  }
>
  <Flex align="center" gap="middle">
    {/* 用户头像 */}
    {/* 用户信息 */}
  </Flex>
</Card>`}
            </SyntaxHighlighter>
          </div>

          {/* API 文档 */}
          <div id="card-api" style={{ marginBottom: '40px', marginTop: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
            <h3>Card API</h3>
            <Table pagination={false} columns={apiColumns} dataSource={cardApiDataSource} />
          </div>

          <div id="card-meta-api" style={{ marginBottom: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
            <h3>Card.Meta API</h3>
            <Table pagination={false} columns={apiColumns} dataSource={metaApiDataSource} />
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
                <Anchor.Link href="#card-intro" title="组件介绍" />
                <Anchor.Link href="#card-basic" title="基本使用" />
                <Anchor.Link href="#card-size" title="尺寸变体" />
                <Anchor.Link href="#card-cover" title="封面卡片" />
                <Anchor.Link href="#card-loading" title="加载状态" />
                <Anchor.Link href="#card-hoverable" title="悬停效果" />
                <Anchor.Link href="#card-no-border" title="无边框" />
                <Anchor.Link href="#card-complex" title="复杂示例" />
                <Anchor.Link href="#card-api" title="API 文档" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardExample;

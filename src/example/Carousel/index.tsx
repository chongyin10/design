import React, { useState, useEffect } from 'react';
import { Flex, Table, Anchor } from '../../components';
import Carousel from '../../components/Carousel';
import { CarouselItem } from '../../components/Carousel/types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 示例图片数据
const bannerItems: CarouselItem[] = [
  {
    key: '1',
    image: 'https://picsum.photos/800/400?random=1',
    title: '探索未来科技',
    description: '了解最新的技术趋势和创新',
    link: 'https://example.com/1',
  },
  {
    key: '2',
    image: 'https://picsum.photos/800/400?random=2',
    title: '自然之美',
    description: '感受大自然的壮丽景色',
    link: 'https://example.com/2',
  },
  {
    key: '3',
    image: 'https://picsum.photos/800/400?random=3',
    title: '城市生活',
    description: '发现城市中的精彩瞬间',
    link: 'https://example.com/3',
  },
  {
    key: '4',
    image: 'https://picsum.photos/800/400?random=4',
    title: '艺术创作',
    description: '欣赏独特的艺术视角',
  },
  {
    key: '5',
    image: 'https://picsum.photos/800/400?random=5',
    title: '美食之旅',
    description: '品味世界各地的美食',
  },
];

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

const CarouselExample: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
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
          <h1 id="carousel-intro">Carousel 轮播图</h1>
          <p>用于展示图片、卡片等内容的轮播组件。</p>

          {/* 基础用法 */}
          <div id="carousel-basic">
            <Section title="基础用法">
        <div style={{ maxWidth: 800, margin: '10px auto' }}>
          <Carousel
            items={bannerItems}
            style={{ height: 400 }}
          />
        </div>
        <CopyBlock code={`import { Carousel } from '@zjpcy/simple-design';

const items = [
  { key: '1', image: 'https://example.com/1.jpg', title: '标题1', description: '描述1' },
  { key: '2', image: 'https://example.com/2.jpg', title: '标题2', description: '描述2' },
];

<Carousel items={items} style={{ height: 400 }} />`} />
            </Section>
          </div>

          {/* 受控模式 */}
          <div id="carousel-controlled">
            <Section title="受控模式">
        <div style={{ maxWidth: 800, margin: '10px auto' }}>
          <Carousel
            items={bannerItems}
            currentIndex={currentIndex}
            onChange={setCurrentIndex}
            style={{ height: 400 }}
          />
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <span>当前: {currentIndex + 1} / {bannerItems.length}</span>
          </div>
        </div>
        <CopyBlock code={`import { Carousel } from '@zjpcy/simple-design';

const [currentIndex, setCurrentIndex] = useState(0);

<Carousel
  items={items}
  currentIndex={currentIndex}
  onChange={setCurrentIndex}
  style={{ height: 400 }}
/>`} />
            </Section>
          </div>

          {/* 淡入淡出效果 */}
          <div id="carousel-fade">
            <Section title="淡入淡出效果">
        <div style={{ maxWidth: 800, margin: '10px auto' }}>
          <Carousel
            items={bannerItems}
            effect="fade"
            style={{ height: 400 }}
          />
        </div>
        <CopyBlock code={`import { Carousel } from '@zjpcy/simple-design';

<Carousel items={items} effect="fade" style={{ height: 400 }} />`} />
            </Section>
          </div>

          {/* 垂直方向 */}
          <div id="carousel-vertical">
            <Section title="垂直方向">
        <div style={{ maxWidth: 800, margin: '10px auto' }}>
          <Carousel
            items={bannerItems}
            direction="vertical"
            style={{ height: 400 }}
          />
        </div>
        <CopyBlock code={`import { Carousel } from '@zjpcy/simple-design';

<Carousel items={items} direction="vertical" style={{ height: 400 }} />`} />
            </Section>
          </div>

          {/* 3D 效果展示 */}
          <div id="carousel-3d">
            <Section title="3D 切换效果">
        <DemoRow title="Flip 翻转">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <Carousel items={bannerItems} effect="flip" style={{ height: 300 }} autoplay={false} />
          </div>
        </DemoRow>
        <DemoRow title="Cards 卡片">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <Carousel items={bannerItems} effect="cards" style={{ height: 300 }} autoplay={false} />
          </div>
        </DemoRow>
        <DemoRow title="Coverflow 覆盖流">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <Carousel items={bannerItems} effect="coverflow" style={{ height: 300 }} autoplay={false} />
          </div>
        </DemoRow>
        <CopyBlock code={`import { Carousel } from '@zjpcy/simple-design';

// 3D 效果：flip | cards | coverflow
<Carousel items={items} effect="flip" style={{ height: 400 }} />`} />
            </Section>
          </div>

          {/* 创意效果展示 */}
          <div id="carousel-creative">
            <Section title="创意切换效果">
        <DemoRow title="Creative 创意">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <Carousel items={bannerItems} effect="creative" style={{ height: 300 }} autoplay={false} />
          </div>
        </DemoRow>
        <DemoRow title="Parallax 视差">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <Carousel items={bannerItems} effect="parallax" style={{ height: 300 }} autoplay={false} />
          </div>
        </DemoRow>
        <DemoRow title="Zoom 缩放">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <Carousel items={bannerItems} effect="zoom" style={{ height: 300 }} autoplay={false} />
          </div>
        </DemoRow>
        <DemoRow title="Book 翻书">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <Carousel items={bannerItems} effect="book" style={{ height: 300 }} autoplay={false} />
          </div>
        </DemoRow>
        <DemoRow title="Curtain 幕布">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <Carousel items={bannerItems} effect="curtain" style={{ height: 300 }} autoplay={false} />
          </div>
        </DemoRow>
        <DemoRow title="Mosaic 马赛克">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <Carousel items={bannerItems} effect="mosaic" style={{ height: 300 }} autoplay={false} />
          </div>
        </DemoRow>
        <DemoRow title="Rain 雨滴">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <Carousel items={bannerItems} effect="rain" style={{ height: 300 }} autoplay={false} />
          </div>
        </DemoRow>
        <CopyBlock code={`import { Carousel } from '@zjpcy/simple-design';

// 创意效果：creative | parallax | zoom | book | curtain | mosaic | rain
<Carousel items={items} effect="creative" style={{ height: 400 }} />`} />
            </Section>
          </div>

          {/* 指示器位置 */}
          <div id="carousel-indicator-position">
            <Section title="指示器位置">
        <DemoRow title="左侧">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <Carousel
              items={bannerItems}
              indicatorPosition="left"
              style={{ height: 300 }}
            />
          </div>
        </DemoRow>
        <DemoRow title="右侧">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <Carousel
              items={bannerItems}
              indicatorPosition="right"
              style={{ height: 300 }}
            />
          </div>
        </DemoRow>
        <DemoRow title="顶部">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <Carousel
              items={bannerItems}
              indicatorPosition="top"
              style={{ height: 300 }}
            />
          </div>
        </DemoRow>
        <DemoRow title="底部(默认)">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <Carousel
              items={bannerItems}
              indicatorPosition="bottom"
              style={{ height: 300 }}
            />
          </div>
        </DemoRow>
        <CopyBlock code={`import { Carousel } from '@zjpcy/simple-design';

// 指示器位置：left | right | top | bottom
<Carousel items={items} indicatorPosition="left" style={{ height: 400 }} />`} />
            </Section>
          </div>

          {/* 指示器进度动画 */}
          <div id="carousel-indicator-progress">
            <Section title="指示器进度动画">
        <DemoRow title="启用进度">
          <div style={{ maxWidth: 800, width: '100%' }}>
            <Carousel
              items={bannerItems}
              indicatorProgress
              style={{ height: 300 }}
            />
          </div>
        </DemoRow>
        <CopyBlock code={`import { Carousel } from '@zjpcy/simple-design';

// 启用指示器进度动画（需要同时启用 autoplay）
<Carousel items={items} indicatorProgress style={{ height: 400 }} />`} />
            </Section>
          </div>

          {/* 自定义渲染 */}
          <div id="carousel-custom-render">
            <Section title="自定义渲染">
        <div style={{ maxWidth: 800, margin: '10px auto' }}>
          <Carousel
            items={[
              {
                key: 'custom1',
                image: '',
                render: () => (
                  <div
                    style={{
                      height: 400,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 24,
                    }}
                  >
                    自定义内容 1
                  </div>
                ),
              },
              {
                key: 'custom2',
                image: '',
                render: () => (
                  <div
                    style={{
                      height: 400,
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 24,
                    }}
                  >
                    自定义内容 2
                  </div>
                ),
              },
            ]}
            style={{ height: 400 }}
          />
        </div>
        <CopyBlock code={`import { Carousel } from '@zjpcy/simple-design';

const customItems = [
  {
    key: 'custom1',
    image: '',
    render: () => (
      <div style={{ height: 400, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        自定义内容 1
      </div>
    ),
  },
  {
    key: 'custom2',
    image: '',
    render: () => (
      <div style={{ height: 400, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
        自定义内容 2
      </div>
    ),
  },
];

<Carousel items={customItems} style={{ height: 400 }} />`} />
            </Section>
          </div>

          {/* 仅图片 */}
          <div id="carousel-image-only">
            <Section title="仅图片">
        <div style={{ maxWidth: 800, margin: '10px auto' }}>
          <Carousel
            items={bannerItems.map(item => ({
              key: item.key,
              image: item.image,
            }))}
            style={{ height: 400 }}
          />
        </div>
        <CopyBlock code={`import { Carousel } from '@zjpcy/simple-design';

// 仅显示图片，不显示标题和描述
const imageOnlyItems = items.map(item => ({
  key: item.key,
  image: item.image,
}));

<Carousel items={imageOnlyItems} style={{ height: 400 }} />`} />
            </Section>
          </div>

          {/* 单张图片 */}
          <div id="carousel-single">
            <Section title="单张图片">
        <div style={{ maxWidth: 800, margin: '10px auto' }}>
          <Carousel
            items={[bannerItems[0]]}
            style={{ height: 400 }}
          />
        </div>
        <CopyBlock code={`import { Carousel } from '@zjpcy/simple-design';

// 单张图片时不显示控制按钮
<Carousel items={[singleItem]} style={{ height: 400 }} />`} />
            </Section>
          </div>

          {/* API 文档 */}
          <div id="carousel-props">
            <Section title="Carousel Props">
        <Table
          bordered
          dataSource={[
            { key: 'items', prop: 'items', description: '轮播数据数组', type: 'CarouselItem[]', default: '-' },
            { key: 'currentIndex', prop: 'currentIndex', description: '当前激活的索引（受控）', type: 'number', default: '-' },
            { key: 'defaultCurrentIndex', prop: 'defaultCurrentIndex', description: '默认激活的索引', type: 'number', default: '0' },
            { key: 'onChange', prop: 'onChange', description: '切换时的回调', type: '(index: number) => void', default: '-' },
            { key: 'autoplay', prop: 'autoplay', description: '是否自动播放', type: 'boolean', default: 'true' },
            { key: 'interval', prop: 'interval', description: '自动播放间隔(ms)', type: 'number', default: '3000' },
            { key: 'effect', prop: 'effect', description: '切换动画效果', type: "'slide' | 'fade' | 'cube' | 'flip' | 'cards' | 'creative' | 'coverflow' | 'parallax' | 'zoom' | 'book' | 'curtain' | 'mosaic' | 'rain'", default: "'slide'" },
            { key: 'direction', prop: 'direction', description: '切换方向', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
            { key: 'showIndicators', prop: 'showIndicators', description: '是否显示指示器', type: 'boolean', default: 'true' },
            { key: 'indicatorPosition', prop: 'indicatorPosition', description: '指示器位置', type: "'bottom' | 'top' | 'left' | 'right'", default: "'bottom'" },
            { key: 'showArrows', prop: 'showArrows', description: '是否显示箭头', type: 'boolean', default: 'true' },
            { key: 'loop', prop: 'loop', description: '是否循环播放', type: 'boolean', default: 'true' },
            { key: 'pauseOnHover', prop: 'pauseOnHover', description: '是否在hover时暂停', type: 'boolean', default: 'true' },
            { key: 'duration', prop: 'duration', description: '切换动画时长(ms)', type: 'number', default: '500' },
            { key: 'className', prop: 'className', description: '自定义类名', type: 'string', default: '-' },
            { key: 'style', prop: 'style', description: '自定义样式', type: 'CSSProperties', default: '-' },
            { key: 'contentClassName', prop: 'contentClassName', description: '内容区域类名', type: 'string', default: '-' },
            { key: 'contentStyle', prop: 'contentStyle', description: '内容区域样式', type: 'CSSProperties', default: '-' },
            { key: 'onItemClick', prop: 'onItemClick', description: '图片点击事件', type: '(item: CarouselItem, index: number) => void', default: '-' },
            { key: 'prevIcon', prop: 'prevIcon', description: '自定义左箭头图标', type: 'ReactNode', default: '-' },
            { key: 'nextIcon', prop: 'nextIcon', description: '自定义右箭头图标', type: 'ReactNode', default: '-' },
            { key: 'upIcon', prop: 'upIcon', description: '自定义上箭头图标（垂直方向）', type: 'ReactNode', default: '-' },
            { key: 'downIcon', prop: 'downIcon', description: '自定义下箭头图标（垂直方向）', type: 'ReactNode', default: '-' },
            { key: 'indicatorProgress', prop: 'indicatorProgress', description: '是否启用指示器进度动画', type: 'boolean', default: 'false' },
          ]}
          columns={[
            { title: '属性', dataIndex: 'prop', width: 150 },
            { title: '说明', dataIndex: 'description' },
            { title: '类型', dataIndex: 'type', width: 250 },
            { title: '默认值', dataIndex: 'default', width: 100 },
          ]}
          pagination={false}
        />
            </Section>
          </div>

          <div id="carousel-item-type">
            <Section title="CarouselItem 数据结构">
        <Table
          bordered
          dataSource={[
            { key: 'key', prop: 'key', description: '唯一标识（必填）', type: 'string', default: '-' },
            { key: 'image', prop: 'image', description: '图片地址（必填）', type: 'string', default: '-' },
            { key: 'title', prop: 'title', description: '标题', type: 'ReactNode', default: '-' },
            { key: 'description', prop: 'description', description: '描述', type: 'ReactNode', default: '-' },
            { key: 'link', prop: 'link', description: '点击跳转链接', type: 'string', default: '-' },
            { key: 'render', prop: 'render', description: '自定义渲染内容', type: '() => ReactNode', default: '-' },
          ]}
          columns={[
            { title: '属性', dataIndex: 'prop', width: 150 },
            { title: '说明', dataIndex: 'description' },
            { title: '类型', dataIndex: 'type', width: 250 },
            { title: '默认值', dataIndex: 'default', width: 100 },
          ]}
          pagination={false}
        />
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
                <Anchor.Link href="#carousel-intro" title="组件介绍" />
                <Anchor.Link href="#carousel-basic" title="基础用法" />
                <Anchor.Link href="#carousel-controlled" title="受控模式" />
                <Anchor.Link href="#carousel-fade" title="淡入淡出" />
                <Anchor.Link href="#carousel-vertical" title="垂直方向" />
                <Anchor.Link href="#carousel-3d" title="3D切换效果" />
                <Anchor.Link href="#carousel-creative" title="创意切换效果" />
                <Anchor.Link href="#carousel-indicator-position" title="指示器位置" />
                <Anchor.Link href="#carousel-indicator-progress" title="指示器进度" />
                <Anchor.Link href="#carousel-custom-render" title="自定义渲染" />
                <Anchor.Link href="#carousel-image-only" title="仅图片" />
                <Anchor.Link href="#carousel-single" title="单张图片" />
                <Anchor.Link href="#carousel-props" title="Carousel Props" />
                <Anchor.Link href="#carousel-item-type" title="CarouselItem" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselExample;

import React, { useState, useEffect } from 'react';
import { Input, Flex, Anchor } from '../../components';

const TextareaResizeExample: React.FC = () => {
  const [size, setSize] = useState({ width: 400, height: 100 });
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
          <h1 id="textarea-intro">Textarea 拖拽调整大小示例</h1>
          <p>通过拖拽右下角的手柄，可以同时调整 Textarea 的宽度和高度。</p>

          <div id="textarea-basic" style={{ marginBottom: '32px' }}>
            <h2>基础拖拽</h2>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px', padding: '24px', marginBottom: '16px' }}>
              <Input.Textarea
                placeholder="拖拽右下角可调整大小"
                resizable
                width="400px"
                minHeight={80}
                maxHeight={300}
                minWidth={200}
                maxWidth={600}
              />
            </div>
            <p style={{ color: '#909399', fontSize: '14px' }}>
              💡 鼠标悬停在 Textarea 上，右下角会出现拖拽手柄，按住并拖动即可调整大小。
            </p>
          </div>

          <div id="textarea-resize" style={{ marginBottom: '32px' }}>
            <h2>实时显示尺寸</h2>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px', padding: '24px', marginBottom: '16px' }}>
              <Input.Textarea
                placeholder="拖拽我，查看实时尺寸"
                resizable
                width={size.width}
                onResize={(newSize) => setSize({
                  width: newSize.width || size.width,
                  height: newSize.height || size.height
                })}
                minHeight={80}
                maxHeight={400}
                minWidth={200}
                maxWidth={600}
              />
              <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <Flex gap="small" style={{ fontSize: '14px', color: '#333' }}>
                  <span>📐 宽度: {size.width}px</span>
                  <span>📏 高度: {size.height}px</span>
                </Flex>
              </div>
            </div>
            <p style={{ color: '#909399', fontSize: '14px' }}>
              💡 通过 onResize 回调可以实时获取 Textarea 的当前尺寸。
            </p>
          </div>

          <div id="textarea-height" style={{ marginBottom: '32px' }}>
            <h2>上下拖拽调整高度</h2>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px', padding: '24px', marginBottom: '16px' }}>
              <Input.Textarea
                placeholder="向下拖拽可增加高度"
                resizable
                width="400px"
                minHeight={100}
                maxHeight={500}
                onResize={(newSize) => console.log('新尺寸:', newSize)}
              />
              <p style={{ marginTop: '8px', fontSize: '12px', color: '#909399' }}>
                当前操作：向下拖拽手柄，高度会随之增加（最小100px，最大500px）
              </p>
            </div>
          </div>

          <div id="textarea-width" style={{ marginBottom: '32px' }}>
            <h2>左右拖拽调整宽度</h2>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px', padding: '24px', marginBottom: '16px' }}>
              <Input.Textarea
                placeholder="向右拖拽可增加宽度"
                resizable
                width="300px"
                height="120px"
                minWidth={200}
                maxWidth={700}
                onResize={(newSize) => console.log('新尺寸:', newSize)}
              />
              <p style={{ marginTop: '8px', fontSize: '12px', color: '#909399' }}>
                当前操作：向右拖拽手柄，宽度会随之增加（最小200px，最大700px）
              </p>
            </div>
          </div>

          <div id="textarea-both" style={{ marginBottom: '32px' }}>
            <h2>同时调整宽度和高度</h2>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px', padding: '24px', marginBottom: '16px' }}>
              <Input.Textarea
                placeholder="向右下角拖拽可同时增加宽度和高度"
                resizable
                width="350px"
                minHeight={100}
                maxHeight={400}
                minWidth={250}
                maxWidth={650}
              />
              <p style={{ marginTop: '8px', fontSize: '12px', color: '#909399' }}>
                当前操作：沿对角线拖拽手柄，宽度和高度会同时变化
              </p>
            </div>
          </div>

          <div id="textarea-scenario" style={{ marginBottom: '32px' }}>
            <h2>使用场景示例</h2>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>📝 文章编辑器</h3>
              <Input.Textarea
                placeholder="在此输入文章内容，可自由调整编辑器大小..."
                resizable
                width="600px"
                minHeight={200}
                maxHeight={600}
                minWidth={400}
                maxWidth={800}
              />
              <p style={{ marginTop: '8px', fontSize: '12px', color: '#909399' }}>
                适用场景：需要根据内容长度动态调整输入框大小
              </p>
            </div>
          </div>

          <div id="textarea-code">
            <h2>代码示例</h2>
            <div style={{ backgroundColor: '#1e1e1e', borderRadius: '4px', padding: '16px', overflow: 'auto' }}>
              <pre style={{ margin: 0, color: '#d4d4d4', fontSize: '14px', fontFamily: 'Consolas, Monaco, monospace' }}>
{`import { Input } from '@zjpcy/simple-design';
import { useState } from 'react';

const Demo = () => {
  const [size, setSize] = useState({ width: 400, height: 100 });

  return (
    <>
      {/* 基础拖拽 */}
      <Input.Textarea
        placeholder="拖拽右下角可调整大小"
        resizable
        width="400px"
        minHeight={80}
        maxHeight={300}
        minWidth={200}
        maxWidth={600}
      />

      {/* 监听尺寸变化 */}
      <Input.Textarea
        placeholder="拖拽查看实时尺寸"
        resizable
        width={size.width}
        onResize={(newSize) => setSize({
          width: newSize.width || size.width,
          height: newSize.height || size.height
        })}
        minHeight={80}
        maxHeight={400}
        minWidth={200}
        maxWidth={600}
      />
      <div>
        宽度: {size.width}px × 高度: {size.height}px
      </div>
    </>
  );
};`}
              </pre>
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
                <Anchor.Link href="#textarea-intro" title="组件介绍" />
                <Anchor.Link href="#textarea-basic" title="基础拖拽" />
                <Anchor.Link href="#textarea-resize" title="实时显示尺寸" />
                <Anchor.Link href="#textarea-height" title="调整高度" />
                <Anchor.Link href="#textarea-width" title="调整宽度" />
                <Anchor.Link href="#textarea-both" title="同时调整" />
                <Anchor.Link href="#textarea-scenario" title="使用场景" />
                <Anchor.Link href="#textarea-code" title="代码示例" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextareaResizeExample;

import React, { useState } from 'react';
import { Input } from '../../components';

const TestTextareaResize: React.FC = () => {
  const [size, setSize] = useState({ width: 400, height: 100 });
  const [log, setLog] = useState<string[]>([]);

  const handleResize = (newSize: { width?: number; height?: number }) => {
    const width = newSize.width || size.width;
    const height = newSize.height || size.height;
    
    setSize({ width, height });
    setLog(prev => [
      ...prev,
      `宽度: ${Math.round(width)}px, 高度: ${Math.round(height)}px`
    ]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Textarea 拖拽测试</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>1. 基础拖拽测试</h3>
        <div style={{ border: '1px solid #d9d9d9', padding: '20px', marginBottom: '10px' }}>
          <Input.Textarea
            placeholder="拖拽右下角测试"
            resizable
            width={400}
            height={100}
            minWidth={200}
            maxWidth={800}
            minHeight={80}
            maxHeight={400}
          />
        </div>
        <p style={{ color: '#666', fontSize: '14px' }}>
          说明：鼠标悬停在 Textarea 上，右下角会出现拖拽手柄，按住并拖动测试
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>2. 带尺寸监听的拖拽测试</h3>
        <div style={{ border: '1px solid #d9d9d9', padding: '20px', marginBottom: '10px' }}>
          <Input.Textarea
            placeholder="拖拽我，查看右侧日志"
            resizable
            width={size.width}
            height={size.height}
            minWidth={200}
            maxWidth={600}
            minHeight={80}
            maxHeight={400}
            onResize={handleResize}
          />
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>当前尺寸：</div>
            <div>宽度: {Math.round(size.width)}px</div>
            <div>高度: {Math.round(size.height)}px</div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>3. 拖拽日志（最近10条）</h3>
        <div style={{ 
          border: '1px solid #d9d9d9', 
          padding: '10px', 
          backgroundColor: '#f9f9f9',
          maxHeight: '200px',
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          {log.length === 0 ? (
            <div style={{ color: '#999' }}>暂无拖拽记录</div>
          ) : (
            log.slice(-10).reverse().map((record, index) => (
              <div key={index} style={{ marginBottom: '2px' }}>
                {record}
              </div>
            ))
          )}
        </div>
        {log.length > 0 && (
          <button 
            onClick={() => setLog([])}
            style={{ 
              marginTop: '10px', 
              padding: '5px 10px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            清空日志
          </button>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>4. 仅调整高度测试</h3>
        <div style={{ border: '1px solid #d9d9d9', padding: '20px', marginBottom: '10px' }}>
          <Input.Textarea
            placeholder="尝试向下拖拽增加高度"
            resizable
            width={400}
            height={100}
            minHeight={100}
            maxHeight={500}
            onResize={(size) => console.log('仅高度测试:', size)}
          />
        </div>
        <p style={{ color: '#666', fontSize: '14px' }}>
          说明：尝试向下拖拽，观察高度是否变化
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>5. 仅调整宽度测试</h3>
        <div style={{ border: '1px solid #d9d9d9', padding: '20px', marginBottom: '10px' }}>
          <Input.Textarea
            placeholder="尝试向右拖拽增加宽度"
            resizable
            width={400}
            height={100}
            minWidth={300}
            maxWidth={700}
            onResize={(size) => console.log('仅宽度测试:', size)}
          />
        </div>
        <p style={{ color: '#666', fontSize: '14px' }}>
          说明：尝试向右拖拽，观察宽度是否变化
        </p>
      </div>

      <div>
        <h3>6. 边界测试</h3>
        <div style={{ border: '1px solid #d9d9d9', padding: '20px' }}>
          <Input.Textarea
            placeholder="测试最小/最大尺寸限制"
            resizable
            width={300}
            height={100}
            minWidth={200}
            maxWidth={400}
            minHeight={80}
            maxHeight={200}
            onResize={(size) => console.log('边界测试:', size)}
          />
        </div>
        <p style={{ color: '#666', fontSize: '14px' }}>
          说明：这个 Textarea 有严格的尺寸限制，测试是否能正确限制在范围内
        </p>
      </div>
    </div>
  );
};

export default TestTextareaResize;

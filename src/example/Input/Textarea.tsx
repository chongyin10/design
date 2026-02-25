import React, { useState } from 'react';
import { Flex, Table, Textarea } from '../../components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

const TextareaExample: React.FC = () => {
  const [basicValue, setBasicValue] = useState('');
  const [countValue, setCountValue] = useState('');
  const [clearValue, setClearValue] = useState('');
  const [labelValue, setLabelValue] = useState('');
  const [disabledValue, setDisabledValue] = useState('');
  const [readonlyValue, setReadonlyValue] = useState('只读内容');
  const [resizeValue, setResizeValue] = useState('');
  const [maxLengthValue, setMaxLengthValue] = useState('');
  const [currentSize, setCurrentSize] = useState<{ width?: number; height?: number }>({});

  return (
    <div style={{ padding: '20px' }}>
      <h1>Textarea 多行文本框</h1>
      <p>用于输入多行文本的表单组件，支持字符计数、清空、拖拽调整大小等功能。</p>

      {/* 基础用法 */}
      <Section title="基础用法">
        <p>最简单的文本框用法，支持受控模式。</p>
        <DemoRow title="基础文本框">
          <Textarea
            placeholder="请输入内容"
            value={basicValue}
            onChange={(e) => setBasicValue(e.target.value)}
            style={{ width: '300px' }}
          />
        </DemoRow>
        <p>当前值: {basicValue}</p>
        <CopyBlock code={`import { Textarea } from '@zjpcy/simple-design';
import { useState } from 'react';

const Demo = () => {
  const [value, setValue] = useState('');
  
  return (
    <Textarea
      placeholder="请输入内容"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      style={{ width: '300px' }}
    />
  );
};`} />
      </Section>

      {/* 字符计数 */}
      <Section title="字符计数">
        <p>显示已输入字符数和最大长度限制。</p>
        <DemoRow title="显示计数">
          <Textarea
            placeholder="请输入内容"
            value={countValue}
            onChange={(e) => setCountValue(e.target.value)}
            maxLength={100}
            showCount
            style={{ width: '300px' }}
          />
        </DemoRow>
        <CopyBlock code={`import { Textarea } from '@zjpcy/simple-design';

<Textarea
  placeholder="请输入内容"
  maxLength={100}
  showCount
  style={{ width: '300px' }}
/>`} />
      </Section>

      {/* 可清空 */}
      <Section title="可清空">
        <p>当输入框有内容时显示清空按钮。</p>
        <DemoRow title="可清空">
          <Textarea
            placeholder="请输入内容"
            value={clearValue}
            onChange={(e) => setClearValue(e.target.value)}
            clear
            style={{ width: '300px' }}
          />
        </DemoRow>
        <CopyBlock code={`import { Textarea } from '@zjpcy/simple-design';

<Textarea
  placeholder="请输入内容"
  clear
  style={{ width: '300px' }}
/>`} />
      </Section>

      {/* 带标签 */}
      <Section title="带标签">
        <p>在文本框前添加标签。</p>
        <DemoRow title="标签文本框">
          <Textarea
            label="备注:"
            placeholder="请输入备注内容"
            value={labelValue}
            onChange={(e) => setLabelValue(e.target.value)}
            style={{ width: '350px' }}
          />
        </DemoRow>
        <DemoRow title="自定义标签样式">
          <Textarea
            label={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>描述:</span>}
            placeholder="请输入描述"
            labelGap={16}
            style={{ width: '350px' }}
          />
        </DemoRow>
        <CopyBlock code={`import { Textarea } from '@zjpcy/simple-design';

// 基础标签
<Textarea
  label="备注:"
  placeholder="请输入备注内容"
  style={{ width: '350px' }}
/>

// 自定义标签样式
<Textarea
  label={<span style={{ color: '#1890ff', fontWeight: 'bold' }}>描述:</span>}
  placeholder="请输入描述"
  labelGap={16}
  style={{ width: '350px' }}
/>`} />
      </Section>

      {/* 状态 */}
      <Section title="状态">
        <p>支持禁用和只读状态。</p>
        <DemoRow title="禁用状态">
          <Textarea
            placeholder="禁用状态"
            value={disabledValue}
            onChange={(e) => setDisabledValue(e.target.value)}
            disabled
            style={{ width: '300px' }}
          />
        </DemoRow>
        <DemoRow title="只读状态">
          <Textarea
            placeholder="只读状态"
            value={readonlyValue}
            onChange={(e) => setReadonlyValue(e.target.value)}
            readOnly
            style={{ width: '300px' }}
          />
        </DemoRow>
        <CopyBlock code={`import { Textarea } from '@zjpcy/simple-design';

// 禁用状态
<Textarea
  placeholder="禁用状态"
  disabled
  style={{ width: '300px' }}
/>

// 只读状态
<Textarea
  placeholder="只读状态"
  readOnly
  style={{ width: '300px' }}
/>`} />
      </Section>

      {/* 自定义尺寸 */}
      <Section title="自定义尺寸">
        <p>可以设置文本框的宽度和高度。</p>
        <DemoRow title="固定尺寸">
          <Textarea
            placeholder="宽度300px，高度100px"
            width={300}
            height={100}
          />
        </DemoRow>
        <DemoRow title="百分比尺寸">
          <Textarea
            placeholder="宽度100%"
            width="100%"
            rows={4}
          />
        </DemoRow>
        <DemoRow title="行数控制">
          <Textarea
            placeholder="6行高度"
            rows={6}
            style={{ width: '300px' }}
          />
        </DemoRow>
        <CopyBlock code={`import { Textarea } from '@zjpcy/simple-design';

// 固定尺寸
<Textarea
  placeholder="宽度300px，高度100px"
  width={300}
  height={100}
/>

// 百分比尺寸
<Textarea
  placeholder="宽度100%"
  width="100%"
  rows={4}
/>

// 行数控制
<Textarea
  placeholder="6行高度"
  rows={6}
  style={{ width: '300px' }}
/>`} />
      </Section>

      {/* 可拖拽调整大小 */}
      <Section title="可拖拽调整大小">
        <p>支持通过拖拽右下角调整文本框大小，可以限制最小和最大尺寸。</p>
        <DemoRow title="启用拖拽">
          <Textarea
            placeholder="可以拖拽右下角调整大小"
            value={resizeValue}
            onChange={(e) => setResizeValue(e.target.value)}
            resizable
            style={{ width: '300px' }}
          />
        </DemoRow>
        <DemoRow title="限制尺寸范围">
          <Textarea
            placeholder="最小200x100，最大500x300"
            resizable
            minWidth={200}
            maxWidth={500}
            minHeight={100}
            maxHeight={300}
            style={{ width: '300px' }}
            onResize={setCurrentSize}
          />
        </DemoRow>
        {currentSize.width && <p>当前宽度: {currentSize.width}px</p>}
        {currentSize.height && <p>当前高度: {currentSize.height}px</p>}
        <CopyBlock code={`import { Textarea } from '@zjpcy/simple-design';
import { useState } from 'react';

const [currentSize, setCurrentSize] = useState({});

// 启用拖拽
<Textarea
  placeholder="可以拖拽右下角调整大小"
  resizable
  style={{ width: '300px' }}
/>

// 限制尺寸范围
<Textarea
  placeholder="最小200x100，最大500x300"
  resizable
  minWidth={200}
  maxWidth={500}
  minHeight={100}
  maxHeight={300}
  onResize={setCurrentSize}
  style={{ width: '300px' }}
/>`} />
      </Section>

      {/* 额外提示 */}
      <Section title="额外提示">
        <p>在文本框下方显示额外的提示信息。</p>
        <DemoRow title="提示信息">
          <Textarea
            placeholder="请输入用户名"
            extra="用户名长度为 3-20 个字符"
            style={{ width: '300px' }}
          />
        </DemoRow>
        <DemoRow title="复杂提示">
          <Textarea
            placeholder="请输入内容"
            extra={
              <Flex gap="small">
                <span style={{ color: '#52c41a' }}>✓ 支持多行文本</span>
                <span style={{ color: '#1890ff' }}>✓ 自动调整高度</span>
              </Flex>
            }
            style={{ width: '300px' }}
          />
        </DemoRow>
        <CopyBlock code={`import { Textarea } from '@zjpcy/simple-design';

// 简单提示
<Textarea
  placeholder="请输入用户名"
  extra="用户名长度为 3-20 个字符"
  style={{ width: '300px' }}
/>

// 复杂提示
<Textarea
  placeholder="请输入内容"
  extra={
    <Flex gap="small">
      <span style={{ color: '#52c41a' }}>✓ 支持多行文本</span>
      <span style={{ color: '#1890ff' }}>✓ 自动调整高度</span>
    </Flex>
  }
  style={{ width: '300px' }}
/>`} />
      </Section>

      {/* 最大长度限制 */}
      <Section title="最大长度限制">
        <p>限制用户输入的最大字符数。</p>
        <DemoRow title="最大长度100">
          <Textarea
            placeholder="最多输入100个字符"
            value={maxLengthValue}
            onChange={(e) => setMaxLengthValue(e.target.value)}
            maxLength={100}
            showCount
            style={{ width: '300px' }}
          />
        </DemoRow>
        <CopyBlock code={`import { Textarea } from '@zjpcy/simple-design';

<Textarea
  placeholder="最多输入100个字符"
  maxLength={100}
  showCount
  style={{ width: '300px' }}
/>`} />
      </Section>

      {/* 综合示例 */}
      <Section title="综合示例">
        <p>结合多个特性的复杂表单场景。</p>
        <DemoRow title="表单评论框">
          <Textarea
            label="评论:"
            placeholder="请发表您的评论..."
            rows={4}
            maxLength={200}
            showCount
            clear
            resizable
            extra="请文明发言，理性讨论"
            labelGap={12}
            style={{ width: '400px' }}
          />
        </DemoRow>
        <CopyBlock code={`import { Textarea } from '@zjpcy/simple-design';

<Textarea
  label="评论:"
  placeholder="请发表您的评论..."
  rows={4}
  maxLength={200}
  showCount
  clear
  resizable
  extra="请文明发言，理性讨论"
  labelGap={12}
  style={{ width: '400px' }}
/>`} />
      </Section>

      {/* API 文档 */}
      <Section title="API">
        <h3>Props</h3>
        <Table
          columns={[
            { title: '属性', dataIndex: 'property', key: 'property' },
            { title: '说明', dataIndex: 'description', key: 'description' },
            { title: '类型', dataIndex: 'type', key: 'type' },
            { title: '默认值', dataIndex: 'default', key: 'default' },
          ]}
          dataSource={[
            { property: 'value', description: '当前值（受控模式）', type: 'string', default: '-' },
            { property: 'defaultValue', description: '默认值（非受控模式）', type: 'string', default: '-' },
            { property: 'onChange', description: '值变化时的回调函数', type: '(e: ChangeEvent) => void', default: '-' },
            { property: 'placeholder', description: '占位符文本', type: 'string', default: '-' },
            { property: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
            { property: 'readOnly', description: '是否只读', type: 'boolean', default: 'false' },
            { property: 'rows', description: '文本框行数', type: 'number', default: '4' },
            { property: 'cols', description: '文本框列数', type: 'number', default: '-' },
            { property: 'maxLength', description: '最大字符长度', type: 'number', default: '-' },
            { property: 'showCount', description: '是否显示字符计数', type: 'boolean', default: 'false' },
            { property: 'clear', description: '是否显示清空按钮', type: 'boolean', default: 'false' },
            { property: 'label', description: '标签内容', type: 'string | ReactNode', default: '-' },
            { property: 'labelGap', description: '标签与输入框的距离', type: 'string | number', default: '8' },
            { property: 'width', description: '文本框宽度', type: 'string | number', default: '-' },
            { property: 'height', description: '文本框高度', type: 'string | number', default: '-' },
            { property: 'resizable', description: '是否可拖拽调整大小', type: 'boolean', default: 'false' },
            { property: 'resizeHandleSize', description: '拖拽手柄大小（像素）', type: 'number', default: '10' },
            { property: 'minWidth', description: '拖拽时最小宽度', type: 'number', default: '200' },
            { property: 'maxWidth', description: '拖拽时最大宽度', type: 'number', default: '2000' },
            { property: 'minHeight', description: '拖拽时最小高度', type: 'number', default: '80' },
            { property: 'maxHeight', description: '拖拽时最大高度', type: 'number', default: '800' },
            { property: 'onResize', description: '尺寸变化时的回调函数', type: '(size: { width?: number; height?: number }) => void', default: '-' },
            { property: 'extra', description: '额外提示信息', type: 'string | ReactNode', default: '-' },
            { property: 'onFocus', description: '获取焦点时的回调', type: '(e: FocusEvent) => void', default: '-' },
            { property: 'onBlur', description: '失去焦点时的回调', type: '(e: FocusEvent) => void', default: '-' },
            { property: 'onKeyDown', description: '按键时的回调', type: '(e: KeyboardEvent) => void', default: '-' },
          ]}
          rowKey="property"
          pagination={false}
        />
      </Section>
    </div>
  );
};

export default TextareaExample;

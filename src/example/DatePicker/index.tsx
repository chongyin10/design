import React, { useState } from 'react';
import { Flex } from '../../components';
import DatePicker from '../../components/DatePicker';
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

const DatePickerExample: React.FC = () => {
  const [basicDate, setBasicDate] = useState<string>('');
  const [defaultDate, setDefaultDate] = useState<string>('2024-02-25');
  const [formatDate, setFormatDate] = useState<string>('2024/02/25');

  // 禁用周末
  const disabledWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // 禁用特定日期
  const disabledDates = ['2024-02-14', '2024-02-20', '2024-02-28'];

  return (
    <div style={{ padding: '20px' }}>
      <h1>DatePicker 日期选择器</h1>
      <p>用于选择日期的浮层控件组件。</p>

      {/* 基础用法 */}
      <Section title="基础用法">
        <DemoRow title="默认">
          <DatePicker
            value={basicDate}
            onChange={setBasicDate}
            placeholder="请选择日期"
          />
          <span style={{ marginLeft: '8px', color: '#666' }}>
            选中值: {basicDate || '无'}
          </span>
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';

const Demo = () => {
  const [date, setDate] = useState('');
  
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      placeholder="请选择日期"
    />
  );
};`} />
      </Section>

      {/* 默认值 */}
      <Section title="默认值">
        <DemoRow title="默认日期">
          <DatePicker
            defaultValue="2024-02-25"
            onChange={(val) => console.log('选中日期:', val)}
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';

// 带默认值的日期选择器
<DatePicker defaultValue="2024-02-25" />`} />
      </Section>

      {/* 不同尺寸 */}
      <Section title="不同尺寸">
        <DemoRow title="Small">
          <DatePicker size="small" placeholder="小尺寸" />
        </DemoRow>
        <DemoRow title="Middle">
          <DatePicker size="middle" placeholder="中尺寸" />
        </DemoRow>
        <DemoRow title="Large">
          <DatePicker size="large" placeholder="大尺寸" />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';

// 小尺寸
<DatePicker size="small" />

// 中尺寸（默认）
<DatePicker size="middle" />

// 大尺寸
<DatePicker size="large" />`} />
      </Section>

      {/* 日期格式 */}
      <Section title="日期格式">
        <DemoRow title="YYYY-MM-DD">
          <DatePicker
            format="YYYY-MM-DD"
            defaultValue="2024-02-25"
          />
        </DemoRow>
        <DemoRow title="YYYY/MM/DD">
          <DatePicker
            format="YYYY/MM/DD"
            value={formatDate}
            onChange={setFormatDate}
          />
        </DemoRow>
        <DemoRow title="DD-MM-YYYY">
          <DatePicker
            format="DD-MM-YYYY"
            defaultValue="25-02-2024"
          />
        </DemoRow>
        <DemoRow title="MM/DD/YYYY">
          <DatePicker
            format="MM/DD/YYYY"
            defaultValue="02/25/2024"
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';

// 不同日期格式
<DatePicker format="YYYY-MM-DD" />  {/* 2024-02-25 */}
<DatePicker format="YYYY/MM/DD" />  {/* 2024/02/25 */}
<DatePicker format="DD-MM-YYYY" />  {/* 25-02-2024 */}
<DatePicker format="MM/DD/YYYY" />  {/* 02/25/2024 */}`} />
      </Section>

      {/* 禁用状态 */}
      <Section title="禁用状态">
        <DemoRow title="禁用">
          <DatePicker disabled defaultValue="2024-02-25" />
        </DemoRow>
        <DemoRow title="只读">
          <DatePicker readOnly defaultValue="2024-02-25" />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';

// 禁用状态
<DatePicker disabled defaultValue="2024-02-25" />

// 只读状态
<DatePicker readOnly defaultValue="2024-02-25" />`} />
      </Section>

      {/* 禁用日期 */}
      <Section title="禁用日期">
        <DemoRow title="禁用周末">
          <DatePicker
            placeholder="周末不可选"
            disabledDate={disabledWeekend}
          />
        </DemoRow>
        <DemoRow title="禁用特定日期">
          <DatePicker
            placeholder="2月14、20、28日不可选"
            disabledDates={disabledDates}
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';

// 禁用周末
<DatePicker
  disabledDate={(date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  }}
/>

// 禁用特定日期
<DatePicker
  disabledDates={['2024-02-14', '2024-02-20', '2024-02-28']}
/>`} />
      </Section>

      {/* 带标签 */}
      <Section title="带标签">
        <DemoRow title="标签">
          <DatePicker
            label="选择日期"
            placeholder="请选择"
          />
        </DemoRow>
        <DemoRow title="自定义标签">
          <DatePicker
            label={<span style={{ color: '#1890ff' }}>📅 日期</span>}
            placeholder="请选择"
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';

// 文字标签
<DatePicker label="选择日期" />

// 自定义标签
<DatePicker
  label={<span style={{ color: '#1890ff' }}>📅 日期</span>}
/>`} />
      </Section>

      {/* 底部按钮 */}
      <Section title="底部按钮">
        <DemoRow title="显示今天">
          <DatePicker
            showToday={true}
            showOk={false}
            placeholder="选择后自动关闭"
          />
        </DemoRow>
        <DemoRow title="显示确定">
          <DatePicker
            showToday={true}
            showOk={true}
            placeholder="需要点击确定"
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';

// 显示今天按钮，选择后自动关闭
<DatePicker showToday={true} showOk={false} />

// 显示今天和确定按钮
<DatePicker showToday={true} showOk={true} />`} />
      </Section>

      {/* 不允许清除 */}
      <Section title="不允许清除">
        <DemoRow title="无清除按钮">
          <DatePicker
            allowClear={false}
            defaultValue="2024-02-25"
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';

// 隐藏清除按钮
<DatePicker allowClear={false} defaultValue="2024-02-25" />`} />
      </Section>

      {/* 受控模式 */}
      <Section title="受控模式">
        <DemoRow title="完全受控">
          <DatePicker
            value={defaultDate}
            onChange={setDefaultDate}
          />
          <button
            onClick={() => setDefaultDate('2024-01-01')}
            style={{
              marginLeft: '8px',
              padding: '4px 12px',
              background: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            设置为 2024-01-01
          </button>
          <button
            onClick={() => setDefaultDate('')}
            style={{
              marginLeft: '8px',
              padding: '4px 12px',
              background: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            清空
          </button>
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';

const Demo = () => {
  const [date, setDate] = useState('2024-02-25');
  
  return (
    <>
      <DatePicker value={date} onChange={setDate} />
      <button onClick={() => setDate('2024-01-01')}>
        设置为 2024-01-01
      </button>
      <button onClick={() => setDate('')}>
        清空
      </button>
    </>
  );
};`} />
      </Section>
    </div>
  );
};

export default DatePickerExample;

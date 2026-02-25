import React, { useState } from 'react';
import { Flex, Table } from '../../components';
import DatePicker from '../../components/DatePicker';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { RangePicker } = DatePicker;

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

  // RangePicker 状态
  const [basicRange, setBasicRange] = useState<[string, string]>(['', '']);
  const [controlledRange, setControlledRange] = useState<[string, string]>(['2024-01-01', '2024-01-15']);

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

      {/* 选择器类型 */}
      <Section title="选择器类型">
        <DemoRow title="日期选择">
          <DatePicker
            picker="date"
            placeholder="选择日期"
          />
        </DemoRow>
        <DemoRow title="月份选择">
          <DatePicker
            picker="month"
            placeholder="选择月份"
          />
        </DemoRow>
        <DemoRow title="季度选择">
          <DatePicker
            picker="quarter"
            placeholder="选择季度"
          />
        </DemoRow>
        <DemoRow title="年份选择">
          <DatePicker
            picker="year"
            placeholder="选择年份"
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';

// 日期选择（默认）
<DatePicker picker="date" />

// 月份选择
<DatePicker picker="month" />

// 季度选择
<DatePicker picker="quarter" />

// 年份选择
<DatePicker picker="year" />`} />
      </Section>

      {/* 多选模式 */}
      <Section title="多选模式">
        <DemoRow title="多选日期">
          <DatePicker
            multiple
            placeholder="可选择多个日期"
          />
        </DemoRow>
        <DemoRow title="多选月份">
          <DatePicker
            picker="month"
            multiple
            placeholder="可选择多个月份"
          />
        </DemoRow>
        <DemoRow title="多选年份">
          <DatePicker
            picker="year"
            multiple
            placeholder="可选择多个年份"
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';

// 多选日期
<DatePicker multiple placeholder="可选择多个日期" />

// 多选月份
<DatePicker picker="month" multiple placeholder="可选择多个月份" />

// 多选年份
<DatePicker picker="year" multiple placeholder="可选择多个年份" />`} />
      </Section>

      {/* 多选标签显示限制 */}
      <Section title="多选标签显示限制">
        <p>多选模式下，可以通过 maxTagDisplayCount 限制显示的标签数量，超出部分以 "...+n" 形式展示。</p>
        <DemoRow title="显示2个标签">
          <DatePicker
            multiple
            maxTagDisplayCount={2}
            placeholder="最多显示2个标签"
          />
        </DemoRow>
        <DemoRow title="显示3个标签">
          <DatePicker
            picker="month"
            multiple
            maxTagDisplayCount={3}
            placeholder="最多显示3个标签"
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';

// 限制最多显示2个标签
<DatePicker multiple maxTagDisplayCount={2} placeholder="最多显示2个标签" />

// 限制最多显示3个标签（月份选择器）
<DatePicker picker="month" multiple maxTagDisplayCount={3} placeholder="最多显示3个标签" />`} />
      </Section>

      {/* ============ RangePicker 示例 ============ */}
      <h1 style={{ marginTop: '48px' }}>RangePicker 日期范围选择器</h1>
      <p>用于选择日期范围的浮层控件组件。</p>

      {/* RangePicker 基础用法 */}
      <Section title="基础用法">
        <DemoRow title="默认">
          <RangePicker
            value={basicRange}
            onChange={setBasicRange}
            placeholder={['开始日期', '结束日期']}
          />
          <span style={{ marginLeft: '8px', color: '#666' }}>
            选中值: {basicRange[0] || '无'} ~ {basicRange[1] || '无'}
          </span>
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';
const { RangePicker } = DatePicker;

const Demo = () => {
  const [dates, setDates] = useState<[string, string]>(['', '']);
  
  return (
    <RangePicker
      value={dates}
      onChange={setDates}
      placeholder={['开始日期', '结束日期']}
    />
  );
};`} />
      </Section>

      {/* RangePicker 默认值 */}
      <Section title="默认值">
        <DemoRow title="默认日期范围">
          <RangePicker
            defaultValue={['2024-02-01', '2024-02-28']}
            onChange={(val) => console.log('选中范围:', val)}
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';
const { RangePicker } = DatePicker;

// 带默认值的日期范围选择器
<RangePicker defaultValue={['2024-02-01', '2024-02-28']} />`} />
      </Section>

      {/* RangePicker 不同尺寸 */}
      <Section title="不同尺寸">
        <DemoRow title="Small">
          <RangePicker size="small" placeholder={['开始日期', '结束日期']} />
        </DemoRow>
        <DemoRow title="Middle">
          <RangePicker size="middle" placeholder={['开始日期', '结束日期']} />
        </DemoRow>
        <DemoRow title="Large">
          <RangePicker size="large" placeholder={['开始日期', '结束日期']} />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';
const { RangePicker } = DatePicker;

// 小尺寸
<RangePicker size="small" />

// 中尺寸（默认）
<RangePicker size="middle" />

// 大尺寸
<RangePicker size="large" />`} />
      </Section>

      {/* RangePicker 日期格式 */}
      <Section title="日期格式">
        <DemoRow title="YYYY-MM-DD">
          <RangePicker
            format="YYYY-MM-DD"
            defaultValue={['2024-02-01', '2024-02-28']}
          />
        </DemoRow>
        <DemoRow title="YYYY/MM/DD">
          <RangePicker
            format="YYYY/MM/DD"
            defaultValue={['2024/02/01', '2024/02/28']}
          />
        </DemoRow>
        <DemoRow title="DD-MM-YYYY">
          <RangePicker
            format="DD-MM-YYYY"
            defaultValue={['01-02-2024', '28-02-2024']}
          />
        </DemoRow>
        <DemoRow title="MM/DD/YYYY">
          <RangePicker
            format="MM/DD/YYYY"
            defaultValue={['02/01/2024', '02/28/2024']}
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';
const { RangePicker } = DatePicker;

// 不同日期格式
<RangePicker format="YYYY-MM-DD" />  {/* 2024-02-01 */}
<RangePicker format="YYYY/MM/DD" />  {/* 2024/02/01 */}
<RangePicker format="DD-MM-YYYY" />  {/* 01-02-2024 */}
<RangePicker format="MM/DD/YYYY" />  {/* 02/01/2024 */}`} />
      </Section>

      {/* RangePicker 禁用状态 */}
      <Section title="禁用状态">
        <DemoRow title="禁用">
          <RangePicker disabled defaultValue={['2024-02-01', '2024-02-28']} />
        </DemoRow>
        <DemoRow title="只读">
          <RangePicker readOnly defaultValue={['2024-02-01', '2024-02-28']} />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';
const { RangePicker } = DatePicker;

// 禁用状态
<RangePicker disabled defaultValue={['2024-02-01', '2024-02-28']} />

// 只读状态
<RangePicker readOnly defaultValue={['2024-02-01', '2024-02-28']} />`} />
      </Section>

      {/* RangePicker 禁用日期 */}
      <Section title="禁用日期">
        <DemoRow title="禁用周末">
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            disabledDate={disabledWeekend}
          />
        </DemoRow>
        <DemoRow title="禁用特定日期">
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            disabledDates={disabledDates}
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';
const { RangePicker } = DatePicker;

// 禁用周末
<RangePicker
  disabledDate={(date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  }}
/>

// 禁用特定日期
<RangePicker
  disabledDates={['2024-02-14', '2024-02-20', '2024-02-28']}
/>`} />
      </Section>

      {/* RangePicker 带标签 */}
      <Section title="带标签">
        <DemoRow title="标签">
          <RangePicker
            label="选择范围"
            placeholder={['开始日期', '结束日期']}
          />
        </DemoRow>
        <DemoRow title="自定义标签">
          <RangePicker
            label={<span style={{ color: '#1890ff' }}>📅 日期范围</span>}
            placeholder={['开始日期', '结束日期']}
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';
const { RangePicker } = DatePicker;

// 文字标签
<RangePicker label="选择范围" />

// 自定义标签
<RangePicker
  label={<span style={{ color: '#1890ff' }}>📅 日期范围</span>}
/>`} />
      </Section>

      {/* RangePicker 底部按钮 */}
      <Section title="底部按钮">
        <DemoRow title="无确定按钮">
          <RangePicker
            showOk={false}
            placeholder={['选择后自动关闭', '']}
          />
        </DemoRow>
        <DemoRow title="显示确定">
          <RangePicker
            showOk={true}
            placeholder={['需要点击确定', '']}
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';
const { RangePicker } = DatePicker;

// 无确定按钮，选择后自动关闭
<RangePicker showOk={false} />

// 显示确定按钮
<RangePicker showOk={true} />`} />
      </Section>

      {/* RangePicker 不允许清除 */}
      <Section title="不允许清除">
        <DemoRow title="无清除按钮">
          <RangePicker
            allowClear={false}
            defaultValue={['2024-02-01', '2024-02-28']}
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';
const { RangePicker } = DatePicker;

// 隐藏清除按钮
<RangePicker allowClear={false} defaultValue={['2024-02-01', '2024-02-28']} />`} />
      </Section>

      {/* RangePicker 受控模式 */}
      <Section title="受控模式">
        <DemoRow title="完全受控">
          <RangePicker
            value={controlledRange}
            onChange={setControlledRange}
          />
          <button
            onClick={() => setControlledRange(['2024-03-01', '2024-03-15'])}
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
            设置为 2024-03-01 ~ 2024-03-15
          </button>
          <button
            onClick={() => setControlledRange(['', ''])}
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
const { RangePicker } = DatePicker;

const Demo = () => {
  const [dates, setDates] = useState<[string, string]>(['2024-01-01', '2024-01-15']);
  
  return (
    <>
      <RangePicker value={dates} onChange={setDates} />
      <button onClick={() => setDates(['2024-03-01', '2024-03-15'])}>
        设置为 2024-03-01 ~ 2024-03-15
      </button>
      <button onClick={() => setDates(['', ''])}>
        清空
      </button>
    </>
  );
};`} />
      </Section>

      {/* RangePicker 自定义分隔符 */}
      <Section title="自定义分隔符">
        <DemoRow title="文字分隔符">
          <RangePicker
            separator="至"
            placeholder={['开始日期', '结束日期']}
          />
        </DemoRow>
        <DemoRow title="自定义分隔符">
          <RangePicker
            separator={<span style={{ color: '#1890ff' }}>→</span>}
            placeholder={['开始日期', '结束日期']}
          />
        </DemoRow>
        <CopyBlock code={`import { DatePicker } from '@zjpcy/simple-design';
const { RangePicker } = DatePicker;

// 文字分隔符
<RangePicker separator="至" />

// 自定义分隔符
<RangePicker separator={<span style={{ color: '#1890ff' }}>→</span>} />`} />
      </Section>

      {/* RangePicker API 文档 */}
      <Section title="RangePicker API">
        <h3>Props</h3>
        <Table
          bordered
          dataSource={[
            { key: 'value', prop: 'value', description: '当前值 [开始日期, 结束日期]', type: '[string, string]', default: '-' },
            { key: 'defaultValue', prop: 'defaultValue', description: '默认值', type: '[string, string]', default: '-' },
            { key: 'onChange', prop: 'onChange', description: '日期变化时的回调', type: '(dates: [string, string]) => void', default: '-' },
            { key: 'placeholder', prop: 'placeholder', description: '输入框占位符 [开始占位符, 结束占位符]', type: '[string, string]', default: "['开始日期', '结束日期']" },
            { key: 'size', prop: 'size', description: '输入框大小', type: "'small' | 'middle' | 'large'", default: "'middle'" },
            { key: 'format', prop: 'format', description: '日期格式', type: "'YYYY-MM-DD' | 'YYYY/MM/DD' | 'DD-MM-YYYY' | 'MM/DD/YYYY'", default: "'YYYY-MM-DD'" },
            { key: 'disabled', prop: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
            { key: 'readOnly', prop: 'readOnly', description: '是否只读', type: 'boolean', default: 'false' },
            { key: 'allowClear', prop: 'allowClear', description: '是否显示清除按钮', type: 'boolean', default: 'true' },
            { key: 'width', prop: 'width', description: '输入框宽度', type: 'string | number', default: "'auto'" },
            { key: 'disabledDate', prop: 'disabledDate', description: '禁用日期的函数', type: '(date: Date) => boolean', default: '-' },
            { key: 'disabledDates', prop: 'disabledDates', description: '不可选择的日期列表', type: 'string[]', default: '-' },
            { key: 'label', prop: 'label', description: '标签内容', type: 'string | ReactNode', default: '-' },
            { key: 'labelGap', prop: 'labelGap', description: '标签到输入框的距离', type: 'string | number', default: '8' },
            { key: 'labelClassName', prop: 'labelClassName', description: '标签的CSS类名', type: 'string', default: '-' },
            { key: 'labelStyle', prop: 'labelStyle', description: '标签的样式', type: 'CSSProperties', default: '-' },
            { key: 'showOk', prop: 'showOk', description: '是否显示"确定"按钮', type: 'boolean', default: 'true' },
            { key: 'open', prop: 'open', description: '面板是否打开（受控）', type: 'boolean', default: '-' },
            { key: 'onOpenChange', prop: 'onOpenChange', description: '面板打开状态改变时的回调', type: '(open: boolean) => void', default: '-' },
            { key: 'separator', prop: 'separator', description: '日期分隔符，默认使用箭头图标', type: 'ReactNode', default: '箭头图标' },
          ]}
          columns={[
            { title: '属性', dataIndex: 'prop', width: 150 },
            { title: '说明', dataIndex: 'description' },
            { title: '类型', dataIndex: 'type', width: 250 },
            { title: '默认值', dataIndex: 'default', width: 120 },
          ]}
          pagination={false}
        />
      </Section>

      {/* API 文档 */}
      <Section title="API">
        <h3>Props</h3>
        <Table
          bordered
          dataSource={[
            { key: 'value', prop: 'value', description: '当前值（受控模式）', type: 'string', default: '-' },
            { key: 'defaultValue', prop: 'defaultValue', description: '默认值（非受控模式）', type: 'string', default: '-' },
            { key: 'onChange', prop: 'onChange', description: '日期变化时的回调', type: '(date: string) => void', default: '-' },
            { key: 'placeholder', prop: 'placeholder', description: '输入框占位符', type: 'string', default: '请选择日期' },
            { key: 'size', prop: 'size', description: '输入框大小', type: "'small' | 'middle' | 'large'", default: "'middle'" },
            { key: 'format', prop: 'format', description: '日期格式', type: "'YYYY-MM-DD' | 'YYYY/MM/DD' | 'DD-MM-YYYY' | 'MM/DD/YYYY'", default: "'YYYY-MM-DD'" },
            { key: 'disabled', prop: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
            { key: 'readOnly', prop: 'readOnly', description: '是否只读', type: 'boolean', default: 'false' },
            { key: 'allowClear', prop: 'allowClear', description: '是否显示清除按钮', type: 'boolean', default: 'true' },
            { key: 'width', prop: 'width', description: '输入框宽度', type: 'string | number', default: '-' },
            { key: 'disabledDate', prop: 'disabledDate', description: '禁用日期的函数', type: '(date: Date) => boolean', default: '-' },
            { key: 'disabledDates', prop: 'disabledDates', description: '不可选择的日期列表', type: 'string[]', default: '-' },
            { key: 'label', prop: 'label', description: '标签内容', type: 'string | ReactNode', default: '-' },
            { key: 'labelGap', prop: 'labelGap', description: '标签到输入框的距离', type: 'string | number', default: '8' },
            { key: 'labelClassName', prop: 'labelClassName', description: '标签的CSS类名', type: 'string', default: '-' },
            { key: 'labelStyle', prop: 'labelStyle', description: '标签的样式', type: 'CSSProperties', default: '-' },
            { key: 'showOk', prop: 'showOk', description: '是否显示"确定"按钮', type: 'boolean', default: 'true' },
            { key: 'open', prop: 'open', description: '面板是否打开（受控）', type: 'boolean', default: '-' },
            { key: 'onOpenChange', prop: 'onOpenChange', description: '面板打开状态改变时的回调', type: '(open: boolean) => void', default: '-' },
            { key: 'picker', prop: 'picker', description: '选择器类型', type: "'date' | 'month' | 'quarter' | 'year'", default: "'date'" },
            { key: 'multiple', prop: 'multiple', description: '是否支持多选', type: 'boolean', default: 'false' },
            { key: 'maxTagCount', prop: 'maxTagCount', description: '多选时最多可选数量', type: 'number', default: '-' },
            { key: 'maxTagDisplayCount', prop: 'maxTagDisplayCount', description: '多选时最多显示几个标签，超过显示...+n模式', type: 'number', default: '-' },
          ]}
          columns={[
            { title: '属性', dataIndex: 'prop', width: 150 },
            { title: '说明', dataIndex: 'description' },
            { title: '类型', dataIndex: 'type', width: 250 },
            { title: '默认值', dataIndex: 'default', width: 120 },
          ]}
          pagination={false}
        />
      </Section>
    </div>
  );
};

export default DatePickerExample;

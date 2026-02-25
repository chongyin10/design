import React, { useState } from 'react';
import { Flex, Table } from '../../components';
import TimePicker from '../../components/TimePicker';
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

const TimePickerExample: React.FC = () => {
  const [basicTime, setBasicTime] = useState<string>('');
  const [defaultTime, setDefaultTime] = useState<string>('14:30:00');
  const [hmTime, setHmTime] = useState<string>('');
  const [nowTime, setNowTime] = useState<string>('');
  const [rangeTime1, setRangeTime1] = useState<[string, string]>(['09:00:00', '18:00:00']);
  const [rangeTime2, setRangeTime2] = useState<[string, string]>(['', '']);
  const [rangeTime3, setRangeTime3] = useState<[string, string]>(['', '']);

  return (
    <div style={{ padding: '20px' }}>
      <h1>TimePicker 时间选择器</h1>
      <p>用于选择或输入时间，支持时、分、秒选择。</p>

      {/* 基础用法 */}
      <Section title="基础用法">
        <DemoRow title="默认时间选择器">
          <TimePicker 
            value={basicTime}
            onChange={setBasicTime}
            placeholder="请选择时间"
          />
          <span style={{ marginLeft: '8px' }}>当前选择: {basicTime || '未选择'}</span>
        </DemoRow>
        <CopyBlock code={`import { TimePicker } from '@zjpcy/simple-design';
import { useState } from 'react';

const Demo = () => {
  const [time, setTime] = useState('');
  
  return (
    <TimePicker 
      value={time}
      onChange={setTime}
      placeholder="请选择时间"
    />
  );
};`} />
      </Section>

      {/* 默认值 */}
      <Section title="默认值">
        <DemoRow title="预设时间">
          <TimePicker 
            value={defaultTime}
            onChange={setDefaultTime}
          />
        </DemoRow>
        <CopyBlock code={`import { TimePicker } from '@zjpcy/simple-design';

// 预设时间为 14:30:00
<TimePicker defaultValue="14:30:00" />`} />
      </Section>

      {/* 时分格式 */}
      <Section title="时分格式">
        <DemoRow title="HH:mm 格式">
          <TimePicker 
            value={hmTime}
            onChange={setHmTime}
            format="HH:mm"
            placeholder="请选择时间"
          />
        </DemoRow>
        <CopyBlock code={`import { TimePicker } from '@zjpcy/simple-design';

// 时分格式（不显示秒）
<TimePicker format="HH:mm" placeholder="请选择时间" />`} />
      </Section>

      {/* 带标签 */}
      <Section title="带标签">
        <DemoRow title="基本标签">
          <TimePicker 
            label="时间："
            placeholder="请选择时间"
          />
        </DemoRow>
        <DemoRow title="自定义间距">
          <TimePicker 
            label="开始时间："
            labelGap={16}
            placeholder="请选择时间"
          />
        </DemoRow>
        <CopyBlock code={`import { TimePicker } from '@zjpcy/simple-design';

// 基本标签
<TimePicker label="时间：" placeholder="请选择时间" />

// 自定义间距
<TimePicker label="开始时间：" labelGap={16} placeholder="请选择时间" />`} />
      </Section>

      {/* 禁用状态 */}
      <Section title="禁用状态">
        <DemoRow title="禁用选择器">
          <TimePicker 
            value="12:00:00"
            disabled
          />
        </DemoRow>
        <CopyBlock code={`import { TimePicker } from '@zjpcy/simple-design';

<TimePicker value="12:00:00" disabled />`} />
      </Section>

      {/* 步长设置 */}
      <Section title="步长设置">
        <DemoRow title="小时步长2">
          <TimePicker 
            placeholder="小时步长2"
            hourStep={2}
            minuteStep={5}
          />
        </DemoRow>
        <DemoRow title="分钟步长15">
          <TimePicker 
            placeholder="分钟步长15"
            minuteStep={15}
          />
        </DemoRow>
        <CopyBlock code={`import { TimePicker } from '@zjpcy/simple-design';

// 小时步长为 2，分钟步长为 5
<TimePicker hourStep={2} minuteStep={5} placeholder="请选择时间" />

// 分钟步长为 15
<TimePicker minuteStep={15} placeholder="请选择时间" />`} />
      </Section>

      {/* 禁用部分时间 */}
      <Section title="禁用部分时间">
        <DemoRow title="禁用 0-8 点">
          <TimePicker 
            placeholder="禁用 0-8 点"
            disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 8]}
          />
        </DemoRow>
        <CopyBlock code={`import { TimePicker } from '@zjpcy/simple-design';

// 禁用 0-8 点
<TimePicker 
  placeholder="禁用 0-8 点"
  disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 8]}
/>`} />
      </Section>

      {/* 底部按钮 */}
      <Section title="底部按钮">
        <DemoRow title="此刻按钮">
          <TimePicker
            value={nowTime}
            onChange={setNowTime}
            placeholder="点击'此刻'设置当前时间"
          />
        </DemoRow>
        <DemoRow title="隐藏此刻">
          <TimePicker
            placeholder="隐藏此刻按钮"
            showNow={false}
          />
        </DemoRow>
        <DemoRow title="隐藏确定">
          <TimePicker
            placeholder="隐藏确定按钮"
            showOk={false}
          />
        </DemoRow>
        <DemoRow title="隐藏所有">
          <TimePicker
            placeholder="隐藏所有按钮"
            showNow={false}
            showOk={false}
          />
        </DemoRow>
        <CopyBlock code={`import { TimePicker } from '@zjpcy/simple-design';

// 默认显示"此刻"和"确定"按钮
<TimePicker placeholder="请选择时间" />

// 隐藏"此刻"按钮
<TimePicker showNow={false} placeholder="请选择时间" />

// 隐藏"确定"按钮
<TimePicker showOk={false} placeholder="请选择时间" />

// 隐藏所有按钮
<TimePicker showNow={false} showOk={false} placeholder="请选择时间" />`} />
      </Section>

      {/* 时间范围选择 */}
      <Section title="时间范围选择">
        <DemoRow title="基本用法">
          <TimePicker.RangePicker
            value={rangeTime1}
            onChange={setRangeTime1}
          />
          <span style={{ marginLeft: '8px' }}>当前范围: {rangeTime1[0]} - {rangeTime1[1]}</span>
        </DemoRow>
        <DemoRow title="自定义占位符">
          <TimePicker.RangePicker
            value={rangeTime2}
            onChange={setRangeTime2}
            placeholder={['开始时间', '结束时间']}
          />
        </DemoRow>
        <DemoRow title="时分格式">
          <TimePicker.RangePicker
            value={rangeTime3}
            onChange={setRangeTime3}
            format="HH:mm"
            placeholder={['开始', '结束']}
          />
        </DemoRow>
        <DemoRow title="禁用状态">
          <TimePicker.RangePicker
            value={['09:00:00', '17:00:00']}
            disabled
          />
        </DemoRow>
        <CopyBlock code={`import { TimePicker } from '@zjpcy/simple-design';
import { useState } from 'react';

const Demo = () => {
  const [timeRange, setTimeRange] = useState(['09:00:00', '18:00:00']);
  
  return (
    <>
      {/* 基本用法 */}
      <TimePicker.RangePicker
        value={timeRange}
        onChange={setTimeRange}
      />
      
      {/* 自定义占位符 */}
      <TimePicker.RangePicker
        placeholder={['开始时间', '结束时间']}
      />
      
      {/* 时分格式 */}
      <TimePicker.RangePicker
        format="HH:mm"
        placeholder={['开始', '结束']}
      />
      
      {/* 禁用状态 */}
      <TimePicker.RangePicker
        value={['09:00:00', '17:00:00']}
        disabled
      />
    </>
  );
};`} />
      </Section>

      {/* API 文档 */}
      <Section title="API">
        <h3>TimePicker Props</h3>
        <Table
          bordered
          dataSource={[
            { key: 'value', prop: 'value', description: '当前值（受控模式）', type: 'string', default: '-' },
            { key: 'defaultValue', prop: 'defaultValue', description: '默认值（非受控模式）', type: 'string', default: '-' },
            { key: 'onChange', prop: 'onChange', description: '时间变化时的回调', type: '(time: string) => void', default: '-' },
            { key: 'placeholder', prop: 'placeholder', description: '输入框占位符', type: 'string', default: '请选择时间' },
            { key: 'format', prop: 'format', description: '时间格式', type: 'string', default: 'HH:mm:ss' },
            { key: 'disabled', prop: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
            { key: 'allowClear', prop: 'allowClear', description: '是否显示清除按钮', type: 'boolean', default: 'true' },
            { key: 'hourStep', prop: 'hourStep', description: '小时选项步长', type: 'number', default: '1' },
            { key: 'minuteStep', prop: 'minuteStep', description: '分钟选项步长', type: 'number', default: '1' },
            { key: 'secondStep', prop: 'secondStep', description: '秒选项步长', type: 'number', default: '1' },
            { key: 'disabledHours', prop: 'disabledHours', description: '禁用的小时', type: '() => number[]', default: '-' },
            { key: 'disabledMinutes', prop: 'disabledMinutes', description: '禁用的分钟', type: '(selectedHour: number) => number[]', default: '-' },
            { key: 'disabledSeconds', prop: 'disabledSeconds', description: '禁用的秒', type: '(selectedHour: number, selectedMinute: number) => number[]', default: '-' },
            { key: 'label', prop: 'label', description: '标签内容', type: 'string | ReactNode', default: '-' },
            { key: 'labelGap', prop: 'labelGap', description: '标签到输入框的距离', type: 'string | number', default: '8' },
            { key: 'showNow', prop: 'showNow', description: '是否显示"此刻"按钮', type: 'boolean', default: 'true' },
            { key: 'showOk', prop: 'showOk', description: '是否显示"确定"按钮', type: 'boolean', default: 'true' },
          ]}
          columns={[
            { title: '属性', dataIndex: 'prop', width: 150 },
            { title: '说明', dataIndex: 'description' },
            { title: '类型', dataIndex: 'type', width: 200 },
            { title: '默认值', dataIndex: 'default', width: 120 },
          ]}
          pagination={false}
        />

        <h3 style={{ marginTop: '32px' }}>TimePicker.RangePicker Props</h3>
        <Table
          bordered
          dataSource={[
            { key: 'value', prop: 'value', description: '当前值（受控模式）', type: '[string, string]', default: '-' },
            { key: 'defaultValue', prop: 'defaultValue', description: '默认值（非受控模式）', type: '[string, string]', default: '-' },
            { key: 'onChange', prop: 'onChange', description: '时间变化时的回调', type: '(times: [string, string]) => void', default: '-' },
            { key: 'placeholder', prop: 'placeholder', description: '输入框占位符', type: 'string | [string, string]', default: '请选择时间' },
            { key: 'format', prop: 'format', description: '时间格式', type: 'string', default: 'HH:mm:ss' },
            { key: 'disabled', prop: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
            { key: 'allowClear', prop: 'allowClear', description: '是否显示清除按钮', type: 'boolean', default: 'true' },
            { key: 'separator', prop: 'separator', description: '分隔符图标', type: 'string', default: 'swap-right' },
            { key: 'hourStep', prop: 'hourStep', description: '小时选项步长', type: 'number', default: '1' },
            { key: 'minuteStep', prop: 'minuteStep', description: '分钟选项步长', type: 'number', default: '1' },
            { key: 'secondStep', prop: 'secondStep', description: '秒选项步长', type: 'number', default: '1' },
            { key: 'disabledHours', prop: 'disabledHours', description: '禁用的小时', type: '() => number[]', default: '-' },
            { key: 'disabledMinutes', prop: 'disabledMinutes', description: '禁用的分钟', type: '(selectedHour: number) => number[]', default: '-' },
            { key: 'disabledSeconds', prop: 'disabledSeconds', description: '禁用的秒', type: '(selectedHour: number, selectedMinute: number) => number[]', default: '-' },
          ]}
          columns={[
            { title: '属性', dataIndex: 'prop', width: 150 },
            { title: '说明', dataIndex: 'description' },
            { title: '类型', dataIndex: 'type', width: 200 },
            { title: '默认值', dataIndex: 'default', width: 120 },
          ]}
          pagination={false}
        />
      </Section>
    </div>
  );
};

export default TimePickerExample;

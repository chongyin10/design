import React, { useState } from 'react';
import { Flex, Table } from '../../components';
import Radio from '../../components/Radio';
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

const RadioExample: React.FC = () => {
  const [basicChecked, setBasicChecked] = useState(false);
  const [groupValue, setGroupValue] = useState('apple');
  const [buttonValue, setButtonValue] = useState('a');
  const [sizeValue, setSizeValue] = useState('middle');
  const [labelValue, setLabelValue] = useState('a');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Radio 单选框</h1>
      <p>单选框用于在一组选项中选择一个。</p>

      {/* 基础用法 */}
      <Section title="基础用法">
        <DemoRow title="默认单选框">
          <Radio 
            checked={basicChecked}
            onChange={(checked) => setBasicChecked(checked)}
          >
            选项
          </Radio>
          <span style={{ marginLeft: '8px' }}>{basicChecked ? '已选中' : '未选中'}</span>
        </DemoRow>
        <CopyBlock code={`import { Radio } from '@zjpcy/simple-design';

const Demo = () => {
  const [checked, setChecked] = useState(false);
  
  return (
    <Radio 
      checked={checked}
      onChange={(checked) => setChecked(checked)}
    >
      选项
    </Radio>
  );
};`} />
      </Section>

      {/* 默认值 */}
      <Section title="默认值">
        <DemoRow title="默认选中">
          <Radio defaultChecked={true}>默认选中</Radio>
        </DemoRow>
        <DemoRow title="默认未选中">
          <Radio defaultChecked={false}>默认未选中</Radio>
        </DemoRow>
        <CopyBlock code={`import { Radio } from '@zjpcy/simple-design';

// 默认选中
<Radio defaultChecked={true}>默认选中</Radio>

// 默认未选中
<Radio defaultChecked={false}>默认未选中</Radio>`} />
      </Section>

      {/* 禁用状态 */}
      <Section title="禁用状态">
        <DemoRow title="禁用未选中">
          <Radio disabled={true}>禁用未选中</Radio>
        </DemoRow>
        <DemoRow title="禁用已选中">
          <Radio disabled={true} defaultChecked={true}>禁用已选中</Radio>
        </DemoRow>
        <CopyBlock code={`import { Radio } from '@zjpcy/simple-design';

// 禁用未选中
<Radio disabled>禁用未选中</Radio>

// 禁用已选中
<Radio disabled defaultChecked>禁用已选中</Radio>`} />
      </Section>

      {/* 不同尺寸 */}
      <Section title="不同尺寸">
        <DemoRow title="Large">
          <Radio size="large" value="large" checked={sizeValue === 'large'} onChange={() => setSizeValue('large')}>
            大尺寸
          </Radio>
        </DemoRow>
        <DemoRow title="Middle">
          <Radio size="middle" value="middle" checked={sizeValue === 'middle'} onChange={() => setSizeValue('middle')}>
            中尺寸
          </Radio>
        </DemoRow>
        <DemoRow title="Small">
          <Radio size="small" value="small" checked={sizeValue === 'small'} onChange={() => setSizeValue('small')}>
            小尺寸
          </Radio>
        </DemoRow>
        <CopyBlock code={`import { Radio } from '@zjpcy/simple-design';

// 大尺寸
<Radio size="large">大尺寸</Radio>

// 中尺寸
<Radio size="middle">中尺寸</Radio>

// 小尺寸
<Radio size="small">小尺寸</Radio>`} />
      </Section>

      {/* Radio.Group 用法 */}
      <Section title="Radio.Group 用法">
        <DemoRow title="单选组">
          <Radio.Group value={groupValue} onChange={setGroupValue}>
            <Radio value="apple">苹果</Radio>
            <Radio value="banana">香蕉</Radio>
            <Radio value="orange">橙子</Radio>
          </Radio.Group>
          <span style={{ marginLeft: '8px' }}>选中: {groupValue}</span>
        </DemoRow>
        <DemoRow title="默认值">
          <Radio.Group defaultValue="banana">
            <Radio value="apple">苹果</Radio>
            <Radio value="banana">香蕉</Radio>
            <Radio value="orange">橙子</Radio>
          </Radio.Group>
        </DemoRow>
        <DemoRow title="禁用组">
          <Radio.Group disabled={true}>
            <Radio value="apple">苹果</Radio>
            <Radio value="banana">香蕉</Radio>
            <Radio value="orange">橙子</Radio>
          </Radio.Group>
        </DemoRow>
        <CopyBlock code={`import { Radio } from '@zjpcy/simple-design';

// 单选组
<Radio.Group value={value} onChange={setValue}>
  <Radio value="apple">苹果</Radio>
  <Radio value="banana">香蕉</Radio>
  <Radio value="orange">橙子</Radio>
</Radio.Group>

// 默认值
<Radio.Group defaultValue="banana">
  <Radio value="apple">苹果</Radio>
  <Radio value="banana">香蕉</Radio>
  <Radio value="orange">橙子</Radio>
</Radio.Group>

// 禁用组
<Radio.Group disabled>
  <Radio value="apple">苹果</Radio>
  <Radio value="banana">香蕉</Radio>
  <Radio value="orange">橙子</Radio>
</Radio.Group>`} />
      </Section>

      {/* 按钮类型 */}
      <Section title="按钮类型">
        <DemoRow title="按钮组">
          <Radio.Group type="button" value={buttonValue} onChange={setButtonValue}>
            <Radio value="a">选项 A</Radio>
            <Radio value="b">选项 B</Radio>
            <Radio value="c">选项 C</Radio>
          </Radio.Group>
          <span style={{ marginLeft: '8px' }}>选中: {buttonValue}</span>
        </DemoRow>
        <DemoRow title="大尺寸按钮">
          <Radio.Group type="button" size="large" defaultValue="a">
            <Radio value="a">选项 A</Radio>
            <Radio value="b">选项 B</Radio>
            <Radio value="c">选项 C</Radio>
          </Radio.Group>
        </DemoRow>
        <DemoRow title="小尺寸按钮">
          <Radio.Group type="button" size="small" defaultValue="a">
            <Radio value="a">选项 A</Radio>
            <Radio value="b">选项 B</Radio>
            <Radio value="c">选项 C</Radio>
          </Radio.Group>
        </DemoRow>
        <CopyBlock code={`import { Radio } from '@zjpcy/simple-design';

// 按钮组
<Radio.Group type="button" value={value} onChange={setValue}>
  <Radio value="a">选项 A</Radio>
  <Radio value="b">选项 B</Radio>
  <Radio value="c">选项 C</Radio>
</Radio.Group>

// 大尺寸按钮
<Radio.Group type="button" size="large">
  <Radio value="a">选项 A</Radio>
  <Radio value="b">选项 B</Radio>
  <Radio value="c">选项 C</Radio>
</Radio.Group>

// 小尺寸按钮
<Radio.Group type="button" size="small">
  <Radio value="a">选项 A</Radio>
  <Radio value="b">选项 B</Radio>
  <Radio value="c">选项 C</Radio>
</Radio.Group>`} />
      </Section>

      {/* 标签 */}
      <Section title="标签">
        <DemoRow title="基本用法">
          <Radio label="启用" checked={basicChecked} onChange={setBasicChecked}>
            选项
          </Radio>
        </DemoRow>
        <DemoRow title="自定义间距">
          <Radio label="通知" labelGap={20} value="a" checked={labelValue === 'a'} onChange={() => setLabelValue('a')}>
            选项 A
          </Radio>
        </DemoRow>
        <DemoRow title="自定义样式">
          <Radio
            label="自动保存"
            labelGap={12}
            labelStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            value="b"
            checked={labelValue === 'b'}
            onChange={() => setLabelValue('b')}
          >
            选项 B
          </Radio>
        </DemoRow>
        <DemoRow title="自定义类名">
          <Radio
            label="同步"
            labelGap={8}
            labelClassName="custom-label"
            value="c"
            checked={labelValue === 'c'}
            onChange={() => setLabelValue('c')}
          >
            选项 C
          </Radio>
        </DemoRow>
        <CopyBlock code={`import { Radio } from '@zjpcy/simple-design';

// 基本用法
<Radio label="启用" checked={checked} onChange={setChecked}>
  选项
</Radio>

// 自定义间距
<Radio label="通知" labelGap={20} value="a">
  选项 A
</Radio>

// 自定义样式
<Radio
  label="自动保存"
  labelGap={12}
  labelStyle={{ color: '#1890ff', fontWeight: 'bold' }}
  value="b"
>
  选项 B
</Radio>

// 自定义类名
<Radio
  label="同步"
  labelGap={8}
  labelClassName="custom-label"
  value="c"
>
  选项 C
</Radio>`} />
      </Section>

      {/* 事件回调 */}
      <Section title="事件回调">
        <DemoRow title="监听变化">
          <Radio.Group value={groupValue} onChange={(val) => console.log('选中值:', val)}>
            <Radio value="apple">苹果</Radio>
            <Radio value="banana">香蕉</Radio>
            <Radio value="orange">橙子</Radio>
          </Radio.Group>
          <span style={{ marginLeft: '8px' }}>选中: {groupValue}</span>
        </DemoRow>
        <DemoRow title="单选框变化">
          <Radio 
            checked={basicChecked}
            onChange={(checked, value) => console.log('状态:', checked, '值:', value)}
          >
            单选框
          </Radio>
        </DemoRow>
        <CopyBlock code={`import { Radio } from '@zjpcy/simple-design';

// 单选组监听变化
<Radio.Group 
  value={value} 
  onChange={(val) => {
    console.log('选中值:', val);
    setValue(val);
  }}
>
  <Radio value="apple">苹果</Radio>
  <Radio value="banana">香蕉</Radio>
  <Radio value="orange">橙子</Radio>
</Radio.Group>

// 单选框监听变化
<Radio 
  checked={checked}
  onChange={(checked, value) => {
    console.log('状态:', checked, '值:', value);
  }}
>
  单选框
</Radio>`} />
      </Section>

      {/* API 文档 */}
      <Section title="API">
        <h3>Radio Props</h3>
        <Table
          columns={[
            { dataIndex: 'property', title: '属性', width: '150px', align: 'left' },
            { dataIndex: 'description', title: '说明', width: '300px', align: 'left' },
            { dataIndex: 'type', title: '类型', width: '200px', align: 'left' },
            { dataIndex: 'default', title: '默认值', align: 'left' }
          ]}
          dataSource={[
            { key: '1', property: 'value', description: '单选框的值', type: 'any', default: '-' },
            { key: '2', property: 'checked', description: '指定当前是否选中（受控模式）', type: 'boolean', default: '-' },
            { key: '3', property: 'defaultChecked', description: '初始是否选中（非受控模式）', type: 'boolean', default: 'false' },
            { key: '4', property: 'onChange', description: '变化时的回调函数', type: '(checked: boolean, value: any) => void', default: '-' },
            { key: '5', property: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
            { key: '6', property: 'size', description: '单选框大小', type: "'large' | 'middle' | 'small'", default: '-' },
            { key: '7', property: 'children', description: '子元素', type: 'ReactNode', default: '-' },
            { key: '8', property: 'className', description: 'CSS类名', type: 'string', default: '-' },
            { key: '9', property: 'style', description: '内联样式', type: 'CSSProperties', default: '-' },
            { key: '10', property: 'label', description: '标签文案，显示在单选按钮前面', type: 'string | ReactNode', default: '-' },
            { key: '11', property: 'labelGap', description: '标签到单选按钮的距离', type: 'string | number', default: '8' },
            { key: '12', property: 'labelClassName', description: '标签的CSS类名', type: 'string', default: '-' },
            { key: '13', property: 'labelStyle', description: '标签的样式', type: 'CSSProperties', default: '-' }
          ]}
        />

        <h3>Radio.Group Props</h3>
        <Table
          columns={[
            { dataIndex: 'property', title: '属性', width: '150px', align: 'left' },
            { dataIndex: 'description', title: '说明', width: '300px', align: 'left' },
            { dataIndex: 'type', title: '类型', width: '200px', align: 'left' },
            { dataIndex: 'default', title: '默认值', align: 'left' }
          ]}
          dataSource={[
            { key: '1', property: 'value', description: '当前选中的值（受控模式）', type: 'any', default: '-' },
            { key: '2', property: 'defaultValue', description: '初始选中的值（非受控模式）', type: 'any', default: '-' },
            { key: '3', property: 'onChange', description: '变化时的回调函数', type: '(value: any) => void', default: '-' },
            { key: '4', property: 'disabled', description: '是否禁用整个组', type: 'boolean', default: 'false' },
            { key: '5', property: 'type', description: '单选框类型', type: "'radio' | 'button'", default: "'radio'" },
            { key: '6', property: 'size', description: '单选框大小', type: "'large' | 'middle' | 'small'", default: "'middle'" },
            { key: '7', property: 'children', description: '子元素', type: 'ReactNode', default: '-' },
            { key: '8', property: 'className', description: 'CSS类名', type: 'string', default: '-' },
            { key: '9', property: 'style', description: '内联样式', type: 'CSSProperties', default: '-' }
          ]}
        />
      </Section>
    </div>
  );
};

export default RadioExample;

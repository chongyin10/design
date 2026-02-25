import React, { useState } from 'react';
import { Select, Table, Flex } from '../../components';
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

const SelectExample: React.FC = () => {
  // 示例状态
  const [value1, setValue1] = useState<string>();
  const [value2, setValue2] = useState<string>();
  const [value3, setValue3] = useState<string>('apple');
  const [value4, setValue4] = useState<string>('banana');
  const [value5, setValue5] = useState<string>();
  const [value6, setValue6] = useState<string>();
  const [value7, setValue7] = useState<string>();
  const [value8, setValue8] = useState<string>();
  const [value9, setValue9] = useState<string>();
  const [value10, setValue10] = useState<string>();
  const [value11, setValue11] = useState<string>();
  const [value12, setValue12] = useState<string>();
  const [open, setOpen] = useState(false);
  
  // 选项数据
  const options = [
    { value: 'apple', label: '苹果', icon: 'user' },
    { value: 'banana', label: '香蕉', icon: 'search' },
    { value: 'orange', label: '橙子', icon: 'plus' },
    { value: 'grape', label: '葡萄', icon: 'minus' },
    { value: 'watermelon', label: '西瓜', icon: 'close' },
    { value: 'apple1', label: '苹果', icon: 'user' },
    { value: 'banana1', label: '香蕉', icon: 'search' },
    { value: 'orange1', label: '橙子', icon: 'plus' },
    { value: 'grape1', label: '葡萄', icon: 'minus' },
    { value: 'watermelon1', label: '西瓜', icon: 'close' }
  ];

  const simpleOptions = [
    { value: 'apple', label: '苹果' },
    { value: 'banana', label: '香蕉' },
    { value: 'orange', label: '橙子' }
  ];
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Select 选择器</h1>
      <p>下拉选择器，支持单选、分组、自定义选项等功能。</p>
      
      {/* 基础用法 */}
      <Section title="基础用法">
        <DemoRow title="使用 options 属性">
          <Select
            value={value1}
            onChange={setValue1}
            options={options}
            placeholder="请选择水果"
            style={{ maxWidth: '400px' }}
          />
        </DemoRow>
        <CopyBlock code={`import { Select } from '@zjpcy/simple-design';
import { useState } from 'react';

const Demo = () => {
  const [value, setValue] = useState<string>();
  
  return (
    <Select
      value={value}
      onChange={setValue}
      options={options}
      placeholder="请选择水果"
    />
  );
};`} />
      </Section>

      {/* 默认值 */}
      <Section title="默认值">
        <DemoRow title="默认选中">
          <Select
            defaultValue="apple"
            options={simpleOptions}
            placeholder="请选择水果"
            style={{ maxWidth: '400px' }}
          />
        </DemoRow>
        <CopyBlock code={`import { Select } from '@zjpcy/simple-design';

// 默认选中
<Select
  defaultValue="apple"
  options={options}
  placeholder="请选择水果"
/>`} />
      </Section>

      {/* 禁用状态 */}
      <Section title="禁用状态">
        <DemoRow title="禁用选择器">
          <Select
            disabled={true}
            options={simpleOptions}
            placeholder="禁用状态"
            style={{ maxWidth: '400px' }}
          />
        </DemoRow>
        <DemoRow title="禁用选项">
          <Select
            value={value2}
            onChange={setValue2}
            options={[
              { value: 'apple', label: '苹果' },
              { value: 'banana', label: '香蕉', disabled: true },
              { value: 'orange', label: '橙子' }
            ]}
            placeholder="请选择水果"
            style={{ maxWidth: '400px' }}
          />
        </DemoRow>
        <CopyBlock code={`import { Select } from '@zjpcy/simple-design';

// 禁用选择器
<Select disabled options={options} placeholder="禁用状态" />

// 禁用选项
<Select
  options={[
    { value: 'apple', label: '苹果' },
    { value: 'banana', label: '香蕉', disabled: true },
    { value: 'orange', label: '橙子' }
  ]}
/>`} />
      </Section>

      {/* 不同尺寸 */}
      <Section title="不同尺寸">
        <DemoRow title="Large">
          <Select
            size="large"
            value={value5}
            onChange={setValue5}
            options={simpleOptions}
            placeholder="大尺寸"
            style={{ maxWidth: '400px' }}
          />
        </DemoRow>
        <DemoRow title="Middle">
          <Select
            size="middle"
            value={value6}
            onChange={setValue6}
            options={simpleOptions}
            placeholder="中尺寸"
            style={{ maxWidth: '400px' }}
          />
        </DemoRow>
        <DemoRow title="Small">
          <Select
            size="small"
            value={value7}
            onChange={setValue7}
            options={simpleOptions}
            placeholder="小尺寸"
            style={{ maxWidth: '400px' }}
          />
        </DemoRow>
        <CopyBlock code={`import { Select } from '@zjpcy/simple-design';

// 大尺寸
<Select size="large" options={options} placeholder="大尺寸" />

// 中尺寸
<Select size="middle" options={options} placeholder="中尺寸" />

// 小尺寸
<Select size="small" options={options} placeholder="小尺寸" />`} />
      </Section>

      {/* 自定义宽度和高度 */}
      <Section title="自定义宽度和高度">
        <DemoRow title="自定义宽度">
          <Select
            value={value8}
            onChange={setValue8}
            options={simpleOptions}
            placeholder="宽度 300px"
            width={300}
          />
        </DemoRow>
        <DemoRow title="自定义高度">
          <Select
            value={value9}
            onChange={setValue9}
            options={simpleOptions}
            placeholder="高度 48px"
            height={48}
          />
        </DemoRow>
        <DemoRow title="自定义下拉高度">
          <Select
            value={value10}
            onChange={setValue10}
            options={options}
            placeholder="下拉高度 150px"
            dropdownHeight={150}
          />
        </DemoRow>
        <DemoRow title="宽度 + Label">
          <Select
            label="水果"
            labelGap={12}
            width={300}
            value={value11}
            onChange={setValue11}
            options={simpleOptions}
            placeholder="请选择水果"
          />
        </DemoRow>
        <DemoRow title="宽度 + 长文本Label">
          <Select
            label="选择你喜欢的水果"
            labelGap={16}
            width={400}
            value={value12}
            onChange={setValue12}
            options={simpleOptions}
            placeholder="请选择水果"
          />
        </DemoRow>
        <CopyBlock code={`import { Select } from '@zjpcy/simple-design';

// 自定义宽度
<Select width={300} options={options} placeholder="宽度 300px" />

// 自定义高度
<Select height={48} options={options} placeholder="高度 48px" />

// 自定义下拉高度
<Select dropdownHeight={150} options={options} placeholder="下拉高度 150px" />

// 宽度 + Label（总宽度300px，触发器自动填充剩余空间）
<Select
  label="水果"
  labelGap={12}
  width={300}
  value={value}
  onChange={setValue}
  options={options}
  placeholder="请选择水果"
/>

// 宽度 + 长文本Label（总宽度400px）
<Select
  label="选择你喜欢的水果"
  labelGap={16}
  width={400}
  value={value}
  onChange={setValue}
  options={options}
  placeholder="请选择水果"
/>`} />
      </Section>

      {/* 受控模式 */}
      <Section title="受控模式">
        <DemoRow title="控制下拉状态">
          <Select
            value={value1}
            onChange={setValue1}
            options={simpleOptions}
            placeholder="请选择水果"
            open={open}
            onOpenChange={setOpen}
            style={{ maxWidth: '400px' }}
          />
          <button onClick={() => setOpen(!open)} style={{ marginLeft: '10px' }}>
            {open ? '关闭' : '打开'}下拉
          </button>
        </DemoRow>
        <CopyBlock code={`import { Select } from '@zjpcy/simple-design';
import { useState } from 'react';

const Demo = () => {
  const [value, setValue] = useState<string>();
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Select
        value={value}
        onChange={setValue}
        options={options}
        open={open}
        onOpenChange={setOpen}
      />
      <button onClick={() => setOpen(!open)}>
        {open ? '关闭' : '打开'}下拉
      </button>
    </>
  );
};`} />
      </Section>

      {/* 分组选项 */}
      <Section title="分组选项">
        <DemoRow title="使用 OptGroup">
          <Select
            value={value3}
            onChange={setValue3}
            placeholder="请选择水果"
            style={{ maxWidth: '400px' }}
          >
            <Select.OptGroup label="热带水果">
              <Select.Option value="banana">香蕉</Select.Option>
              <Select.Option value="mango">芒果</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="温带水果">
              <Select.Option value="apple">苹果</Select.Option>
              <Select.Option value="orange">橙子</Select.Option>
            </Select.OptGroup>
          </Select>
        </DemoRow>
        <CopyBlock code={`import { Select } from '@zjpcy/simple-design';

<Select value={value} onChange={setValue}>
  <Select.OptGroup label="热带水果">
    <Select.Option value="banana">香蕉</Select.Option>
    <Select.Option value="mango">芒果</Select.Option>
  </Select.OptGroup>
  <Select.OptGroup label="温带水果">
    <Select.Option value="apple">苹果</Select.Option>
    <Select.Option value="orange">橙子</Select.Option>
  </Select.OptGroup>
</Select>`} />
      </Section>

      {/* 标签 */}
      <Section title="标签">
        <DemoRow title="基本用法">
          <Select
            label="水果"
            value={value1}
            onChange={setValue1}
            options={simpleOptions}
            placeholder="请选择水果"
            style={{ maxWidth: '400px' }}
          />
        </DemoRow>
        <DemoRow title="自定义间距">
          <Select
            label="状态"
            labelGap={20}
            value={value2}
            onChange={setValue2}
            options={simpleOptions}
            placeholder="请选择状态"
            style={{ maxWidth: '400px' }}
          />
        </DemoRow>
        <DemoRow title="自定义样式">
          <Select
            label="优先级"
            labelGap={12}
            labelStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            value={value3}
            onChange={setValue3}
            options={simpleOptions}
            placeholder="请选择优先级"
            style={{ maxWidth: '400px' }}
          />
        </DemoRow>
        <DemoRow title="自定义类名">
          <Select
            label="分类"
            labelGap={8}
            labelClassName="custom-label"
            value={value4}
            onChange={setValue4}
            options={simpleOptions}
            placeholder="请选择分类"
            style={{ maxWidth: '400px' }}
          />
        </DemoRow>
        <CopyBlock code={`import { Select } from '@zjpcy/simple-design';

// 基本用法
<Select label="水果" value={value} onChange={setValue} options={options} />

// 自定义间距
<Select label="状态" labelGap={20} value={value} onChange={setValue} options={options} />

// 自定义样式
<Select
  label="优先级"
  labelGap={12}
  labelStyle={{ color: '#1890ff', fontWeight: 'bold' }}
  value={value}
  onChange={setValue}
  options={options}
/>

// 自定义类名
<Select
  label="分类"
  labelGap={8}
  labelClassName="custom-label"
  value={value}
  onChange={setValue}
  options={options}
/>`} />
      </Section>

      {/* 事件回调 */}
      <Section title="事件回调">
        <DemoRow title="值变化回调">
          <Select
            value={value1}
            onChange={(val) => console.log('选中值:', val)}
            options={simpleOptions}
            placeholder="请选择水果"
            style={{ maxWidth: '400px' }}
          />
          <span style={{ marginLeft: '8px' }}>选中: {value1}</span>
        </DemoRow>
        <DemoRow title="下拉状态变化">
          <Select
            value={value1}
            onChange={setValue1}
            onOpenChange={(open) => console.log('下拉状态:', open)}
            options={simpleOptions}
            placeholder="请选择水果"
            style={{ maxWidth: '400px' }}
          />
        </DemoRow>
        <CopyBlock code={`import { Select } from '@zjpcy/simple-design';
import { useState } from 'react';

const Demo = () => {
  const [value, setValue] = useState<string>();
  
  return (
    <>
      <Select
        value={value}
        onChange={(val) => {
          console.log('选中值:', val);
          setValue(val);
        }}
        onOpenChange={(open) => {
          console.log('下拉状态:', open);
        }}
        options={options}
      />
    </>
  );
};`} />
      </Section>

      {/* API 文档 */}
      <Section title="API">
        <h3>Select Props</h3>
        <Table
          columns={[
            { dataIndex: 'property', title: '属性', width: '150px', align: 'left' },
            { dataIndex: 'description', title: '说明', width: '300px', align: 'left' },
            { dataIndex: 'type', title: '类型', width: '200px', align: 'left' },
            { dataIndex: 'default', title: '默认值', align: 'left' }
          ]}
          dataSource={[
            { key: '1', property: 'value', description: '当前选中的值（受控模式）', type: 'any', default: '-' },
            { key: '2', property: 'defaultValue', description: '默认选中的值（非受控模式）', type: 'any', default: '-' },
            { key: '3', property: 'onChange', description: '值变化时的回调函数', type: '(value: any) => void', default: '-' },
            { key: '4', property: 'placeholder', description: '占位符文本', type: 'string', default: '请选择' },
            { key: '5', property: 'disabled', description: '是否禁用选择器', type: 'boolean', default: 'false' },
            { key: '6', property: 'size', description: '选择器尺寸，当设置了height时，此参数失效', type: "'large' | 'middle' | 'small'", default: 'middle' },
            { key: '7', property: 'style', description: '自定义内联样式', type: 'React.CSSProperties', default: '-' },
            { key: '8', property: 'className', description: '自定义CSS类名', type: 'string', default: '-' },
            { key: '9', property: 'options', description: '选项列表', type: 'SelectOption[]', default: '-' },
            { key: '10', property: 'children', description: '子节点', type: 'React.ReactNode', default: '-' },
            { key: '11', property: 'open', description: '控制下拉菜单是否打开（受控）', type: 'boolean', default: '-' },
            { key: '12', property: 'onOpenChange', description: '下拉菜单开关状态变化时的回调函数', type: '(open: boolean) => void', default: '-' },
            { key: '13', property: 'width', description: '选择器宽度，下拉菜单宽度将跟随此值', type: 'number | string', default: '-' },
            { key: '14', property: 'height', description: '选择器高度，设置后将覆盖size参数', type: 'number | string', default: '-' },
            { key: '15', property: 'dropdownHeight', description: '下拉菜单的最大高度', type: 'number | string', default: '200px' },
            { key: '16', property: 'label', description: '标签文案，显示在选择器前面', type: 'string | React.ReactNode', default: '-' },
            { key: '17', property: 'labelGap', description: '标签到选择器的距离', type: 'string | number', default: '8' },
            { key: '18', property: 'labelClassName', description: '标签的CSS类名', type: 'string', default: '-' },
            { key: '19', property: 'labelStyle', description: '标签的样式', type: 'React.CSSProperties', default: '-' }
          ]}
        />

        <h3>Select.Option Props</h3>
        <Table
          columns={[
            { dataIndex: 'property', title: '属性', width: '150px', align: 'left' },
            { dataIndex: 'description', title: '说明', width: '300px', align: 'left' },
            { dataIndex: 'type', title: '类型', width: '200px', align: 'left' },
            { dataIndex: 'default', title: '默认值', align: 'left' }
          ]}
          dataSource={[
            { key: '1', property: 'value', description: '选项的值', type: 'any', default: '-' },
            { key: '2', property: 'children', description: '选项的标签文本', type: 'React.ReactNode', default: '-' },
            { key: '3', property: 'disabled', description: '是否禁用该选项', type: 'boolean', default: 'false' },
            { key: '4', property: 'icon', description: '选项的图标类型', type: 'string', default: '-' }
          ]}
        />

        <h3>Select.OptGroup Props</h3>
        <Table
          columns={[
            { dataIndex: 'property', title: '属性', width: '150px', align: 'left' },
            { dataIndex: 'description', title: '说明', width: '300px', align: 'left' },
            { dataIndex: 'type', title: '类型', width: '200px', align: 'left' },
            { dataIndex: 'default', title: '默认值', align: 'left' }
          ]}
          dataSource={[
            { key: '1', property: 'label', description: '分组的标签', type: 'React.ReactNode', default: '-' },
            { key: '2', property: 'children', description: '分组内的选项', type: 'React.ReactNode', default: '-' }
          ]}
        />
      </Section>
    </div>
  );
};

export default SelectExample;

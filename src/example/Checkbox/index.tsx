import React, { useState } from 'react';
import { Flex, Button, Table } from '../../components';
import Checkbox from '../../components/Checkbox';
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

const CheckboxExample: React.FC = () => {
  const [basicChecked, setBasicChecked] = useState(false);
  const [groupValues, setGroupValues] = useState<string[]>(['apple', 'orange']);
  const [disabledGroupValues, setDisabledGroupValues] = useState<string[]>(['apple']);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Checkbox 复选框</h1>
      <p>在一组可选项中进行多项选择。</p>

      {/* 基础用法 */}
      <Section title="基础用法">
        <DemoRow title="单个复选框">
          <Checkbox 
            checked={basicChecked}
            onChange={(checked) => setBasicChecked(checked)}
          >
            选项
          </Checkbox>
          <span style={{ marginLeft: '8px' }}>{basicChecked ? '已选中' : '未选中'}</span>
        </DemoRow>
        <CopyBlock code={`import { Checkbox } from '@zjpcy/simple-design';

const Demo = () => {
  const [checked, setChecked] = useState(false);
  
  return (
    <Checkbox 
      checked={checked}
      onChange={setChecked}
    >
      选项
    </Checkbox>
  );
};`} />

        <DemoRow title="默认选中">
          <Checkbox defaultChecked={true} onChange={(checked) => console.log('选中状态:', checked)}>
            默认选中
          </Checkbox>
        </DemoRow>
        <CopyBlock code={`<Checkbox defaultChecked={true}>默认选中</Checkbox>`} />
      </Section>

      {/* 高级属性 */}
      <Section title="高级属性">
        <p>Checkbox 提供了丰富的属性来自定义标签样式和行为。</p>
        
        <DemoRow title="自定义标签样式">
          <Checkbox 
            label="标签在前"
            labelGap={20}
            labelStyle={{ color: '#1890ff', fontWeight: 'bold' }}
          />
        </DemoRow>
        <CopyBlock code={`<Checkbox 
  label="标签在前"
  labelGap={20}
  labelStyle={{ color: '#1890ff', fontWeight: 'bold' }}
/>`} />

        <DemoRow title="不确定状态">
          <Checkbox 
            indeterminate={true}
            checked={true}
            onChange={(checked) => console.log('状态:', checked)}
          >
            半选中状态
          </Checkbox>
        </DemoRow>
        <CopyBlock code={`<Checkbox 
  indeterminate={true}
  checked={true}
>
  半选中状态
</Checkbox>`} />

        <DemoRow title="自定义类名">
          <Checkbox 
            className="custom-checkbox"
            labelClassName="custom-label"
          >
            自定义样式类
          </Checkbox>
        </DemoRow>
        <CopyBlock code={`<Checkbox 
  className="custom-checkbox"
  labelClassName="custom-label"
>
  自定义样式类
</Checkbox>`} />
      </Section>

      {/* 禁用状态 */}
      <Section title="禁用状态">
        <DemoRow title="未选中的禁用">
          <Checkbox disabled={true}>禁用选项</Checkbox>
        </DemoRow>
        <DemoRow title="已选中的禁用">
          <Checkbox disabled={true} defaultChecked={true}>
            已选中的禁用
          </Checkbox>
        </DemoRow>
        <CopyBlock code={`import { Checkbox } from '@zjpcy/simple-design';

// 禁用未选中
<Checkbox disabled>禁用选项</Checkbox>

// 禁用已选中
<Checkbox disabled defaultChecked={true}>已选中的禁用</Checkbox>`} />
      </Section>

      {/* Checkbox Group */}
      <Section title="复选框组">
        <p>使用 Checkbox.Group 可以方便地管理一组复选框。</p>
        
        <DemoRow title="基础用法">
          <Checkbox.Group
            options={[
              { label: '苹果', value: 'apple' },
              { label: '香蕉', value: 'banana' },
              { label: '橙子', value: 'orange' },
            ]}
            value={groupValues}
            onChange={(values) => setGroupValues(values)}
          />
          <span style={{ marginLeft: '16px' }}>已选: {groupValues.join(', ')}</span>
        </DemoRow>
        <CopyBlock code={`import { Checkbox } from '@zjpcy/simple-design';
import { useState } from 'react';

const Demo = () => {
  const [values, setValues] = useState(['apple', 'orange']);
  
  return (
    <Checkbox.Group
      options={[
        { label: '苹果', value: 'apple' },
        { label: '香蕉', value: 'banana' },
        { label: '橙子', value: 'orange' },
      ]}
      value={values}
      onChange={setValues}
    />
  );
};`} />

        <DemoRow title="禁用选项">
          <Checkbox.Group
            options={[
              { label: '苹果', value: 'apple' },
              { label: '香蕉', value: 'banana', disabled: true },
              { label: '橙子', value: 'orange' },
            ]}
            value={disabledGroupValues}
            onChange={(values) => setDisabledGroupValues(values)}
          />
        </DemoRow>
        <CopyBlock code={`<Checkbox.Group
  options={[
    { label: '苹果', value: 'apple' },
    { label: '香蕉', value: 'banana', disabled: true },
    { label: '橙子', value: 'orange' },
  ]}
/>`} />

        <DemoRow title="禁用整个组">
          <Checkbox.Group
            options={[
              { label: '选项一', value: '1' },
              { label: '选项二', value: '2' },
              { label: '选项三', value: '3' },
            ]}
            disabled={true}
            defaultValue={['1']}
          />
        </DemoRow>
        <CopyBlock code={`<Checkbox.Group
  options={[...]}
  disabled={true}
  defaultValue={['1']}
/>`} />

        <DemoRow title="垂直布局">
          <Checkbox.Group
            options={[
              { label: '选项一', value: '1' },
              { label: '选项二', value: '2' },
              { label: '选项三', value: '3' },
            ]}
            layout="vertical"
          />
        </DemoRow>
        <CopyBlock code={`<Checkbox.Group
  options={[...]}
  layout="vertical"
/>`} />

        <DemoRow title="自定义间距">
          <Checkbox.Group
            options={[
              { label: '选项一', value: '1' },
              { label: '选项二', value: '2' },
              { label: '选项三', value: '3' },
            ]}
            gap={40}
          />
        </DemoRow>
        <CopyBlock code={`<Checkbox.Group
  options={[...]}
  gap={40}
/>`} />
      </Section>

      {/* 全选/全不选 */}
      <Section title="全选/全不选">
        <DemoRow title="受控的全选">
          <Checkbox.Group
            options={[
              { label: '选项一', value: '1' },
              { label: '选项二', value: '2' },
              { label: '选项三', value: '3' },
            ]}
            value={groupValues}
            onChange={(values) => setGroupValues(values)}
          />
          <Button
            onClick={() => setGroupValues(['apple', 'banana', 'orange', '1', '2', '3'])}
            style={{ marginLeft: '16px' }}
          >
            全选
          </Button>
          <Button
            onClick={() => setGroupValues([])}
            style={{ marginLeft: '8px' }}
          >
            全不选
          </Button>
        </DemoRow>
        <CopyBlock code={`import { Checkbox, Button } from '@zjpcy/simple-design';
import { useState } from 'react';

const Demo = () => {
  const [values, setValues] = useState([]);
  const options = [
    { label: '选项一', value: '1' },
    { label: '选项二', value: '2' },
    { label: '选项三', value: '3' },
  ];
  
  return (
    <>
      <Checkbox.Group
        options={options}
        value={values}
        onChange={setValues}
      />
      <Button onClick={() => setValues(options.map(o => o.value))}>
        全选
      </Button>
      <Button onClick={() => setValues([])}>
        全不选
      </Button>
    </>
  );
};`} />
      </Section>

      {/* 实际应用场景 */}
      <Section title="实际应用场景">
        <p>Checkbox 组件在实际项目中的常见使用场景。</p>

        <h3>1. 表单选择</h3>
        <DemoRow title="兴趣爱好">
          <Checkbox.Group
            options={[
              { label: '音乐', value: 'music' },
              { label: '电影', value: 'movie' },
              { label: '阅读', value: 'reading' },
              { label: '运动', value: 'sport' },
            ]}
          />
        </DemoRow>
        <CopyBlock code={`<Checkbox.Group
  options={[
    { label: '音乐', value: 'music' },
    { label: '电影', value: 'movie' },
    { label: '阅读', value: 'reading' },
    { label: '运动', value: 'sport' },
  ]}
/>`} />

        <h3>2. 权限设置</h3>
        <DemoRow title="用户权限">
          <Checkbox.Group
            defaultValue={['read', 'write']}
            options={[
              { label: '读取', value: 'read' },
              { label: '写入', value: 'write' },
              { label: '删除', value: 'delete', disabled: true },
            ]}
          />
        </DemoRow>
        <CopyBlock code={`<Checkbox.Group
  defaultValue={['read', 'write']}
  options={[
    { label: '读取', value: 'read' },
    { label: '写入', value: 'write' },
    { label: '删除', value: 'delete', disabled: true },
  ]}
/>`} />

        <h3>3. 设置选项</h3>
        <DemoRow title="系统设置">
          <Checkbox.Group
            layout="vertical"
            options={[
              { label: '接收邮件通知', value: 'email' },
              { label: '接收短信通知', value: 'sms' },
              { label: '接收推送通知', value: 'push' },
              { label: '显示在线状态', value: 'online' },
            ]}
            defaultValue={['email', 'push']}
          />
        </DemoRow>
        <CopyBlock code={`<Checkbox.Group
  layout="vertical"
  options={[...]}
  defaultValue={['email', 'push']}
/>`} />
      </Section>

      {/* API 文档 */}
      <Section title="API">
        <h3>Checkbox Props</h3>
        <Table
          columns={[
            { title: '属性', dataIndex: 'prop', width: 120 },
            { title: '说明', dataIndex: 'description' },
            { title: '类型', dataIndex: 'type', width: 200 },
            { title: '默认值', dataIndex: 'default', width: 100 }
          ]}
          dataSource={[
            { prop: 'checked', description: '指定当前是否选中（受控模式）', type: 'boolean', default: '-' },
            { prop: 'defaultChecked', description: '初始是否选中（非受控模式）', type: 'boolean', default: 'false' },
            { prop: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
            { prop: 'value', description: '复选框的值，在 Checkbox.Group 中使用', type: 'string | number', default: '-' },
            { prop: 'indeterminate', description: '设置不确定状态', type: 'boolean', default: 'false' },
            { prop: 'label', description: '标签文案，显示在复选框前面', type: 'string | ReactNode', default: '-' },
            { prop: 'labelGap', description: '标签到复选框的距离', type: 'string | number', default: '-' },
            { prop: 'labelClassName', description: '标签的CSS类名', type: 'string', default: '-' },
            { prop: 'labelStyle', description: '标签的样式', type: 'React.CSSProperties', default: '-' },
            { prop: 'onChange', description: '变化时的回调函数', type: `(checked: boolean, value?: string | number) => void`, default: '-' },
            { prop: 'className', description: '自定义CSS类名', type: 'string', default: '-' },
            { prop: 'style', description: '自定义样式', type: 'React.CSSProperties', default: '-' }
          ]}
          bordered={true}
          pagination={false}
        />

        <h3 style={{ marginTop: '32px' }}>Checkbox.Group Props</h3>
        <Table
          columns={[
            { title: '属性', dataIndex: 'prop', width: 120 },
            { title: '说明', dataIndex: 'description' },
            { title: '类型', dataIndex: 'type', width: 250 },
            { title: '默认值', dataIndex: 'default', width: 100 }
          ]}
          dataSource={[
            { prop: 'options', description: '指定可选项', type: `Array<{ label: string | ReactNode; value: any; disabled?: boolean }>`, default: '-' },
            { prop: 'value', description: '指定选中的选项（受控模式）', type: '(string | number)[]', default: '-' },
            { prop: 'defaultValue', description: '默认选中的选项（非受控模式）', type: '(string | number)[]', default: '[]' },
            { prop: 'disabled', description: '是否禁用整个组', type: 'boolean', default: 'false' },
            { prop: 'layout', description: '排列方向', type: "'horizontal' | 'vertical'", default: "'vertical'" },
            { prop: 'gap', description: '复选框之间的间距', type: 'number | string', default: '-' },
            { prop: 'onChange', description: '变化时的回调函数', type: `(value: (string | number)[]) => void`, default: '-' },
            { prop: 'className', description: '自定义CSS类名', type: 'string', default: '-' },
            { prop: 'style', description: '自定义样式', type: 'React.CSSProperties', default: '-' }
          ]}
          bordered={true}
          pagination={false}
        />
      </Section>
    </div>
  );
};

export default CheckboxExample;

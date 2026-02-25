import React, { useState } from 'react';
import { Flex } from '../../components';
import Switch from '../../components/Switch';
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

const SwitchExample: React.FC = () => {
  const [basicChecked, setBasicChecked] = useState(false);
  const [loadingChecked, setLoadingChecked] = useState(false);
  const [smallChecked, setSmallChecked] = useState(false);
  const [textChecked, setTextChecked] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Switch 开关</h1>
      <p>开关选择器，用于在两种状态之间进行切换。</p>

      {/* 基础用法 */}
      <Section title="基础用法">
        <DemoRow title="默认开关">
          <Switch 
            checked={basicChecked}
            onChange={setBasicChecked}
          />
          <span style={{ marginLeft: '8px' }}>{basicChecked ? '开' : '关'}</span>
        </DemoRow>
        <CopyBlock code={`import { Switch } from '@zjpcy/simple-design';

const Demo = () => {
  const [checked, setChecked] = useState(false);
  
  return (
    <Switch 
      checked={checked}
      onChange={setChecked}
    />
  );
};`} />
      </Section>

      {/* 默认值 */}
      <Section title="默认值">
        <DemoRow title="默认选中">
          <Switch 
            defaultChecked={true}
            onChange={(val) => console.log('开关状态:', val)}
          />
        </DemoRow>
        <CopyBlock code={`import { Switch } from '@zjpcy/simple-design';

// 默认选中的开关
<Switch defaultChecked={true} />

// 默认未选中的开关
<Switch defaultChecked={false} />`} />
      </Section>

      {/* 禁用状态 */}
      <Section title="禁用状态">
        <DemoRow title="禁用未选中">
          <Switch disabled={true} />
        </DemoRow>
        <DemoRow title="禁用已选中">
          <Switch disabled={true} defaultChecked={true} />
        </DemoRow>
        <CopyBlock code={`import { Switch } from '@zjpcy/simple-design';

// 禁用未选中
<Switch disabled />

// 禁用已选中
<Switch disabled defaultChecked={true} />`} />
      </Section>

      {/* 加载中 */}
      <Section title="加载中">
        <DemoRow title="加载中">
          <Switch 
            loading={true}
            defaultChecked={false}
          />
        </DemoRow>
        <DemoRow title="加载中(已选中)">
          <Switch 
            loading={true}
            defaultChecked={true}
          />
        </DemoRow>
        <CopyBlock code={`import { Switch } from '@zjpcy/simple-design';

// 加载中
<Switch loading />

// 加载中且已选中
<Switch loading defaultChecked={true} />`} />
      </Section>

      {/* 不同尺寸 */}
      <Section title="不同尺寸">
        <DemoRow title="Default">
          <Switch 
            size="default"
            checked={basicChecked}
            onChange={setBasicChecked}
          />
        </DemoRow>
        <DemoRow title="Small">
          <Switch 
            size="small"
            checked={smallChecked}
            onChange={setSmallChecked}
          />
        </DemoRow>
        <CopyBlock code={`import { Switch } from '@zjpcy/simple-design';

// 默认尺寸
<Switch size="default" />

// 小尺寸
<Switch size="small" />`} />
      </Section>

      {/* 文字内容 */}
      <Section title="文字内容">
        <DemoRow title="文字开关">
          <Switch
            checked={textChecked}
            onChange={setTextChecked}
            checkedChildren="开启"
            unCheckedChildren="关闭"
          />
        </DemoRow>
        <DemoRow title="图标开关">
          <Switch
            defaultChecked={true}
            checkedChildren="✓"
            unCheckedChildren="✗"
          />
        </DemoRow>
        <DemoRow title="小尺寸文字">
          <Switch
            size="small"
            checkedChildren="开"
            unCheckedChildren="关"
          />
        </DemoRow>
        <DemoRow title="较长文本">
          <Switch
            checkedChildren="已开启"
            unCheckedChildren="已关闭"
          />
        </DemoRow>
        <CopyBlock code={`import { Switch } from '@zjpcy/simple-design';

// 文字开关
<Switch
  checkedChildren="开启"
  unCheckedChildren="关闭"
/>

// 图标开关
<Switch
  checkedChildren="✓"
  unCheckedChildren="✗"
/>

// 小尺寸文字
<Switch
  size="small"
  checkedChildren="开"
  unCheckedChildren="关"
/>

// 较长文本也能完整显示
<Switch
  checkedChildren="已开启"
  unCheckedChildren="已关闭"
/>`} />
      </Section>

      {/* 自定义宽度 */}
      <Section title="自定义宽度">
        <DemoRow title="宽度 60px">
          <Switch width={60} defaultChecked={false} />
        </DemoRow>
        <DemoRow title="宽度 80px">
          <Switch width={80} defaultChecked={true} />
        </DemoRow>
        <DemoRow title="宽度 100px">
          <Switch width={100} checkedChildren="开启" unCheckedChildren="关闭" />
        </DemoRow>
        <DemoRow title="小尺寸 + 自定义宽度">
          <Switch size="small" width={50} />
        </DemoRow>
        <CopyBlock code={`import { Switch } from '@zjpcy/simple-design';

// 自定义宽度 60px
<Switch width={60} />

// 自定义宽度 80px
<Switch width={80} defaultChecked={true} />

// 自定义宽度 100px + 文字内容
<Switch width={100} checkedChildren="开启" unCheckedChildren="关闭" />

// 小尺寸 + 自定义宽度
<Switch size="small" width={50} />`} />
      </Section>

      {/* 自定义样式 */}
      <Section title="自定义样式">
        <DemoRow title="自定义颜色">
          <Switch
            styles={{
              track: { backgroundColor: '#52c41a' },
              thumb: { backgroundColor: '#f0f0f0' }
            }}
            onChange={(val) => console.log('自定义开关:', val)}
          />
        </DemoRow>
        <CopyBlock code={`import { Switch } from '@zjpcy/simple-design';

<Switch
  styles={{
    track: { backgroundColor: '#52c41a' },
    thumb: { backgroundColor: '#f0f0f0' }
  }}
/>`} />
      </Section>
      
      {/* 标签 */}
      <Section title="标签">
        <DemoRow title="基本用法">
          <Switch
            label="启用"
            checked={basicChecked}
            onChange={setBasicChecked}
          />
        </DemoRow>
        <DemoRow title="自定义间距">
          <Switch
            label="通知"
            labelGap={20}
            checked={loadingChecked}
            onChange={setLoadingChecked}
          />
        </DemoRow>
        <DemoRow title="自定义样式">
          <Switch
            label="自动保存"
            labelGap={12}
            labelStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            checked={smallChecked}
            onChange={setSmallChecked}
          />
        </DemoRow>
        <DemoRow title="自定义类名">
          <Switch
            label="同步"
            labelGap={8}
            labelClassName="custom-label"
            checked={textChecked}
            onChange={setTextChecked}
          />
        </DemoRow>
        <CopyBlock code={`import { Switch } from '@zjpcy/simple-design';

// 基本用法
<Switch label="启用" checked={checked} onChange={setChecked} />

// 自定义间距
<Switch label="通知" labelGap={20} checked={checked} onChange={setChecked} />

// 自定义样式
<Switch
  label="自动保存"
  labelGap={12}
  labelStyle={{ color: '#1890ff', fontWeight: 'bold' }}
  checked={checked}
  onChange={setChecked}
/>

// 自定义类名
<Switch
  label="同步"
  labelGap={8}
  labelClassName="custom-label"
  checked={checked}
  onChange={setChecked}
/>`} />
      </Section>
      
      {/* 事件回调 */}
      <Section title="事件回调">
        <DemoRow title="监听变化">
          <Switch 
            checked={loadingChecked}
            onChange={setLoadingChecked}
          />
          <span style={{ marginLeft: '8px' }}>状态: {loadingChecked ? '开启' : '关闭'}</span>
        </DemoRow>
        <CopyBlock code={`import { Switch } from '@zjpcy/simple-design';

const Demo = () => {
  const [checked, setChecked] = useState(false);
  
  return (
    <Switch 
      checked={checked}
      onChange={(checked) => {
        console.log('开关状态变为:', checked);
        setChecked(checked);
      }}
    />
  );
};`} />
      </Section>

      {/* API 文档 */}
      <Section title="API">
        <h3>Props</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>属性</th>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>说明</th>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>类型</th>
              <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>默认值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>checked</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>指定当前是否选中（受控模式）</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>boolean</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>defaultChecked</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>初始是否选中（非受控模式）</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>boolean</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>false</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>disabled</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>是否禁用</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>boolean</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>false</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>loading</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>加载中的开关</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>boolean</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>false</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>size</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>开关大小</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>'default' | 'small'</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>'default'</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>width</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>自定义宽度（单位：px）</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>number</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>checkedChildren</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>选中时的内容</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>ReactNode</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>unCheckedChildren</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>非选中时的内容</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>ReactNode</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>styles</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>自定义组件内部各语义化结构的行内 style</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>Object</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>onChange</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>变化时的回调函数</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>(checked: boolean) =&gt; void</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>label</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>标签文案，显示在开关前面</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>string | ReactNode</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>labelGap</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>标签到开关的距离</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>string | number</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>8</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>labelClassName</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>标签的CSS类名</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>string</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>labelStyle</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>标签的样式</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>CSSProperties</td>
              <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
            </tr>
          </tbody>
        </table>
      </Section>
    </div>
  );
};

export default SwitchExample;
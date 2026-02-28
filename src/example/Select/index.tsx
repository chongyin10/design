import React, { useState } from 'react';
import { Flex } from '../../components';
import Select from '../../components/Select';
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

// 基础选项
const basicOptions = [
    { value: '1', label: '选项一' },
    { value: '2', label: '选项二' },
    { value: '3', label: '选项三' },
];

// 城市选项
const cityOptions = [
    { value: 'beijing', label: '北京' },
    { value: 'shanghai', label: '上海' },
    { value: 'guangzhou', label: '广州' },
    { value: 'shenzhen', label: '深圳' },
    { value: 'hangzhou', label: '杭州' },
    { value: 'chengdu', label: '成都' },
];

// 带禁用的选项
const disabledOptions = [
    { value: 'apple', label: '苹果' },
    { value: 'banana', label: '香蕉' },
    { value: 'orange', label: '橙子', disabled: true },
    { value: 'grape', label: '葡萄' },
];

const SelectExample: React.FC = () => {
    const [singleValue, setSingleValue] = useState<string>('');
    const [multipleValue, setMultipleValue] = useState<(string | number)[]>([]);
    const [cityValue, setCityValue] = useState<string>('');

    return (
        <div style={{ padding: '20px' }}>
            <h1>Select 选择器</h1>
            <p>下拉选择器，用于从一组选项中选择一项或多项。</p>

            {/* 基础用法 */}
            <Section title="基础用法">
                <DemoRow title="默认选择器">
                    <Select
                        options={basicOptions}
                        value={singleValue}
                        onChange={(value) => setSingleValue(value as string)}
                        placeholder="请选择"
                        style={{ width: '200px' }}
                    />
                </DemoRow>
                <CopyBlock code={`import { Select } from '@zjpcy/simple-design';

const options = [
  { value: '1', label: '选项一' },
  { value: '2', label: '选项二' },
  { value: '3', label: '选项三' },
];

<Select
  options={options}
  placeholder="请选择"
/>`} />
            </Section>

            {/* 默认值 */}
            <Section title="默认值">
                <DemoRow title="默认选中">
                    <Select
                        options={basicOptions}
                        defaultValue="1"
                        placeholder="请选择"
                        style={{ width: '200px' }}
                    />
                </DemoRow>
                <CopyBlock code={`<Select
  options={options}
  defaultValue="1"
  placeholder="请选择"
/>`} />
            </Section>

            {/* 尺寸 */}
            <Section title="尺寸">
                <DemoRow title="小尺寸">
                    <Select
                        options={basicOptions}
                        size="small"
                        placeholder="小尺寸"
                        style={{ width: '200px' }}
                    />
                </DemoRow>
                <DemoRow title="默认尺寸">
                    <Select
                        options={basicOptions}
                        size="default"
                        placeholder="默认尺寸"
                        style={{ width: '200px' }}
                    />
                </DemoRow>
                <DemoRow title="大尺寸">
                    <Select
                        options={basicOptions}
                        size="large"
                        placeholder="大尺寸"
                        style={{ width: '200px' }}
                    />
                </DemoRow>
                <CopyBlock code={`// 小尺寸
<Select size="small" options={options} />

// 默认尺寸
<Select size="default" options={options} />

// 大尺寸
<Select size="large" options={options} />`} />
            </Section>

            {/* 禁用状态 */}
            <Section title="禁用状态">
                <DemoRow title="禁用选择器">
                    <Select
                        options={basicOptions}
                        disabled
                        placeholder="禁用状态"
                        style={{ width: '200px' }}
                    />
                </DemoRow>
                <DemoRow title="禁用选项">
                    <Select
                        options={disabledOptions}
                        placeholder="橙子被禁用"
                        style={{ width: '200px' }}
                    />
                </DemoRow>
                <CopyBlock code={`// 禁用选择器
<Select options={options} disabled />

// 禁用特定选项
const options = [
  { value: 'apple', label: '苹果' },
  { value: 'orange', label: '橙子', disabled: true },
];
<Select options={options} />`} />
            </Section>

            {/* 可清除 */}
            <Section title="可清除">
                <DemoRow title="可清除">
                    <Select
                        options={basicOptions}
                        clearable
                        defaultValue="1"
                        placeholder="可清除"
                        style={{ width: '200px' }}
                    />
                </DemoRow>
                <CopyBlock code={`<Select options={options} clearable />`} />
            </Section>

            {/* 加载中 */}
            <Section title="加载中">
                <DemoRow title="加载中">
                    <Select
                        options={basicOptions}
                        loading
                        placeholder="加载中..."
                        style={{ width: '200px' }}
                    />
                </DemoRow>
                <CopyBlock code={`<Select options={options} loading />`} />
            </Section>

            {/* 可搜索 */}
            <Section title="可搜索">
                <DemoRow title="可搜索">
                    <Select
                        options={cityOptions}
                        searchable
                        placeholder="可搜索的城市"
                        style={{ width: '200px' }}
                    />
                </DemoRow>
                <CopyBlock code={`<Select options={options} searchable />`} />
            </Section>

            {/* 多选模式 */}
            <Section title="多选模式">
                <DemoRow title="多选">
                    <Select
                        mode="multiple"
                        options={cityOptions}
                        value={multipleValue}
                        onChange={(value) => setMultipleValue(value as (string | number)[])}
                        placeholder="请选择城市"
                        style={{ width: '320px' }}
                    />
                </DemoRow>
                <DemoRow title="多选（可清除）">
                    <Select
                        mode="multiple"
                        options={cityOptions}
                        clearable
                        placeholder="请选择城市"
                        style={{ width: '320px' }}
                    />
                </DemoRow>
                <CopyBlock code={`const [values, setValues] = useState([]);

<Select
  mode="multiple"
  options={options}
  value={values}
  onChange={setValues}
/>`} />
            </Section>

            {/* 带标签 */}
            <Section title="带标签">
                <DemoRow title="前置标签">
                    <Select
                        options={cityOptions}
                        label="城市"
                        placeholder="请选择城市"
                        style={{ width: '200px' }}
                    />
                </DemoRow>
                <DemoRow title="自定义间距">
                    <Select
                        options={cityOptions}
                        label="城市"
                        labelGap={16}
                        placeholder="请选择城市"
                        style={{ width: '200px' }}
                    />
                </DemoRow>
                <CopyBlock code={`// 基础标签
<Select options={options} label="城市" />

// 自定义标签间距
<Select options={options} label="城市" labelGap={16} />`} />
            </Section>

            {/* 事件回调 */}
            <Section title="事件回调">
                <DemoRow title="事件监听">
                    <Select
                        options={cityOptions}
                        value={cityValue}
                        onChange={(value, option) => {
                            setCityValue(value as string);
                            console.log('选中值:', value);
                            console.log('选中选项:', option);
                        }}
                        onOpenChange={(open) => console.log('下拉状态:', open)}
                        onSearch={(value) => console.log('搜索值:', value)}
                        searchable
                        placeholder="带事件监听"
                        style={{ width: '200px' }}
                    />
                </DemoRow>
                <CopyBlock code={`<Select
  options={options}
  onChange={(value, option) => {
    console.log('选中值:', value);
    console.log('选中选项:', option);
  }}
  onOpenChange={(open) => console.log('下拉状态:', open)}
  onSearch={(value) => console.log('搜索值:', value)}
/>`} />
            </Section>

            {/* 自定义空状态 */}
            <Section title="自定义空状态">
                <DemoRow title="自定义空状态">
                    <Select
                        options={[]}
                        placeholder="无数据"
                        emptyContent="暂无可用选项"
                        style={{ width: '200px' }}
                    />
                </DemoRow>
                <CopyBlock code={`<Select
  options={[]}
  emptyContent="暂无可用选项"
/>`} />
            </Section>

            {/* 自定义样式 */}
            <Section title="自定义样式">
                <DemoRow title="自定义样式">
                    <Select
                        options={basicOptions}
                        placeholder="自定义样式"
                        styles={{
                            selector: {
                                borderRadius: '20px',
                            },
                            dropdown: {
                                borderRadius: '12px',
                            }
                        }}
                        style={{ width: '200px' }}
                    />
                </DemoRow>
                <CopyBlock code={`<Select
  options={options}
  styles={{
    selector: { borderRadius: '20px' },
    dropdown: { borderRadius: '12px' },
    option: { padding: '12px 16px' }
  }}
/>`} />
            </Section>
        </div>
    );
};

export default SelectExample;

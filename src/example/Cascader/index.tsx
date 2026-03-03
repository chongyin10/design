import React, { useState, useEffect } from 'react';
import { Cascader, Flex, Table, CopyToClipboard, Anchor } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Cascader.css';

// 代码块组件
const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'tsx' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative', marginTop: '16px' }}>
      <div className="code-header">
        <CopyToClipboard url={code} onCopyStatusChange={handleCopy}>
          <button className="copy-button">
            {copied ? '已复制' : '复制'}
          </button>
        </CopyToClipboard>
      </div>
      <SyntaxHighlighter language={language} style={vscDarkPlus}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const CascaderExample: React.FC = () => {
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  // 示例数据
  const options = [
    {
      value: 'zhejiang',
      label: '浙江省',
      children: [
        {
          value: 'hangzhou',
          label: '杭州市',
          children: [
            {
              value: 'xihu',
              label: '西湖区'
            },
            {
              value: 'gongshu',
              label: '拱墅区'
            },
            {
              value: 'jianggan',
              label: '江干区'
            },
            {
              value: 'xiaoshan',
              label: '萧山区'
            }
          ]
        },
        {
          value: 'ningbo',
          label: '宁波市',
          children: [
            {
              value: 'haishu',
              label: '海曙区'
            },
            {
              value: 'jiangbei',
              label: '江北区'
            },
            {
              value: 'zhenhai',
              label: '镇海区'
            }
          ]
        },
        {
          value: 'wenzhou',
          label: '温州市',
          children: [
            {
              value: 'lucheng',
              label: '鹿城区'
            },
            {
              value: 'longwan',
              label: '龙湾区'
            }
          ]
        }
      ]
    },
    {
      value: 'jiangsu',
      label: '江苏省',
      children: [
        {
          value: 'nanjing',
          label: '南京市',
          children: [
            {
              value: 'xuanwu',
              label: '玄武区'
            },
            {
              value: 'qinhuai',
              label: '秦淮区'
            },
            {
              value: 'jianye',
              label: '建邺区'
            }
          ]
        },
        {
          value: 'suzhou',
          label: '苏州市',
          children: [
            {
              value: 'gusu',
              label: '姑苏区'
            },
            {
              value: 'wuzhong',
              label: '吴中区'
            },
            {
              value: 'xiangcheng',
              label: '相城区'
            }
          ]
        }
      ]
    },
    {
      value: 'shanghai',
      label: '上海市',
      children: [
        {
          value: 'pudong',
          label: '浦东新区',
          children: [
            {
              value: 'lujiazui',
              label: '陆家嘴街道'
            },
            {
              value: 'tangzhen',
              label: '唐镇'
            }
          ]
        },
        {
          value: 'minhang',
          label: '闵行区',
          children: [
            {
              value: 'xinzhuang',
              label: '莘庄镇'
            },
            {
              value: 'qibao',
              label: '七宝镇'
            }
          ]
        }
      ]
    }
  ];

  const [value, setValue] = useState<any[]>([]);
  const [value2, setValue2] = useState<any[]>([]);
  const [value3, setValue3] = useState<any[]>([]);
  const [value4, setValue4] = useState<any[]>(['zhejiang', 'hangzhou', 'xihu']);
  const [checkboxValue, setCheckboxValue] = useState<any[][]>([]);

  const handleChange = (value: any[], selectedOptions: any[]) => {
    console.log('选中的值:', value);
    console.log('选中的选项:', selectedOptions);
    setValue(value);
  };

  const handleChange2 = (value: any[]) => {
    setValue2(value);
  };

  const handleChange3 = (value: any[]) => {
    setValue3(value);
  };

  const handleChange4 = (value: any[]) => {
    setValue4(value);
  };

  const handleCheckboxChange = (value: any[][], selectedOptions: any[]) => {
    console.log('多选选中的值:', value);
    console.log('多选选中的选项:', selectedOptions);
    console.log('selectedOptions:', selectedOptions);
    setCheckboxValue(value);
  };

  const apiColumns: Column[] = [
    { dataIndex: 'name', title: '属性名', width: '150px' },
    { dataIndex: 'type', title: '类型', width: '200px' },
    { dataIndex: 'default', title: '默认值', width: '120px' },
    { dataIndex: 'description', title: '描述' }
  ];

  const apiDataSource = [
    { name: 'value', type: 'any[]', default: '[]', description: '当前选中的值（多选模式下为多个值路径的数组）' },
    { name: 'defaultValue', type: 'any[]', default: '[]', description: '默认选中的值' },
    { name: 'onChange', type: '(value, selectedOptions) => void', default: '-', description: '选项改变时的回调' },
    { name: 'options', type: 'CascaderOption[]', default: '[]', description: '可选项数据源' },
    { name: 'placeholder', type: 'string', default: '\'请选择\'', description: '选择框默认文字' },
    { name: 'disabled', type: 'boolean', default: 'false', description: '是否禁用' },
    { name: 'size', type: 'large | middle | small', default: '\'middle\'', description: '选择框大小' },
    { name: 'allowClear', type: 'boolean', default: 'true', description: '是否显示清除按钮' },
    { name: 'expandTrigger', type: 'click | hover', default: '\'click\'', description: '次级菜单的展开方式' },
    { name: 'changeOnSelect', type: 'boolean', default: 'false', description: '当此项为 true 时，点选每级菜单选项值都会发生变化' },
    { name: 'fieldNames', type: 'object', default: '-', description: '自定义选项的字段名' },
    { name: 'width', type: 'number | string', default: '-', description: '组件宽度' },
    { name: 'dropdownWidth', type: 'number | string', default: '-', description: '下拉框宽度' },
    { name: 'dropdownHeight', type: 'number | string', default: '-', description: '下拉框高度' },
    { name: 'dropdownStyle', type: 'CSSProperties', default: '-', description: '下拉框样式对象' },
    { name: 'dropdownClassName', type: 'string', default: '-', description: '下拉框的自定义类名' },
    { name: 'placement', type: 'bottomLeft | bottomRight | topLeft | topRight', default: '\'bottomLeft\'', description: '下拉菜单的弹出位置' },
    { name: 'checkbox', type: 'boolean', default: 'false', description: '是否启用多选模式（启用后显示复选框，支持多选）' },
    { name: 'autoWidth', type: 'boolean', default: 'false', description: '是否根据内容自动调整宽度，默认为 false（不自动扩展，超出显示省略号）' }
  ];

  const optionColumns: Column[] = [
    { dataIndex: 'name', title: '属性名', width: '150px' },
    { dataIndex: 'type', title: '类型', width: '200px' },
    { dataIndex: 'default', title: '默认值', width: '120px' },
    { dataIndex: 'description', title: '描述' }
  ];

  const optionDataSource = [
    { name: 'value', type: 'any', default: '-', description: '选项的值' },
    { name: 'label', type: 'ReactNode', default: '-', description: '选项的标签' },
    { name: 'disabled', type: 'boolean', default: 'false', description: '是否禁用该选项' },
    { name: 'children', type: 'CascaderOption[]', default: '-', description: '子选项' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="cascader-intro">Cascader 级联选择框</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            一级菜单为上下级结构关系（垂直下拉），二级及以后的多级菜单为左右平铺关系（水平展开）的级联选择器。
          </p>

          {/* 基础用法 */}
          <div id="cascader-basic" style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>基础用法</h2>
        <Flex direction="column" gap="middle">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>默认用法</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                value={value}
                onChange={handleChange}
                placeholder="请选择所在地区"
              />
            </div>
            <p style={{ color: '#666', marginTop: '8px' }}>
              当前选中: {value.length > 0 ? value.join(' / ') : '未选择'}
            </p>
            <CodeBlock
              code={`import { Cascader } from '@zjpcy/simple-design';

function App() {
  const [value, setValue] = useState<any[]>([]);

  const handleChange = (value: any[], selectedOptions: any[]) => {
    console.log('选中的值:', value);
    console.log('选中的选项:', selectedOptions);
    setValue(value);
  };

  return (
    <Cascader
      options={options}
      value={value}
      onChange={handleChange}
      placeholder="请选择所在地区"
    />
  );
}`}
            />
          </div>
        </Flex>
          </div>

          {/* 默认值 */}
          <div id="cascader-default" style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>默认值</h2>
        <Flex direction="column" gap="middle">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>设置默认选中项</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                defaultValue={value4}
                onChange={handleChange4}
                placeholder="请选择所在地区"
              />
            </div>
            <CodeBlock
              code={`const defaultOptions = ['zhejiang', 'hangzhou', 'xihu'];

<Cascader
  options={options}
  defaultValue={defaultOptions}
  onChange={handleChange}
  placeholder="请选择所在地区"
/>`}
            />
          </div>
        </Flex>
          </div>

          {/* 禁用 */}
          <div id="cascader-disabled" style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>禁用</h2>
        <Flex direction="column" gap="middle">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>整个组件禁用</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                value={value2}
                onChange={handleChange2}
                disabled
                placeholder="禁用状态"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  disabled
  placeholder="禁用状态"
/>`}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>禁用选项</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={[
                  {
                    value: 'zhejiang',
                    label: '浙江省',
                    disabled: true,
                    children: [
                      {
                        value: 'hangzhou',
                        label: '杭州市'
                      }
                    ]
                  },
                  {
                    value: 'jiangsu',
                    label: '江苏省',
                    children: [
                      {
                        value: 'nanjing',
                        label: '南京市',
                        disabled: true
                      },
                      {
                        value: 'suzhou',
                        label: '苏州市'
                      }
                    ]
                  }
                ]}
                placeholder="禁用某些选项"
              />
            </div>
            <CodeBlock
              code={`const options = [
  {
    value: 'zhejiang',
    label: '浙江省',
    disabled: true,
    children: [
      { value: 'hangzhou', label: '杭州市' }
    ]
  },
  {
    value: 'jiangsu',
    label: '江苏省',
    children: [
      { value: 'nanjing', label: '南京市', disabled: true },
      { value: 'suzhou', label: '苏州市' }
    ]
  }
];

<Cascader
  options={options}
  placeholder="禁用某些选项"
/>`}
            />
          </div>
        </Flex>
          </div>

          {/* 多选模式 */}
          <div id="cascader-checkbox" style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>多选模式</h2>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          通过设置 <code>checkbox</code> 属性为 true，启用多选模式，支持同时选择多个选项
        </p>
        <Flex direction="column" gap="middle">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>基础多选</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                value={checkboxValue}
                onChange={handleCheckboxChange}
                checkbox
                placeholder="请选择多个地区"
              />
            </div>
            <p style={{ color: '#666', marginTop: '8px' }}>
              已选择 {checkboxValue.length} 个选项
            </p>
            <CodeBlock
              code={`function App() {
  const [value, setValue] = useState<any[][]>([]);

  const handleChange = (value: any[][], selectedOptions: any[]) => {
    console.log('选中的值:', value);
    console.log('选中的选项:', selectedOptions);
    setValue(value);
  };

  return (
    <Cascader
      options={options}
      value={value}
      onChange={handleChange}
      checkbox
      placeholder="请选择多个地区"
    />
  );
}`}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>多选 + 宽度</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                value={checkboxValue}
                onChange={handleCheckboxChange}
                checkbox
                width={300}
                placeholder="多选且限制宽度"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  checkbox
  width={300}
  placeholder="多选且限制宽度"
/>`}
            />
          </div>
        </Flex>
          </div>

          {/* 尺寸 */}
          <div id="cascader-size" style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>尺寸</h2>
        <Flex direction="column" gap="middle">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>不同尺寸</h3>
            <Flex gap="middle" style={{ marginBottom: '16px' }} align="center">
              <Cascader
                options={options}
                size="large"
                placeholder="大尺寸"
              />
              <Cascader
                options={options}
                size="middle"
                placeholder="中等尺寸"
              />
              <Cascader
                options={options}
                size="small"
                placeholder="小尺寸"
              />
            </Flex>
            <CodeBlock
              code={`<Cascader
  options={options}
  size="large"
  placeholder="大尺寸"
/>

<Cascader
  options={options}
  size="middle"
  placeholder="中等尺寸"
/>

<Cascader
  options={options}
  size="small"
  placeholder="小尺寸"
/>`}
            />
          </div>
        </Flex>
          </div>

          {/* 可清空 */}
          <div id="cascader-clear" style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>可清空</h2>
        <Flex direction="column" gap="middle">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>允许清除</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                value={value3}
                onChange={handleChange3}
                allowClear
                placeholder="可清空的选择器"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  allowClear
  placeholder="可清空的选择器"
/>`}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>不允许清除</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                value={value3}
                onChange={handleChange3}
                allowClear={false}
                placeholder="不可清空的选择器"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  allowClear={false}
  placeholder="不可清空的选择器"
/>`}
            />
          </div>
        </Flex>
          </div>

          {/* 展开触发方式 */}
          <div id="cascader-trigger" style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>展开触发方式</h2>
        <Flex direction="column" gap="middle">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>点击展开（默认）</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                expandTrigger="click"
                placeholder="点击展开"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  expandTrigger="click"
  placeholder="点击展开"
/>`}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>悬停展开</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                expandTrigger="hover"
                placeholder="悬停展开"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  expandTrigger="hover"
  placeholder="悬停展开"
/>`}
            />
          </div>
        </Flex>
          </div>

          {/* 任意级别可选 */}
          <div id="cascader-change" style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>任意级别可选</h2>
        <Flex direction="column" gap="middle">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>changeOnSelect = true</h3>
            <p style={{ color: '#666', marginBottom: '8px' }}>
              当此项为 true 时，点选每级菜单选项值都会发生变化
            </p>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                changeOnSelect
                placeholder="可以选择任意级别"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  changeOnSelect
  placeholder="可以选择任意级别"
/>`}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>changeOnSelect = false（默认）</h3>
            <p style={{ color: '#666', marginBottom: '8px' }}>
              只能选择最后一级
            </p>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                changeOnSelect={false}
                placeholder="只能选择最后一级"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  changeOnSelect={false}
  placeholder="只能选择最后一级"
/>`}
            />
          </div>
        </Flex>
          </div>

          {/* 自定义字段名 */}
          <div id="cascader-field" style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>自定义字段名</h2>
        <Flex direction="column" gap="middle">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>使用自定义字段名</h3>
            <p style={{ color: '#666', marginBottom: '8px' }}>
              当数据源使用非标准的字段名时，可以通过 fieldNames 进行映射
            </p>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={[
                  {
                    value: 'zhejiang',
                    label: '浙江省',
                    children: [
                      {
                        value: 'hangzhou',
                        label: '杭州市',
                        children: [
                          { value: 'xihu', label: '西湖区' },
                          { value: 'gongshu', label: '拱墅区' },
                          { value: 'jianggan', label: '江干区' }
                        ]
                      },
                      {
                        value: 'ningbo',
                        label: '宁波市',
                        children: [
                          { value: 'haishu', label: '海曙区' },
                          { value: 'jiangbei', label: '江北区' }
                        ]
                      }
                    ]
                  },
                  {
                    value: 'jiangsu',
                    label: '江苏省',
                    children: [
                      {
                        value: 'nanjing',
                        label: '南京市',
                        children: [
                          { value: 'xuanwu', label: '玄武区' },
                          { value: 'qinhuai', label: '秦淮区' }
                        ]
                      },
                      {
                        value: 'suzhou',
                        label: '苏州市',
                        children: [
                          { value: 'gusu', label: '姑苏区' },
                          { value: 'wuzhong', label: '吴中区' }
                        ]
                      }
                    ]
                  }
                ]}
                fieldNames={{
                  label: 'label',
                  value: 'value',
                  children: 'children'
                }}
                placeholder="请选择所在地区（使用自定义字段）"
              />
            </div>
            <CodeBlock
              code={`// 使用自定义字段名（假设后端返回的字段名）
const customOptions = [
  {
    id: 'zhejiang',
    name: '浙江省',
    items: [
      {
        id: 'hangzhou',
        name: '杭州市',
        items: [
          { id: 'xihu', name: '西湖区' },
          { id: 'gongshu', name: '拱墅区' }
        ]
      }
    ]
  }
] as any[]; // 需要添加类型断言，因为使用了非标准字段名

<Cascader
  options={customOptions}
  fieldNames={{
    label: 'name',      // 将 name 映射为 label
    value: 'id',        // 将 id 映射为 value
    children: 'items'   // 将 items 映射为 children
  }}
  placeholder="请选择所在地区"
/>`}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>使用自定义字段名 + 多选</h3>
            <p style={{ color: '#666', marginBottom: '8px' }}>
              多选模式下同样支持自定义字段名
            </p>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={[
                  {
                    value: 'china',
                    label: '中国',
                    children: [
                      {
                        value: 'zhejiang',
                        label: '浙江省',
                        children: [
                          { value: 'hangzhou', label: '杭州市' },
                          { value: 'ningbo', label: '宁波市' }
                        ]
                      },
                      {
                        value: 'jiangsu',
                        label: '江苏省',
                        children: [
                          { value: 'nanjing', label: '南京市' },
                          { value: 'suzhou', label: '苏州市' }
                        ]
                      }
                    ]
                  }
                ]}
                fieldNames={{
                  label: 'label',
                  value: 'value',
                  children: 'children'
                }}
                checkbox
                placeholder="多选模式 + 自定义字段"
              />
            </div>
            <CodeBlock
              code={`const customOptions = [
  {
    code: 'zhejiang',
    text: '浙江省',
    list: [
      { code: 'hangzhou', text: '杭州市' },
      { code: 'ningbo', text: '宁波市' }
    ]
  }
] as any[]; // 需要添加类型断言，因为使用了非标准字段名

<Cascader
  options={customOptions}
  fieldNames={{
    label: 'text',
    value: 'code',
    children: 'list'
  }}
  checkbox
  placeholder="多选模式 + 自定义字段"
/>`}
            />
          </div>
        </Flex>
          </div>

          {/* 空状态 */}
          <div id="cascader-empty" style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>空状态</h2>
        <Flex direction="column" gap="middle">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>整个数据为空</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={[]}
                placeholder="暂无数据"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={[]}
  placeholder="暂无数据"
/>`}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>某一级菜单为空</h3>
            <p style={{ color: '#666', marginBottom: '8px' }}>
              当某个选项的子项为空时，该级菜单会显示空状态提示
            </p>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={[
                  {
                    value: 'empty',
                    label: '空数据',
                    children: []
                  },
                  {
                    value: 'has-data',
                    label: '有数据',
                    children: [
                      { value: 'item-1', label: '选项1' },
                      { value: 'item-2', label: '选项2' }
                    ]
                  }
                ]}
                placeholder="选择一项查看空状态"
              />
            </div>
            <CodeBlock
              code={`const options = [
  {
    value: 'empty',
    label: '空数据',
    children: []
  },
  {
    value: 'has-data',
    label: '有数据',
    children: [
      { value: 'item-1', label: '选项1' },
      { value: 'item-2', label: '选项2' }
    ]
  }
];

<Cascader
  options={options}
  placeholder="选择一项查看空状态"
/>`}
            />
          </div>
        </Flex>
          </div>

          {/* 尺寸控制 */}
          <div id="cascader-dimension" style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>尺寸控制</h2>
        <Flex direction="column" gap="middle">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>设置组件宽度</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                width={400}
                placeholder="宽度设置为400px"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  width={400}
  placeholder="宽度设置为400px"
/>`}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>设置下拉框宽度</h3>
            <p style={{ color: '#666', marginBottom: '8px' }}>
              下拉框宽度独立于组件宽度设置
            </p>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                dropdownWidth={400}
                placeholder="下拉框宽度设置为400px"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  dropdownWidth={400}
  placeholder="下拉框宽度设置为400px"
/>`}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>设置下拉框高度</h3>
            <p style={{ color: '#666', marginBottom: '8px' }}>
              下拉框超过指定高度时会出现滚动条
            </p>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                dropdownHeight={180}
                placeholder="下拉框高度设置为180px"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  dropdownHeight={180}
  placeholder="下拉框高度设置为180px"
/>`}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>自定义下拉框样式</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                dropdownStyle={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '12px',
                  border: '2px solid #ff6b6b'
                }}
                placeholder="自定义下拉框样式"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  dropdownStyle={{
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    border: '2px solid #ff6b6b'
  }}
  placeholder="自定义下拉框样式"
/>`}
            />
          </div>
        </Flex>
          </div>

          {/* 弹出位置 */}
          <div id="cascader-placement" style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>弹出位置</h2>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          支持 4 个弹出位置：bottomLeft（默认）、bottomRight、topLeft、topRight
        </p>
        <Flex direction="column" gap="middle">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>bottomLeft（默认）</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                placement="bottomLeft"
                placeholder="左下方弹出"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  placement="bottomLeft"
  placeholder="左下方弹出（默认）"
/>`}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>bottomRight</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                placement="bottomRight"
                placeholder="右下方弹出"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  placement="bottomRight"
  placeholder="右下方弹出"
/>`}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>topLeft</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                placement="topLeft"
                placeholder="左上方弹出"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  placement="topLeft"
  placeholder="左上方弹出"
/>`}
            />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>topRight</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                placement="topRight"
                placeholder="右上方弹出"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  placement="topRight"
  placeholder="右上方弹出"
/>`}
            />
          </div>
        </Flex>
          </div>

          {/* 组合使用 */}
          <div id="cascader-combination" style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>组合使用</h2>
        <Flex direction="column" gap="middle">
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>宽度 + 高度 + 位置</h3>
            <div style={{ marginBottom: '16px' }}>
              <Cascader
                options={options}
                width={350}
                dropdownWidth={500}
                dropdownHeight={180}
                placement="bottomRight"
                placeholder="组合使用多个参数"
              />
            </div>
            <CodeBlock
              code={`<Cascader
  options={options}
  width={350}
  dropdownWidth={500}
  dropdownHeight={180}
  placement="bottomRight"
  placeholder="组合使用多个参数"
/>`}
            />
          </div>
        </Flex>
          </div>

          {/* API 文档 */}
          <div id="cascader-api" style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>API 文档</h2>
        <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px' }}>Cascader Props</h3>
        <Table
          columns={apiColumns}
          dataSource={apiDataSource}
          pagination={false}
        />

        <h3 style={{ fontSize: '18px', fontWeight: '500', marginTop: '32px', marginBottom: '16px' }}>CascaderOption</h3>
        <Table
          columns={optionColumns}
          dataSource={optionDataSource}
          pagination={false}
        />
          </div>
        </div>

        {/* 右侧锚点导航 */}
        <div style={{ width: '140px', flexShrink: 0 }}>
          <div style={{ position: 'fixed', top: '100px', right: '40px', width: '140px' }}>
            {scrollContainer && (
              <Anchor
                getContainer={() => scrollContainer}
                offsetTop={20}
                affix={false}
                bounds={30}
              >
                <Anchor.Link href="#cascader-intro" title="组件介绍" />
                <Anchor.Link href="#cascader-basic" title="基础用法" />
                <Anchor.Link href="#cascader-default" title="默认值" />
                <Anchor.Link href="#cascader-disabled" title="禁用" />
                <Anchor.Link href="#cascader-checkbox" title="多选模式" />
                <Anchor.Link href="#cascader-size" title="尺寸" />
                <Anchor.Link href="#cascader-clear" title="可清空" />
                <Anchor.Link href="#cascader-trigger" title="展开触发" />
                <Anchor.Link href="#cascader-change" title="任意级别可选" />
                <Anchor.Link href="#cascader-field" title="自定义字段名" />
                <Anchor.Link href="#cascader-empty" title="空状态" />
                <Anchor.Link href="#cascader-dimension" title="尺寸控制" />
                <Anchor.Link href="#cascader-placement" title="弹出位置" />
                <Anchor.Link href="#cascader-combination" title="组合使用" />
                <Anchor.Link href="#cascader-api" title="API 文档" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CascaderExample;

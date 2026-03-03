import React, { useState, useEffect } from 'react';
import { TreeSelect, Anchor, Table } from '../../components';
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

const TreeSelectExample: React.FC = () => {
    // 基础树形数据
    const treeData = [
        {
            title: 'Node1',
            value: '0-0',
            children: [
                {
                    title: 'Child Node1',
                    value: '0-0-1',
                },
                {
                    title: 'Child Node2',
                    value: '0-0-2',
                },
            ],
        },
        {
            title: 'Node2',
            value: '0-1',
            children: [
                {
                    title: 'Child Node3',
                    value: '0-1-1',
                    children: [
                        {
                            title: 'Grandchild Node1',
                            value: '0-1-1-1',
                        },
                        {
                            title: 'Grandchild Node2',
                            value: '0-1-1-2',
                        },
                    ],
                },
                {
                    title: 'Child Node4',
                    value: '0-1-2',
                },
            ],
        },
        {
            title: 'Node3',
            value: '0-2',
            disabled: true,
        },
    ];

    // 单选状态
    const [singleValue, setSingleValue] = useState<string>();
    
    // 多选状态
    const [multipleValue, setMultipleValue] = useState<string[]>([]);
    
    // 带搜索状态
    const [searchValue, setSearchValue] = useState<string>();
    
    // 带最大标签数状态
    const [maxTagValue, setMaxTagValue] = useState<string[]>(['0-0', '0-0-1', '0-0-2', '0-1']);

    // 滚动容器
    const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // 获取滚动容器
        const container = document.querySelector('.app-content') as HTMLElement;
        setScrollContainer(container);
    }, []);

    // API 表格列定义
    const columns = [
        { title: '属性', dataIndex: 'property', width: 120 },
        { title: '说明', dataIndex: 'description', width: 200 },
        { title: '类型', dataIndex: 'type', width: 200 },
        { title: '默认值', dataIndex: 'default', width: 100 },
    ];

    // API 表格数据
    const apiData = [
        { key: '1', property: 'treeData', description: '树形数据', type: 'TreeSelectNode[]', default: '[]' },
        { key: '2', property: 'value', description: '选中的值（受控）', type: 'any | any[]', default: '-' },
        { key: '3', property: 'defaultValue', description: '默认选中的值', type: 'any | any[]', default: '-' },
        { key: '4', property: 'onChange', description: '选中值变化时的回调', type: '(value, selectedNodes) => void', default: '-' },
        { key: '5', property: 'placeholder', description: '占位符', type: 'string', default: "'请选择'" },
        { key: '6', property: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
        { key: '7', property: 'multiple', description: '是否支持多选', type: 'boolean', default: 'false' },
        { key: '8', property: 'maxTagCount', description: '最大标签数量（多选时有效）', type: 'number', default: '-' },
        { key: '9', property: 'allowClear', description: '是否显示清除按钮', type: 'boolean', default: 'true' },
        { key: '10', property: 'size', description: '尺寸', type: "'large' | 'middle' | 'small'", default: "'middle'" },
        { key: '11', property: 'showSearch', description: '是否支持搜索', type: 'boolean', default: 'false' },
        { key: '12', property: 'width', description: '选择器宽度', type: 'number | string', default: '-' },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
                {/* 左侧主内容区 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h1 id="treeselect-intro">TreeSelect 树型选择器</h1>
                    <p>树形选择控件，支持单选和多选，以及最大标签数量限制。</p>
            
                    {/* 基础单选 */}
                    <div id="treeselect-basic">
                        <Section title="基础单选">
                <p>最简单的树形选择，支持展开/折叠子节点</p>
                <TreeSelect
                    treeData={treeData}
                    value={singleValue}
                    onChange={(value) => setSingleValue(value as string)}
                    placeholder="请选择节点"
                    styles={{ wrapper: { width: 300 } }}
                />
                <div style={{ marginTop: '12px', color: '#666' }}>
                    <p>选中值: {singleValue || '无'}</p>
                </div>
                <CopyBlock code={`import { TreeSelect } from '@zjpcy/simple-design';
import { useState } from 'react';

const [value, setValue] = useState<string>();

<TreeSelect
  treeData={[
    {
      title: 'Node1',
      value: '0-0',
      children: [
        { title: 'Child Node1', value: '0-0-1' },
        { title: 'Child Node2', value: '0-0-2' },
      ],
    },
    { title: 'Node2', value: '0-1' },
  ]}
  value={value}
  onChange={(value) => setValue(value as string)}
  placeholder="请选择节点"
/>`} />
            </Section>

                    </div>

                    {/* 多选 */}
                    <div id="treeselect-multiple">
                        <Section title="多选">
                <p>支持同时选择多个节点</p>
                <TreeSelect
                    treeData={treeData}
                    multiple
                    value={multipleValue}
                    onChange={(value) => setMultipleValue(value as string[])}
                    placeholder="请选择多个节点"
                    styles={{ wrapper: { width: 300 } }}
                />
                <div style={{ marginTop: '12px', color: '#666' }}>
                    <p>选中值: {JSON.stringify(multipleValue)}</p>
                </div>
                <CopyBlock code={`<TreeSelect
  treeData={treeData}
  multiple
  value={multipleValue}
  onChange={(value) => setMultipleValue(value as string[])}
  placeholder="请选择多个节点"
/>`} />
                        </Section>
                    </div>

                    {/* 多选带最大标签数 */}
                    <div id="treeselect-maxtag">
                        <Section title="多选 - 最大标签数 (maxTagCount=2)">
                <p>当选中项超过指定数量时，剩余项以 +N 形式显示</p>
                <TreeSelect
                    treeData={treeData}
                    multiple
                    maxTagCount={2}
                    value={maxTagValue}
                    onChange={(value) => setMaxTagValue(value as string[])}
                    placeholder="请选择节点"
                    styles={{ wrapper: { width: 300 } }}
                />
                <div style={{ marginTop: '12px', color: '#666' }}>
                    <p>选中值: {JSON.stringify(maxTagValue)}</p>
                </div>
                <CopyBlock code={`<TreeSelect
  treeData={treeData}
  multiple
  maxTagCount={2}
  value={maxTagValue}
  onChange={(value) => setMaxTagValue(value as string[])}
  placeholder="请选择节点"
/>`} />
                        </Section>
                    </div>

                    {/* 可搜索 */}
                    <div id="treeselect-search">
                        <Section title="可搜索">
                <p>支持搜索节点标题来过滤选项</p>
                <TreeSelect
                    treeData={treeData}
                    showSearch
                    value={searchValue}
                    onChange={(value) => setSearchValue(value as string)}
                    placeholder="请输入关键词搜索"
                    styles={{ wrapper: { width: 300 } }}
                />
                <CopyBlock code={`<TreeSelect
  treeData={treeData}
  showSearch
  value={searchValue}
  onChange={(value) => setSearchValue(value as string)}
  placeholder="请输入关键词搜索"
/>`} />
                        </Section>
                    </div>

                    {/* 不同尺寸 */}
                    <div id="treeselect-size">
                        <Section title="不同尺寸">
                <p>支持 large、middle、small 三种尺寸</p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <TreeSelect
                        treeData={treeData}
                        size="large"
                        placeholder="Large"
                        styles={{ wrapper: { width: 200 } }}
                    />
                    <TreeSelect
                        treeData={treeData}
                        size="middle"
                        placeholder="Middle"
                        styles={{ wrapper: { width: 200 } }}
                    />
                    <TreeSelect
                        treeData={treeData}
                        size="small"
                        placeholder="Small"
                        styles={{ wrapper: { width: 200 } }}
                    />
                </div>
                <CopyBlock code={`<TreeSelect treeData={treeData} size="large" placeholder="Large" />
<TreeSelect treeData={treeData} size="middle" placeholder="Middle" />
<TreeSelect treeData={treeData} size="small" placeholder="Small" />`} />
                        </Section>
                    </div>

                    {/* 禁用状态 */}
                    <div id="treeselect-disabled">
                        <Section title="禁用状态">
                <TreeSelect
                    treeData={treeData}
                    disabled
                    placeholder="禁用状态"
                    styles={{ wrapper: { width: 300 } }}
                />
                <CopyBlock code={`<TreeSelect
  treeData={treeData}
  disabled
  placeholder="禁用状态"
/>`} />
                        </Section>
                    </div>

                    {/* 不带清除按钮 */}
                    <div id="treeselect-noclear">
                        <Section title="不带清除按钮">
                <TreeSelect
                    treeData={treeData}
                    allowClear={false}
                    defaultValue="0-0"
                    placeholder="请选择"
                    styles={{ wrapper: { width: 300 } }}
                />
                <CopyBlock code={`<TreeSelect
  treeData={treeData}
  allowClear={false}
  defaultValue="0-0"
  placeholder="请选择"
/>`} />
                        </Section>
                    </div>

                    {/* API 文档 */}
                    <div id="treeselect-api">
                        <Section title="API">
                <h3>TreeSelect Props</h3>
                <Table
                    dataSource={apiData}
                    columns={columns}
                    bordered
                    pagination={false}
                />

                <h3 style={{ marginTop: '30px' }}>TreeSelectNode 类型</h3>
                <Table
                    dataSource={[
                        { key: '1', property: 'title', description: '节点标题', type: 'React.ReactNode' },
                        { key: '2', property: 'value', description: '节点值', type: 'any' },
                        { key: '3', property: 'disabled', description: '是否禁用', type: 'boolean' },
                        { key: '4', property: 'children', description: '子节点', type: 'TreeSelectNode[]' },
                    ]}
                    columns={[
                        { title: '属性', dataIndex: 'property', width: 120 },
                        { title: '说明', dataIndex: 'description', width: 200 },
                        { title: '类型', dataIndex: 'type', width: 200 },
                    ]}
                    bordered
                    pagination={false}
                />
                        </Section>
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
                                <Anchor.Link href="#treeselect-intro" title="组件介绍" />
                                <Anchor.Link href="#treeselect-basic" title="基础单选" />
                                <Anchor.Link href="#treeselect-multiple" title="多选" />
                                <Anchor.Link href="#treeselect-maxtag" title="最大标签数" />
                                <Anchor.Link href="#treeselect-search" title="可搜索" />
                                <Anchor.Link href="#treeselect-size" title="不同尺寸" />
                                <Anchor.Link href="#treeselect-disabled" title="禁用状态" />
                                <Anchor.Link href="#treeselect-noclear" title="不带清除按钮" />
                                <Anchor.Link href="#treeselect-api" title="API 文档" />
                            </Anchor>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TreeSelectExample;

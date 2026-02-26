import React, { useState, useRef } from 'react';
import { Flex, Table } from '../../components';
import Tree from '../../components/Tree';
import { TreeNode, TreeRef } from '../../components';
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

const DemoRow: React.FC<{ title: string; children: React.ReactNode; description?: string }> = ({ title, children, description }) => (
  <div style={{ marginBottom: '16px' }}>
    <Flex align="flex-start" gap="middle">
      <span style={{ minWidth: '100px', fontWeight: 500, paddingTop: '4px' }}>{title}:</span>
      <div style={{ flex: 1 }}>
        {children}
        {description && <p style={{ margin: '8px 0 0', color: '#666', fontSize: '12px' }}>{description}</p>}
      </div>
    </Flex>
  </div>
);

// 示例数据
const basicTreeData: TreeNode[] = [
  {
    key: '1',
    title: '文件夹',
    children: [
      {
        key: '1-1',
        title: '文档',
        children: [
          { key: '1-1-1', title: '工作报告.docx' },
          { key: '1-1-2', title: '项目计划.xlsx' },
        ],
      },
      {
        key: '1-2',
        title: '图片',
        children: [
          { key: '1-2-1', title: 'logo.png' },
          { key: '1-2-2', title: 'banner.jpg' },
        ],
      },
    ],
  },
  {
    key: '2',
    title: '音乐',
    children: [
      { key: '2-1', title: '周杰伦' },
      { key: '2-2', title: '林俊杰' },
    ],
  },
  {
    key: '3',
    title: '视频',
    children: [
      { key: '3-1', title: '电影' },
      { key: '3-2', title: '电视剧' },
      { key: '3-3', title: '综艺节目' },
    ],
  },
];

const countryTreeData: TreeNode[] = [
  {
    key: 'cn',
    title: '中国',
    children: [
      { key: 'cn-bj', title: '北京' },
      { key: 'cn-sh', title: '上海' },
      { key: 'cn-gz', title: '广州' },
      { key: 'cn-sz', title: '深圳' },
    ],
  },
  {
    key: 'us',
    title: '美国',
    children: [
      { key: 'us-ny', title: '纽约' },
      { key: 'us-la', title: '洛杉矶' },
      { key: 'us-sf', title: '旧金山' },
    ],
  },
  {
    key: 'gb',
    title: '英国',
    children: [
      { key: 'gb-lon', title: '伦敦' },
      { key: 'gb-man', title: '曼彻斯特' },
    ],
  },
];

const controlledTreeData: TreeNode[] = [
  {
    key: '0-0',
    title: '父节点 0',
    children: [
      { key: '0-0-0', title: '叶子节点 0-0-0' },
      { key: '0-0-1', title: '叶子节点 0-0-1' },
    ],
  },
  {
    key: '0-1',
    title: '父节点 1',
    children: [
      { key: '0-1-0', title: '叶子节点 0-1-0' },
      { key: '0-1-1', title: '叶子节点 0-1-1' },
    ],
  },
];

const disabledTreeData: TreeNode[] = [
  {
    key: '1',
    title: '正常节点',
    children: [
      { key: '1-1', title: '正常子节点' },
      { key: '1-2', title: '禁用节点', disabled: true },
    ],
  },
  {
    key: '2',
    title: '禁用父节点',
    disabled: true,
    children: [
      { key: '2-1', title: '子节点' },
    ],
  },
];

const iconTreeData: TreeNode[] = [
  {
    key: '1',
    title: '文件夹',
    icon: '📁',
    children: [
      { key: '1-1', title: '文档', icon: '📄', children: [
        { key: '1-1-1', title: '报告.docx', icon: '📝' },
        { key: '1-1-2', title: '表格.xlsx', icon: '📊' },
      ]},
      { key: '1-2', title: '图片', icon: '🖼️', children: [
        { key: '1-2-1', title: 'logo.png', icon: '🎨' },
      ]},
    ],
  },
  {
    key: '2',
    title: '音乐',
    icon: '🎵',
    children: [
      { key: '2-1', title: '流行', icon: '🎤' },
      { key: '2-2', title: '古典', icon: '🎹' },
    ],
  },
];

// 自定义渲染示例数据
const customRenderTreeData: TreeNode[] = [
  {
    key: '1',
    title: '销售部',
    children: [
      { key: '1-1', title: '张三', icon: '👤' },
      { key: '1-2', title: '李四', icon: '👤' },
    ],
  },
  {
    key: '2',
    title: '技术部',
    children: [
      { key: '2-1', title: '王五', icon: '👨‍💻' },
      { key: '2-2', title: '赵六', icon: '👩‍💻' },
    ],
  },
];

// 异步加载示例组件
const AsyncLoadTreeDemo: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>([
    { key: '1', title: '点击展开加载更多', isLeaf: false },
    { key: '2', title: '叶子节点', isLeaf: true },
  ]);

  const updateTreeData = (
    data: TreeNode[],
    key: string | number,
    children: TreeNode[]
  ): TreeNode[] => {
    return data.map((node) => {
      if (node.key === key) {
        return { ...node, children };
      }
      if (node.children) {
        return { ...node, children: updateTreeData(node.children, key, children) };
      }
      return node;
    });
  };

  const handleLoadData = (node: TreeNode) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // 模拟加载子节点
        const newChildren: TreeNode[] = [
          { key: String(node.key) + '-1', title: '异步子节点 1' },
          { key: String(node.key) + '-2', title: '异步子节点 2' },
        ];
        
        // 更新 treeData 添加子节点
        setTreeData(prev => updateTreeData(prev, node.key, newChildren));
        resolve();
      }, 1000);
    });
  };

  return (
    <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', maxWidth: '300px' }}>
      <Tree treeData={treeData} loadData={handleLoadData} />
    </div>
  );
};

// 滚动到节点示例组件
const ScrollToDemo: React.FC = () => {
  const treeRef = useRef<TreeRef>(null);
  const scrollableTreeData: TreeNode[] = [
    {
      key: '0',
      title: '根节点',
      children: [
        { key: '0-0', title: '第 1 个节点' },
        { key: '0-1', title: '第 2 个节点' },
        { key: '0-2', title: '第 3 个节点' },
        { key: '0-3', title: '第 4 个节点' },
        { key: '0-4', title: '第 5 个节点' },
        { key: '0-5', title: '第 6 个节点' },
        { key: '0-6', title: '第 7 个节点' },
        { key: '0-7', title: '第 8 个节点' },
        { key: '0-8', title: '第 9 个节点' },
        { key: '0-9', title: '第 10 个节点' },
        { key: '0-10', title: '第 11 个节点' },
        { key: '0-11', title: '第 12 个节点' },
      ],
    },
  ];

  const handleScrollTo = (key: string | number) => {
    treeRef.current?.scrollTo(key);
  };

  return (
    <>
      <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', maxWidth: '300px', maxHeight: '200px', overflow: 'auto' }}>
        <Tree
          ref={treeRef}
          treeData={scrollableTreeData}
          defaultExpandAll
        />
      </div>
      <div style={{ marginTop: '8px' }}>
        <button
          onClick={() => handleScrollTo('0-5')}
          style={{
            padding: '4px 12px',
            background: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px',
          }}
        >
          滚动到第 6 个节点
        </button>
        <button
          onClick={() => handleScrollTo('0-10')}
          style={{
            padding: '4px 12px',
            background: '#52c41a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          滚动到第 11 个节点
        </button>
      </div>
    </>
  );
};

const TreeExample: React.FC = () => {
  // 受控模式状态
  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>(['0-0']);
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<(string | number)[]>([]);


  // 目录树状态
  const [dirExpandedKeys, setDirExpandedKeys] = useState<(string | number)[]>(['1']);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Tree 树形控件</h1>
      <p>多层次的结构列表，用于展示文件夹、组织架构、分类目录等层级数据。</p>

      {/* 基础用法 */}
      <Section title="基础用法">
        <p>最简单的树形结构，支持展开/收起功能。</p>
        <DemoRow title="默认">
          <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', maxWidth: '300px' }}>
            <Tree treeData={basicTreeData} />
          </div>
        </DemoRow>
        <CopyBlock code={`import { Tree } from '@zjpcy/simple-design';

const treeData = [
  {
    key: '1',
    title: '文件夹',
    children: [
      { key: '1-1', title: '文档' },
      { key: '1-2', title: '图片' },
    ],
  },
  { key: '2', title: '音乐' },
];

<Tree treeData={treeData} />
`} />
      </Section>

      {/* 可选择 */}
      <Section title="可选择">
        <p>通过设置 checkable 属性，可以开启复选框选择功能，支持父子联动。</p>
        <DemoRow title="复选框">
          <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', maxWidth: '300px' }}>
            <Tree
              treeData={basicTreeData}
              checkable
              defaultExpandedKeys={['1']}
            />
          </div>
        </DemoRow>
        <CopyBlock code={`import { Tree } from '@zjpcy/simple-design';

<Tree
  treeData={treeData}
  checkable
  defaultExpandedKeys={['1']}
/>`} />
      </Section>

      {/* 受控模式 */}
      <Section title="受控模式">
        <p>通过 expandedKeys、selectedKeys、checkedKeys 控制树的展开、选中、勾选状态。</p>
        <DemoRow title="完全受控">
          <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', maxWidth: '300px' }}>
            <Tree
              treeData={controlledTreeData}
              checkable
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              checkedKeys={checkedKeys}
              onExpand={setExpandedKeys}
              onSelect={setSelectedKeys}
              onCheck={setCheckedKeys}
            />
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            <p>展开: {expandedKeys.join(', ') || '无'}</p>
            <p>选中: {selectedKeys.join(', ') || '无'}</p>
            <p>勾选: {checkedKeys.join(', ') || '无'}</p>
          </div>
        </DemoRow>
        <CopyBlock code={`import { Tree } from '@zjpcy/simple-design';

const [expandedKeys, setExpandedKeys] = useState(['0-0']);
const [selectedKeys, setSelectedKeys] = useState([]);
const [checkedKeys, setCheckedKeys] = useState([]);

<Tree
  treeData={treeData}
  checkable
  expandedKeys={expandedKeys}
  selectedKeys={selectedKeys}
  checkedKeys={checkedKeys}
  onExpand={setExpandedKeys}
  onSelect={setSelectedKeys}
  onCheck={setCheckedKeys}
/>`} />
      </Section>

      {/* 默认展开 */}
      <Section title="默认展开">
        <DemoRow title="默认展开指定节点">
          <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', maxWidth: '300px' }}>
            <Tree
              treeData={basicTreeData}
              defaultExpandedKeys={['1', '2']}
            />
          </div>
        </DemoRow>
        <DemoRow title="默认展开全部">
          <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', maxWidth: '300px' }}>
            <Tree
              treeData={countryTreeData}
              defaultExpandAll
            />
          </div>
        </DemoRow>
        <CopyBlock code={`import { Tree } from '@zjpcy/simple-design';

// 默认展开指定节点
<Tree treeData={treeData} defaultExpandedKeys={['1', '2']} />

// 默认展开全部节点
<Tree treeData={treeData} defaultExpandAll />`} />
      </Section>

      {/* 连接线 */}
      <Section title="连接线">
        <p>通过 showLine 属性显示节点之间的连接线。</p>
        <DemoRow title="显示连接线">
          <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', maxWidth: '300px' }}>
            <Tree
              treeData={basicTreeData}
              showLine
              defaultExpandedKeys={['1']}
            />
          </div>
        </DemoRow>
        <CopyBlock code={`import { Tree } from '@zjpcy/simple-design';

<Tree treeData={treeData} showLine defaultExpandedKeys={['1']} />`} />
      </Section>

      {/* 图标 */}
      <Section title="自定义图标">
        <DemoRow title="显示图标">
          <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', maxWidth: '300px' }}>
            <Tree
              treeData={iconTreeData}
              defaultExpandedKeys={['1', '1-1']}
            />
          </div>
        </DemoRow>
        <DemoRow title="隐藏图标">
          <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', maxWidth: '300px' }}>
            <Tree
              treeData={basicTreeData}
              showIcon={false}
              defaultExpandedKeys={['1']}
            />
          </div>
        </DemoRow>
        <CopyBlock code={`import { Tree } from '@zjpcy/simple-design';

// 带图标的树节点
const treeData = [
  {
    key: '1',
    title: '文件夹',
    icon: '📁',
    children: [
      { key: '1-1', title: '文档', icon: '📄' },
    ],
  },
];

<Tree treeData={treeData} />

// 隐藏图标
<Tree treeData={treeData} showIcon={false} />
`} />
      </Section>

      {/* 禁用状态 */}
      <Section title="禁用状态">
        <p>可以禁用整个节点，禁用后不可选中和展开。</p>
        <DemoRow title="禁用节点">
          <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', maxWidth: '300px' }}>
            <Tree
              treeData={disabledTreeData}
              checkable
              defaultExpandedKeys={['1']}
            />
          </div>
        </DemoRow>
        <CopyBlock code={`import { Tree } from '@zjpcy/simple-design';

const treeData = [
  {
    key: '1',
    title: '正常节点',
    children: [
      { key: '1-1', title: '正常子节点' },
      { key: '1-2', title: '禁用节点', disabled: true },
    ],
  },
];

<Tree treeData={treeData} checkable />`} />
      </Section>

      {/* 目录树 */}
      <Section title="目录树">
        <p>通过 directory 属性展示目录样式，文件夹有特殊样式。</p>
        <DemoRow title="目录模式">
          <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', maxWidth: '300px' }}>
            <Tree
              treeData={basicTreeData}
              showIcon
              expandedKeys={dirExpandedKeys}
              onExpand={setDirExpandedKeys}
            />
          </div>
        </DemoRow>
        <CopyBlock code={`import { Tree } from '@zjpcy/simple-design';

<Tree treeData={treeData} showIcon />
`} />
      </Section>

      {/* Title 省略模式 */}
      <Section title="Title 省略模式">
        <p>Tree 组件默认启用 title 省略模式，当 title 内容超过容器宽度时自动显示省略号。</p>
        <DemoRow title="省略效果展示">
          <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', maxWidth: '200px' }}>
            <Tree
              treeData={[
                {
                  key: '1',
                  title: '这是一个非常长的文件夹名称',
                  children: [
                    { key: '1-1', title: '子文件夹名称也很长很长' },
                    { key: '1-2', title: '短名' },
                  ]
                },
                { key: '2', title: '另一个很长的文件名示例' },
                { key: '3', title: '短名' },
              ]}
              defaultExpandAll
            />
          </div>
        </DemoRow>
        <CopyBlock code={`import { Tree } from '@zjpcy/simple-design';

// 默认：超出宽度显示省略号
<Tree
  treeData={[
    { key: '1', title: '这是一个非常长的文件夹名称' },
    { key: '2', title: '另一个很长的文件名示例' },
  ]}
  defaultExpandAll
/>`} />
      </Section>

      {/* 自定义节点渲染 */}
      <Section title="自定义节点渲染">
        <p>通过 renderNode 属性自定义节点的渲染方式。</p>
        <DemoRow title="自定义渲染">
          <div style={{ border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', maxWidth: '300px' }}>
            <Tree
              treeData={customRenderTreeData}
              defaultExpandedKeys={['1', '2']}
              renderNode={(node) => (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {node.icon && <span>{node.icon}</span>}
                  <span style={{ fontWeight: node.children ? 'bold' : 'normal', color: node.children ? '#1890ff' : '#333' }}>
                    {node.title}
                  </span>
                  {node.children && (
                    <span style={{ fontSize: '12px', color: '#999', marginLeft: '4px' }}>
                      ({node.children.length}人)
                    </span>
                  )}
                </span>
              )}
            />
          </div>
        </DemoRow>
        <CopyBlock code={`import { Tree } from '@zjpcy/simple-design';

<Tree
  treeData={treeData}
  renderNode={(node) => (
    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {node.icon && <span>{node.icon}</span>}
      <span style={{ fontWeight: node.children ? 'bold' : 'normal' }}>
        {node.title}
      </span>
      {node.children && (
        <span style={{ fontSize: '12px', color: '#999' }}>
          ({node.children.length}人)
        </span>
      )}
    </span>
  )}
/>`} />
      </Section>

      {/* 异步加载 */}
      <Section title="异步加载">
        <p>通过 loadData 属性实现异步加载子节点。需要设置 isLeaf: false 来表示节点可以展开。</p>
        <DemoRow title="点击加载">
          <AsyncLoadTreeDemo />
        </DemoRow>
        <CopyBlock code={`import { Tree, TreeNode } from '@zjpcy/simple-design';
import { useState } from 'react';

const AsyncLoadDemo = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>([
    { key: '1', title: '点击展开加载更多', isLeaf: false },
    { key: '2', title: '叶子节点', isLeaf: true },
  ]);

  const handleLoadData = (node: TreeNode) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // 模拟加载子节点
        const newChildren: TreeNode[] = [
          { key: node.key + '-1', title: '异步子节点 1' },
          { key: node.key + '-2', title: '异步子节点 2' },
        ];
        
        // 更新 treeData 添加子节点
        setTreeData(prev => updateTreeData(prev, node.key, newChildren));
        resolve();
      }, 1000);
    });
  };

  const updateTreeData = (
    data: TreeNode[],
    key: string | number,
    children: TreeNode[]
  ): TreeNode[] => {
    return data.map((node) => {
      if (node.key === key) {
        return { ...node, children };
      }
      if (node.children) {
        return { ...node, children: updateTreeData(node.children, key, children) };
      }
      return node;
    });
  };

  return <Tree treeData={treeData} loadData={handleLoadData} />;
};`} />
      </Section>

      {/* Ref 方法 */}
      <Section title="Ref 方法">
        <p>通过 ref 可以调用树组件的实例方法，如 scrollTo 滚动到指定节点。</p>
        <ScrollToDemo />
        <CopyBlock code={`import { Tree, TreeRef, TreeNode } from '@zjpcy/simple-design';
import { useRef } from 'react';

const Demo = () => {
  const treeRef = useRef<TreeRef>(null);
  
  const treeData: TreeNode[] = [
    {
      key: '0',
      title: '根节点',
      children: [
        { key: '0-0', title: '节点 1' },
        { key: '0-1', title: '节点 2' },
        // ...更多节点
      ],
    },
  ];

  const handleScrollTo = (key: string | number) => {
    treeRef.current?.scrollTo(key);
  };

  return (
    <>
      <Tree ref={treeRef} treeData={treeData} defaultExpandAll />
      <button onClick={() => handleScrollTo('0-5')}>
        滚动到节点
      </button>
    </>
  );
};`} />
      </Section>

      {/* API 文档 */}
      <Section title="API">
        <h3>Tree Props</h3>
        <Table
          bordered
          dataSource={[
            { key: '1', prop: 'treeData', description: '树形数据', type: 'TreeNode[]', default: '[]' },
            { key: '2', prop: 'checkable', description: '是否显示复选框', type: 'boolean', default: 'false' },
            { key: '3', prop: 'checkedKeys', description: '勾选的节点（受控）', type: '(string | number)[]', default: '-' },
            { key: '4', prop: 'defaultCheckedKeys', description: '默认勾选的节点', type: '(string | number)[]', default: '[]' },
            { key: '5', prop: 'selectedKeys', description: '选中的节点（受控）', type: '(string | number)[]', default: '-' },
            { key: '6', prop: 'defaultSelectedKeys', description: '默认选中的节点', type: '(string | number)[]', default: '[]' },
            { key: '7', prop: 'expandedKeys', description: '展开的节点（受控）', type: '(string | number)[]', default: '-' },
            { key: '8', prop: 'defaultExpandedKeys', description: '默认展开的节点', type: '(string | number)[]', default: '[]' },
            { key: '9', prop: 'defaultExpandAll', description: '默认展开所有节点', type: 'boolean', default: 'false' },
            { key: '10', prop: 'showLine', description: '是否显示连接线', type: 'boolean', default: 'false' },
            { key: '11', prop: 'showIcon', description: '是否显示节点图标', type: 'boolean', default: 'true' },
            { key: '12', prop: 'showIcon', description: '是否展示为目录树', type: 'boolean', default: 'false' },
            { key: '13', prop: 'blockNode', description: '是否节点占据一行', type: 'boolean', default: 'false' },
            { key: '14', prop: 'draggable', description: '是否可拖拽', type: 'boolean', default: 'false' },
            { key: '15', prop: 'loadData', description: '异步加载数据', type: '(node: TreeNode) => Promise<void>', default: '-' },
            { key: '16', prop: 'onExpand', description: '展开节点时的回调', type: '(keys: (string | number)[]) => void', default: '-' },
            { key: '17', prop: 'onSelect', description: '选中节点时的回调', type: '(keys: (string | number)[]) => void', default: '-' },
            { key: '18', prop: 'onCheck', description: '勾选节点时的回调', type: '(keys: (string | number)[]) => void', default: '-' },
            { key: '19', prop: 'onClick', description: '点击节点时的回调', type: '(node: TreeNode) => void', default: '-' },
            { key: '20', prop: 'onRightClick', description: '右键点击节点时的回调', type: '(e: React.MouseEvent, node: TreeNode) => void', default: '-' },
            { key: '21', prop: 'onDoubleClick', description: '双击节点时的回调', type: '(e: React.MouseEvent, node: TreeNode) => void', default: '-' },
            { key: '22', prop: 'renderNode', description: '自定义节点渲染', type: '(node: TreeNode) => React.ReactNode', default: '-' },
          ]}
          columns={[
            { title: '属性', dataIndex: 'prop', width: 150 },
            { title: '说明', dataIndex: 'description' },
            { title: '类型', dataIndex: 'type', width: 250 },
            { title: '默认值', dataIndex: 'default', width: 80 },
          ]}
          pagination={false}
        />

        <h3 style={{ marginTop: '24px' }}>TreeNode 数据结构</h3>
        <Table
          bordered
          dataSource={[
            { key: '1', prop: 'key', description: '节点唯一标识（必填）', type: 'string | number', default: '-' },
            { key: '2', prop: 'title', description: '节点标题', type: 'ReactNode', default: '-' },
            { key: '3', prop: 'children', description: '子节点数组', type: 'TreeNode[]', default: '-' },
            { key: '4', prop: 'icon', description: '自定义图标', type: 'ReactNode', default: '-' },
            { key: '5', prop: 'disabled', description: '是否禁用节点', type: 'boolean', default: 'false' },
            { key: '6', prop: 'disableCheckbox', description: '是否禁用复选框', type: 'boolean', default: 'false' },
            { key: '7', prop: 'selectable', description: '是否可选中', type: 'boolean', default: 'true' },
            { key: '8', prop: 'checkable', description: '是否可勾选', type: 'boolean', default: 'true' },
            { key: '9', prop: 'isLeaf', description: '是否为叶子节点', type: 'boolean', default: '-' },
          ]}
          columns={[
            { title: '属性', dataIndex: 'prop', width: 150 },
            { title: '说明', dataIndex: 'description' },
            { title: '类型', dataIndex: 'type', width: 250 },
            { title: '默认值', dataIndex: 'default', width: 80 },
          ]}
          pagination={false}
        />

      </Section>
    </div>
  );
};

export default TreeExample;

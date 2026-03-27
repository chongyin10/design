import React, { useState, useEffect } from 'react';
import { Input, Flex, Table, Anchor } from '../../components';
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

const InputExample: React.FC = () => {
  const [textValue, setTextValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [textareaSize, setTextareaSize] = useState<{ width: number; height: number }>({ width: 300, height: 80 });
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="input-intro">Input 输入框</h1>
          <p>用于接收用户输入的基础表单组件，支持文本、数字和搜索等多种类型。</p>

          {/* 基础用法 */}
          <div id="input-basic">
            <Section title="基础用法">
              <DemoRow title="文本输入">
                <Input
                  placeholder="请输入文本"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  width="300px"
                />
                <span>值: {textValue}</span>
              </DemoRow>
              <CopyBlock code={`import { Input } from '@zjpcy/simple-design';
import { useState } from 'react';

const Demo = () => {
  const [value, setValue] = useState('');

  return (
    <Input
      placeholder="请输入文本"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      width="300px"
    />
  );
};`} />
            </Section>
          </div>

          {/* 尺寸 */}
          <div id="input-size">
            <Section title="尺寸">
              <DemoRow title="small 尺寸">
                <Input placeholder="小尺寸输入框" size="small" width="200px" />
              </DemoRow>
              <DemoRow title="middle 尺寸（默认）">
                <Input placeholder="中尺寸输入框" size="middle" width="200px" />
              </DemoRow>
              <DemoRow title="large 尺寸">
                <Input placeholder="大尺寸输入框" size="large" width="200px" />
              </DemoRow>
              <CopyBlock code={`// small 尺寸
<Input placeholder="小尺寸" size="small" />

// middle 尺寸（默认）
<Input placeholder="中尺寸" size="middle" />

// large 尺寸
<Input placeholder="大尺寸" size="large" />`} />
            </Section>
          </div>

          {/* 状态 */}
          <div id="input-status">
            <Section title="状态">
              <DemoRow title="禁用状态">
                <Input placeholder="禁用状态" disabled width="200px" />
              </DemoRow>
              <DemoRow title="只读状态">
                <Input placeholder="只读状态" readOnly value="只读内容" width="200px" />
              </DemoRow>
              <CopyBlock code={`<Input placeholder="禁用状态" disabled />
<Input placeholder="只读状态" readOnly value="只读内容" />`} />
            </Section>
          </div>

          {/* 前缀后缀 */}
          <div id="input-affix">
            <Section title="前缀后缀">
              <DemoRow title="图标前缀">
                <Input placeholder="用户名" prefix="user" width="300px" />
              </DemoRow>
              <DemoRow title="图标后缀">
                <Input placeholder="密码" suffix="close" width="300px" />
              </DemoRow>
              <DemoRow title="前后缀组合">
                <Input placeholder="搜索" prefix="search" suffix="close" width="300px" />
              </DemoRow>
              <DemoRow title="自定义前缀">
                <Input placeholder="金额" prefix={<span style={{ color: '#f5222d' }}>¥</span>} width="300px" />
              </DemoRow>
              <DemoRow title="自定义后缀">
                <Input placeholder="百分比" suffix={<span style={{ color: '#52c41a' }}>%</span>} width="300px" />
              </DemoRow>
              <CopyBlock code={`// 图标前缀
<Input placeholder="用户名" prefix="user" />

// 图标后缀
<Input placeholder="密码" suffix="close" />

// 前后缀组合
<Input placeholder="搜索" prefix="search" suffix="close" />

// 自定义前缀
<Input placeholder="金额" prefix={<span style={{ color: '#f5222d' }}>¥</span>} />

// 自定义后缀
<Input placeholder="百分比" suffix={<span style={{ color: '#52c41a' }}>%</span>} />`} />
            </Section>
          </div>

          {/* 清除按钮 */}
          <div id="input-clear">
            <Section title="清除按钮">
              <DemoRow title="基本用法">
                <Input
                  placeholder="请输入内容"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  clear
                  width="300px"
                />
              </DemoRow>
              <DemoRow title="带前缀">
                <Input
                  placeholder="带前缀的清除按钮"
                  prefix="user"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  clear
                  width="300px"
                />
              </DemoRow>
              <DemoRow title="禁用状态">
                <Input placeholder="禁用状态" defaultValue="禁用内容" disabled clear width="300px" />
              </DemoRow>
              <CopyBlock code={`// 基本用法
<Input
  placeholder="请输入内容"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  clear
/>

// 带前缀
<Input placeholder="带前缀" prefix="user" clear />

// 禁用状态
<Input placeholder="禁用状态" defaultValue="禁用内容" disabled clear />`} />
            </Section>
          </div>

          {/* 提示信息 */}
          <div id="input-extra">
            <Section title="提示信息">
              <DemoRow title="基本用法">
                <Input placeholder="请输入用户名" extra="用户名长度6-20个字符" width="300px" />
              </DemoRow>
              <DemoRow title="带前后缀">
                <Input placeholder="请输入金额" prefix="¥" suffix="元" extra="支持小数点后两位" width="300px" />
              </DemoRow>
              <CopyBlock code={`<Input placeholder="请输入用户名" extra="用户名长度6-20个字符" />

<Input placeholder="请输入金额" prefix="¥" suffix="元" extra="支持小数点后两位" />`} />
            </Section>
          </div>

          {/* 标签 */}
          <div id="input-label">
            <Section title="标签">
              <DemoRow title="基本用法">
                <Input label="用户名" placeholder="请输入用户名" width="300px" />
              </DemoRow>
              <DemoRow title="自定义间距">
                <Input label="邮箱" labelGap={20} placeholder="请输入邮箱" width="300px" />
              </DemoRow>
              <DemoRow title="自定义样式">
                <Input
                  label="手机号"
                  labelGap={12}
                  labelStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                  placeholder="请输入手机号"
                  width="300px"
                />
              </DemoRow>
              <DemoRow title="自定义类名">
                <Input
                  label="地址"
                  labelGap={8}
                  labelClassName="custom-label"
                  placeholder="请输入地址"
                  width="300px"
                />
              </DemoRow>
              <DemoRow title="带前后缀">
                <Input label="金额" prefix="¥" suffix="元" placeholder="请输入金额" width="300px" />
              </DemoRow>
              <DemoRow title="带清除按钮">
                <Input
                  label="备注"
                  labelGap={10}
                  placeholder="请输入备注"
                  clear
                  width="300px"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                />
              </DemoRow>
              <CopyBlock code={`// 基本用法
<Input label="用户名" placeholder="请输入用户名" />

// 自定义间距
<Input label="邮箱" labelGap={20} placeholder="请输入邮箱" />

// 自定义样式
<Input
  label="手机号"
  labelGap={12}
  labelStyle={{ color: '#1890ff', fontWeight: 'bold' }}
  placeholder="请输入手机号"
/>

// 自定义类名
<Input
  label="地址"
  labelGap={8}
  labelClassName="custom-label"
  placeholder="请输入地址"
/>

// 带前后缀
<Input label="金额" prefix="¥" suffix="元" placeholder="请输入金额" />

// 带清除按钮
<Input
  label="备注"
  labelGap={10}
  placeholder="请输入备注"
  clear
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>`} />
            </Section>
          </div>

          {/* 键盘事件 */}
          <div id="input-keyboard">
            <Section title="键盘事件">
              <DemoRow title="回车事件">
                <Input
                  placeholder="按下 Enter 键"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      alert('Enter 键被按下');
                    }
                  }}
                  width="300px"
                />
              </DemoRow>
              <CopyBlock code={`<Input
  placeholder="按下 Enter 键"
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      alert('Enter 键被按下');
    }
  }}
/>`} />
            </Section>
          </div>

          {/* 搜索输入框 */}
          <div id="input-search">
            <Section title="搜索输入框">
              <DemoRow title="基础搜索">
                <Input.Search
                  placeholder="请输入搜索内容"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onSearch={() => alert(`搜索: ${searchValue}`)}
                  width="300px"
                />
              </DemoRow>
              <DemoRow title="带清除按钮">
                <Input.Search
                  placeholder="使用统一清除按钮"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onSearch={() => alert(`搜索: ${searchValue}`)}
                  clear
                  width="300px"
                />
              </DemoRow>
              <CopyBlock code={`import { Input } from '@zjpcy/simple-design';

// 基础搜索
<Input.Search
  placeholder="请输入搜索内容"
  value={searchValue}
  onChange={(e) => setSearchValue(e.target.value)}
  onSearch={() => console.log('搜索:', searchValue)}
/>

// 带清除按钮
<Input.Search
  placeholder="使用统一清除按钮"
  value={searchValue}
  onChange={(e) => setSearchValue(e.target.value)}
  onSearch={() => console.log('搜索:', searchValue)}
  clear
/>`} />
            </Section>
          </div>

          {/* 密码输入框 */}
          <div id="input-password">
            <Section title="密码输入框">
              <DemoRow title="基本用法">
                <Input.Password
                  placeholder="请输入密码"
                  width="300px"
                />
              </DemoRow>
              <DemoRow title="受控模式">
                <Input.Password
                  placeholder="请输入密码"
                  width="300px"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                />
              </DemoRow>
              <DemoRow title="默认可见">
                <Input.Password
                  placeholder="默认可见密码"
                  defaultVisible
                  width="300px"
                />
              </DemoRow>
              <DemoRow title="带可见性回调">
                <Input.Password
                  placeholder="监听可见性变化"
                  onVisibleChange={(visible) => console.log('密码可见性:', visible)}
                  width="300px"
                />
              </DemoRow>
              <CopyBlock code={`import { Input } from '@zjpcy/simple-design';

// 基本用法
<Input.Password placeholder="请输入密码" />

// 受控模式
<Input.Password
  placeholder="请输入密码"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

// 默认可见
<Input.Password
  placeholder="默认可见密码"
  defaultVisible
/>

// 监听可见性变化
<Input.Password
  placeholder="监听可见性变化"
  onVisibleChange={(visible) => console.log('密码可见性:', visible)}
/>`} />
            </Section>
          </div>

          {/* 数字输入框 */}
          <div id="input-number">
            <Section title="数字输入框">
              <DemoRow title="正浮点数">
                <Input.Number placeholder="正浮点数" nType="positive-float" width="200px" />
              </DemoRow>
              <DemoRow title="正整数">
                <Input.Number placeholder="正整数" nType="positive-integer" width="200px" />
              </DemoRow>
              <DemoRow title="整数">
                <Input.Number placeholder="整数" nType="integer" width="200px" />
              </DemoRow>
              <DemoRow title="带前后缀">
                <Input.Number placeholder="金额" nType="positive-float" prefix="¥" suffix="元" width="200px" />
              </DemoRow>
              <DemoRow title="带清除按钮">
                <Input.Number placeholder="带清除按钮" nType="positive-float" clear width="200px" />
              </DemoRow>
              <DemoRow title="自定义错误消息">
                <Input.Number placeholder="正整数" nType="positive-integer" errorMessage="请输入有效的正整数" width="200px" />
              </DemoRow>
              <DemoRow title="带提示信息">
                <Input.Number placeholder="正整数" nType="positive-integer" extra="请输入大于0的整数" width="200px" />
              </DemoRow>
              <CopyBlock code={`// 正浮点数
<Input.Number placeholder="正浮点数" nType="positive-float" />

// 正整数
<Input.Number placeholder="正整数" nType="positive-integer" />

// 整数
<Input.Number placeholder="整数" nType="integer" />

// 带前后缀
<Input.Number placeholder="金额" nType="positive-float" prefix="¥" suffix="元" />

// 带清除按钮
<Input.Number placeholder="带清除按钮" nType="positive-float" clear />

// 自定义错误消息
<Input.Number placeholder="正整数" nType="positive-integer" errorMessage="请输入有效的正整数" />

// 带提示信息
<Input.Number placeholder="正整数" nType="positive-integer" extra="请输入大于0的整数" />`} />
            </Section>
          </div>

          {/* 多行文本输入框 */}
          <div id="input-textarea">
            <Section title="多行文本输入框">
              <DemoRow title="基本用法">
                <Input.Textarea
                  placeholder="请输入多行文本"
                  width="300px"
                />
              </DemoRow>
              <DemoRow title="受控模式">
                <Input.Textarea
                  placeholder="请输入多行文本"
                  width="300px"
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                />
              </DemoRow>
              <DemoRow title="自定义行数">
                <Input.Textarea
                  placeholder="6行文本"
                  rows={6}
                  width="300px"
                />
              </DemoRow>
              <DemoRow title="自定义高度">
                <Input.Textarea
                  placeholder="高度120px"
                  height="120px"
                  width="300px"
                />
              </DemoRow>
              <DemoRow title="带提示信息">
                <Input.Textarea
                  placeholder="请输入描述"
                  extra="最多200个字符"
                  width="300px"
                />
              </DemoRow>
              <DemoRow title="带标签">
                <Input.Textarea
                  label="描述"
                  labelGap={10}
                  placeholder="请输入描述"
                  width="300px"
                />
              </DemoRow>
              <DemoRow title="带字数统计">
                <Input.Textarea
                  placeholder="带字数统计"
                  maxLength={100}
                  showCount
                  width="300px"
                />
              </DemoRow>
              <DemoRow title="带清除按钮">
                <Input.Textarea
                  placeholder="带清除按钮"
                  clear
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  width="300px"
                />
              </DemoRow>
              <DemoRow title="可调整大小">
                <Input.Textarea
                  placeholder="拖拽右下角可调整大小"
                  resizable
                  minWidth={200}
                  maxWidth={800}
                  minHeight={80}
                  maxHeight={400}
                  width="300px"
                />
              </DemoRow>
              <DemoRow title="监听尺寸变化">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Input.Textarea
                    placeholder="拖拽查看实时尺寸"
                    resizable
                    minWidth={200}
                    maxWidth={800}
                    minHeight={80}
                    maxHeight={400}
                    width={textareaSize.width}
                    onResize={(size) => setTextareaSize({ width: size.width || textareaSize.width, height: size.height || textareaSize.height })}
                  />
                  <span style={{ fontSize: '12px', color: '#909399' }}>
                    当前尺寸: 宽度 {textareaSize.width}px × 高度 {textareaSize.height}px
                  </span>
                </div>
              </DemoRow>
              <CopyBlock code={`import { Input } from '@zjpcy/simple-design';

// 基本用法
<Input.Textarea placeholder="请输入多行文本" />

// 受控模式
<Input.Textarea
  placeholder="请输入多行文本"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// 自定义行数
<Input.Textarea
  placeholder="6行文本"
  rows={6}
/>

// 自定义高度
<Input.Textarea
  placeholder="高度120px"
  height="120px"
/>

// 带提示信息
<Input.Textarea
  placeholder="请输入描述"
  extra="最多200个字符"
/>

// 带标签
<Input.Textarea
  label="描述"
  labelGap={10}
  placeholder="请输入描述"
/>

// 带字数统计
<Input.Textarea
  placeholder="带字数统计"
  maxLength={100}
  showCount
/>

// 带清除按钮
<Input.Textarea
  placeholder="带清除按钮"
  clear
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// 可调整大小
<Input.Textarea
  placeholder="拖拽右下角可调整大小"
  resizable
  minWidth={200}
  maxWidth={800}
  minHeight={80}
  maxHeight={400}
/>

// 监听尺寸变化
const [textareaSize, setTextareaSize] = useState({ width: 300, height: 80 });

<Input.Textarea
  placeholder="拖拽查看实时尺寸"
  resizable
  minWidth={200}
  maxWidth={800}
  minHeight={80}
  maxHeight={400}
  width={textareaSize.width}
  onResize={(size) => setTextareaSize({
    width: size.width || textareaSize.width,
    height: size.height || textareaSize.height
  })}
/>
<span>当前尺寸: 宽度 {textareaSize.width}px × 高度 {textareaSize.height}px</span>`} />
            </Section>
          </div>

          {/* API 文档 */}
          <div id="input-api">
            <Section title="API">
              <h3>Input Props</h3>
              <Table
                columns={[
                  { title: '属性', dataIndex: 'property', key: 'property' },
                  { title: '说明', dataIndex: 'description', key: 'description' },
                  { title: '类型', dataIndex: 'type', key: 'type' },
                  { title: '默认值', dataIndex: 'default', key: 'default' },
                ]}
                dataSource={[
                  { property: 'type', description: '输入框类型', type: `'text'`, default: `'text'` },
                  { property: 'placeholder', description: '占位符文本', type: 'string', default: '-' },
                  { property: 'value', description: '输入值', type: 'string', default: '-' },
                  { property: 'width', description: '自定义宽度', type: 'string | number', default: '-' },
                  { property: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
                  { property: 'readOnly', description: '是否只读', type: 'boolean', default: 'false' },
                  { property: 'prefix', description: '输入框前缀', type: 'string | React.ReactNode', default: '-' },
                  { property: 'suffix', description: '输入框后缀', type: 'string | React.ReactNode', default: '-' },
                  { property: 'clear', description: '是否显示清除按钮', type: 'boolean', default: 'false' },
                  { property: 'extra', description: '提示信息', type: 'string | React.ReactNode', default: '-' },
                  { property: 'label', description: '标签文案，显示在输入框前面', type: 'string | React.ReactNode', default: '-' },
                  { property: 'labelGap', description: '标签到输入框的距离', type: 'string | number', default: '8' },
                  { property: 'labelClassName', description: '标签的CSS类名', type: 'string', default: '-' },
                  { property: 'labelStyle', description: '标签的样式', type: 'React.CSSProperties', default: '-' },
                  { property: 'size', description: '输入框尺寸', type: `'large' | 'middle' | 'small'`, default: `'middle'` },
                  { property: 'onChange', description: '输入变化事件', type: '(e: React.ChangeEvent) => void', default: '-' },
                  { property: 'onBlur', description: '失去焦点事件', type: '(e: React.FocusEvent) => void', default: '-' },
                  { property: 'onFocus', description: '获取焦点事件', type: '(e: React.FocusEvent) => void', default: '-' },
                  { property: 'onKeyDown', description: '键盘按下事件', type: '(e: React.KeyboardEvent) => void', default: '-' },
                ]}
                rowKey="property"
                pagination={false}
              />

              <h3>Input.Search Props</h3>
              <Table
                columns={[
                  { title: '属性', dataIndex: 'property', key: 'property' },
                  { title: '说明', dataIndex: 'description', key: 'description' },
                  { title: '类型', dataIndex: 'type', key: 'type' },
                  { title: '默认值', dataIndex: 'default', key: 'default' },
                ]}
                dataSource={[
                  { property: 'onSearch', description: '搜索事件', type: '() => void', default: '-' },
                  { property: 'onClear', description: '清除事件', type: '() => void', default: '-' },
                ]}
                rowKey="property"
                pagination={false}
              />

              <h3>Input.Number Props</h3>
              <Table
                columns={[
                  { title: '属性', dataIndex: 'property', key: 'property' },
                  { title: '说明', dataIndex: 'description', key: 'description' },
                  { title: '类型', dataIndex: 'type', key: 'type' },
                  { title: '默认值', dataIndex: 'default', key: 'default' },
                ]}
                dataSource={[
                  { property: 'nType', description: '数字类型验证', type: `'positive-float' | 'negative-float' | 'positive-integer' | 'negative-integer' | 'integer' | 'negative' | 'positive'`, default: '-' },
                  { property: 'errorMessage', description: '自定义错误消息', type: 'string', default: '-' },
                ]}
                rowKey="property"
                pagination={false}
              />

              <h3>Input.Password Props</h3>
              <Table
                columns={[
                  { title: '属性', dataIndex: 'property', key: 'property' },
                  { title: '说明', dataIndex: 'description', key: 'description' },
                  { title: '类型', dataIndex: 'type', key: 'type' },
                  { title: '默认值', dataIndex: 'default', key: 'default' },
                ]}
                dataSource={[
                  { property: 'defaultVisible', description: '是否默认可见密码', type: 'boolean', default: 'false' },
                  { property: 'onVisibleChange', description: '切换可见性时的回调', type: '(visible: boolean) => void', default: '-' },
                ]}
                rowKey="property"
                pagination={false}
              />

              <h3>Input.Textarea Props</h3>
              <Table
                columns={[
                  { title: '属性', dataIndex: 'property', key: 'property' },
                  { title: '说明', dataIndex: 'description', key: 'description' },
                  { title: '类型', dataIndex: 'type', key: 'type' },
                  { title: '默认值', dataIndex: 'default', key: 'default' },
                ]}
                dataSource={[
                  { property: 'rows', description: '文本域行数', type: 'number', default: '4' },
                  { property: 'height', description: '文本域高度', type: 'string | number', default: '-' },
                  { property: 'maxLength', description: '最大字符数', type: 'number', default: '-' },
                  { property: 'showCount', description: '是否显示字数统计', type: 'boolean', default: 'false' },
                  { property: 'clear', description: '是否显示清除按钮', type: 'boolean', default: 'false' },
                  { property: 'resizable', description: '是否可调整大小', type: 'boolean', default: 'false' },
                  { property: 'resizeHandleSize', description: '拖拽手柄大小（像素）', type: 'number', default: '10' },
                  { property: 'minWidth', description: '最小宽度', type: 'number', default: '200' },
                  { property: 'maxWidth', description: '最大宽度', type: 'number', default: '2000' },
                  { property: 'minHeight', description: '最小高度', type: 'number', default: '80' },
                  { property: 'maxHeight', description: '最大高度', type: 'number', default: '800' },
                  { property: 'onResize', description: '大小变化回调', type: '(size: { width?: number; height?: number }) => void', default: '-' },
                ]}
                rowKey="property"
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
                <Anchor.Link href="#input-intro" title="组件介绍" />
                <Anchor.Link href="#input-basic" title="基础用法" />
                <Anchor.Link href="#input-size" title="尺寸" />
                <Anchor.Link href="#input-status" title="状态" />
                <Anchor.Link href="#input-affix" title="前缀后缀" />
                <Anchor.Link href="#input-clear" title="清除按钮" />
                <Anchor.Link href="#input-extra" title="提示信息" />
                <Anchor.Link href="#input-label" title="标签" />
                <Anchor.Link href="#input-keyboard" title="键盘事件" />
                <Anchor.Link href="#input-search" title="搜索输入框" />
                <Anchor.Link href="#input-password" title="密码输入框" />
                <Anchor.Link href="#input-number" title="数字输入框" />
                <Anchor.Link href="#input-textarea" title="多行文本" />
                <Anchor.Link href="#input-api" title="API 文档" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputExample;

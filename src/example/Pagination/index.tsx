import React, { useState, useEffect } from 'react';
import { Pagination, Table, Flex, Anchor } from '../../components';
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

const PaginationExample: React.FC = () => {
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total] = useState(100);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  const handleChange = (page: number, size: number) => {
    setCurrent(page);
    if (size !== undefined) {
      setPageSize(size);
    }
  };

  const showTotal = (total: number, _: [number, number]) => (
    <span>共 {total} 条记录</span>
  );

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
    { title: '地址', dataIndex: 'address', key: 'address' },
  ];

  const dataSource = Array.from({ length: total }, (_, i) => ({
    key: i,
    name: `用户 ${i + 1}`,
    age: 20 + (i % 30),
    address: `北京市朝阳区 ${i + 1} 号`,
  }));

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="pagination-intro">Pagination 分页</h1>
          <p>采用分页的形式分隔长列表，每次只加载一个页面。</p>

          {/* 基础用法 */}
          <div id="pagination-basic">
            <Section title="基础用法">
              <Pagination
                total={total}
                current={current}
                pageSize={pageSize}
                onChange={handleChange}
              />
              <CopyBlock code={`import { Pagination } from '@zjpcy/simple-design';

const Demo = () => {
  const [current, setCurrent] = useState(1);
  
  return (
    <Pagination
      total={100}
      current={current}
      pageSize={10}
      onChange={(page, pageSize) => setCurrent(page)}
    />
  );
};`} />
            </Section>
          </div>

          {/* 显示总数 */}
          <div id="pagination-total">
            <Section title="显示总数">
              <DemoRow title="显示总数">
                <Pagination
                  total={total}
                  current={current}
                  pageSize={pageSize}
                  onChange={handleChange}
                  showTotal={(total) => <span>共 {total} 条</span>}
                />
              </DemoRow>
              <DemoRow title="显示范围">
                <Pagination
                  total={total}
                  current={current}
                  pageSize={pageSize}
                  onChange={handleChange}
                  showTotal={(total, range) => <span>{range[0]}-{range[1]} / 共 {total} 条</span>}
                />
              </DemoRow>
              <CopyBlock code={`import { Pagination } from '@zjpcy/simple-design';

// 显示总数
<Pagination
  total={100}
  showTotal={(total) => \`共 \${total} 条\`}
/>

// 显示范围
<Pagination
  total={100}
  showTotal={(total, range) => \`\${range[0]}-\${range[1]} / 共 \${total} 条\`}
/>`} />
            </Section>
          </div>

          {/* 每页条数 */}
          <div id="pagination-size">
            <Section title="每页条数">
              <DemoRow title="切换每页条数">
                <Pagination
                  total={total}
                  current={current}
                  pageSize={pageSize}
                  onChange={handleChange}
                  showSizeChanger
                  pageSizeOptions={[10, 20, 50, 100]}
                />
              </DemoRow>
              <CopyBlock code={`import { Pagination } from '@zjpcy/simple-design';

<Pagination
  total={100}
  showSizeChanger
  pageSizeOptions={[10, 20, 50, 100]}
  onChange={(page, pageSize) => console.log(page, pageSize)}
/>`} />
            </Section>
          </div>

          {/* 快速跳转 */}
          <div id="pagination-jumper">
            <Section title="快速跳转">
              <DemoRow title="跳转到指定页">
                <Pagination
                  total={total}
                  current={current}
                  pageSize={pageSize}
                  onChange={handleChange}
                  showQuickJumper
                />
              </DemoRow>
              <CopyBlock code={`import { Pagination } from '@zjpcy/simple-design';

<Pagination
  total={100}
  showQuickJumper
  onChange={(page) => console.log('跳转到:', page)}
/>`} />
            </Section>
          </div>

          {/* 完整功能 */}
          <div id="pagination-full">
            <Section title="完整功能">
              <DemoRow title="所有功能">
                <Pagination
                  total={total}
                  current={current}
                  pageSize={pageSize}
                  onChange={handleChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) => <span>{range[0]}-{range[1]} / 共 {total} 条</span>}
                  pageSizeOptions={[10, 20, 50, 100]}
                />
              </DemoRow>
              <CopyBlock code={`import { Pagination } from '@zjpcy/simple-design';

<Pagination
  total={100}
  current={current}
  pageSize={pageSize}
  onChange={handleChange}
  showSizeChanger
  showQuickJumper
  showTotal={(total, range) => \`\${range[0]}-\${range[1]} / 共 \${total} 条\`}
  pageSizeOptions={[10, 20, 50, 100]}
/>`} />
            </Section>
          </div>

          {/* 简洁模式 */}
          <div id="pagination-simple">
            <Section title="简洁模式">
              <DemoRow title="简洁分页">
                <Pagination
                  total={total}
                  current={current}
                  pageSize={pageSize}
                  onChange={handleChange}
                  simple
                />
              </DemoRow>
              <CopyBlock code={`import { Pagination } from '@zjpcy/simple-design';

<Pagination
  total={100}
  simple
  onChange={(page) => console.log('页码:', page)}
/>`} />
            </Section>
          </div>

          {/* 禁用状态 */}
          <div id="pagination-disabled">
            <Section title="禁用状态">
              <DemoRow title="禁用分页">
                <Pagination
                  total={total}
                  current={current}
                  pageSize={pageSize}
                  onChange={handleChange}
                  disabled
                />
              </DemoRow>
              <CopyBlock code={`import { Pagination } from '@zjpcy/simple-design';

<Pagination
  total={100}
  disabled
/>`} />
            </Section>
          </div>

          {/* 分页配合表格 */}
          <div id="pagination-table">
            <Section title="分页配合表格">
              <Table
                columns={columns}
                dataSource={dataSource.slice((current - 1) * pageSize, current * pageSize)}
                pagination={false}
              />
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination
                  total={total}
                  current={current}
                  pageSize={pageSize}
                  onChange={handleChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={showTotal}
                />
              </div>
              <CopyBlock code={`import { Pagination, Table } from '@zjpcy/simple-design';
import { useState } from 'react';

const Demo = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const total = 100;
  
  const dataSource = Array.from({ length: total }, (_, i) => ({
    key: i,
    name: \`用户 \${i + 1}\`,
    age: 20 + (i % 30),
    address: \`北京市朝阳区 \${i + 1} 号\`,
  }));

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource.slice(
          (current - 1) * pageSize, 
          current * pageSize
        )}
        pagination={false}
      />
      <Pagination
        total={total}
        current={current}
        pageSize={pageSize}
        onChange={(page, size) => {
          setCurrent(page);
          if (size) setPageSize(size);
        }}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => \`共 \${total} 条\`}
      />
    </>
  );
};`} />
            </Section>
          </div>

          {/* API 文档 */}
          <div id="pagination-api">
            <Section title="API">
              <h3>Props</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>参数名</th>
                    <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>说明</th>
                    <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>类型</th>
                    <th style={{ border: '1px solid #d9d9d9', padding: '8px', textAlign: 'left' }}>默认值</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>current</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>当前页码</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>number</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>1</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>total</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>数据总数</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>number</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>pageSize</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>每页条数</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>number</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>10</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>onChange</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>页码改变的回调</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>{"(page: number, pageSize?: number) => void"}</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>showSizeChanger</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>是否显示 pageSize 切换器</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>boolean</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>false</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>pageSizeOptions</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>指定每页可以显示多少条</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>number[]</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>[10, 20, 50, 100]</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>showQuickJumper</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>是否可以快速跳转至某页</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>boolean</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>false</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>showTotal</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>用于显示数据总量和当前数据顺序</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>{"(total: number, range: [number, number]) => ReactNode"}</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>-</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>simple</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>简洁模式</td>
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
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>hideOnSinglePage</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>只有一页时是否隐藏分页器</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>boolean</td>
                    <td style={{ border: '1px solid #d9d9d9', padding: '8px' }}>false</td>
                  </tr>
                </tbody>
              </table>
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
                <Anchor.Link href="#pagination-intro" title="组件介绍" />
                <Anchor.Link href="#pagination-basic" title="基础用法" />
                <Anchor.Link href="#pagination-total" title="显示总数" />
                <Anchor.Link href="#pagination-size" title="每页条数" />
                <Anchor.Link href="#pagination-jumper" title="快速跳转" />
                <Anchor.Link href="#pagination-full" title="完整功能" />
                <Anchor.Link href="#pagination-simple" title="简洁模式" />
                <Anchor.Link href="#pagination-disabled" title="禁用状态" />
                <Anchor.Link href="#pagination-table" title="配合表格" />
                <Anchor.Link href="#pagination-api" title="API 文档" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginationExample;

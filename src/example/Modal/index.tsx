import React, { useState, useEffect } from 'react';
import { Button, Modal, Flex, Anchor, Table, Form, Input, Select } from '../../components';
import type { Column } from '../../components/Table';
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

const ModalExample: React.FC = () => {
    const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);
    const [visible4, setVisible4] = useState(false);
    const [visible5, setVisible5] = useState(false);
    const [visible6, setVisible6] = useState(false);
    const [visible7, setVisible7] = useState(false);
    const [visible8, setVisible8] = useState(false);
    const [visible9, setVisible9] = useState(false);
    const [visible10, setVisible10] = useState(false);
    const [visible11, setVisible11] = useState(false);
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [formModalEditMode, setFormModalEditMode] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [tableData, setTableData] = useState([
        { id: 1, name: '张三', email: 'zhangsan@example.com', status: 'active', role: '管理员' },
        { id: 2, name: '李四', email: 'lisi@example.com', status: 'inactive', role: '用户' },
        { id: 3, name: '王五', email: 'wangwu@example.com', status: 'active', role: '编辑' },
    ]);
    const [visible19, setVisible19] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();

    // 表格列配置
    const tableColumns: Column[] = [
        { dataIndex: 'name', title: '姓名', width: '100px' },
        { dataIndex: 'email', title: '邮箱', width: '180px' },
        { dataIndex: 'role', title: '角色', width: '100px' },
        {
            dataIndex: 'status',
            title: '状态',
            width: '100px',
            render: (value: string) => (
                <span style={{
                    color: value === 'active' ? '#52c41a' : '#999',
                    background: value === 'active' ? '#f6ffed' : '#f5f5f5',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                }}>
                    {value === 'active' ? '启用' : '禁用'}
                </span>
            )
        },
        {
            dataIndex: 'action',
            title: '操作',
            width: '150px',
            render: (_: any, record: any) => (
                <Flex gap="small">
                    <Button variant="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>
                    <Button variant="link" size="small" style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record)}>删除</Button>
                </Flex>
            )
        }
    ];

    // 打开新增弹窗
    const handleAdd = () => {
        setFormModalEditMode(false);
        setSelectedRecord(null);
        form.resetFields();
        setFormModalVisible(true);
    };

    // 打开编辑弹窗
    const handleEdit = (record: any) => {
        setFormModalEditMode(true);
        setSelectedRecord(record);
        form.setFieldsValue(record);
        setFormModalVisible(true);
    };

    // 删除记录
    const handleDelete = (record: any) => {
        setTableData(prev => prev.filter(item => item.id !== record.id));
    };

    // 提交表单
    const handleFormSubmit = () => {
        form.validateFields().then((values: any) => {
            setFormLoading(true);
            setTimeout(() => {
                if (formModalEditMode && selectedRecord) {
                    // 编辑模式
                    setTableData(prev => prev.map(item =>
                        item.id === selectedRecord.id ? { ...item, ...values } : item
                    ));
                } else {
                    // 新增模式
                    const newRecord = {
                        id: Date.now(),
                        ...values
                    };
                    setTableData(prev => [...prev, newRecord]);
                }
                setFormLoading(false);
                setFormModalVisible(false);
                form.resetFields();
            }, 800);
        });
    };

    useEffect(() => {
      // 获取滚动容器
      const container = document.querySelector('.app-content') as HTMLElement;
      setScrollContainer(container);
    }, []);

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setVisible(false);
            setConfirmLoading(false);
        }, 1000);
    };

    return (
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            {/* 左侧主内容区 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 id="modal-intro">Modal 对话框</h1>
              <p>模态对话框组件，用于显示重要信息或需要用户确认的操作。</p>

              {/* 基本使用 */}
              <div id="modal-basic">
                <Section title="基本使用">
                    <p>点击按钮打开基本弹窗。</p>
                    
                    <DemoRow title="基本弹窗">
                        <Button variant="primary" onClick={() => setVisible(true)}>
                            打开弹窗
                        </Button>
                    </DemoRow>

                    <Modal
                        visible={visible}
                        title="基本弹窗"
                        onCancel={() => setVisible(false)}
                        onOk={() => setVisible(false)}
                    >
                        <p>这是弹窗的内容区域，可以放置任意内容。</p>
                        <p>弹窗会上下左右居中显示。</p>
                    </Modal>
                    
                    <CopyBlock code={`import { Modal, Button } from '@zjpcy/simple-design';
import { useState } from 'react';

function App() {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <Button onClick={() => setVisible(true)}>
                打开弹窗
            </Button>
            <Modal
                visible={visible}
                title="基本弹窗"
                onCancel={() => setVisible(false)}
                onOk={() => setVisible(false)}
            >
                <p>这是弹窗的内容区域，可以放置任意内容。</p>
                <p>弹窗会上下左右居中显示。</p>
            </Modal>
        </>
    );
}`} />
                </Section>
              </div>

              <div id="modal-size">
              <Section title="自定义尺寸">
                  <p>可以自定义弹窗的宽度和高度。</p>

                  <DemoRow title="小尺寸">
                      <Button variant="primary" onClick={() => setVisible2(true)}>
                          小尺寸弹窗
                      </Button>
                  </DemoRow>
                  
                  <DemoRow title="大尺寸">
                      <Button variant="primary" onClick={() => setVisible3(true)}>
                          大尺寸弹窗
                      </Button>
                  </DemoRow>
                  
                  <DemoRow title="最小高度测试">
                      <Button variant="primary" onClick={() => setVisible19(true)}>
                          最小高度测试
                      </Button>
                  </DemoRow>

                  <Modal
                      visible={visible2}
                      title="小尺寸弹窗"
                      width={400}
                      onCancel={() => setVisible2(false)}
                      onOk={() => setVisible2(false)}
                  >
                      <p>这是一个宽度为 400px 的小尺寸弹窗。</p>
                  </Modal>

                  <Modal
                      visible={visible3}
                      title="大尺寸弹窗"
                      width={800}
                      height={500}
                      onCancel={() => setVisible3(false)}
                      onOk={() => setVisible3(false)}
                  >
                      <p>这是一个宽度 800px，高度 500px 的大尺寸弹窗。</p>
                      <p>设置了 height 后，内容区域将使用设置的高度。</p>
                  </Modal>

                  <Modal
                      visible={visible19}
                      title="最小高度测试"
                      width={400}
                      onCancel={() => setVisible19(false)}
                      onOk={() => setVisible19(false)}
                  >
                      <p>内容很少，但内容区域仍有最小高度 300px。</p>
                  </Modal>
                  
                  <CopyBlock code={`import { Modal, Button } from '@zjpcy/simple-design';
import { useState } from 'react';

function App() {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <Button onClick={() => setVisible(true)}>
                打开弹窗
            </Button>
            <Modal
                visible={visible}
                title="自定义尺寸"
                width={800}
                height={500}
                onCancel={() => setVisible(false)}
                onOk={() => setVisible(false)}
            >
                <p>自定义宽度和高度的弹窗。</p>
            </Modal>
        </>
    );
}`} />
              </Section>
              </div>

              <div id="modal-loading">
              <Section title="确认加载">
                  <p>模拟异步操作的加载状态。</p>

                  <DemoRow title="确认加载">
                      <Button variant="primary" onClick={() => setVisible4(true)}>
                          打开弹窗
                      </Button>
                  </DemoRow>

                  <Modal
                      visible={visible4}
                      title="确认加载"
                      confirmLoading={confirmLoading}
                      onCancel={() => setVisible4(false)}
                      onOk={handleOk}
                  >
                      <p>点击确认按钮后会显示加载状态，1秒后关闭。</p>
                  </Modal>
                  
                  <CopyBlock code={`import { Modal, Button } from '@zjpcy/simple-design';
import { useState } from 'react';

function App() {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setVisible(false);
            setLoading(false);
        }, 1000);
    };

    return (
        <>
            <Button onClick={() => setVisible(true)}>
                打开弹窗
            </Button>
            <Modal
                visible={visible}
                title="确认加载"
                confirmLoading={loading}
                onCancel={() => setVisible(false)}
                onOk={handleOk}
            >
                <p>点击确认后会显示加载状态。</p>
            </Modal>
        </>
    );
}`} />
              </Section>
              </div>

              <div id="modal-direction">
              <Section title="自定义方向">
                  <p>支持不同的弹出方向动画。</p>

                  <DemoRow title="居中弹出">
                      <Button variant="primary" onClick={() => setVisible5(true)}>
                          居中弹出
                      </Button>
                  </DemoRow>
                  
                  <DemoRow title="从右上滑入">
                      <Button variant="primary" onClick={() => setVisible6(true)}>
                          从右上滑入
                      </Button>
                  </DemoRow>
                  
                  <DemoRow title="从右下滑入">
                      <Button variant="primary" onClick={() => setVisible7(true)}>
                          从右下滑入
                      </Button>
                  </DemoRow>

                  <Modal
                      visible={visible5}
                      title="居中弹出"
                      direction="center"
                      onCancel={() => setVisible5(false)}
                      onOk={() => setVisible5(false)}
                  >
                      <p>从中心缩放的弹窗。</p>
                  </Modal>

                  <Modal
                      visible={visible6}
                      title="从右上滑入"
                      direction="top-right"
                      onCancel={() => setVisible6(false)}
                      onOk={() => setVisible6(false)}
                  >
                      <p>从右上角滑入的弹窗。</p>
                  </Modal>

                  <Modal
                      visible={visible7}
                      title="从右下滑入"
                      direction="bottom-right"
                      onCancel={() => setVisible7(false)}
                      onOk={() => setVisible7(false)}
                  >
                      <p>从右下角滑入的弹窗。</p>
                  </Modal>
                  
                  <CopyBlock code={`import { Modal, Button } from '@zjpcy/simple-design';

// 居中弹出
<Modal direction="center" {...props} />

// 从右上滑入
<Modal direction="top-right" {...props} />

// 从右下滑入
<Modal direction="bottom-right" {...props} />`} />
              </Section>
              </div>

              <div id="modal-top">
              <Section title="自定义顶部距离">
                  <p>可以设置弹窗距离顶部的距离。</p>

                  <DemoRow title="距顶 50px">
                      <Button variant="primary" onClick={() => setVisible8(true)}>
                          距顶 50px
                      </Button>
                  </DemoRow>
                  
                  <DemoRow title="距顶 100px">
                      <Button variant="primary" onClick={() => setVisible9(true)}>
                          距顶 100px
                      </Button>
                  </DemoRow>

                  <Modal
                      visible={visible8}
                      title="距顶 50px"
                      top={50}
                      onCancel={() => setVisible8(false)}
                      onOk={() => setVisible8(false)}
                  >
                      <p>距离顶部 50px 的弹窗。</p>
                  </Modal>

                  <Modal
                      visible={visible9}
                      title="距顶 100px"
                      top={100}
                      onCancel={() => setVisible9(false)}
                      onOk={() => setVisible9(false)}
                  >
                      <p>距离顶部 100px 的弹窗。</p>
                  </Modal>
                  
                  <CopyBlock code={`import { Modal, Button } from '@zjpcy/simple-design';

// 距顶 100px
<Modal top={100} {...props} />

// 距顶 50px
<Modal top={50} {...props} />`} />
              </Section>
              </div>

              <div id="modal-text">
              <Section title="自定义按钮文字">
                  <p>可以自定义确认和取消按钮的文字。</p>

                  <DemoRow title="自定义文字">
                      <Button variant="primary" onClick={() => setVisible10(true)}>
                          自定义文字
                      </Button>
                  </DemoRow>

                  <Modal
                      visible={visible10}
                      title="自定义按钮"
                      okText="保存"
                      cancelText="关闭"
                      onCancel={() => setVisible10(false)}
                      onOk={() => setVisible10(false)}
                  >
                      <p>自定义了确认和取消按钮的文字。</p>
                  </Modal>
                  
                  <CopyBlock code={`import { Modal, Button } from '@zjpcy/simple-design';

<Modal
    visible={visible}
    title="自定义按钮"
    okText="保存"
    cancelText="关闭"
    onCancel={handleCancel}
    onOk={handleOk}
>
    <p>自定义按钮文字的内容。</p>
</Modal>`} />
</Section>
</div>

<div id="modal-footer">
<Section title="自定义底部">
                  <p>可以完全自定义底部的按钮区域。</p>

                  <DemoRow title="自定义底部">
                      <Button variant="primary" onClick={() => setVisible11(true)}>
                          自定义底部
                      </Button>
                  </DemoRow>

                  <Modal
                      visible={visible11}
                      title="自定义底部"
                      footer={[
                          <Button key="cancel" variant="secondary" onClick={() => setVisible11(false)}>
                              取消
                          </Button>,
                          <Button key="save" variant="primary" onClick={() => setVisible11(false)}>
                              保存
                          </Button>,
                          <Button key="delete" variant="danger" onClick={() => setVisible11(false)}>
                              删除
                          </Button>
                      ]}
                      onCancel={() => setVisible11(false)}
                  >
                      <p>这是一个自定义 Footer 的弹窗，底部显示了三个按钮：取消、保存和删除。</p>
                      <p>footer 为 null 时显示默认按钮，提供值时显示自定义按钮。</p>
                  </Modal>
                  
                  <CopyBlock code={`import { Modal, Button } from '@zjpcy/simple-design';

<Modal
    visible={visible}
    title="自定义底部"
    footer={[
        <Button key="cancel" onClick={handleCancel}>取消</Button>,
        <Button key="save" variant="primary" onClick={handleSave}>保存</Button>,
        <Button key="delete" variant="danger" onClick={handleDelete}>删除</Button>
    ]}
>
    <p>自定义底部按钮的内容。</p>
</Modal>`} />
              </Section>

              <div id="modal-table-form">
              <Section title="Table + Modal + Form 组合">
                  <p>展示 Table、Modal 和 Form 的组合使用场景，实现增删改查功能。</p>

                  <div style={{ marginBottom: '16px' }}>
                      <Button variant="primary" onClick={handleAdd}>
                          + 新增用户
                      </Button>
                  </div>

                  <Table
                      columns={tableColumns}
                      dataSource={tableData}
                      pagination={false}
                      rowKey="id"
                  />

                  <Modal
                      visible={formModalVisible}
                      title={formModalEditMode ? '编辑用户' : '新增用户'}
                      width={500}
                      confirmLoading={formLoading}
                      onCancel={() => {
                          setFormModalVisible(false);
                          form.resetFields();
                      }}
                      onOk={handleFormSubmit}
                  >
                      <Form form={form} layout="vertical">
                          <Form.Item
                              label="姓名"
                              name="name"
                              rules={[{ required: true, message: '请输入姓名' }]}
                          >
                              <Input placeholder="请输入姓名" />
                          </Form.Item>
                          <Form.Item
                              label="邮箱"
                              name="email"
                              rules={[
                                  { required: true, message: '请输入邮箱' },
                                  { type: 'email', message: '请输入有效的邮箱地址' }
                              ]}
                          >
                              <Input placeholder="请输入邮箱" />
                          </Form.Item>
                          <Form.Item
                              label="角色"
                              name="role"
                              rules={[{ required: true, message: '请选择角色' }]}
                          >
                              <Select
                                  placeholder="请选择角色"
                                  options={[
                                      { value: '管理员', label: '管理员' },
                                      { value: '编辑', label: '编辑' },
                                      { value: '用户', label: '用户' }
                                  ]}
                              />
                          </Form.Item>
                          <Form.Item
                              label="状态"
                              name="status"
                              rules={[{ required: true, message: '请选择状态' }]}
                          >
                              <Select
                                  placeholder="请选择状态"
                                  options={[
                                      { value: 'active', label: '启用' },
                                      { value: 'inactive', label: '禁用' }
                                  ]}
                              />
                          </Form.Item>
                      </Form>
                  </Modal>

                  <CopyBlock code={`import { Modal, Button, Table, Form, Input, Select } from '@zjpcy/simple-design';
import type { Column } from '@zjpcy/simple-design';
import { useState } from 'react';

function UserManagement() {
   const [form] = Form.useForm();
   const [formModalVisible, setFormModalVisible] = useState(false);
   const [formModalEditMode, setFormModalEditMode] = useState(false);
   const [tableData, setTableData] = useState([
       { id: 1, name: '张三', email: 'zhangsan@example.com', status: 'active', role: '管理员' },
   ]);

   const tableColumns: Column[] = [
       { dataIndex: 'name', title: '姓名' },
       { dataIndex: 'email', title: '邮箱' },
       { dataIndex: 'role', title: '角色' },
       {
           dataIndex: 'status',
           title: '状态',
           render: (value) => <span>{value === 'active' ? '启用' : '禁用'}</span>
       },
       {
           dataIndex: 'action',
           title: '操作',
           render: (_, record) => (
               <>
                   <Button onClick={() => handleEdit(record)}>编辑</Button>
                   <Button onClick={() => handleDelete(record)}>删除</Button>
               </>
           )
       }
   ];

   const handleEdit = (record) => {
       setFormModalEditMode(true);
       form.setFieldsValue(record);
       setFormModalVisible(true);
   };

   const handleFormSubmit = () => {
       form.validateFields().then((values) => {
           // 提交表单逻辑
           console.log(values);
           setFormModalVisible(false);
       });
   };

   return (
       <>
           <Button onClick={() => setFormModalVisible(true)}>
               + 新增用户
           </Button>
           <Table columns={tableColumns} dataSource={tableData} />
           <Modal
               visible={formModalVisible}
               title={formModalEditMode ? '编辑用户' : '新增用户'}
               onOk={handleFormSubmit}
               onCancel={() => setFormModalVisible(false)}
           >
               <Form form={form} layout="vertical">
                   <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
                       <Input />
                   </Form.Item>
                   <Form.Item label="邮箱" name="email" rules={[{ required: true }, { type: 'email' }]}>
                       <Input />
                   </Form.Item>
                   <Form.Item label="角色" name="role" rules={[{ required: true }]}>
                       <Select options={[...]} />
                   </Form.Item>
                   <Form.Item label="状态" name="status" rules={[{ required: true }]}>
                       <Select options={[...]} />
                   </Form.Item>
               </Form>
           </Modal>
       </>
   );
}`} />
              </Section>
              </div>

              <Section title="安装和使用">
                  <h3>1. 安装依赖</h3>
                  <CopyBlock code="npm i @zjpcy/simple-design" />
                  
                  <h3>2. 引用组件</h3>
                  <CopyBlock code={`// 方式一：单独引入
import Modal from '@zjpcy/simple-design/lib/Modal';
import '@zjpcy/simple-design/lib/Modal/Modal.css';

// 方式二：批量引入
import { Modal } from '@zjpcy/simple-design';
import '@zjpcy/simple-design/lib/index.css';`} />
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
                    <Anchor.Link href="#modal-intro" title="组件介绍" />
                    <Anchor.Link href="#modal-basic" title="基本使用" />
                    <Anchor.Link href="#modal-size" title="自定义尺寸" />
                    <Anchor.Link href="#modal-loading" title="确认加载" />
                    <Anchor.Link href="#modal-direction" title="自定义方向" />
                    <Anchor.Link href="#modal-top" title="自定义顶部" />
                    <Anchor.Link href="#modal-text" title="自定义文字" />
                    <Anchor.Link href="#modal-footer" title="自定义底部" />
                    <Anchor.Link href="#modal-table-form" title="组合示例" />
                  </Anchor>
                )}
              </div>
            </div>
          </div>
        </div>
    );
};

export default ModalExample;

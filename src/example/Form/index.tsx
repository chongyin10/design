import React, { useState } from 'react';
import { Input, Button, Table, Flex, Modal } from '../../components';
import Form, { useForm } from '../../components/Form';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Column } from '../../components/Table';

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

const DemoBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: '24px', border: '1px solid #d9d9d9', borderRadius: '4px', marginBottom: '16px' }}>
    {children}
  </div>
);



const FormExample: React.FC = () => {
  const [form1] = useForm();
  const [form6] = useForm();
  const [modalForm] = useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const handleHorizontalFinish = (values: any) => {
    console.log('Horizontal form values:', values);
  };

  const handleVerticalFinish = (values: any) => {
    console.log('Vertical form values:', values);
  };

  const handleInlineFinish = (values: any) => {
    console.log('Inline form values:', values);
  };

  const handleFormInstanceFinish = (values: any) => {
    console.log('Form instance values:', values);
  };

  const handleSetValues = () => {
    form6.setFieldsValue({
      username: 'testuser',
      email: 'test@example.com',
      age: 25
    });
  };

  const handleGetValues = () => {
    const values = form6.getFieldsValue();
    console.log('Form values:', values);
    alert(JSON.stringify(values, null, 2));
  };

  const handleReset = () => {
    form6.resetFields();
  };

  const handleValidate = () => {
    form6.validateFields().then(values => {
      console.log('Validation passed:', values);
      alert('Validation passed!');
    }).catch(error => {
      console.log('Validation failed:', error);
      alert('Validation failed!');
    });
  };

  // API 表格列定义
  const formPropsColumns: Column[] = [
    { dataIndex: 'property', title: '属性', width: '150px' },
    { dataIndex: 'description', title: '说明', width: '200px' },
    { dataIndex: 'type', title: '类型', width: '250px' },
    { dataIndex: 'default', title: '默认值', width: '120px' }
  ];

  const formItemPropsColumns: Column[] = [
    { dataIndex: 'property', title: '属性', width: '150px' },
    { dataIndex: 'description', title: '说明', width: '200px' },
    { dataIndex: 'type', title: '类型', width: '250px' },
    { dataIndex: 'default', title: '默认值', width: '120px' }
  ];

  const ruleColumns: Column[] = [
    { dataIndex: 'property', title: '属性', width: '150px' },
    { dataIndex: 'description', title: '说明', width: '300px' },
    { dataIndex: 'type', title: '类型', width: '300px' }
  ];

  const formInstanceColumns: Column[] = [
    { dataIndex: 'method', title: '方法', width: '150px' },
    { dataIndex: 'description', title: '说明', width: '200px' },
    { dataIndex: 'params', title: '参数', width: '250px' },
    { dataIndex: 'return', title: '返回值', width: '150px' }
  ];

  // API 数据源
  const formPropsDataSource = [
    { property: 'layout', description: '表单布局', type: "'horizontal' | 'vertical' | 'inline'", default: "'horizontal'" },
    { property: 'labelSpan', description: 'label 标签的宽度占比（24栅格系统）', type: 'number', default: '6' },
    { property: 'wrapperSpan', description: '表单控件的宽度占比（24栅格系统，范围1-24-labelSpan）', type: 'number', default: '24-labelSpan' },
    { property: 'initialValues', description: '表单默认值', type: 'Record<string, any>', default: '{}' },
    { property: 'onFinish', description: '提交表单且数据验证成功后回调', type: '(values: Record<string, any>) => void', default: '-' },
    { property: 'onFinishFailed', description: '提交表单且数据验证失败后回调', type: '(errorInfo: any) => void', default: '-' },
    { property: 'form', description: '表单实例', type: 'FormInstance', default: '-' }
  ];

  const formItemPropsDataSource = [
    { property: 'name', description: '字段名', type: 'string', default: '-' },
    { property: 'label', description: 'label 标签的文本', type: 'ReactNode', default: '-' },
    { property: 'labelSpan', description: 'label 标签的宽度占比（24栅格系统）', type: 'number', default: '继承Form' },
    { property: 'wrapperSpan', description: '表单控件的宽度占比（24栅格系统，范围1-24-labelSpan）', type: 'number', default: '继承Form' },
    { property: 'required', description: '是否必填', type: 'boolean', default: 'false' },
    { property: 'rules', description: '校验规则', type: 'Rule[]', default: '-' },
    { property: 'help', description: '提示信息', type: 'ReactNode', default: '-' },
    { property: 'extra', description: '额外提示信息', type: 'ReactNode', default: '-' },
    { property: 'validateStatus', description: '校验状态', type: "'success' | 'warning' | 'error' | 'validating'", default: '-' }
  ];

  const ruleDataSource = [
    { property: 'required', description: '是否必填', type: 'boolean' },
    { property: 'message', description: '校验失败提示信息', type: 'string' },
    { property: 'pattern', description: '正则表达式校验', type: 'RegExp' },
    { property: 'min', description: '最小长度', type: 'number' },
    { property: 'max', description: '最大长度', type: 'number' },
    { property: 'type', description: '类型校验', type: "'email' | 'url' | 'phone' | 'number'" },
    { property: 'validator', description: '自定义校验函数', type: '(value: any) => boolean | string' }
  ];

  const formInstanceDataSource = [
    { method: 'getFieldValue', description: '获取单个字段的值', params: 'name: string', return: 'any' },
    { method: 'getFieldsValue', description: '获取多个字段的值', params: 'names?: string[]', return: 'Record<string, any>' },
    { method: 'setFieldValue', description: '设置单个字段的值', params: 'name: string, value: any', return: 'void' },
    { method: 'setFieldsValue', description: '设置多个字段的值', params: 'values: Record<string, any>', return: 'void' },
    { method: 'resetFields', description: '重置表单字段', params: '-', return: 'void' },
    { method: 'validateFields', description: '验证表单字段', params: '-', return: 'Promise<Record<string, any>>' },
    { method: 'destroy', description: '销毁表单实例，清空所有数据', params: '-', return: 'void' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Form 表单</h1>
      <p>具有数据收集、校验和提交功能的表单组件。</p>

      <Section title="基础用法">
        <p>最简单的用法，使用 Form.Item 包裹输入控件。</p>
        <DemoBox>
          <Form
            layout="horizontal"
            labelSpan={6}
            initialValues={{ username: '', password: '' }}
            onFinish={handleHorizontalFinish}
            form={form1}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6位' }
              ]}
            >
              <Input type="password" placeholder="请输入密码" />
            </Form.Item>
            <Form.Item>
              <Button variant="primary" type="submit">提交</Button>
            </Form.Item>
          </Form>
        </DemoBox>
        <CopyBlock code={`import { Form, Input, Button } from '@zjpcy/simple-design';
import { useForm } from '@zjpcy/simple-design/components/Form';

const Demo = () => {
  const [form] = useForm();
  
  const onFinish = (values) => {
    console.log('表单值:', values);
  };

  return (
    <Form
      layout="horizontal"
      labelSpan={6}
      initialValues={{ username: '', password: '' }}
      onFinish={onFinish}
      form={form}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码至少6位' }
        ]}
      >
        <Input type="password" placeholder="请输入密码" />
      </Form.Item>
      <Form.Item>
        <Button variant="primary" type="submit">提交</Button>
      </Form.Item>
    </Form>
  );
};`} />
      </Section>

      <Section title="垂直布局">
        <p>通过设置 layout="vertical" 实现垂直布局。</p>
        <DemoBox>
          <Form
            layout="vertical"
            initialValues={{ email: '', phone: '' }}
            onFinish={handleVerticalFinish}
          >
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="手机号"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\\d{9}$/, message: '请输入有效的手机号' }
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item>
              <Button variant="primary" type="submit">提交</Button>
            </Form.Item>
          </Form>
        </DemoBox>
        <CopyBlock code={`import { Form, Input, Button } from '@zjpcy/simple-design';

const Demo = () => {
  const onFinish = (values) => {
    console.log('表单值:', values);
  };

  return (
    <Form
      layout="vertical"
      initialValues={{ email: '', phone: '' }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item
        name="phone"
        label="手机号"
        rules={[
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3-9]\\d{9}$/, message: '请输入有效的手机号' }
        ]}
      >
        <Input placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item>
        <Button variant="primary" type="submit">提交</Button>
      </Form.Item>
    </Form>
  );
};`} />
      </Section>

      <Section title="行内布局">
        <p>通过设置 layout="inline" 实现行内布局。</p>
        <DemoBox>
          <Form
            layout="inline"
            initialValues={{ keyword: '' }}
            onFinish={handleInlineFinish}
          >
            <Form.Item
              name="keyword"
              label="关键词"
              rules={[{ required: true, message: '请输入关键词' }]}
            >
              <Input placeholder="请输入关键词" />
            </Form.Item>
            <Form.Item>
              <Button variant="primary" type="submit">搜索</Button>
            </Form.Item>
          </Form>
        </DemoBox>
        <CopyBlock code={`import { Form, Input, Button } from '@zjpcy/simple-design';

const Demo = () => {
  const onFinish = (values) => {
    console.log('表单值:', values);
  };

  return (
    <Form
      layout="inline"
      initialValues={{ keyword: '' }}
      onFinish={onFinish}
    >
      <Form.Item
        name="keyword"
        label="关键词"
        rules={[{ required: true, message: '请输入关键词' }]}
      >
        <Input placeholder="请输入关键词" />
      </Form.Item>
      <Form.Item>
        <Button variant="primary" type="submit">搜索</Button>
      </Form.Item>
    </Form>
  );
};`} />
      </Section>

      <Section title="表单验证">
        <p>支持多种验证规则：必填、类型、正则、自定义验证等。</p>
        <DemoBox>
          <Form
            layout="horizontal"
            labelSpan={6}
            initialValues={{
              username: '',
              email: '',
              age: '',
              website: ''
            }}
            onFinish={(values) => console.log('验证通过:', values)}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, max: 16, message: '用户名长度为3-16位' }
              ]}
            >
              <Input placeholder="3-16位字符" />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="example@email.com" />
            </Form.Item>
            <Form.Item
              name="age"
              label="年龄"
              rules={[
                { required: true, message: '请输入年龄' },
                { type: 'number', message: '请输入有效的数字' }
              ]}
            >
              <Input placeholder="请输入年龄" />
            </Form.Item>
            <Form.Item
              name="website"
              label="网站"
              rules={[
                { required: true, message: '请输入网站地址' },
                { type: 'url', message: '请输入有效的URL地址' }
              ]}
            >
              <Input placeholder="https://example.com" />
            </Form.Item>
            <Form.Item>
              <Button variant="primary" type="submit">提交</Button>
            </Form.Item>
          </Form>
        </DemoBox>
        <CopyBlock code={`import { Form, Input, Button } from '@zjpcy/simple-design';

const Demo = () => {
  return (
    <Form
      layout="horizontal"
      labelSpan={6}
      onFinish={(values) => console.log('验证通过:', values)}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 3, max: 16, message: '用户名长度为3-16位' }
        ]}
      >
        <Input placeholder="3-16位字符" />
      </Form.Item>
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]}
      >
        <Input placeholder="example@email.com" />
      </Form.Item>
      <Form.Item>
        <Button variant="primary" type="submit">提交</Button>
      </Form.Item>
    </Form>
  );
};`} />
      </Section>

      <Section title="帮助文本">
        <p>使用 help 和 extra 属性添加帮助文本。</p>
        <DemoBox>
          <Form
            layout="horizontal"
            labelSpan={6}
            initialValues={{ username: '', email: '' }}
            onFinish={(values) => console.log('表单值:', values)}
          >
            <Form.Item
              name="username"
              label="用户名"
              help="用户名将用于登录系统"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              extra="我们将向您的邮箱发送验证邮件"
              rules={[{ required: true, message: '请输入邮箱' }]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item>
              <Button variant="primary" type="submit">提交</Button>
            </Form.Item>
          </Form>
        </DemoBox>
        <CopyBlock code={`import { Form, Input, Button } from '@zjpcy/simple-design';

const Demo = () => {
  return (
    <Form layout="horizontal" labelSpan={6}>
      <Form.Item
        name="username"
        label="用户名"
        help="用户名将用于登录系统"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        name="email"
        label="邮箱"
        extra="我们将向您的邮箱发送验证邮件"
        rules={[{ required: true, message: '请输入邮箱' }]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>
    </Form>
  );
};`} />
      </Section>

      <Section title="自定义布局宽度">
        <p>通过 labelSpan 和 wrapperSpan 自定义表单布局宽度（基于24栅格系统）。</p>
        <DemoBox>
          <Form
            layout="horizontal"
            labelSpan={4}
            wrapperSpan={20}
            initialValues={{ title: '', content: '' }}
            onFinish={(values) => console.log('表单值:', values)}
          >
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder="labelSpan=4, wrapperSpan=20" />
            </Form.Item>
            <Form.Item
              name="content"
              label="内容"
              labelSpan={6}
              wrapperSpan={18}
              rules={[{ required: true, message: '请输入内容' }]}
            >
              <Input placeholder="Item级别: labelSpan=6, wrapperSpan=18" />
            </Form.Item>
            <Form.Item>
              <Button variant="primary" type="submit">提交</Button>
            </Form.Item>
          </Form>
        </DemoBox>
        <CopyBlock code={`import { Form, Input, Button } from '@zjpcy/simple-design';

const Demo = () => {
  return (
    <Form
      layout="horizontal"
      labelSpan={4}
      wrapperSpan={20}
    >
      {/* 继承Form的labelSpan和wrapperSpan */}
      <Form.Item name="title" label="标题">
        <Input placeholder="labelSpan=4, wrapperSpan=20" />
      </Form.Item>
      
      {/* Item级别覆盖 */}
      <Form.Item
        name="content"
        label="内容"
        labelSpan={6}
        wrapperSpan={18}
      >
        <Input placeholder="Item级别覆盖" />
      </Form.Item>
    </Form>
  );
};`} />
      </Section>

      <Section title="FormInstance 方法">
        <p>通过 useForm 获取表单实例，可以调用各种方法来操作表单。</p>
        <DemoBox>
          <Form
            layout="horizontal"
            labelSpan={6}
            initialValues={{ username: '', email: '', age: '' }}
            onFinish={handleFormInstanceFinish}
            form={form6}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item
              name="age"
              label="年龄"
              rules={[
                { required: true, message: '请输入年龄' },
                { type: 'number', message: '请输入有效的数字' }
              ]}
            >
              <Input placeholder="请输入年龄" />
            </Form.Item>
            <Form.Item>
              <Flex gap="small">
                <Button variant="primary" type="submit">提交</Button>
                <Button onClick={handleSetValues}>设置值</Button>
                <Button onClick={handleGetValues}>获取值</Button>
                <Button onClick={handleReset}>重置</Button>
                <Button onClick={handleValidate}>验证</Button>
              </Flex>
            </Form.Item>
          </Form>
        </DemoBox>
        <CopyBlock code={`import { Form, Input, Button } from '@zjpcy/simple-design';
import { useForm } from '@zjpcy/simple-design/components/Form';

const Demo = () => {
  const [form] = useForm();
  
  const handleSetValues = () => {
    form.setFieldsValue({
      username: 'testuser',
      email: 'test@example.com',
      age: 25
    });
  };

  const handleGetValues = () => {
    const values = form.getFieldsValue();
    console.log('表单值:', values);
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleValidate = () => {
    form.validateFields()
      .then(values => {
        console.log('验证通过:', values);
      })
      .catch(error => {
        console.log('验证失败:', error);
      });
  };

  const handleDestroy = () => {
    form.destroy();
    console.log('表单已销毁');
    alert('表单实例已销毁，所有数据已清空');
  };

  return (
    <Form form={form} layout="horizontal" labelSpan={6}>
      <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item>
        <Button onClick={handleSetValues}>设置值</Button>
        <Button onClick={handleGetValues}>获取值</Button>
        <Button onClick={handleReset}>重置</Button>
        <Button onClick={handleValidate}>验证</Button>
        <Button variant="danger" onClick={handleDestroy}>销毁</Button>
      </Form.Item>
    </Form>
  );
};`} />
      </Section>

      <Section title="在 Modal 中使用">
        <p>Form 组件可以与 Modal 组件结合使用，实现弹窗表单的场景。</p>
        <DemoBox>
          <Button variant="primary" onClick={() => setModalVisible(true)}>
            打开表单弹窗
          </Button>

          <Modal
            visible={modalVisible}
            title="新建用户"
            width={560}
            confirmLoading={modalLoading}
            onCancel={() => {
              setModalVisible(false);
              modalForm.resetFields();
            }}
            onOk={() => {
              modalForm.validateFields().then(values => {
                setModalLoading(true);
                setTimeout(() => {
                  setModalLoading(false);
                  setModalVisible(false);
                  console.log('表单提交成功:', values);
                  alert('提交成功！\n' + JSON.stringify(values, null, 2));
                  modalForm.resetFields();
                }, 1500);
              }).catch(error => {
                console.log('表单验证失败:', error);
              });
            }}
          >
            <Form
              form={modalForm}
              layout="horizontal"
              labelSpan={5}
              wrapperSpan={19}
              initialValues={{
                username: '',
                email: '',
                phone: '',
                department: ''
              }}
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 2, max: 20, message: '用户名长度为2-20位' }
                ]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input placeholder="example@email.com" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
              <Form.Item
                name="department"
                label="部门"
                help="请输入所属部门"
              >
                <Input placeholder="请输入部门名称" />
              </Form.Item>
            </Form>
          </Modal>
        </DemoBox>
        <CopyBlock code={`import { Form, Input, Button, Modal } from '@zjpcy/simple-design';
import { useForm } from '@zjpcy/simple-design/components/Form';
import { useState } from 'react';

const Demo = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  const handleOk = () => {
    form.validateFields().then(values => {
      setLoading(true);
      // 模拟异步提交
      setTimeout(() => {
        setLoading(false);
        setVisible(false);
        console.log('表单提交成功:', values);
        form.resetFields();
      }, 1500);
    }).catch(error => {
      console.log('表单验证失败:', error);
    });
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Button onClick={() => setVisible(true)}>
        打开表单弹窗
      </Button>
      <Modal
        visible={visible}
        title="新建用户"
        width={560}
        confirmLoading={loading}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form
          form={form}
          layout="horizontal"
          labelSpan={5}
          wrapperSpan={19}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 2, max: 20, message: '用户名长度为2-20位' }
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="example@email.com" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\\d{9}$/, message: '请输入有效的手机号' }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};`} />
      </Section>

      <Section title="API">
        <h3>Form Props</h3>
        <Table columns={formPropsColumns} dataSource={formPropsDataSource} />

        <h3>Form.Item Props</h3>
        <Table columns={formItemPropsColumns} dataSource={formItemPropsDataSource} />

        <h3>Rule</h3>
        <Table columns={ruleColumns} dataSource={ruleDataSource} />

        <h3>FormInstance 方法</h3>
        <Table columns={formInstanceColumns} dataSource={formInstanceDataSource} />
      </Section>
    </div>
  );
};

export default FormExample;

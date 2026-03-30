import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Flex, Space, Modal, Anchor, Form, Select, Switch } from '../../components';
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


// Form 同步测试组件 - 验证 setFieldsValue/getFieldsValue 修复
const FormSyncTest: React.FC = () => {
  const [form] = Form.useForm();
  const [logText, setLogText] = useState('');

  const log = (msg: string) => {
    setLogText(prev => prev + msg + '\n');
  };

  const clearLog = () => {
    setLogText('');
  };

  // 测试1：设置值后立即获取
  const testSetAndGet = () => {
    clearLog();
    log('=== 测试 setFieldsValue 后立即 getFieldsValue ===');
    form.setFieldsValue({ username: 'test123' });
    const values = form.getFieldsValue();
    log('设置 username = "test123"');
    log('立即获取值: ' + JSON.stringify(values));
    log('结果: ' + (values.username === 'test123' ? '✅ 通过' : '❌ 失败'));
  };

  // 测试2：设置空字符串
  const testSetEmpty = () => {
    clearLog();
    log('=== 测试设置空字符串 ===');
    form.setFieldsValue({ username: 'initial' });
    log('先设置 username = "initial"');
    form.setFieldsValue({ username: '' });
    log('再设置 username = ""');
    const values = form.getFieldsValue();
    log('获取值: ' + JSON.stringify(values));
    log('结果: ' + (values.username === '' ? '✅ 通过' : '❌ 失败'));
  };

  // 测试3：连续设置和获取
  const testContinuous = () => {
    clearLog();
    log('=== 测试连续设置和获取 ===');
    form.setFieldsValue({ username: 'a' });
    log('设置 username = "a"，获取: ' + form.getFieldsValue().username);
    form.setFieldsValue({ username: 'ab' });
    log('设置 username = "ab"，获取: ' + form.getFieldsValue().username);
    form.setFieldsValue({ username: 'abc' });
    log('设置 username = "abc"，获取: ' + form.getFieldsValue().username);
    log('结果: ' + (form.getFieldsValue().username === 'abc' ? '✅ 通过' : '❌ 失败'));
  };

  // 测试4：resetFields 后获取
  const testResetAndGet = () => {
    clearLog();
    log('=== 测试 resetFields 后获取值 ===');
    form.setFieldsValue({ username: 'before_reset' });
    log('设置 username = "before_reset"');
    form.resetFields();
    log('调用 resetFields()');
    const values = form.getFieldsValue();
    log('获取值: ' + JSON.stringify(values));
    log('结果: ✅ 重置成功');
  };

  // 测试5：getFieldValue 单个字段
  const testSingleField = () => {
    clearLog();
    log('=== 测试 getFieldValue 单个字段 ===');
    form.setFieldsValue({ username: 'single_test', email: 'test@example.com' });
    log('设置 username = "single_test", email = "test@example.com"');
    const username = form.getFieldValue('username');
    log('getFieldValue("username"): ' + username);
    log('结果: ' + (username === 'single_test' ? '✅ 通过' : '❌ 失败'));
  };

  return (
    <div>
      <Form
        form={form}
        layout="horizontal"
        labelSpan={6}
        initialValues={{ username: '', email: '' }}
      >
        <Form.Item name="username" label="用户名">
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name="email" label="邮箱">
          <Input placeholder="请输入邮箱" />
        </Form.Item>
      </Form>

      <Flex gap="small" wrap="wrap" style={{ marginTop: 16 }}>
        <Button variant="primary" onClick={testSetAndGet}>测试设置后立即获取</Button>
        <Button onClick={testSetEmpty}>测试设置空字符串</Button>
        <Button onClick={testContinuous}>测试连续操作</Button>
        <Button onClick={testResetAndGet}>测试重置</Button>
        <Button onClick={testSingleField}>测试单个字段</Button>
        <Button onClick={clearLog}>清空日志</Button>
      </Flex>

      <div style={{
        marginTop: 16,
        padding: 12,
        background: '#f5f5f5',
        borderRadius: 4,
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        minHeight: 150,
        maxHeight: 300,
        overflow: 'auto'
      }}>
        {logText || '点击按钮运行测试...'}
      </div>
    </div>
  );
};

// Space 包裹示例组件
const SpaceExample: React.FC = () => {
  const [form] = Form.useForm();
  const [values, setValues] = useState<Record<string, any>>({});

  const handleSetValues = () => {
    form.setFieldsValue({
      baseCultivation: 24,
      startTime: '09:00',
      endTime: '18:00',
      price: 199,
    });
  };

  const handleGetValues = () => {
    setValues(form.getFieldsValue());
  };

  return (
    <div>
      <Form form={form} layout="horizontal" labelSpan={6} wrapperSpan={18}>
        {/* 示例1: 自动递归注入 - Space 包裹 InputNumber */}
        <Form.Item
          name="baseCultivation"
          label="基础培养"
          rules={[{ required: true, message: '请输入基础培养时间' }]}
        >
          <Space>
            <Input.Number style={{ width: 120 }} placeholder="请输入" />
            <span>小时</span>
          </Space>
        </Form.Item>

        {/* 示例2: noStyle 模式 - 多个独立字段 */}
        <Form.Item label="时间范围">
          <Space>
            <Form.Item name="startTime" noStyle>
              <Input placeholder="开始时间" style={{ width: 100 }} />
            </Form.Item>
            <span>至</span>
            <Form.Item name="endTime" noStyle>
              <Input placeholder="结束时间" style={{ width: 100 }} />
            </Form.Item>
          </Space>
        </Form.Item>

        {/* 示例3: 多层嵌套 */}
        <Form.Item name="price" label="价格" rules={[{ required: true }]}>
          <Space>
            <Space>
              <Input.Number style={{ width: 100 }} placeholder="金额" />
              <span>元</span>
            </Space>
            <span>/</span>
            <span>件</span>
          </Space>
        </Form.Item>
      </Form>

      <Flex gap="small" style={{ marginTop: 16 }}>
        <Button variant="primary" onClick={handleSetValues}>
          设置值 (setFieldsValue)
        </Button>
        <Button onClick={handleGetValues}>获取值</Button>
        <Button onClick={() => form.resetFields()}>重置</Button>
      </Flex>

      {Object.keys(values).length > 0 && (
        <div style={{
          marginTop: 16,
          padding: 12,
          background: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: 4,
        }}>
          <strong>表单值:</strong>
          <pre style={{ margin: '8px 0 0 0' }}>{JSON.stringify(values, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};


// Modal + Form 高级场景模拟 - 验证 useForm + Modal + validateFields 完整链路
const ModalFormAdvanced: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleOpen = () => {
    form.resetFields();
    // 在 Modal 打开前设置默认值
    form.setFieldsValue({
      name: '',
      stage: 4,
      cultivation: '1000',
      successRate: '100',
      healthBonus: '0',
      attackBonus: '0',
      defenseBonus: '0',
      description: '',
    });
    setVisible(true);
  };

  const handleOpenWithEdit = () => {
    form.resetFields();
    // 模拟编辑：填充已有数据
    form.setFieldsValue({
      name: '金丹期',
      stage: 3,
      cultivation: '50000',
      successRate: '60',
      healthBonus: '500',
      attackBonus: '300',
      defenseBonus: '200',
      description: '金丹大道，一往无前',
    });
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('validateFields 返回值:', values);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setVisible(false);
        const displayValues: Record<string, any> = {};
        Object.keys(values).forEach(key => {
          const v = values[key];
          if (v !== undefined && v !== null && v !== '') {
            displayValues[key] = typeof v === 'string' ? (isNaN(Number(v)) ? v : Number(v)) : v;
          }
        });
        setResult(JSON.stringify(displayValues, null, 2));
      }, 800);
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const STAGE_OPTIONS = [
    { value: 1, label: '初期' },
    { value: 2, label: '中期' },
    { value: 3, label: '后期' },
    { value: 4, label: '大圆满' },
  ];

  const validateCultivation = (_: any, value: string) => {
    const num = Number(value);
    if (isNaN(num)) throw new Error('请输入有效数字');
    if (num < 0) throw new Error('不能为负数');
  };

  return (
    <div>
      <Space gap={12}>
        <Button variant="primary" onClick={handleOpen}>新增（空表单）</Button>
        <Button onClick={handleOpenWithEdit}>编辑（预填数据）</Button>
      </Space>

      <Modal
        title="Modal + Form 高级场景"
        visible={visible}
        width={600}
        confirmLoading={loading}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="stage" label="阶段" rules={[{ required: true, message: '请选择阶段' }]}>
            <Select placeholder="请选择阶段" options={STAGE_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="cultivation"
            label="基础修为"
            rules={[
              { required: true, message: '请输入基础修为' },
              { validator: validateCultivation },
            ]}
          >
            <Input.Number placeholder="请输入数值" />
          </Form.Item>
          <Form.Item name="successRate" label="成功率(%)">
            <Input.Number placeholder="默认100" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.Textarea rows={2} placeholder="可选" />
          </Form.Item>
          <Form.Item label="属性加成">
            <Space gap={12}>
              <Form.Item name="healthBonus" noStyle>
                <Input placeholder="生命" style={{ width: 100 }} />
              </Form.Item>
              <Form.Item name="attackBonus" noStyle>
                <Input placeholder="攻击" style={{ width: 100 }} />
              </Form.Item>
              <Form.Item name="defenseBonus" noStyle>
                <Input placeholder="防御" style={{ width: 100 }} />
              </Form.Item>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {result && (
        <div style={{
          marginTop: 16,
          padding: 12,
          background: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: 4,
        }}>
          <strong>validateFields() 返回值:</strong>
          <pre style={{ margin: '8px 0 0 0' }}>{result}</pre>
        </div>
      )}
    </div>
  );
};


// Modal + Form 复杂表单校验 - 多字段、自定义校验、条件渲染
const ModalFormComplexValidate: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [maxBaseCultivation] = useState(50000);
  const [result, setResult] = useState<string>('');

  const STAGE_COUNT_OPTIONS = [
    { value: 1, label: '1 个阶段' },
    { value: 2, label: '2 个阶段' },
    { value: 3, label: '3 个阶段' },
    { value: 4, label: '4 个阶段' },
  ];

  const modalTitle = editingId ? '编辑境界' : '新增境界';

  const validateBaseCultivation = (_: any, value: string) => {
    if (!value) throw new Error('请输入基础修为');
    const num = Number(value);
    if (isNaN(num)) throw new Error('请输入有效数字');
    if (num < 0) throw new Error('不能为负数');
    if (!editingId && num <= maxBaseCultivation) {
      throw new Error(`新增境界基础修为必须大于 ${maxBaseCultivation.toLocaleString()}`);
    }
  };

  const handleRecommendCultivation = () => {
    const recommended = maxBaseCultivation + 10000;
    form.setFieldsValue({ baseCultivation: String(recommended) });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        setVisible(false);
        const displayValues: Record<string, any> = {};
        Object.keys(values).forEach(key => {
          const v = values[key];
          if (v !== undefined && v !== null && v !== '') {
            displayValues[key] = typeof v === 'string' ? (isNaN(Number(v)) ? v : Number(v)) : v;
          }
        });
        setResult(JSON.stringify(displayValues, null, 2));
      }, 800);
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      baseCultivation: '',
      breakthroughCost: '',
      breakthroughItemId: '',
      breakthroughItemCount: '',
      baseSuccessRate: '',
      healthBonus: '0',
      attackBonus: '0',
      defenseBonus: '0',
      spiritPowerBonus: '0',
      lifespanBonus: '0',
      skillSlotUnlock: '0',
      description: '',
    });
    setVisible(true);
  };

  const handleOpenEdit = () => {
    setEditingId(1);
    form.resetFields();
    form.setFieldsValue({
      name: '金丹期',
      stageCount: 3,
      baseCultivation: '50000',
      breakthroughCost: '1000',
      breakthroughItemId: '2001',
      breakthroughItemCount: '3',
      baseSuccessRate: '60',
      healthBonus: '500',
      attackBonus: '300',
      defenseBonus: '200',
      spiritPowerBonus: '150',
      lifespanBonus: '100',
      skillSlotUnlock: '2',
      description: '金丹大道，一往无前',
      sortOrder: 5,
      isHidden: false,
    });
    setVisible(true);
  };

  return (
    <div>
      <Space gap={12}>
        <Button variant="primary" onClick={handleOpenCreate}>新增境界</Button>
        <Button onClick={handleOpenEdit}>编辑境界</Button>
      </Space>

      <Modal
        title={modalTitle}
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        confirmLoading={submitting}
        width={700}
      >
        <Form layout="vertical" form={form} className="realm-modal-form">
          <Form.Item
            label="境界名称"
            name="name"
            rules={[{ required: true, message: '请输入境界名称' }]}
          >
            <Input placeholder="如：练气、筑基、金丹" disabled={!!editingId} />
          </Form.Item>

          <Form.Item
            label="阶段数"
            name="stageCount"
            rules={[{ required: true, message: '请选择阶段数' }]}
          >
            <Select
              placeholder="请选择阶段数"
              options={STAGE_COUNT_OPTIONS}
              disabled={!!editingId}
            />
          </Form.Item>

          <Form.Item
            label={<span>基础修为 <Button onClick={handleRecommendCultivation} variant="primary" size="small">
              推荐基础修为
            </Button></span>}
            name="baseCultivation"
            rules={[
              { required: true, message: '请输入基础修为' },
              ...(!editingId ? [{ validator: validateBaseCultivation }] : []),
            ]}
          >
            <Input.Number
              placeholder="突破至该境界所需基础修为"
              style={{ width: '100%' }}
            />
          </Form.Item>
          {!editingId && maxBaseCultivation > 0 && (
            <div style={{ marginTop: -4, marginBottom: 16, color: '#8c8c8c', fontSize: 12 }}>
              当前最大基础修为：{maxBaseCultivation.toLocaleString()}，新增境界必须大于此值
            </div>
          )}

          <Form.Item
            label="突破消耗"
            name="breakthroughCost"
          >
            <Input.Number placeholder="可选" />
          </Form.Item>

          <Form.Item
            label="突破物品ID"
            name="breakthroughItemId"
          >
            <Input.Number placeholder="可选" />
          </Form.Item>

          <Form.Item
            label="突破物品数量"
            name="breakthroughItemCount"
          >
            <Input.Number />
          </Form.Item>

          <Form.Item
            label="基础成功率(%)"
            name="baseSuccessRate"
          >
            <Input.Number />
          </Form.Item>

          <Form.Item
            label="生命加成"
            name="healthBonus"
          >
            <Input.Number placeholder="0" />
          </Form.Item>

          <Form.Item
            label="攻击加成"
            name="attackBonus"
          >
            <Input.Number placeholder="0" />
          </Form.Item>

          <Form.Item
            label="防御加成"
            name="defenseBonus"
          >
            <Input.Number placeholder="0" />
          </Form.Item>

          <Form.Item
            label="灵力加成"
            name="spiritPowerBonus"
          >
            <Input.Number placeholder="0" />
          </Form.Item>

          <Form.Item
            label="寿命加成"
            name="lifespanBonus"
          >
            <Input.Number placeholder="0" />
          </Form.Item>

          <Form.Item
            label="技能槽解锁"
            name="skillSlotUnlock"
          >
            <Input.Number placeholder="0" />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
          >
            <Input.Textarea rows={2} placeholder="可选" />
          </Form.Item>

          {editingId && (
            <Form.Item
              label="排序"
              name="sortOrder"
              rules={[{ required: false, message: '请输入排序值' }]}
            >
              <Input.Number placeholder="数值越小排序越靠前" disabled />
            </Form.Item>
          )}

          <Form.Item
            label="是否隐藏"
            name="isHidden"
          >
            <Switch checkedChildren="隐藏" unCheckedChildren="显示" />
          </Form.Item>
        </Form>
      </Modal>

      {result && (
        <div style={{
          marginTop: 16,
          padding: 12,
          background: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: 4,
        }}>
          <strong>validateFields() 返回值:</strong>
          <pre style={{ margin: '8px 0 0 0' }}>{result}</pre>
        </div>
      )}
    </div>
  );
};


const FormExample: React.FC = () => {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [form4] = Form.useForm();
  const [form5] = Form.useForm();
  const [form6] = Form.useForm();
  const [form7] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  // Form + Table 组合示例
  const [queryForm] = Form.useForm();
  const [tableData] = useState([
    { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com' },
    { id: 2, name: '李四', age: 32, email: 'lisi@example.com' },
    { id: 3, name: '王五', age: 26, email: 'wangwu@example.com' },
    { id: 4, name: '赵六', age: 35, email: 'zhaoliu@example.com' },
  ]);
  const [loading, setLoading] = useState(false);

  const tableColumns: Column[] = [
    { dataIndex: 'id', title: 'ID', width: 80 },
    { dataIndex: 'name', title: '姓名', width: 120 },
    { dataIndex: 'age', title: '年龄', width: 100 },
    { dataIndex: 'email', title: '邮箱' },
  ];

  const handleQuery = (values: any) => {
    console.log('查询条件:', values);
    setLoading(true);
    // 模拟查询
    setTimeout(() => {
      setLoading(false);
      // 这里可以根据 values 过滤数据
      alert('查询条件：' + JSON.stringify(values, null, 2));
    }, 500);
  };

  const handleQueryReset = () => {
    queryForm.resetFields();
    console.log('表单已重置');
    // 验证：Table 中的数据不应该被重置
    alert('表单已重置，Table 数据保持不变！');
  };

  const handleQueryGetValues = () => {
    const values = queryForm.getFieldsValue();
    console.log('当前表单值:', values);
    alert('当前表单值：' + JSON.stringify(values, null, 2));
  };

  const handleQuerySetValues = () => {
    queryForm.setFieldsValue({
      keyword: '测试关键词',
      status: 'active',
      name: '测试名称',
    });
  };

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

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
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="form-intro">Form 表单</h1>
          <p>具有数据收集、校验和提交功能的表单组件。</p>

          <div id="form-basic">
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
                    <Button variant="primary" htmlType="submit">提交</Button>
                  </Form.Item>
                </Form>
              </DemoBox>
              <CopyBlock code={`import { Form, Input, Button } from '@zjpcy/simple-design';

const Demo = () => {
  const [form] = Form.useForm();
  
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
        <Button variant="primary" htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
  );
};`} />
            </Section>
          </div>

          <div id="form-vertical">
            <Section title="垂直布局">
              <p>通过设置 layout="vertical" 实现垂直布局。</p>
              <DemoBox>
                <Form
                  form={form3}
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
                    <Button variant="primary" htmlType="submit">提交</Button>
                  </Form.Item>
                </Form>
              </DemoBox>
              <CopyBlock code={`import { Form, Input, Button } from '@zjpcy/simple-design';

const Demo = () => {
  const [form] = Form.useForm();
  
  const onFinish = (values) => {
    console.log('表单值:', values);
  };

  return (
    <Form
      form={form}
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
        <Button variant="primary" htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
  );
};`} />
            </Section>
          </div>

          <div id="form-inline">
            <Section title="行内布局">
              <p>通过设置 layout="inline" 实现行内布局。</p>
              <DemoBox>
                <Form
                  form={form4}
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
                    <Button variant="primary" htmlType="submit">搜索</Button>
                  </Form.Item>
                </Form>
              </DemoBox>
              <CopyBlock code={`import { Form, Input, Button } from '@zjpcy/simple-design';

const Demo = () => {
  const [form] = Form.useForm();
  
  const onFinish = (values) => {
    console.log('表单值:', values);
  };

  return (
    <Form
      form={form}
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
        <Button variant="primary" htmlType="submit">搜索</Button>
      </Form.Item>
    </Form>
  );
};`} />
            </Section>
          </div>

          <div id="form-validation">
            <Section title="表单验证">
              <p>支持多种验证规则：必填、类型、正则、自定义验证等。</p>
              <DemoBox>
                <Form
                  form={form2}
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
                    <Button variant="primary" htmlType="submit">提交</Button>
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
        <Button variant="primary" htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
  );
};`} />
            </Section>
          </div>

          <div id="form-help">
            <Section title="帮助文本">
              <p>使用 help 和 extra 属性添加帮助文本。</p>
              <DemoBox>
                <Form
                  form={form5}
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
                    <Button variant="primary" htmlType="submit">提交</Button>
                  </Form.Item>
                </Form>
              </DemoBox>
              <CopyBlock code={`import { Form, Input, Button } from '@zjpcy/simple-design';

const Demo = () => {
  const [form] = Form.useForm();
  
  return (
    <Form form={form} layout="horizontal" labelSpan={6}>
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
          </div>

          <div id="form-layout">
            <Section title="自定义布局宽度">
              <p>通过 labelSpan 和 wrapperSpan 自定义表单布局宽度（基于24栅格系统）。</p>
              <DemoBox>
                <Form
                  form={form7}
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
                    <Button variant="primary" htmlType="submit">提交</Button>
                  </Form.Item>
                </Form>
              </DemoBox>
              <CopyBlock code={`import { Form, Input, Button } from '@zjpcy/simple-design';

const Demo = () => {
  const [form] = Form.useForm();
  
  return (
    <Form
      form={form}
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
          </div>

          <div id="form-instance">
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
                      <Button variant="primary" htmlType="submit">提交</Button>
                      <Button onClick={handleSetValues}>设置值</Button>
                      <Button onClick={handleGetValues}>获取值</Button>
                      <Button onClick={handleReset}>重置</Button>
                      <Button onClick={handleValidate}>验证</Button>
                    </Flex>
                  </Form.Item>
                </Form>
              </DemoBox>
              <CopyBlock code={`import { Form, Input, Button } from '@zjpcy/simple-design';

const Demo = () => {
  const [form] = Form.useForm();
  
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
          </div>

          <div id="form-sync-test">
            <Section title="setFieldsValue/getFieldsValue 同步测试">
              <p>验证 setFieldsValue 后立即调用 getFieldsValue 能获取到最新值（修复了闭包问题）。</p>
              <DemoBox>
                <FormSyncTest />
              </DemoBox>
              <CopyBlock code={`import { Form, Input, Button, Flex } from '@zjpcy/simple-design';
import { useState } from 'react';

const FormSyncTest = () => {
  const [form] = Form.useForm();
  const [logText, setLogText] = useState('');

  const log = (msg: string) => {
    setLogText(prev => prev + msg + '\\n');
  };

  const clearLog = () => {
    setLogText('');
  };

  // 测试1：设置值后立即获取
  const testSetAndGet = () => {
    clearLog();
    log('=== 测试 setFieldsValue 后立即 getFieldsValue ===');
    form.setFieldsValue({ username: 'test123' });
    const values = form.getFieldsValue();
    log('设置 username = "test123"');
    log('立即获取值: ' + JSON.stringify(values));
    log('结果: ' + (values.username === 'test123' ? '✅ 通过' : '❌ 失败'));
  };

  // 测试2：设置空字符串
  const testSetEmpty = () => {
    clearLog();
    log('=== 测试设置空字符串 ===');
    form.setFieldsValue({ username: 'initial' });
    log('先设置 username = "initial"');
    form.setFieldsValue({ username: '' });
    log('再设置 username = ""');
    const values = form.getFieldsValue();
    log('获取值: ' + JSON.stringify(values));
    log('结果: ' + (values.username === '' ? '✅ 通过' : '❌ 失败'));
  };

  // 测试3：连续设置和获取
  const testContinuous = () => {
    clearLog();
    log('=== 测试连续设置和获取 ===');
    form.setFieldsValue({ username: 'a' });
    log('设置 username = "a"，获取: ' + form.getFieldsValue().username);
    form.setFieldsValue({ username: 'ab' });
    log('设置 username = "ab"，获取: ' + form.getFieldsValue().username);
    form.setFieldsValue({ username: 'abc' });
    log('设置 username = "abc"，获取: ' + form.getFieldsValue().username);
    log('结果: ' + (form.getFieldsValue().username === 'abc' ? '✅ 通过' : '❌ 失败'));
  };

  // 测试4：resetFields 后获取
  const testResetAndGet = () => {
    clearLog();
    log('=== 测试 resetFields 后获取值 ===');
    form.setFieldsValue({ username: 'before_reset' });
    log('设置 username = "before_reset"');
    form.resetFields();
    log('调用 resetFields()');
    const values = form.getFieldsValue();
    log('获取值: ' + JSON.stringify(values));
    log('结果: ✅ 重置成功');
  };

  // 测试5：getFieldValue 单个字段
  const testSingleField = () => {
    clearLog();
    log('=== 测试 getFieldValue 单个字段 ===');
    form.setFieldsValue({ username: 'single_test', email: 'test@example.com' });
    log('设置 username = "single_test", email = "test@example.com"');
    const username = form.getFieldValue('username');
    log('getFieldValue("username"): ' + username);
    log('结果: ' + (username === 'single_test' ? '✅ 通过' : '❌ 失败'));
  };

  return (
    <div>
      <Form
        form={form}
        layout="horizontal"
        labelSpan={6}
        initialValues={{ username: '', email: '' }}
      >
        <Form.Item name="username" label="用户名">
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name="email" label="邮箱">
          <Input placeholder="请输入邮箱" />
        </Form.Item>
      </Form>

      <Flex gap="small" wrap="wrap" style={{ marginTop: 16 }}>
        <Button variant="primary" onClick={testSetAndGet}>测试设置后立即获取</Button>
        <Button onClick={testSetEmpty}>测试设置空字符串</Button>
        <Button onClick={testContinuous}>测试连续操作</Button>
        <Button onClick={testResetAndGet}>测试重置</Button>
        <Button onClick={testSingleField}>测试单个字段</Button>
        <Button onClick={clearLog}>清空日志</Button>
      </Flex>

      <div style={{
        marginTop: 16,
        padding: 12,
        background: '#f5f5f5',
        borderRadius: 4,
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        minHeight: 150,
        maxHeight: 300,
        overflow: 'auto'
      }}>
        {logText || '点击按钮运行测试...'}
      </div>
    </div>
  );
};`} />
            </Section>
          </div>

          <div id="form-modal">
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
                        alert('提交成功！\\n' + JSON.stringify(values, null, 2));
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
import { useState } from 'react';

const Demo = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

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
          </div>

          <div id="form-table">
            <Section title="Form + Table 组合使用">
              <p>Form 组件与 Table 组件组合使用</p>
              <DemoBox>
                <Form
                  form={queryForm}
                  layout="inline"
                  initialValues={{ keyword: '', status: '' }}
                  onFinish={handleQuery}
                  style={{ marginBottom: 16 }}
                >
                  <Form.Item
                    name="keyword"
                    label="关键词"
                  >
                    <Input placeholder="请输入关键词" style={{ width: 150 }} />
                  </Form.Item>
                  <Form.Item
                    name="status"
                    label="状态"
                  >
                    <Input placeholder="请输入状态" style={{ width: 150 }} />
                  </Form.Item>
                  <Form.Item
                    name="name"
                    label="名称"
                  >
                    <Input placeholder="请输入名称" style={{ width: 150 }} />
                  </Form.Item>
                  <Form.Item>
                    <Flex gap="small">
                      <Button variant="primary" htmlType="submit">查询</Button>
                      <Button onClick={handleQueryReset}>重置</Button>
                      <Button onClick={handleQueryGetValues}>获取值</Button>
                      <Button onClick={handleQuerySetValues}>设置值</Button>
                    </Flex>
                  </Form.Item>
                </Form>
                
                <Table
                  dataSource={tableData}
                  columns={tableColumns}
                  loading={loading}
                  rowKey="id"
                  bordered
                  pagination={{ pageSize: 5 }}
                />
              </DemoBox>
              <CopyBlock code={`import { Form, Input, Button, Table, Flex } from '@zjpcy/simple-design';
import { useState } from 'react';

const Demo = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([
    { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com' },
    { id: 2, name: '李四', age: 32, email: 'lisi@example.com' },
  ]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { dataIndex: 'id', title: 'ID', width: 80 },
    { dataIndex: 'name', title: '姓名', width: 120 },
    { dataIndex: 'age', title: '年龄', width: 100 },
    { dataIndex: 'email', title: '邮箱' },
  ];

  const handleQuery = (values) => {
    console.log('查询条件:', values);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleReset = () => {
    // 只重置 Form.Item 注册的字段
    // Table 数据不会被影响
    form.resetFields();
  };

  return (
    <>
      <Form form={form} layout="inline" onFinish={handleQuery}>
        <Form.Item name="keyword" label="关键词">
          <Input placeholder="请输入关键词" />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Input placeholder="请输入状态" />
        </Form.Item>
        <Form.Item name="name" label="名称">
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item>
          <Button variant="primary" htmlType="submit">查询</Button>
          <Button onClick={handleReset}>重置</Button>
        </Form.Item>
      </Form>
      
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="id"
      />
    </>
  );
};`} />
            </Section>
          </div>

          <div id="form-space">
            <Section title="Space 包裹输入组件">
              <p>当使用 Space 等布局组件包裹输入组件时，Form.Item 会自动递归查找并注入表单属性</p>
              <DemoBox>
                <SpaceExample />
              </DemoBox>
              <CopyBlock code={`import { Form, Input, Space, Button } from '@zjpcy/simple-design';

// 示例1: 自动递归注入（推荐）
// Form.Item 会自动穿透 Space 找到 Input.Number
<Form.Item name="baseCultivation" label="基础培养">
  <Space>
    <Input.Number style={{ width: 120 }} />
    <span>小时</span>
  </Space>
</Form.Item>

// 示例2: 使用 noStyle 模式（精细控制）
// 当需要在一个 Form.Item 中放置多个独立字段时使用
<Form.Item label="时间范围">
  <Space>
    <Form.Item name="startTime" noStyle>
      <Input placeholder="开始时间" />
    </Form.Item>
    <span>至</span>
    <Form.Item name="endTime" noStyle>
      <Input placeholder="结束时间" />
    </Form.Item>
  </Space>
</Form.Item>

// 示例3: 多层嵌套
<Form.Item name="price" label="价格">
  <Space>
    <Space>
      <Input.Number style={{ width: 100 }} />
      <span>元</span>
    </Space>
    <span>/</span>
    <span>件</span>
  </Space>
</Form.Item>`} />
            </Section>
          </div>

          <div id="form-modal-advanced">
            <Section title="Modal + Form 高级场景">
              <p>模拟实际业务场景：Modal 中使用 Form + useForm，包含多字段、默认值设置、validateFields 提交、Space 包裹 noStyle 子字段。</p>
              <DemoBox>
                <ModalFormAdvanced />
              </DemoBox>
              <CopyBlock code={`import { useState } from 'react';
import { Modal, Form, Input, Select, Space, Button } from '@zjpcy/simple-design';

const Demo = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    form.resetFields();
    // 在 Modal 打开前设置默认值
    form.setFieldsValue({
      name: '',
      stage: 4,
      cultivation: '1000',
      successRate: '100',
      healthBonus: '0',
      attackBonus: '0',
      defenseBonus: '0',
      description: '',
    });
    setVisible(true);
  };

  const handleOpenWithEdit = () => {
    form.resetFields();
    // 模拟编辑：填充已有数据
    form.setFieldsValue({
      name: '金丹期',
      stage: 3,
      cultivation: '50000',
      successRate: '60',
      healthBonus: '500',
      attackBonus: '300',
      defenseBonus: '200',
      description: '金丹大道，一往无前',
    });
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('validateFields 返回值:', values);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setVisible(false);
        alert('提交成功！\\n' + JSON.stringify(values, null, 2));
      }, 800);
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  const STAGE_OPTIONS = [
    { value: 1, label: '初期' },
    { value: 2, label: '中期' },
    { value: 3, label: '后期' },
    { value: 4, label: '大圆满' },
  ];

  return (
    <>
      <Space gap={12}>
        <Button variant="primary" onClick={handleOpen}>新增（空表单）</Button>
        <Button onClick={handleOpenWithEdit}>编辑（预填数据）</Button>
      </Space>

      <Modal
        title="Modal + Form 高级场景"
        visible={visible}
        width={600}
        confirmLoading={loading}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="stage" label="阶段" rules={[{ required: true }]}>
            <Select placeholder="请选择阶段" options={STAGE_OPTIONS} />
          </Form.Item>
          <Form.Item name="cultivation" label="基础修为" rules={[{ required: true }]}>
            <Input type="number" placeholder="请输入数值" />
          </Form.Item>
          <Form.Item name="successRate" label="成功率(%)">
            <Input type="number" placeholder="默认100" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.Textarea rows={2} placeholder="可选" />
          </Form.Item>
          {/* Space 包裹 noStyle 子字段 */}
          <Form.Item label="属性加成">
            <Space gap={12}>
              <Form.Item name="healthBonus" noStyle>
                <Input placeholder="生命" style={{ width: 100 }} />
              </Form.Item>
              <Form.Item name="attackBonus" noStyle>
                <Input placeholder="攻击" style={{ width: 100 }} />
              </Form.Item>
              <Form.Item name="defenseBonus" noStyle>
                <Input placeholder="防御" style={{ width: 100 }} />
              </Form.Item>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};`} />
            </Section>
          </div>

          <div id="form-complex-validate">
            <Section title="Modal + Form 复杂表单校验">
              <p>模拟实际业务场景：多字段表单、自定义校验、条件渲染字段、label 内嵌按钮、Switch 开关等复杂组合。</p>
              <DemoBox>
                <ModalFormComplexValidate />
              </DemoBox>
              <CopyBlock code={`import { useState } from 'react';
import { Modal, Form, Input, Select, Switch, Button, Space } from '@zjpcy/simple-design';

const Demo = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [maxBaseCultivation] = useState(50000);

  const STAGE_COUNT_OPTIONS = [
    { value: 1, label: '1 个阶段' },
    { value: 2, label: '2 个阶段' },
    { value: 3, label: '3 个阶段' },
    { value: 4, label: '4 个阶段' },
  ];

  const modalTitle = editingId ? '编辑境界' : '新增境界';

  const validateBaseCultivation = (_: any, value: string) => {
    if (!value) throw new Error('请输入基础修为');
    const num = Number(value);
    if (isNaN(num)) throw new Error('请输入有效数字');
    if (num < 0) throw new Error('不能为负数');
    if (!editingId && num <= maxBaseCultivation) {
      throw new Error(\`新增境界基础修为必须大于 \${maxBaseCultivation.toLocaleString()}\`);
    }
  };

  const handleRecommendCultivation = () => {
    const recommended = maxBaseCultivation + 10000;
    form.setFieldsValue({ baseCultivation: String(recommended) });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        setVisible(false);
        console.log('提交成功:', values);
      }, 800);
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    form.resetFields();
    setVisible(true);
  };

  const handleOpenEdit = () => {
    setEditingId(1);
    form.resetFields();
    form.setFieldsValue({
      name: '金丹期',
      stageCount: 3,
      baseCultivation: '50000',
      // ...其他字段
    });
    setVisible(true);
  };

  return (
    <>
      <Space gap={12}>
        <Button variant="primary" onClick={handleOpenCreate}>新增境界</Button>
        <Button onClick={handleOpenEdit}>编辑境界</Button>
      </Space>

      <Modal
        title={modalTitle}
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        confirmLoading={submitting}
        width={700}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="境界名称"
            name="name"
            rules={[{ required: true, message: '请输入境界名称' }]}
          >
            <Input placeholder="如：练气、筑基、金丹" disabled={!!editingId} />
          </Form.Item>

          <Form.Item
            label="阶段数"
            name="stageCount"
            rules={[{ required: true, message: '请选择阶段数' }]}
          >
            <Select placeholder="请选择阶段数" options={STAGE_COUNT_OPTIONS} />
          </Form.Item>

          {/* label 内嵌按钮 */}
          <Form.Item
            label={<span>基础修为 <Button onClick={handleRecommendCultivation} variant="primary" size="small">
              推荐基础修为
            </Button></span>}
            name="baseCultivation"
            rules={[
              { required: true, message: '请输入基础修为' },
              ...(!editingId ? [{ validator: validateBaseCultivation }] : []),
            ]}
          >
            <Input.Number placeholder="突破至该境界所需基础修为" style={{ width: '100%' }} />
          </Form.Item>

          {/* 条件渲染提示 */}
          {!editingId && maxBaseCultivation > 0 && (
            <div style={{ marginTop: -4, marginBottom: 16, color: '#8c8c8c', fontSize: 12 }}>
              当前最大基础修为：{maxBaseCultivation.toLocaleString()}，新增境界必须大于此值
            </div>
          )}

          <Form.Item label="生命加成" name="healthBonus">
            <Input.Number placeholder="0" />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.Textarea rows={2} placeholder="可选" />
          </Form.Item>

          {/* 条件渲染：仅编辑时显示 */}
          {editingId && (
            <Form.Item label="排序" name="sortOrder">
              <Input.Number placeholder="数值越小排序越靠前" disabled />
            </Form.Item>
          )}

          {/* Switch 开关 */}
          <Form.Item label="是否隐藏" name="isHidden">
            <Switch checkedChildren="隐藏" unCheckedChildren="显示" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};`} />
            </Section>
          </div>

          <div id="form-api">
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
                <Anchor.Link href="#form-intro" title="组件介绍" />
                <Anchor.Link href="#form-basic" title="基础用法" />
                <Anchor.Link href="#form-vertical" title="垂直布局" />
                <Anchor.Link href="#form-inline" title="行内布局" />
                <Anchor.Link href="#form-validation" title="表单验证" />
                <Anchor.Link href="#form-help" title="帮助文本" />
                <Anchor.Link href="#form-layout" title="自定义布局" />
                <Anchor.Link href="#form-instance" title="FormInstance" />
                <Anchor.Link href="#form-sync-test" title="同步测试" />
                <Anchor.Link href="#form-modal" title="Modal 中使用" />
                <Anchor.Link href="#form-table" title="Form + Table" />
                <Anchor.Link href="#form-space" title="Space 包裹" />
                <Anchor.Link href="#form-modal-advanced" title="Modal高级场景" />
                <Anchor.Link href="#form-complex-validate" title="复杂表单校验" />
                <Anchor.Link href="#form-api" title="API" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormExample;

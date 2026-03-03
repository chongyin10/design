import React, { useState, useEffect } from 'react';
import { Notification, Table, Button, Anchor } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const NotificationExample: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);
  
  // 受控模式状态
  const [controlledOpen, setControlledOpen] = useState(false);
  const [controlledMessage, setControlledMessage] = useState('这是一条通知');
  const [controlledType, setControlledType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [controlledPosition, setControlledPosition] = useState<'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right'>('center');
  const [controlledColor, setControlledColor] = useState<string | undefined>(undefined);
  const [controlledTop, setControlledTop] = useState<number | undefined>(undefined);
  const [controlledClickOutsideToClose, setControlledClickOutsideToClose] = useState(false);

  // API参数列配置
  const apiColumns: Column[] = [
    { dataIndex: 'param', title: '参数名', width: '150px' },
    { dataIndex: 'type', title: '类型', width: '300px' },
    { dataIndex: 'default', title: '默认值', width: '150px' },
    { dataIndex: 'description', title: '描述', width: '300px' }
  ];

  // API参数数据源
  const apiDataSource = [
    { param: 'message', type: 'string', default: '-', description: '通知显示的消息内容' },
    { param: 'duration', type: 'number', default: '3000', description: '通知显示的持续时间（毫秒）' },
    { param: 'type', type: "'info' | 'success' | 'warning' | 'error'", default: 'info', description: '通知的类型，决定显示的图标和样式（不设置时默认白色背景）' },
    { param: 'position', type: "'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right'", default: 'center', description: '通知显示的位置' },
    { param: 'color', type: 'string', default: '#ffffff', description: '自定义背景颜色（白色），覆盖默认背景色，不影响 type 的主题色' },
    { param: 'top', type: 'number', default: 'undefined', description: '控制通知离浏览器顶部的距离（y轴），仅对顶部位置有效，优先级高于position' },
    { param: 'open', type: 'boolean', default: 'undefined', description: '控制通知是否显示（受控模式）。不设置时为非受控模式，默认显示' },
    { param: 'clickOutsideToClose', type: 'boolean', default: 'false', description: '点击外部区域是否关闭通知，默认false' },
    { param: 'onClose', type: '() => void', default: '-', description: '通知关闭时的回调函数' }
  ];

  // 显示通知的函数
  const showNotification = (
    type: 'info' | 'success' | 'warning' | 'error', 
    message: string, 
    duration?: number,
    position?: 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right',
    color?: string,
    top?: number,
    clickOutsideToClose?: boolean
  ) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message, duration, position: position || 'center', color, top, clickOutsideToClose }]);
  };

  // 关闭通知的函数
  const handleClose = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="notification-intro">Notification 组件</h1>
          <p>用于显示操作反馈或系统通知的组件，支持多种类型、自定义持续时间和关闭回调。</p>
      
          {/* 基本使用示例 */}
          <div id="notification-basic" style={{ marginBottom: '40px' }}>
        <h3>基本使用</h3>
        <p>点击以下按钮查看不同类型的通知效果：</p>
        
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => showNotification('info', '这是一条信息通知')}
            variant="secondary"
            size="medium"
          >
            信息通知
          </Button>
          <Button 
            onClick={() => showNotification('success', '操作成功！')}
            variant="success"
            size="medium"
          >
            成功通知
          </Button>
          <Button 
            onClick={() => showNotification('warning', '警告：请检查输入')}
            variant="warning"
            size="medium"
          >
            警告通知
          </Button>
          <Button 
            onClick={() => showNotification('error', '错误：操作失败')}
            variant="danger"
            size="medium"
          >
            错误通知
          </Button>
        </div>
        
        <h4>自定义持续时间</h4>
        <p>可以通过 duration 属性设置通知显示的持续时间：</p>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => showNotification('info', '显示1秒的通知', 1000)}
            variant="secondary"
            size="medium"
          >
            1秒后关闭
          </Button>
          <Button 
            onClick={() => showNotification('success', '显示5秒的通知', 5000)}
            variant="success"
            size="medium"
          >
            5秒后关闭
          </Button>
          <Button 
            onClick={() => showNotification('warning', '显示10秒的通知', 10000)}
            variant="warning"
            size="medium"
          >
            10秒后关闭
          </Button>
        </div>
        
        <h4>带关闭回调的通知</h4>
        <p>可以通过 onClose 属性设置通知关闭时的回调函数：</p>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => showNotification('info', '关闭时会触发回调', 3000)}
            variant="secondary"
            size="medium"
          >
            带回调的通知
          </Button>
        </div>
        
        {/* 通知显示区域 */}
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
          {notifications.map(notification => (
            <Notification
              key={notification.id}
              type={notification.type}
              message={notification.message}
              duration={notification.duration}
              position={notification.position}
              color={notification.color}
              top={notification.top}
              clickOutsideToClose={notification.clickOutsideToClose}
              onClose={() => {
                handleClose(notification.id);
                if (notification.type === 'info') {
                  console.log('通知已关闭');
                }
              }}
            />
          ))}
        </div>
      </div>
      
          {/* 颜色示例 */}
          <div id="notification-color" style={{ marginBottom: '40px' }}>
            <h3>颜色示例</h3>
        <p>可以通过 color 属性自定义通知的背景颜色，默认白色背景：</p>
        
        <h4>默认白色背景（无 type 或不设置 type 时）</h4>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => showNotification('info', '默认白色背景', 3000, 'center', '#ffffff')}
            variant="secondary"
            size="medium"
          >
            白色背景
          </Button>
        </div>
        
        <h4>自定义颜色背景</h4>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => showNotification('info', '淡蓝色背景通知', 3000, 'center', '#e6f7ff')}
            variant="secondary"
            size="medium"
          >
            淡蓝色
          </Button>
          <Button 
            onClick={() => showNotification('success', '淡绿色背景通知', 3000, 'center', '#f6ffed')}
            variant="success"
            size="medium"
          >
            淡绿色
          </Button>
          <Button 
            onClick={() => showNotification('warning', '淡黄色背景通知', 3000, 'center', '#fffbe6')}
            variant="warning"
            size="medium"
          >
            淡黄色
          </Button>
          <Button 
            onClick={() => showNotification('error', '淡红色背景通知', 3000, 'center', '#fff1f0')}
            variant="danger"
            size="medium"
          >
            淡红色
          </Button>
        </div>
        
        <h4>鲜艳颜色背景</h4>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => showNotification('info', '粉色通知', 3000, 'center', '#ff85c0')}
            variant="secondary"
            size="medium"
          >
            粉色
          </Button>
          <Button 
            onClick={() => showNotification('success', '青色通知', 3000, 'center', '#5cdbd3')}
            variant="success"
            size="medium"
          >
            青色
          </Button>
          <Button 
            onClick={() => showNotification('warning', '橙色通知', 3000, 'center', '#ffc069')}
            variant="warning"
            size="medium"
          >
            橙色
          </Button>
          <Button 
            onClick={() => showNotification('error', '紫色通知', 3000, 'center', '#b37feb')}
            variant="danger"
            size="medium"
          >
            紫色
          </Button>
        </div>
        
        <h4>type 主题色保持不变</h4>
        <p>使用 type 属性时，主题色不受 color 影响：</p>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => showNotification('info', '蓝色主题色', 3000, 'top-left')}
            variant="secondary"
            size="medium"
          >
            蓝色主题
          </Button>
          <Button 
            onClick={() => showNotification('success', '绿色主题色', 3000, 'top-center')}
            variant="success"
            size="medium"
          >
            绿色主题
          </Button>
          <Button 
            onClick={() => showNotification('warning', '黄色主题色', 3000, 'top-right')}
            variant="warning"
            size="medium"
          >
            黄色主题
          </Button>
          <Button 
            onClick={() => showNotification('error', '红色主题色', 3000, 'bottom-right')}
            variant="danger"
            size="medium"
          >
            红色主题
          </Button>
        </div>
      </div>
      
      {/* 位置示例 */}
      <div style={{ marginBottom: '40px' }}>
        <h3>位置示例</h3>
        <p>可以通过 position 属性设置通知显示的位置：</p>
        
        <h4>顶部位置</h4>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => showNotification('info', '左上角通知', 3000, 'top-left')}
            variant="secondary"
            size="medium"
          >
            顶部左侧
          </Button>
          <Button 
            onClick={() => showNotification('success', '顶部中间通知', 3000, 'top-center')}
            variant="success"
            size="medium"
          >
            顶部中间
          </Button>
          <Button 
            onClick={() => showNotification('warning', '顶部右侧通知', 3000, 'top-right')}
            variant="warning"
            size="medium"
          >
            顶部右侧
          </Button>
        </div>
        
        <h4>居中位置</h4>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => showNotification('info', '居中显示的通知', 3000, 'center')}
            variant="primary"
            size="medium"
          >
            居中显示
          </Button>
        </div>
        
        <h4>底部位置</h4>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => showNotification('info', '左下角通知', 3000, 'bottom-left')}
            variant="secondary"
            size="medium"
          >
            底部左侧
          </Button>
          <Button 
            onClick={() => showNotification('success', '底部中间通知', 3000, 'bottom-center')}
            variant="success"
            size="medium"
          >
            底部中间
          </Button>
          <Button 
            onClick={() => showNotification('warning', '右下角通知', 3000, 'bottom-right')}
            variant="warning"
            size="medium"
          >
            底部右侧
          </Button>
        </div>
      </div>
      
          {/* 受控模式示例 */}
          <div id="notification-controlled" style={{ marginBottom: '40px' }}>
            <h3>受控模式示例</h3>
        <p>通过 open 属性控制通知的显示和隐藏，配合 onClose 实现手动控制：</p>
        
        <h4>基本用法</h4>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => setControlledOpen(true)}
            variant="primary"
            size="medium"
          >
            显示通知
          </Button>
        </div>
        
        <h4>不同类型</h4>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => {
              setControlledMessage('这是一条信息通知');
              setControlledType('info');
              setControlledOpen(true);
            }}
            variant="secondary"
            size="medium"
          >
            信息通知
          </Button>
          <Button 
            onClick={() => {
              setControlledMessage('操作成功！');
              setControlledType('success');
              setControlledOpen(true);
            }}
            variant="success"
            size="medium"
          >
            成功通知
          </Button>
          <Button 
            onClick={() => {
              setControlledMessage('警告：请检查输入');
              setControlledType('warning');
              setControlledOpen(true);
            }}
            variant="warning"
            size="medium"
          >
            警告通知
          </Button>
          <Button 
            onClick={() => {
              setControlledMessage('错误：操作失败');
              setControlledType('error');
              setControlledOpen(true);
            }}
            variant="danger"
            size="medium"
          >
            错误通知
          </Button>
        </div>
        
        <h4>不同位置</h4>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => {
              setControlledMessage('左上角通知');
              setControlledPosition('top-left');
              setControlledOpen(true);
            }}
            variant="secondary"
            size="medium"
          >
            顶部左侧
          </Button>
          <Button 
            onClick={() => {
              setControlledMessage('居中通知');
              setControlledPosition('center');
              setControlledOpen(true);
            }}
            variant="primary"
            size="medium"
          >
            居中显示
          </Button>
          <Button 
            onClick={() => {
              setControlledMessage('右下角通知');
              setControlledPosition('bottom-right');
              setControlledOpen(true);
            }}
            variant="warning"
            size="medium"
          >
            底部右侧
          </Button>
        </div>
        
        <h4>自定义颜色</h4>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => {
              setControlledMessage('淡蓝色背景');
              setControlledColor('#e6f7ff');
              setControlledOpen(true);
            }}
            variant="secondary"
            size="medium"
          >
            淡蓝色
          </Button>
          <Button 
            onClick={() => {
              setControlledMessage('淡绿色背景');
              setControlledColor('#f6ffed');
              setControlledOpen(true);
            }}
            variant="success"
            size="medium"
          >
            淡绿色
          </Button>
          <Button 
            onClick={() => {
              setControlledMessage('粉色通知');
              setControlledColor('#ff85c0');
              setControlledOpen(true);
            }}
            variant="danger"
            size="medium"
          >
            粉色
          </Button>
        </div>
        
        <h4>自定义 top 值</h4>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => {
              setControlledMessage('距离顶部50px的通知');
              setControlledPosition('top-right');
              setControlledTop(50);
              setControlledOpen(true);
            }}
            variant="primary"
            size="medium"
          >
            顶部50px
          </Button>
          <Button 
            onClick={() => {
              setControlledMessage('距离顶部100px的通知');
              setControlledPosition('top-right');
              setControlledTop(100);
              setControlledOpen(true);
            }}
            variant="secondary"
            size="medium"
          >
            顶部100px
          </Button>
          <Button 
            onClick={() => {
              setControlledMessage('距离顶部200px的通知');
              setControlledPosition('top-left');
              setControlledTop(200);
              setControlledOpen(true);
            }}
            variant="success"
            size="medium"
          >
            顶部200px
          </Button>
          <Button 
            onClick={() => {
              setControlledMessage('距离顶部300px的通知');
              setControlledPosition('top-center');
              setControlledTop(300);
              setControlledOpen(true);
            }}
            variant="warning"
            size="medium"
          >
            顶部300px
          </Button>
        </div>
        
        <h4>点击外部关闭</h4>
        <p>点击通知外部区域可关闭通知：</p>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => {
              setControlledMessage('点击外部关闭通知');
              setControlledClickOutsideToClose(true);
              setControlledOpen(true);
            }}
            variant="primary"
            size="medium"
          >
            点击外部关闭
          </Button>
        </div>
        
        {/* 受控模式通知显示 */}
        <Notification
          open={controlledOpen}
          message={controlledMessage}
          type={controlledType}
          position={controlledPosition}
          color={controlledColor}
          top={controlledTop}
          clickOutsideToClose={controlledClickOutsideToClose}
          onClose={() => {
            console.log('通知已关闭');
            setControlledOpen(false);
          }}
        />
      </div>
      
      {/* API 文档 */}
      <div style={{ marginBottom: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
        <h3>API 参数</h3>
        <Table pagination={false} columns={apiColumns} dataSource={apiDataSource} />
      </div>
      
      {/* 代码示例 */}
      <div style={{ marginBottom: '40px' }}>
        <h3>代码示例</h3>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0' }}>
{`import { Notification } from '@zjpcy/simple-design';

// 非受控模式 - 无需 open 属性，默认显示，3秒后自动关闭
<Notification 
  message="非受控模式通知"
/>

// 受控模式 - 通过 open 属性控制显示/隐藏
const [isOpen, setIsOpen] = useState(false);

<Notification 
  message="受控模式通知"
  open={isOpen}
  onClose={() => setIsOpen(false)}
/>

// 点击按钮显示通知
<Button onClick={() => setIsOpen(true)}>
  显示通知
</Button>

// 不同类型的通知（使用主题色）
<Notification 
  message="操作成功！"
  type="success"
/>

<Notification 
  message="警告：请检查输入"
  type="warning"
/>

<Notification 
  message="错误：操作失败"
  type="error"
/>

// 自定义持续时间（5秒后关闭）
<Notification 
  message="这条通知将显示5秒"
  duration={5000}
  type="info"
/>

// 带关闭回调的通知
<Notification 
  message="关闭时有回调"
  type="success"
  onClose={() => {
    console.log('通知已关闭');
    // 可以在这里执行一些清理或其他操作
  }}
/>

// 不同位置的通知
<Notification 
  message="顶部左侧通知"
  position="top-left"
  type="info"
/>

<Notification 
  message="顶部中间通知"
  position="top-center"
  type="success"
/>

<Notification 
  message="顶部右侧通知"
  position="top-right"
  type="warning"
/>

<Notification 
  message="居中显示通知"
  position="center"
  type="info"
/>

<Notification 
  message="底部左侧通知"
  position="bottom-left"
  type="info"
/>

<Notification 
  message="底部中间通知"
  position="bottom-center"
  type="success"
/>

<Notification 
  message="底部右侧通知"
  position="bottom-right"
  type="warning"
/>

// 自定义背景颜色（白色背景，黑色文字）
<Notification 
  message="默认白色背景"
  color="#ffffff"
/>

// 自定义各种颜色背景
<Notification 
  message="淡蓝色背景"
  color="#e6f7ff"
/>

<Notification 
  message="淡绿色背景"
  color="#f6ffed"
/>

<Notification 
  message="淡黄色背景"
  color="#fffbe6"
/>

<Notification 
  message="淡红色背景"
  color="#fff1f0"
/>

// 鲜艳颜色
<Notification 
  message="粉色通知"
  color="#ff85c0"
/>

<Notification 
  message="青色通知"
  color="#5cdbd3"
/>

<Notification 
  message="橙色通知"
  color="#ffc069"
/>

<Notification 
  message="紫色通知"
  color="#b37feb"
/>

// 自定义 top 值（仅顶部位置生效）
<Notification 
  message="距离顶部100px的通知"
  position="top-right"
  top={100}
  type="info"
/>

// 自定义 top 值 + 顶部左侧
<Notification 
  message="距离顶部150px的左侧通知"
  position="top-left"
  top={150}
  type="success"
/>

// 自定义 top 值 + 顶部中间
<Notification 
  message="距离顶部200px的中间通知"
  position="top-center"
  top={200}
  type="warning"
/>

// 非顶部位置 + top（position失效，仅使用top值，默认靠右）
<Notification 
  message="距离顶部250px的通知"
  position="center"
  top={250}
  type="error"
/>

// 完整用法示例
<Notification 
  message="自定义颜色和位置"
  color="#f0f5ff"
  position="top-right"
  duration={3000}
  onClose={() => console.log('通知已关闭')}
/>

// 完整用法 + top
<Notification 
  message="完整自定义通知"
  type="success"
  position="top-right"
  top={300}
  color="#e6f7ff"
  duration={5000}
  onClose={() => console.log('通知已关闭')}
/>

// 点击外部关闭通知
<Notification 
  message="点击外部区域关闭此通知"
  type="info"
  position="top-right"
  clickOutsideToClose={true}
/>

// 点击外部关闭 + 自定义颜色
<Notification 
  message="点击外部区域关闭"
  type="success"
  position="top-center"
  color="#f6ffed"
  clickOutsideToClose={true}
/>

// 点击外部关闭 + 受控模式
const [isOpen, setIsOpen] = useState(false);

<Notification 
  message="受控模式点击外部关闭"
  type="warning"
  position="top-left"
  open={isOpen}
  clickOutsideToClose={true}
  onClose={() => setIsOpen(false)}
/>`}
        </SyntaxHighlighter>
      </div>
      
          {/* 批量显示示例 */}
          <div id="notification-batch" style={{ marginBottom: '40px' }}>
            <h3>批量显示示例</h3>
        <p>支持同时显示多条通知，它们会依次堆叠显示：</p>
        <Button 
          onClick={() => {
            showNotification('success', '第一条通知', 2000);
            showNotification('info', '第二条通知', 4000);
            showNotification('warning', '第三条通知', 6000);
            showNotification('error', '第四条通知', 8000);
          }}
          variant="primary"
          size="medium"
        >
          批量显示通知
        </Button>
      </div>
      
          {/* 在其他项目中引用示例 */}
          <div id="notification-usage">
            <h3>在其他项目中引用</h3>
        <div style={{ margin: '15px 0' }}>
          <h4>1. 安装</h4>
          <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
            {`npm i @zjpcy/simple-design`}
          </SyntaxHighlighter>
        </div>
        <div>
          <h4>2. 引用组件</h4>
          <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
{`// 方式一：单独引入
import Notification from '@zjpcy/simple-design/lib/Notification';
import '@zjpcy/simple-design/lib/Notification/Notification.css';

// 方式二：批量引入（推荐）
import { Notification } from '@zjpcy/simple-design';
import '@zjpcy/simple-design/lib/index.css';

// 使用组件
const App: React.FC = () => {
  return (
    <div>
      <Notification 
        message="欢迎使用 Notification 组件！"
        type="success"
        duration={3000}
      />
    </div>
  );
};`}
          </SyntaxHighlighter>
        </div>
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
                <Anchor.Link href="#notification-intro" title="组件介绍" />
                <Anchor.Link href="#notification-basic" title="基本使用" />
                <Anchor.Link href="#notification-color" title="颜色示例" />
                <Anchor.Link href="#notification-position" title="位置示例" />
                <Anchor.Link href="#notification-controlled" title="受控模式" />
                <Anchor.Link href="#notification-batch" title="批量显示" />
                <Anchor.Link href="#notification-usage" title="引用说明" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationExample;
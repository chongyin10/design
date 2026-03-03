import React, { useState, useEffect } from 'react';
import { Slider, Table, Anchor } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SliderExample: React.FC = () => {
  const [_basicValue, setBasicValue] = useState(30);
  const [_rangedValue, setRangedValue] = useState(50);
  const [_stepValue, setStepValue] = useState(30);
  const [_markedValue, setMarkedValue] = useState(50);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  const apiColumns: Column[] = [
    { dataIndex: 'param', title: '参数名', width: '150px' },
    { dataIndex: 'type', title: '类型', width: '200px' },
    { dataIndex: 'default', title: '默认值', width: '150px' },
    { dataIndex: 'description', title: '描述', width: '300px' }
  ];

  const apiDataSource = [
    { param: 'min', type: 'number', default: '0', description: '最小值' },
    { param: 'max', type: 'number', default: '100', description: '最大值' },
    { param: 'step', type: 'number', default: '1', description: '步长，取值必须为大于0的数' },
    { param: 'value', type: 'number', default: '-', description: '受控模式下的当前值' },
    { param: 'defaultValue', type: 'number', default: '0', description: '非受控模式下的默认值' },
    { param: 'disabled', type: 'boolean', default: 'false', description: '是否禁用' },
    { param: 'marks', type: 'Record<number, string> | Record<number, { trackColor?: string; handleColor?: string; mark: React.ReactNode }>', default: '{}', description: '标记点配置，支持简单字符串或包含颜色配置的对象' },
    { param: 'showValue', type: 'boolean', default: 'false', description: '是否显示当前值' },
    { param: 'transitionSpeed', type: 'number', default: '300', description: '滑动动画速度（毫秒）' },
    { param: 'trackColor', type: 'string', default: "'#1890ff'", description: '填充轨道颜色' },
    { param: 'handleColor', type: 'string', default: "'#1890ff'", description: '滑块手柄边框颜色' },
    { param: 'gradient', type: '{ startColor: string; endColor: string }', default: '-', description: '轨道渐变颜色配置（仅在没有设置其他trackColor时生效）' },
    { param: 'onChange', type: '(value: number) => void', default: '-', description: '值改变时的回调函数' },
    { param: 'onAfterChange', type: '(value: number) => void', default: '-', description: '拖拽结束后的回调函数' },
    { param: 'className', type: 'string', default: '-', description: '自定义 CSS 类名' },
    { param: 'style', type: 'React.CSSProperties', default: '-', description: '自定义样式' }
  ];

  const marks = {
    0: '0°C',
    20: '20°C',
    40: '40°C',
    60: '60°C',
    80: '80°C',
    100: '100°C'
  };

  const customMarks = {
    0: '极低',
    25: '低',
    50: '中',
    75: '高',
    100: '极高'
  };

  const marksWithTooltip = {
    0: '0',
    20: '20',
    40: '40',
    60: '60',
    80: '80',
    100: '100'
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="slider-intro">Slider 滑动条</h1>
          <p>滑动型输入器，展示当前值和可选范围。当用户需要在数值区间/自定义区间内进行选择时，可为连续或离散值。</p>

          {/* 基本使用 */}
          <div id="slider-basic" style={{ marginBottom: '40px' }}>
            <h2>基本使用</h2>
            <p>最简单的滑动条，默认范围是 0-100。</p>
            
            <h3>基础滑动条</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider onChange={setBasicValue} />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider onChange={setBasicValue} />`}
            </SyntaxHighlighter>

            <h3>显示当前值</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider showValue defaultValue={50} onChange={setBasicValue} />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider showValue defaultValue={50} onChange={setBasicValue} />`}
            </SyntaxHighlighter>

            <h3>禁用状态</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider disabled defaultValue={30} />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider disabled defaultValue={30} />`}
            </SyntaxHighlighter>
          </div>

          {/* 自定义范围 */}
          <div id="slider-range" style={{ marginBottom: '40px' }}>
            <h2>自定义范围</h2>
            <p>通过设置 min 和 max 属性来自定义滑动范围。</p>

            <h3>0-100 范围（默认）</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider showValue defaultValue={50} onChange={setRangedValue} />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider showValue defaultValue={50} onChange={setRangedValue} />`}
            </SyntaxHighlighter>

            <h3>20-80 范围</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider showValue min={20} max={80} defaultValue={50} onChange={setRangedValue} />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider showValue min={20} max={80} defaultValue={50} onChange={setRangedValue} />`}
            </SyntaxHighlighter>

            <h3>0-1 范围（百分比）</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider showValue min={0} max={1} step={0.01} defaultValue={0.5} onChange={setRangedValue} />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider showValue min={0} max={1} step={0.01} defaultValue={0.5} onChange={setRangedValue} />`}
            </SyntaxHighlighter>
          </div>

          {/* 步长控制 */}
          <div id="slider-step" style={{ marginBottom: '40px' }}>
            <h2>步长控制</h2>
            <p>通过设置 step 属性来控制每次滑动的最小步长。</p>

            <h3>步长为 10</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider showValue step={10} defaultValue={30} onChange={setStepValue} />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider showValue step={10} defaultValue={30} onChange={setStepValue} />`}
            </SyntaxHighlighter>

            <h3>步长为 20</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider showValue step={20} defaultValue={40} onChange={setStepValue} />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider showValue step={20} defaultValue={40} onChange={setStepValue} />`}
            </SyntaxHighlighter>

            <h3>连续值（步长为 0）</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider showValue step={0.01} defaultValue={30.5} onChange={setStepValue} />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider showValue step={0.01} defaultValue={30.5} onChange={setStepValue} />`}
            </SyntaxHighlighter>
          </div>

          {/* 标记点 */}
          <div id="slider-marks" style={{ marginBottom: '40px' }}>
            <h2>标记点</h2>
            <p>使用 marks 属性在滑动条上显示标记点。</p>

            <h3>温度选择</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                marks={marks} 
                defaultValue={50} 
                onChange={setMarkedValue} 
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`const marks = {
  0: '0°C',
  20: '20°C',
  40: '40°C',
  60: '60°C',
  80: '80°C',
  100: '100°C'
};

<Slider showValue marks={marks} defaultValue={50} onChange={setMarkedValue} />`}
            </SyntaxHighlighter>

            <h3>风险等级</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                marks={customMarks} 
                defaultValue={50} 
                onChange={setMarkedValue} 
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`const customMarks = {
  0: '极低',
  25: '低',
  50: '中',
  75: '高',
  100: '极高'
};

<Slider showValue marks={customMarks} defaultValue={50} onChange={setMarkedValue} />`}
            </SyntaxHighlighter>

            <h3>仅显示部分标记</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                marks={marksWithTooltip} 
                step={20} 
                defaultValue={40} 
                onChange={setMarkedValue} 
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`const marksWithTooltip = {
  0: '0',
  20: '20',
  40: '40',
  60: '60',
  80: '80',
  100: '100'
};

<Slider showValue marks={marksWithTooltip} step={20} defaultValue={40} onChange={setMarkedValue} />`}
            </SyntaxHighlighter>

            <h3>分段颜色配置（高级）</h3>
            <p>为每个标记点配置不同的 trackColor 和 handleColor，实现分段颜色效果。优先级：marks {'>'} style {'>'} trackColor/handleColor 参数</p>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                marks={{
                  0: { mark: '低', trackColor: '#52c41a', handleColor: '#52c41a' },
                  33: { mark: '中', trackColor: '#faad14', handleColor: '#faad14' },
                  66: { mark: '高', trackColor: '#ff4d4f', handleColor: '#ff4d4f' },
                  100: { mark: '极高', trackColor: '#722ed1', handleColor: '#722ed1' }
                }}
                defaultValue={50}
                onChange={(val) => console.log('分段颜色值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`// 分段颜色配置（优先级最高）
<Slider 
  showValue 
  marks={{
    0: { mark: '低', trackColor: '#52c41a', handleColor: '#52c41a' },  // 最高优先级
    33: { mark: '中', trackColor: '#faad14', handleColor: '#faad14' },
    66: { mark: '高', trackColor: '#ff4d4f', handleColor: '#ff4d4f' },
    100: { mark: '极高', trackColor: '#722ed1', handleColor: '#722ed1' }
  }}
  defaultValue={50}
  onChange={(val) => console.log('分段颜色值：', val)}
/>

// 工作原理：
// - 当值 ≤ 33 时：显示绿色（低）
// - 当值 ≤ 66 时：显示橙色（中）
// - 当值 ≤ 100 时：显示红色（高）
// - marks 颜色优先级最高，会覆盖其他所有颜色设置`}
            </SyntaxHighlighter>

            <h3>仅配置轨道颜色</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                marks={{
                  0: { mark: '开始', trackColor: '#1890ff' },
                  50: { mark: '中间', trackColor: '#13c2c2' },
                  100: { mark: '结束', trackColor: '#f5222d' }
                }}
                defaultValue={75}
                onChange={(val) => console.log('仅轨道颜色值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`// 仅配置 trackColor，handleColor 使用默认值
<Slider 
  showValue 
  marks={{
    0: { mark: '开始', trackColor: '#1890ff' },  // 优先级最高
    50: { mark: '中间', trackColor: '#13c2c2' },
    100: { mark: '结束', trackColor: '#f5222d' }
  }}
  defaultValue={75}
  onChange={(val) => console.log('仅轨道颜色值：', val)}
/>`}
            </SyntaxHighlighter>
          </div>

          {/* 综合示例 */}
          <div id="slider-demo" style={{ marginBottom: '40px' }}>
            <h2>综合示例</h2>
            <p>组合使用各种属性来创建复杂的滑动条。</p>

            <h3>音量控制</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                min={0} 
                max={100} 
                step={5} 
                marks={{
                  0: '静音',
                  25: '低',
                  50: '中',
                  75: '高',
                  100: '最大'
                }}
                defaultValue={30}
                onChange={(val) => console.log('音量：', val)}
                onAfterChange={(val) => console.log('最终音量：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider 
  showValue 
  min={0} 
  max={100} 
  step={5} 
  marks={{
    0: '静音',
    25: '低',
    50: '中',
    75: '高',
    100: '最大'
  }}
  defaultValue={30}
  onChange={(val) => console.log('音量：', val)}
  onAfterChange={(val) => console.log('最终音量：', val)}
/>`}
            </SyntaxHighlighter>

            <h3>评分系统（1-10分）</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                min={1} 
                max={10} 
                step={1} 
                marks={{
                  1: '1分',
                  5: '5分',
                  10: '10分'
                }}
                defaultValue={7}
                onChange={(val) => console.log('当前评分：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider 
  showValue 
  min={1} 
  max={10} 
  step={1} 
  marks={{
    1: '1分',
    5: '5分',
    10: '10分'
  }}
  defaultValue={7}
  onChange={(val) => console.log('当前评分：', val)}
/>`}
            </SyntaxHighlighter>
          </div>

          {/* 颜色定制 */}
          <div id="slider-color" style={{ marginBottom: '40px' }}>
            <h2>颜色定制</h2>
            <p>通过多种方式自定义 Slider 组件的颜色，优先级顺序为：marks {'>'} style {'>'} trackColor/handleColor 参数 {'>'} 默认颜色</p>

            <h3>优先级演示</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                trackColor="#1890ff"
                handleColor="#1890ff"
                style={{ 
                  ['--slider-track-filled-bg-color' as any]: '#faad14',
                  ['--slider-handle-border-color' as any]: '#faad14'
                }}
                marks={{
                  0: { mark: '低', trackColor: '#52c41a', handleColor: '#52c41a' },
                  100: { mark: '高', trackColor: '#ff4d4f', handleColor: '#ff4d4f' }
                }}
                defaultValue={30}
                onChange={(val) => console.log('优先级测试值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`// 优先级演示：marks > style > trackColor/handleColor > 默认
<Slider 
  trackColor="#1890ff"      // 参数颜色（最低优先级）
  handleColor="#1890ff"
  style={{ 
    '--slider-track-filled-bg-color': '#faad14',  // style颜色（中等优先级）
    '--slider-handle-border-color': '#faad14'
  }}
  marks={{
    0: { mark: '低', trackColor: '#52c41a', handleColor: '#52c41a' },  // marks颜色（最高优先级）
    100: { mark: '高', trackColor: '#ff4d4f', handleColor: '#ff4d4f' }
  }}
  defaultValue={30}
/>

// 实际显示颜色：
// - 当值在 0-50 之间：绿色（来自 marks）
// - 当值在 50-100 之间：红色（来自 marks）
// - style 和参数颜色被 marks 覆盖`}
            </SyntaxHighlighter>

            <h3>使用 trackColor 和 handleColor 参数（简洁方式）</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                trackColor="#52c41a"
                handleColor="#52c41a"
                defaultValue={40}
                onChange={(val) => console.log('参数颜色值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider 
  showValue 
  trackColor="#52c41a"  // 快速设置轨道颜色
  handleColor="#52c41a" // 快速设置滑块颜色
  defaultValue={40}
/>`}
            </SyntaxHighlighter>

            <h3>使用 style 属性（CSS 变量方式）</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                style={{ 
                  ['--slider-track-filled-bg-color' as any]: '#722ed1',
                  ['--slider-handle-border-color' as any]: '#722ed1'
                }}
                defaultValue={60}
                onChange={(val) => console.log('style颜色值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider 
  showValue 
  style={{ 
    '--slider-track-filled-bg-color': '#722ed1',  // CSS变量设置轨道颜色
    '--slider-handle-border-color': '#722ed1'     // CSS变量设置滑块颜色
  }}
  defaultValue={60}
/>`}
            </SyntaxHighlighter>

            <h3>marks 分段颜色（动态优先级）</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                trackColor="#1890ff"  // 默认蓝色
                marks={{
                  0: { mark: '低', trackColor: '#52c41a', handleColor: '#52c41a' },  // 0-50：绿色
                  50: { mark: '高', trackColor: '#ff4d4f', handleColor: '#ff4d4f' }   // 50-100：红色
                }}
                defaultValue={30}
                onChange={(val) => console.log('动态颜色值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`// marks 颜色会覆盖 trackColor/handleColor 参数
<Slider 
  trackColor="#1890ff"  // 默认颜色，会被 marks 覆盖
  marks={{
    0: { mark: '低', trackColor: '#52c41a', handleColor: '#52c41a' },  // 优先级最高
    50: { mark: '高', trackColor: '#ff4d4f', handleColor: '#ff4d4f' }
  }}
  defaultValue={30}
/>

// 显示效果：
// - 值在 0-50 之间：绿色（marks[0] 的颜色）
// - 值在 50-100 之间：红色（marks[50] 的颜色）
// - trackColor="#1890ff" 只在无 marks 配置时生效`}
            </SyntaxHighlighter>
          </div>

          {/* 滑动速度控制 */}
          <div id="slider-speed" style={{ marginBottom: '40px' }}>
            <h2>滑动速度控制</h2>
            <p>通过 transitionSpeed 属性控制滑动动画的速度（毫秒）。</p>

            <h3>快速滑动（100ms）</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                transitionSpeed={100}
                defaultValue={30}
                onChange={(val) => console.log('快速滑动值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider 
  showValue 
  transitionSpeed={100}
  defaultValue={30}
  onChange={(val) => console.log('快速滑动值：', val)}
/>`}
            </SyntaxHighlighter>

            <h3>慢速滑动（1000ms）</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                transitionSpeed={1000}
                defaultValue={50}
                onChange={(val) => console.log('慢速滑动值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider 
  showValue 
  transitionSpeed={1000}
  defaultValue={50}
  onChange={(val) => console.log('慢速滑动值：', val)}
/>`}
            </SyntaxHighlighter>

            <h3>默认速度（300ms）</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                defaultValue={70}
                onChange={(val) => console.log('默认滑动值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider 
  showValue 
  defaultValue={70}
  onChange={(val) => console.log('默认滑动值：', val)}
/>`}
            </SyntaxHighlighter>
          </div>

          {/* 渐变颜色 */}
          <div id="slider-gradient" style={{ marginBottom: '40px' }}>
            <h2>渐变颜色</h2>
            <p>通过 gradient 属性设置轨道的渐变颜色，从 startColor 到 endColor 的渐变效果。仅在未设置 trackColor、style 中的 trackColor 和 marks 中的 trackColor 时生效。</p>

            <h3>蓝色到紫色渐变</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                gradient={{ startColor: '#1890ff', endColor: '#722ed1' }}
                defaultValue={50}
                onChange={(val) => console.log('渐变值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider 
  showValue 
  gradient={{ startColor: '#1890ff', endColor: '#722ed1' }}
  defaultValue={50}
  onChange={(val) => console.log('渐变值：', val)}
/>`}
            </SyntaxHighlighter>

            <h3>绿色到蓝色渐变</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                gradient={{ startColor: '#52c41a', endColor: '#1890ff' }}
                defaultValue={70}
                onChange={(val) => console.log('渐变值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider 
  showValue 
  gradient={{ startColor: '#52c41a', endColor: '#1890ff' }}
  defaultValue={70}
  onChange={(val) => console.log('渐变值：', val)}
/>`}
            </SyntaxHighlighter>

            <h3>橙色到红色渐变</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                gradient={{ startColor: '#faad14', endColor: '#ff4d4f' }}
                defaultValue={30}
                onChange={(val) => console.log('渐变值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider 
  showValue 
  gradient={{ startColor: '#faad14', endColor: '#ff4d4f' }}
  defaultValue={30}
  onChange={(val) => console.log('渐变值：', val)}
/>`}
            </SyntaxHighlighter>

            <h3>渐变颜色的优先级</h3>
            <p>gradient 仅在以下情况下生效：</p>
            <ul>
              <li>marks 中没有设置 trackColor</li>
              <li>style 中没有设置 --slider-track-filled-bg-color</li>
              <li>没有设置 trackColor 参数（或使用默认值 #1890ff）</li>
            </ul>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                gradient={{ startColor: '#52c41a', endColor: '#1890ff' }}
                trackColor="#ff4d4f"
                defaultValue={50}
                onChange={(val) => console.log('渐变被覆盖：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`// gradient 会被 trackColor 覆盖（trackColor优先级更高）
<Slider 
  showValue 
  gradient={{ startColor: '#52c41a', endColor: '#1890ff' }}  // 渐变配置
  trackColor="#ff4d4f"  // 红色会覆盖渐变
  defaultValue={50}
/>

// 显示效果：红色（trackColor 优先级高于 gradient）`}
            </SyntaxHighlighter>
          </div>

          {/* 自定义样式 */}
          <div id="slider-custom" style={{ marginBottom: '40px' }}>
            <h2>自定义样式</h2>
            <p>通过 style 属性自定义 Slider 组件的样式，可以覆盖默认的 CSS 变量值。</p>

            <h3>自定义主题颜色</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                defaultValue={40}
                style={{ 
                  ['--slider-track-filled-bg-color' as any]: '#52c41a',
                  ['--slider-handle-border-color' as any]: '#52c41a'
                }}
                onChange={(val) => console.log('自定义颜色值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider 
  showValue 
  defaultValue={40}
  style={{ 
    '--slider-track-filled-bg-color': '#52c41a',
    '--slider-handle-border-color': '#52c41a'
  }}
  onChange={(val) => console.log('自定义颜色值：', val)}
/>`}
            </SyntaxHighlighter>

            <h3>自定义滑块大小</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                defaultValue={60}
                style={{ 
                  ['--slider-handle-size' as any]: '24px',
                  ['--slider-track-height' as any]: '8px'
                }}
                onChange={(val) => console.log('自定义大小值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider 
  showValue 
  defaultValue={60}
  style={{ 
    '--slider-handle-size': '24px',
    '--slider-track-height': '8px'
  }}
  onChange={(val) => console.log('自定义大小值：', val)}
/>`}
            </SyntaxHighlighter>

            <h3>自定义动画速度</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                defaultValue={50}
                transitionSpeed={500}
                style={{ 
                  ['--slider-handle-hover-scale' as any]: '1.5'
                }}
                onChange={(val) => console.log('自定义动画值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider 
  showValue 
  defaultValue={50}
  transitionSpeed={500}
  style={{ 
    '--slider-handle-hover-scale': '1.5'
  }}
  onChange={(val) => console.log('自定义动画值：', val)}
/>`}
            </SyntaxHighlighter>

            <h3>组合多个自定义样式</h3>
            <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
              <Slider 
                showValue 
                defaultValue={75}
                style={{ 
                  ['--slider-track-filled-bg-color' as any]: '#ff4d4f',
                  ['--slider-handle-border-color' as any]: '#ff4d4f',
                  ['--slider-handle-size' as any]: '20px',
                  ['--slider-track-height' as any]: '6px',
                  ['--slider-handle-hover-scale' as any]: '1.3',
                  ['--slider-value-color' as any]: '#ff4d4f',
                  ['--slider-value-font-weight' as any]: 'bold'
                }}
                onChange={(val) => console.log('组合自定义值：', val)}
              />
            </div>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
              {`<Slider 
  showValue 
  defaultValue={75}
  style={{ 
    '--slider-track-filled-bg-color': '#ff4d4f',
    '--slider-handle-border-color': '#ff4d4f',
    '--slider-handle-size': '20px',
    '--slider-track-height': '6px',
    '--slider-handle-hover-scale': '1.3',
    '--slider-value-color': '#ff4d4f',
    '--slider-value-font-weight': 'bold'
  }}
  onChange={(val) => console.log('组合自定义值：', val)}
/>`}
            </SyntaxHighlighter>
          </div>

          {/* API 文档 */}
          <div id="slider-api" style={{ marginBottom: '40px' }}>
            <h2>API 文档</h2>
            <p>Slider 组件的属性配置。</p>
            <Table columns={apiColumns} pagination={false} dataSource={apiDataSource} />
          </div>

          {/* 安装和使用说明 */}
          <div id="slider-install" style={{ marginBottom: '40px' }}>
            <h2>安装和使用</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <h3>1. 安装依赖</h3>
              <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
                {`yarn add @zjpcy/simple-design`}
              </SyntaxHighlighter>
            </div>
            
            <div>
              <h3>2. 引用组件</h3>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
                {`// 方式一：单独引入
import Slider from '@zjpcy/simple-design/lib/Slider';
import '@zjpcy/simple-design/lib/Slider/Slider.css';

// 方式二：批量引入
import { Slider } from '@zjpcy/simple-design';
import '@zjpcy/simple-design/lib/index.css';`}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* 可用的 CSS 变量 */}
          <div id="slider-css" style={{ marginBottom: '40px' }}>
            <h2>可用的 CSS 变量</h2>
            <p>Slider 组件提供了丰富的 CSS 变量，可以通过 style 属性进行自定义：</p>
            
            <Table 
              columns={[
                { dataIndex: 'variable', title: 'CSS 变量', width: '250px' },
                { dataIndex: 'default', title: '默认值', width: '150px' },
                { dataIndex: 'description', title: '说明', width: '400px' }
              ]}
              pagination={false}
              dataSource={[
                { variable: '--slider-container-padding', default: '16px 0', description: '容器内边距' },
                { variable: '--slider-track-height', default: '4px', description: '轨道高度' },
                { variable: '--slider-track-bg-color', default: '#e0e0e0', description: '轨道背景色' },
                { variable: '--slider-track-border-radius', default: '2px', description: '轨道圆角' },
                { variable: '--slider-track-filled-bg-color', default: '#1890ff', description: '填充轨道背景色（优先级：marks > style > trackColor参数 > 默认）' },
                { variable: '--slider-handle-size', default: '16px', description: '滑块手柄尺寸' },
                { variable: '--slider-handle-bg-color', default: '#fff', description: '滑块手柄背景色' },
                { variable: '--slider-handle-border-color', default: '#1890ff', description: '滑块手柄边框色（优先级：marks > style > handleColor参数 > 默认）' },
                { variable: '--slider-handle-hover-scale', default: '1.2', description: '滑块悬停放大比例' },
                { variable: '--slider-handle-hover-box-shadow', default: '0 4px 8px rgba(0, 0, 0, 0.3)', description: '滑块悬停阴影' },
                { variable: '--slider-mark-font-size', default: '12px', description: '标记点字体大小' },
                { variable: '--slider-mark-color', default: '#666', description: '标记点文字颜色' },
                { variable: '--slider-value-color', default: '#333', description: '当前值文字颜色' },
                { variable: '--slider-value-font-weight', default: '500', description: '当前值字体粗细' },
                { variable: '--slider-tooltip-bg-color', default: '#333', description: '工具提示背景色' },
                { variable: '--slider-tooltip-color', default: '#fff', description: '工具提示文字颜色' }
              ]}
            />
            
            <div style={{ marginTop: '20px' }}>
              <h3>marks 配置说明</h3>
              <p>marks 支持两种配置方式：</p>
              <ul>
                <li><strong>简单字符串方式：</strong><code>{`{ 0: '标签', 50: '中间' }`}</code></li>
                <li><strong>高级对象方式（支持分段颜色）：</strong>
                  <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '10px 0', fontSize: '14px' }}>
                    {`{
  0: { mark: '低', trackColor: '#52c41a', handleColor: '#52c41a' },
  50: { mark: '中', trackColor: '#faad14', handleColor: '#faad14' },
  100: { mark: '高', trackColor: '#ff4d4f', handleColor: '#ff4d4f' }
}`}
                  </SyntaxHighlighter>
                </li>
              </ul>
              <p><strong>分段颜色工作原理：</strong>根据当前值所在的区间，自动应用对应的 trackColor 和 handleColor。</p>
            </div>
          </div>

          {/* 使用建议 */}
          <div id="slider-tips">
            <h2>使用建议</h2>
            <ul>
              <li><strong>适用场景：</strong>适合用于在一定范围内选择数值的场景，如音量控制、亮度调节、评分等。</li>
              <li><strong>精度选择：</strong>对于精确数值输入，建议结合Input组件使用；对于大致范围选择，使用Slider更合适。</li>
              <li><strong>可访问性：</strong>组件支持键盘操作（方向键、Home、End、PageUp、PageDown），确保无障碍访问。</li>
              <li><strong>视觉反馈：</strong>建议开启showValue属性或提供marks标记点，让用户明确当前选择的值。</li>
              <li><strong>分段颜色：</strong>使用 marks 的高级配置方式，可以为不同数值区间设置不同的颜色，提供更好的视觉反馈。</li>
              <li><strong>颜色优先级：</strong>marks 中的 trackColor/handleColor {'>'} style 中的 CSS 变量 {'>'} trackColor/handleColor 参数 {'>'} 默认颜色</li>
            </ul>
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
                <Anchor.Link href="#slider-intro" title="组件介绍" />
                <Anchor.Link href="#slider-basic" title="基本使用" />
                <Anchor.Link href="#slider-range" title="自定义范围" />
                <Anchor.Link href="#slider-step" title="步长控制" />
                <Anchor.Link href="#slider-marks" title="标记点" />
                <Anchor.Link href="#slider-demo" title="综合示例" />
                <Anchor.Link href="#slider-color" title="颜色定制" />
                <Anchor.Link href="#slider-speed" title="滑动速度" />
                <Anchor.Link href="#slider-gradient" title="渐变颜色" />
                <Anchor.Link href="#slider-custom" title="自定义样式" />
                <Anchor.Link href="#slider-api" title="API 文档" />
                <Anchor.Link href="#slider-install" title="安装使用" />
                <Anchor.Link href="#slider-css" title="CSS 变量" />
                <Anchor.Link href="#slider-tips" title="使用建议" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderExample;

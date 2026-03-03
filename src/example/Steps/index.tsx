import React, { useState, useEffect } from 'react';
import { Steps, Flex, Table, Anchor } from '../../components';
import type { Column } from '../../components/Table';
import type { StepItem, StepStatus } from '../../components/Steps/types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const StepsExample: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // 获取滚动容器
        const container = document.querySelector('.app-content') as HTMLElement;
        setScrollContainer(container);
    }, []);

    // 基础步骤数据
    const basicSteps = [
        { title: '第一步', description: '填写基本信息' },
        { title: '第二步', description: '确认订单信息' },
        { title: '第三步', description: '完成支付' },
        { title: '第四步', description: '等待发货' }
    ];

    // 面板类型步骤数据
    const panelSteps = [
        { title: '第一步', description: '填写基本信息' },
        { title: '第二步', description: '确认订单信息' },
        { title: '第三步', description: '完成支付' },
        { title: '第四步', description: '等待发货' }
    ];

    // 智能内容显示步骤数据
    const smartSteps = [
        { 
            node: (
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}>
                    1
                </div>
            ),
            title: '第一步（node优先）',
            description: 'node存在时显示node内容'
        },
        { 
            title: (
                <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                    第二步（title优先）
                </span>
            ),
            description: 'node不存在时显示title内容'
        },
        { 
            description: (
                <span style={{ color: '#52c41a', fontStyle: 'italic' }}>
                    第三步（description优先）
                </span>
            )
        },
        { 
            // 所有内容都为空，显示默认图标
        }
    ];

    // 带节点的步骤数据
    const nodeSteps = [
        { title: '登录', description: '用户登录系统', node: '🔐' },
        { title: '选择', description: '选择商品或服务', node: '🛒' },
        { title: '支付', description: '完成支付流程', node: '💳' },
        { title: '完成', description: '订单处理完成', node: '✅' }
    ];

    // 自定义节点的步骤数据
    const customNodeSteps = [
        { 
            title: '第一步', 
            description: '填写基本信息', 
            node: (
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}>
                    1
                </div>
            )
        },
        { 
            title: '第二步', 
            description: '确认订单信息', 
            node: (
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}>
                    2
                </div>
            )
        },
        { 
            title: '第三步', 
            description: '完成支付', 
            node: (
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}>
                    3
                </div>
            )
        },
        { 
            title: '第四步', 
            description: '等待发货', 
            node: (
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}>
                    4
                </div>
            )
        }
    ];

    // 错误状态步骤数据
    const errorSteps: StepItem[] = [
        { title: '第一步', description: '填写基本信息' },
        { title: '第二步', description: '确认订单信息', status: 'error' as StepStatus },
        { title: '第三步', description: '完成支付' },
        { title: '第四步', description: '等待发货' }
    ];

    // 自定义连接线步骤数据
    const tailSteps = [
        { 
            title: '第一步', 
            description: '填写基本信息',
            tailColor: '#52c41a',
            tailTitle: '信息填写'
        },
        { 
            title: '第二步', 
            description: '确认订单信息',
            tailColor: '#1890ff',
            tailTitle: '订单确认'
        },
        { 
            title: '第三步', 
            description: '完成支付',
            tailColor: '#faad14',
            tailTitle: '支付处理'
        },
        { 
            title: '第四步', 
            description: '等待发货',
            tailColor: '#722ed1',
            tailTitle: '发货准备'
        }
    ];

    // 虚线连接线步骤数据
    const dashedTailSteps = [
        { 
            title: '第一步', 
            description: '填写基本信息',
            tailColor: '#52c41a',
            tailTitle: '信息填写',
            tailType: 'dashed' as const
        },
        { 
            title: '第二步', 
            description: '确认订单信息',
            tailColor: '#1890ff',
            tailTitle: '订单确认',
            tailType: 'dashed' as const
        },
        { 
            title: '第三步', 
            description: '完成支付',
            tailColor: '#faad14',
            tailTitle: '支付处理',
            tailType: 'solid' as const
        },
        { 
            title: '第四步', 
            description: '等待发货',
            tailColor: '#722ed1',
            tailTitle: '发货准备',
            tailType: 'dashed' as const
        }
    ];

    // 禁用状态步骤数据
    const disabledSteps = [
        { title: '第一步', description: '填写基本信息' },
        { title: '第二步', description: '确认订单信息', disabled: true },
        { title: '第三步', description: '完成支付' },
        { title: '第四步', description: '等待发货' }
    ];

    const basicCode = `import React, { useState } from 'react';
import { Steps } from 'idp-design';

const BasicStepsExample = () => {
    const [current, setCurrent] = useState(0);
    
    const steps = [
        { title: '第一步', description: '填写基本信息' },
        { title: '第二步', description: '确认订单信息' },
        { title: '第三步', description: '完成支付' },
        { title: '第四步', description: '等待发货' }
    ];
    
    return (
        <Steps 
            current={current} 
            items={steps} 
            onChange={setCurrent}
        />
    );
};`;

    const panelCode = `import React, { useState } from 'react';
import { Steps } from 'idp-design';

const PanelStepsExample = () => {
    const [current, setCurrent] = useState(0);
    
    const steps = [
        { title: '第一步', description: '填写基本信息' },
        { title: '第二步', description: '确认订单信息' },
        { title: '第三步', description: '完成支付' },
        { title: '第四步', description: '等待发货' }
    ];
    
    return (
        <Steps 
            current={current} 
            items={steps} 
            onChange={setCurrent}
            type="panel"
        />
    );
};`;

    const smartCode = `import React, { useState } from 'react';
import { Steps } from 'idp-design';

const SmartStepsExample = () => {
    const [current, setCurrent] = useState(0);
    
    const steps = [
        { 
            node: (
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}>
                    1
                </div>
            ),
            title: '第一步（node优先）',
            description: 'node存在时显示node内容'
        },
        { 
            title: (
                <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                    第二步（title优先）
                </span>
            ),
            description: 'node不存在时显示title内容'
        },
        { 
            description: (
                <span style={{ color: '#52c41a', fontStyle: 'italic' }}>
                    第三步（description优先）
                </span>
            )
        },
        { 
            // 所有内容都为空，显示默认图标
        }
    ];
    
    return (
        <Steps 
            current={current} 
            items={steps} 
            onChange={setCurrent}
        />
    );
};`;

    const verticalCode = `import React, { useState } from 'react';
import { Steps } from 'idp-design';

const VerticalStepsExample = () => {
    const [current, setCurrent] = useState(0);
    
    const steps = [
        { title: '第一步', description: '填写基本信息' },
        { title: '第二步', description: '确认订单信息' },
        { title: '第三步', description: '完成支付' },
        { title: '第四步', description: '等待发货' }
    ];
    
    return (
        <Steps 
            current={current} 
            items={steps} 
            direction="vertical"
            onChange={setCurrent}
        />
    );
};`;

    const nodeCode = `import React, { useState } from 'react';
import { Steps } from 'idp-design';

const NodeStepsExample = () => {
    const [current, setCurrent] = useState(0);
    
    const steps = [
        { title: '登录', description: '用户登录系统', node: '🔐' },
        { title: '选择', description: '选择商品或服务', node: '🛒' },
        { title: '支付', description: '完成支付流程', node: '💳' },
        { title: '完成', description: '订单处理完成', node: '✅' }
    ];
    
    return (
        <Steps 
            current={current} 
            items={steps} 
            onChange={setCurrent}
        />
    );
};`;

    const errorCode = `import React, { useState } from 'react';
import { Steps } from 'idp-design';

const ErrorStepsExample = () => {
    const [current, setCurrent] = useState(0);
    
    const steps = [
        { title: '第一步', description: '填写基本信息' },
        { title: '第二步', description: '确认订单信息', status: 'error' },
        { title: '第三步', description: '完成支付' },
        { title: '第四步', description: '等待发货' }
    ];
    
    return (
        <Steps 
            current={current} 
            items={steps} 
            onChange={setCurrent}
        />
    );
};`;

    const tailCode = `import React, { useState } from 'react';
import { Steps } from 'idp-design';

const TailStepsExample = () => {
    const [current, setCurrent] = useState(0);
    
    const steps = [
        { 
            title: '第一步', 
            description: '填写基本信息',
            tailColor: '#52c41a',
            tailTitle: '信息填写'
        },
        { 
            title: '第二步', 
            description: '确认订单信息',
            tailColor: '#1890ff',
            tailTitle: '订单确认'
        },
        { 
            title: '第三步', 
            description: '完成支付',
            tailColor: '#faad14',
            tailTitle: '支付处理'
        },
        { 
            title: '第四步', 
            description: '等待发货',
            tailColor: '#722ed1',
            tailTitle: '发货准备'
        }
    ];
    
    return (
        <Steps 
            current={current} 
            items={steps} 
            onChange={setCurrent}
        />
    );
};`;

    const dashedTailCode = `import React, { useState } from 'react';
import { Steps } from 'idp-design';

const DashedTailStepsExample = () => {
    const [current, setCurrent] = useState(0);
    
    const steps = [
        { 
            title: '第一步', 
            description: '填写基本信息',
            tailColor: '#52c41a',
            tailTitle: '信息填写',
            tailType: 'dashed'
        },
        { 
            title: '第二步', 
            description: '确认订单信息',
            tailColor: '#1890ff',
            tailTitle: '订单确认',
            tailType: 'dashed'
        },
        { 
            title: '第三步', 
            description: '完成支付',
            tailColor: '#faad14',
            tailTitle: '支付处理',
            tailType: 'solid'
        },
        { 
            title: '第四步', 
            description: '等待发货',
            tailColor: '#722ed1',
            tailTitle: '发货准备',
            tailType: 'dashed'
        }
    ];
    
    return (
        <Steps 
            current={current} 
            items={steps} 
            onChange={setCurrent}
        />
    );
};`;

    const customNodeCode = `import React, { useState } from 'react';
import { Steps } from 'idp-design';

const CustomNodeStepsExample = () => {
    const [current, setCurrent] = useState(0);
    
    const steps = [
        { 
            title: '第一步', 
            description: '填写基本信息', 
            node: (
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}>
                    1
                </div>
            )
        },
        { 
            title: '第二步', 
            description: '确认订单信息', 
            node: (
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}>
                    2
                </div>
            )
        }
    ];
    
    return (
        <Steps 
            current={current} 
            items={steps} 
            onChange={setCurrent}
        />
    );
};`;

    // Steps组件API表格数据
    const stepsApiColumns: Column[] = [
        { dataIndex: 'param', title: '参数', width: '120px' },
        { dataIndex: 'description', title: '说明' },
        { dataIndex: 'type', title: '类型' },
        { dataIndex: 'default', title: '默认值', width: '100px' }
    ];

    const stepsApiData = [
        { param: 'current', description: '当前步骤', type: 'number', default: '0' },
        { param: 'status', description: '当前步骤的状态', type: '\'wait\' | \'process\' | \'finish\' | \'error\'', default: '\'process\'' },
        { param: 'direction', description: '步骤条方向', type: '\'horizontal\' | \'vertical\'', default: '\'horizontal\'' },
        { param: 'size', description: '尺寸', type: '\'default\' | \'small\'', default: '\'default\'' },
        { param: 'items', description: '步骤配置项', type: 'StepItem[]', default: '-' },
        { param: 'onChange', description: '步骤变化时的回调函数', type: '(current: number) => void', default: '-' }
    ];

    // StepItem配置表格数据
    const stepItemApiColumns: Column[] = [
        { dataIndex: 'param', title: '参数', width: '120px' },
        { dataIndex: 'description', title: '说明' },
        { dataIndex: 'type', title: '类型' },
        { dataIndex: 'default', title: '默认值', width: '100px' }
    ];

    const stepItemApiData = [
        { param: 'title', description: '标题', type: 'string', default: '-' },
        { param: 'description', description: '描述', type: 'string', default: '-' },
        { param: 'node', description: '节点内容', type: 'React.ReactNode', default: '-' },
        { param: 'status', description: '步骤状态', type: '\'wait\' | \'process\' | \'finish\' | \'error\'', default: '-' },
        { param: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' }
    ];

    return (
        <div className="steps-example" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
                {/* 左侧主内容区 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 className="section-title" id="steps-intro">Steps 步骤条</h2>
                    <p className="section-text">引导用户按照流程完成任务的导航条。</p>
                    
                    <div className="example-section" id="steps-basic">
                        <h3 className="subsection-title">基础用法</h3>
                <p className="section-text">简单的步骤条，支持点击切换步骤。</p>
                <div className="example-demo">
                    <Steps current={current} items={basicSteps} onChange={setCurrent} />
                </div>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                    {basicCode}
                </SyntaxHighlighter>
                    </div>

                    <div className="example-section" id="steps-panel">
                        <h3 className="subsection-title">面板类型</h3>
                <p className="section-text">将步骤条包装在面板容器中，提供更丰富的视觉体验。</p>
                <div className="example-demo">
                    <Steps current={current} items={panelSteps} onChange={setCurrent} type="panel" />
                </div>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                    {panelCode}
                </SyntaxHighlighter>
                    </div>

                    <div className="example-section" id="steps-smart">
                        <h3 className="subsection-title">智能内容显示</h3>
                <p className="section-text">支持优先级显示：node &gt; title &gt; description &gt; 默认图标。</p>
                <div className="example-demo">
                    <Steps current={current} items={smartSteps} onChange={setCurrent} />
                </div>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                    {smartCode}
                </SyntaxHighlighter>
                    </div>

                    <div className="example-section" id="steps-vertical">
                        <h3 className="subsection-title">垂直方向</h3>
                <p className="section-text">垂直方向的步骤条，适合较长的流程。</p>
                <div className="example-demo">
                    <Flex direction="column" gap="large">
                        <Steps current={current} items={basicSteps} direction="vertical" onChange={setCurrent} />
                    </Flex>
                </div>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                    {verticalCode}
                </SyntaxHighlighter>
                    </div>

                    <div className="example-section" id="steps-node">
                        <h3 className="subsection-title">带节点</h3>
                <p className="section-text">每个步骤可以自定义节点内容。</p>
                <div className="example-demo">
                    <Steps current={current} items={nodeSteps} onChange={setCurrent} />
                </div>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                    {nodeCode}
                </SyntaxHighlighter>
                    </div>

                    <div className="example-section" id="steps-custom-node">
                        <h3 className="subsection-title">自定义节点</h3>
                <p className="section-text">完全自定义节点区域，支持复杂的React组件。</p>
                <div className="example-demo">
                    <Steps current={current} items={customNodeSteps} onChange={setCurrent} />
                </div>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                    {customNodeCode}
                </SyntaxHighlighter>
                    </div>

                    <div className="example-section" id="steps-error">
                        <h3 className="subsection-title">错误状态</h3>
                <p className="section-text">标记某个步骤为错误状态。</p>
                <div className="example-demo">
                    <Steps current={1} items={errorSteps} onChange={setCurrent} />
                </div>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                    {errorCode}
                </SyntaxHighlighter>
                    </div>

                    <div className="example-section" id="steps-tail">
                        <h3 className="subsection-title">自定义连接线</h3>
                <p className="section-text">支持自定义连接线颜色和连接线标题。</p>
                <div className="example-demo">
                    <Steps current={current} items={tailSteps} onChange={setCurrent} />
                </div>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                    {tailCode}
                </SyntaxHighlighter>
                    </div>

                    <div className="example-section" id="steps-dashed">
                        <h3 className="subsection-title">虚线连接线</h3>
                <p className="section-text">支持实线和虚线两种连接线类型。</p>
                <div className="example-demo">
                    <Steps current={current} items={dashedTailSteps} onChange={setCurrent} />
                </div>
                <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                    {dashedTailCode}
                </SyntaxHighlighter>
                    </div>

                    <div className="example-section" id="steps-disabled">
                        <h3 className="subsection-title">禁用状态</h3>
                <p className="section-text">禁用某些步骤的点击功能。</p>
                <div className="example-demo">
                    <Steps current={current} items={disabledSteps} onChange={setCurrent} />
                </div>
                    </div>

                    <div className="example-section" id="steps-small">
                        <h3 className="subsection-title">小尺寸</h3>
                <p className="section-text">适用于空间有限的场景。</p>
                <div className="example-demo">
                    <Steps current={current} items={basicSteps} size="small" onChange={setCurrent} />
                </div>
                    </div>

                    <div className="example-section" id="steps-api">
                        <h3 className="subsection-title">API 参考</h3>
                <div className="api-table">
                    <Table 
                        columns={stepsApiColumns} 
                        dataSource={stepsApiData}
                    />
                </div>
                    </div>

                    <div className="example-section" id="steps-item-api">
                        <h3 className="subsection-title">StepItem 配置</h3>
                        <div className="api-table">
                            <Table
                                columns={stepItemApiColumns}
                                dataSource={stepItemApiData}
                            />
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
                                <Anchor.Link href="#steps-intro" title="组件介绍" />
                                <Anchor.Link href="#steps-basic" title="基础用法" />
                                <Anchor.Link href="#steps-panel" title="面板类型" />
                                <Anchor.Link href="#steps-smart" title="智能内容" />
                                <Anchor.Link href="#steps-vertical" title="垂直方向" />
                                <Anchor.Link href="#steps-node" title="带节点" />
                                <Anchor.Link href="#steps-custom-node" title="自定义节点" />
                                <Anchor.Link href="#steps-error" title="错误状态" />
                                <Anchor.Link href="#steps-tail" title="自定义连接线" />
                                <Anchor.Link href="#steps-dashed" title="虚线连接线" />
                                <Anchor.Link href="#steps-disabled" title="禁用状态" />
                                <Anchor.Link href="#steps-small" title="小尺寸" />
                                <Anchor.Link href="#steps-api" title="API 参考" />
                                <Anchor.Link href="#steps-item-api" title="StepItem 配置" />
                            </Anchor>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepsExample;
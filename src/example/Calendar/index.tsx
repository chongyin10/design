import React, { useState, useEffect } from 'react';
import { Flex, Calendar, Tag, Button, Space, Table, Anchor } from '../../components';
import { message } from '../../components/Message';
import type { Column } from '../../components/Table';
import type { CalendarProps, DateInfoData, DateInfoItem } from '../../components/Calendar/types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Calendar 组件示例
 * Calendar Component Examples
 */
const CalendarExample: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [mode, setMode] = useState<'month' | 'year'>('month');
    const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // 获取滚动容器
        const container = document.querySelector('.app-content') as HTMLElement;
        setScrollContainer(container);
    }, []);

    // 辅助函数：获取本地日期键 (YYYY-MM-DD)
    const getLocalDateKey = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 辅助函数：格式化日期显示
    const formatDate = (date: Date): string => {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}月${day}日`;
    };

    // 日期信息编辑功能的状态
    const [dateInfo, setDateInfo] = useState<DateInfoData>(() => {
        // 预置一些示例数据（使用本地日期键）
        const today = new Date();
        const todayKey = getLocalDateKey(today);
        return {
            [todayKey]: [
                { title: '今日会议', content: '上午10点团队周会', color: '#1890ff' },
                { title: '项目截止', content: '提交设计文档', color: '#f5222d' },
            ],
        };
    });

    // 自定义日期单元格渲染 - 显示待办事项
    const dateCellRender = (date: Date) => {
        const day = date.getDate();
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

        // 模拟一些待办事项
        if (day % 7 === 0 && !isWeekend) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Tag size="small" color="blue">会议</Tag>
                </div>
            );
        }
        if (day % 11 === 0 && !isWeekend) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Tag size="small" color="green">发布</Tag>
                    <Tag size="small" color="orange">评审</Tag>
                </div>
            );
        }
        if (day % 13 === 0 && !isWeekend) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Tag size="small" color="red">截止</Tag>
                </div>
            );
        }
        return null;
    };

    // 自定义月份单元格渲染
    const monthCellRender = (date: Date) => {
        const month = date.getMonth();
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        const quarter = Math.floor(month / 3) + 1;

        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{monthNames[month]}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Q{quarter}</div>
            </div>
        );
    };

    // 禁用过去的日期
    const disabledDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    // 处理日期变化
    const handleChange: CalendarProps['onChange'] = (date) => {
        setSelectedDate(date as Date);
        console.log('Selected date:', date);
    };

    // 处理面板变化
    const handlePanelChange: CalendarProps['onPanelChange'] = (date, newMode) => {
        setMode(newMode);
        console.log('Panel changed:', date, newMode);
    };

    // 处理日期信息变更
    const handleDateInfoChange = (date: Date, info: DateInfoItem[]) => {
        const dateKey = getLocalDateKey(date);
        setDateInfo(prev => ({
            ...prev,
            [dateKey]: info,
        }));
        message.success(`已更新 ${date.toLocaleDateString('zh-CN')} 的信息`);
    };

    // 代码示例
    const basicCode = `import React from 'react';
import { Calendar } from 'zjpcy-design';

const BasicCalendar = () => {
    return <Calendar />;
};`;

    const controlledCode = `import React, { useState } from 'react';
import { Calendar, Tag } from 'zjpcy-design';

const ControlledCalendar = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    return (
        <>
            <Tag color="blue">{selectedDate.toLocaleDateString('zh-CN')}</Tag>
            <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
            />
        </>
    );
};`;

    const multipleCode = `import React, { useState } from 'react';
import { Calendar, Tag, Space, Button } from 'zjpcy-design';

const MultipleCalendar = () => {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);

    return (
        <>
            <Space gap={8} wrap="wrap">
                {selectedDates.map((date, index) => (
                    <Tag key={index} color="blue">
                        {date.toLocaleDateString('zh-CN')}
                    </Tag>
                ))}
            </Space>
            <Calendar
                selectionMode="multiple"
                value={selectedDates}
                onChange={setSelectedDates}
            />
        </>
    );
};`;

    const customRenderCode = `import React from 'react';
import { Calendar, Tag } from 'zjpcy-design';

const CustomRenderCalendar = () => {
    const dateCellRender = (date: Date) => {
        const day = date.getDate();
        if (day % 7 === 0) {
            return <Tag size="small" color="blue">会议</Tag>;
        }
        return null;
    };

    const monthCellRender = (date: Date) => {
        const month = date.getMonth();
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
            '七月', '八月', '九月', '十月', '十一月', '十二月'];
        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                    {monthNames[month]}
                </div>
            </div>
        );
    };

    return (
        <Calendar
            dateCellRender={dateCellRender}
            monthCellRender={monthCellRender}
        />
    );
};`;

    const disabledDateCode = `import React from 'react';
import { Calendar } from 'zjpcy-design';

const DisabledDateCalendar = () => {
    const disabledDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    return <Calendar disabledDate={disabledDate} />;
};`;

    const firstDayOfWeekCode = `import React from 'react';
import { Calendar, Flex } from 'zjpcy-design';

const FirstDayCalendar = () => {
    return (
        <Flex gap={24}>
            <div>
                <p>周日开始（默认）</p>
                <Calendar firstDayOfWeek={0} />
            </div>
            <div>
                <p>周一开始</p>
                <Calendar firstDayOfWeek={1} />
            </div>
        </Flex>
    );
};`;

    const hideWeekendCode = `import React from 'react';
import { Calendar } from 'zjpcy-design';

const HideWeekendCalendar = () => {
    return <Calendar showWeekend={false} />;
};`;

    const fullscreenCode = `import React from 'react';
import { Calendar } from 'zjpcy-design';

const FullscreenCalendar = () => {
    return (
        <div style={{ height: 500 }}>
            <Calendar fullscreen />
        </div>
    );
};`;

    const smallCode = `import React from 'react';
import { Calendar } from 'zjpcy-design';

const SmallCalendar = () => {
    return (
        <>
            <Calendar size="small" />
            <Calendar size="small" showLunar />
        </>
    );
};`;

    const layoutCode = `import React from 'react';
import { Calendar } from 'zjpcy-design';

const LayoutCalendar = () => {
    return (
        <>
            <Calendar size="small" showLunar layout="horizontal" />
            <Calendar size="small" showLunar layout="vertical" />
        </>
    );
};`;

    const panelModeCode = `import React, { useState } from 'react';
import { Calendar, Tag, Button } from 'zjpcy-design';

const PanelModeCalendar = () => {
    const [mode, setMode] = useState<'month' | 'year'>('month');

    return (
        <>
            <Tag color="purple">
                {mode === 'month' ? '月份视图' : '年份视图'}
            </Tag>
            <Button onClick={() => setMode(mode === 'month' ? 'year' : 'month')}>
                切换模式
            </Button>
            <Calendar
                mode={mode}
                onPanelChange={(date, newMode) => setMode(newMode)}
            />
        </>
    );
};`;

    const lunarCode = `import React from 'react';
import { Calendar } from 'zjpcy-design';

const LunarCalendar = () => {
    return <Calendar showLunar />;
};`;

    const lunarDetailCode = `import React from 'react';
import { Calendar } from 'zjpcy-design';

const LunarDetailCalendar = () => {
    return (
        <Calendar 
            showLunar 
            enableLunarDetail 
        />
    );
};`;

    const customLunarCode = `import React from 'react';
import { Calendar } from 'zjpcy-design';

const CustomLunarCalendar = () => {
    return (
        <Calendar
            showLunar
            lunarRender={(lunarInfo) => {
                if (lunarInfo.term) return lunarInfo.term;
                if (lunarInfo.dayName === '初一') return lunarInfo.monthName;
                if (lunarInfo.dayName === '十五') return '🌕';
                return lunarInfo.dayName;
            }}
        />
    );
};`;

    const headerRenderCode = `import React from 'react';
import { Calendar } from 'zjpcy-design';

const HeaderRenderCalendar = () => {
    return (
        <Calendar
            headerRender={({ value, onChange }) => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                    color: 'white',
                }}>
                    <button onClick={() => onChange(new Date(value.getFullYear(), value.getMonth() - 1))}>
                        上个月
                    </button>
                    <span>{value.getFullYear()}年 {value.getMonth() + 1}月</span>
                    <button onClick={() => onChange(new Date(value.getFullYear(), value.getMonth() + 1))}>
                        下个月
                    </button>
                </div>
            )}
        />
    );
};`;

    const editableCode = `import React, { useState } from 'react';
import { Calendar } from 'zjpcy-design';

const EditableCalendar = () => {
    const [dateInfo, setDateInfo] = useState({});

    const handleDateInfoChange = (date: Date, info: DateInfoItem[]) => {
        const dateKey = date.toISOString().split('T')[0];
        setDateInfo(prev => ({
            ...prev,
            [dateKey]: info,
        }));
    };

    return (
        <Calendar
            editable
            dateInfo={dateInfo}
            onDateInfoChange={handleDateInfoChange}
        />
    );
};`;

    // API 表格列定义
    const apiColumns: Column[] = [
        { dataIndex: 'param', title: '参数', width: '140px' },
        { dataIndex: 'description', title: '说明' },
        { dataIndex: 'type', title: '类型' },
        { dataIndex: 'default', title: '默认值', width: '120px' }
    ];

    // API 数据
    const apiData = [
        { param: 'selectionMode', description: '选择模式', type: "'single' | 'multiple'", default: "'single'" },
        { param: 'value', description: '当前日期（受控）- 单选 Date，多选 Date[]', type: 'Date | Date[]', default: '-' },
        { param: 'defaultValue', description: '默认日期（非受控）- 单选 Date，多选 Date[]', type: 'Date | Date[]', default: 'new Date()' },
        { param: 'onChange', description: '日期改变时的回调 - 单选返回 Date，多选返回 Date[]', type: '(date: Date | Date[]) => void', default: '-' },
        { param: 'dateCellRender', description: '自定义日期单元格渲染（第二个参数为农历信息，仅在 showLunar 为 true 时提供）', type: '(date: Date, lunarInfo?: LunarInfo) => ReactNode', default: '-' },
        { param: 'monthCellRender', description: '自定义月份单元格渲染', type: '(date: Date) => ReactNode', default: '-' },
        { param: 'disabledDate', description: '不可选择的日期', type: '(date: Date) => boolean', default: '-' },
        { param: 'headerRender', description: '自定义头部渲染', type: 'HeaderRenderProps => ReactNode', default: '-' },
        { param: 'mode', description: '日历模式（受控）', type: "'month' | 'year'", default: "'month'" },
        { param: 'onPanelChange', description: '面板切换回调', type: "(date: Date, mode: 'month' | 'year') => void", default: '-' },
        { param: 'fullscreen', description: '是否全屏显示', type: 'boolean', default: 'true' },
        { param: 'size', description: '日历尺寸', type: "'default' | 'small'", default: "'default'" },
        { param: 'layout', description: '日期单元格布局方式', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
        { param: 'firstDayOfWeek', description: '周起始日，0-6', type: '0 | 1 | 2 | 3 | 4 | 5 | 6', default: '0' },
        { param: 'showWeekend', description: '是否显示周末日期', type: 'boolean', default: 'true' },
        { param: 'editable', description: '是否启用日期信息编辑', type: 'boolean', default: 'false' },
        { param: 'dateInfo', description: '日期信息数据', type: 'Record<string, DateInfoItem[]>', default: '{}' },
        { param: 'onDateInfoChange', description: '日期信息变更回调', type: '(date: Date, info: DateInfoItem[]) => void', default: '-' },
        { param: 'panelFormConfig', description: '编辑面板表单配置', type: 'DatePanelFormConfig', default: '-' },
        { param: 'showLunar', description: '是否显示农历', type: 'boolean', default: 'false' },
        { param: 'lunarRender', description: '自定义农历渲染', type: '(lunarInfo: LunarInfo) => ReactNode', default: '-' },
        { param: 'enableLunarDetail', description: '是否启用双击查看农历详情', type: 'boolean', default: 'false' },
    ];

    return (
        <div className="calendar-example" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
                {/* 左侧主内容区 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 className="section-title" id="calendar-intro">Calendar 日历</h2>
                    <p className="section-text">按照日历形式展示数据的容器，支持丰富的交互和自定义渲染。</p>

                    {/* 基础用法 */}
                    <div className="example-section" id="calendar-basic">
                        <h3 className="subsection-title">基础用法</h3>
                        <p className="section-text">最简单的日历用法，支持月份和年份切换。包含今天高亮、选中状态等视觉效果。</p>
                        <div className="example-demo">
                            <Flex gap={24} align="flex-start" wrap="wrap">
                                <Calendar />
                                <div style={{
                                    padding: 24,
                                    background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
                                    borderRadius: 8,
                                    border: '1px solid #e8e8e8',
                                    maxWidth: 300
                                }}>
                                    <h4 style={{ marginBottom: 12 }}>样式特性</h4>
                                    <ul style={{ margin: 0, paddingLeft: 20, color: 'rgba(0, 0, 0, 0.65)', lineHeight: 1.8 }}>
                                        <li>渐变背景和圆角设计</li>
                                        <li>统一的阴影效果</li>
                                        <li>悬停和选中动画</li>
                                        <li>今天日期特殊标记</li>
                                    </ul>
                                </div>
                            </Flex>
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {basicCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* 受控模式 */}
                    <div className="example-section" id="calendar-controlled">
                        <h3 className="subsection-title">受控模式</h3>
                        <p className="section-text">受控的日历组件，可以通过 value 和 onChange 控制选中日期。</p>
                        <div className="example-demo">
                            <Flex gap={24} align="flex-start" direction="column">
                                <Space gap={12}>
                                    <strong>选中日期：</strong>
                                    <Tag color="blue">{selectedDate.toLocaleDateString('zh-CN')}</Tag>
                                </Space>
                                <Calendar value={selectedDate} onChange={handleChange} />
                            </Flex>
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {controlledCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* 多选模式 */}
                    <div className="example-section" id="calendar-multiple">
                        <h3 className="subsection-title">多选模式</h3>
                        <p className="section-text">通过 selectionMode="multiple" 启用多选模式，可以选择多个日期，适用于日期范围选择、批量标记等场景。</p>
                        <div className="example-demo">
                            <Flex gap={24} align="flex-start" direction="column">
                                <Space gap={12}>
                                    <strong>已选日期：</strong>
                                    {selectedDates.length === 0 ? (
                                        <Tag color="default">未选择</Tag>
                                    ) : (
                                        <Space gap={8} wrap="wrap">
                                            {selectedDates.map((date, index) => (
                                                <Tag key={index} color="blue">{formatDate(date)}</Tag>
                                            ))}
                                        </Space>
                                    )}
                                    {selectedDates.length > 0 && (
                                        <Button size="small" onClick={() => setSelectedDates([])}>清空选择</Button>
                                    )}
                                </Space>
                                <Calendar
                                    selectionMode="multiple"
                                    value={selectedDates}
                                    onChange={(dates) => setSelectedDates(dates as Date[])}
                                />
                            </Flex>
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {multipleCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* 自定义数据展示 */}
                    <div className="example-section" id="calendar-custom-render">
                        <h3 className="subsection-title">自定义数据展示</h3>
                        <p className="section-text">使用 dateCellRender 和 monthCellRender 自定义日历单元格内容，适合用于日程、待办事项等场景。</p>
                        <div className="example-demo">
                            <Flex gap={24} align="flex-start" wrap="wrap">
                                <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
                                <div style={{
                                    padding: 24,
                                    background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)',
                                    borderRadius: 8,
                                    border: '1px solid #91d5ff',
                                    maxWidth: 280
                                }}>
                                    <h4 style={{ marginBottom: 16, color: '#1890ff' }}>日程说明</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <Space gap={8}><Tag size="small" color="blue">会议</Tag><span style={{ fontSize: 13 }}>团队周会</span></Space>
                                        <Space gap={8}><Tag size="small" color="green">发布</Tag><span style={{ fontSize: 13 }}>版本发布</span></Space>
                                        <Space gap={8}><Tag size="small" color="orange">评审</Tag><span style={{ fontSize: 13 }}>代码评审</span></Space>
                                        <Space gap={8}><Tag size="small" color="red">截止</Tag><span style={{ fontSize: 13 }}>截止日期</span></Space>
                                    </div>
                                </div>
                            </Flex>
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {customRenderCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* 禁用日期 */}
                    <div className="example-section" id="calendar-disabled">
                        <h3 className="subsection-title">禁用日期</h3>
                        <p className="section-text">使用 disabledDate 函数来禁用某些日期，例如禁用过去的日期。</p>
                        <div className="example-demo">
                            <Flex gap={24} align="flex-start" wrap="wrap">
                                <Calendar disabledDate={disabledDate} />
                                <div style={{
                                    padding: 24,
                                    background: 'linear-gradient(135deg, #fff2f0 0%, #fff5f5 100%)',
                                    borderRadius: 8,
                                    border: '1px solid #ffccc7',
                                    maxWidth: 280
                                }}>
                                    <h4 style={{ marginBottom: 12, color: '#f5222d' }}>禁用规则</h4>
                                    <p style={{ margin: 0, fontSize: 13, color: 'rgba(0, 0, 0, 0.65)' }}>
                                        已过去的日期将被禁用，用户无法选择。禁用日期会显示为灰色半透明状态。
                                    </p>
                                </div>
                            </Flex>
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {disabledDateCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* 周起始日 */}
                    <div className="example-section" id="calendar-first-day">
                        <h3 className="subsection-title">周起始日</h3>
                        <p className="section-text">通过 firstDayOfWeek 属性设置周起始日，0 为周日，1 为周一。</p>
                        <div className="example-demo">
                            <Flex gap={24} align="flex-start" wrap="wrap">
                                <div>
                                    <p style={{ marginBottom: 12, fontWeight: 500 }}>周日开始（默认）</p>
                                    <Calendar firstDayOfWeek={0} />
                                </div>
                                <div>
                                    <p style={{ marginBottom: 12, fontWeight: 500 }}>周一开始</p>
                                    <Calendar firstDayOfWeek={1} />
                                </div>
                            </Flex>
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {firstDayOfWeekCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* 隐藏周末 */}
                    <div className="example-section" id="calendar-hide-weekend">
                        <h3 className="subsection-title">隐藏周末</h3>
                        <p className="section-text">设置 showWeekend 为 false 可以隐藏周末日期，适合工作日历场景。</p>
                        <div className="example-demo">
                            <Flex gap={24} align="flex-start" wrap="wrap">
                                <Calendar showWeekend={false} />
                                <div style={{
                                    padding: 24,
                                    background: 'linear-gradient(135deg, #f6ffed 0%, #f0fff4 100%)',
                                    borderRadius: 8,
                                    border: '1px solid #b7eb8f',
                                    maxWidth: 280
                                }}>
                                    <h4 style={{ marginBottom: 12, color: '#52c41a' }}>工作日历</h4>
                                    <p style={{ margin: 0, fontSize: 13, color: 'rgba(0, 0, 0, 0.65)' }}>
                                        隐藏周六和周日，仅显示工作日。适用于项目管理、排班系统等场景。
                                    </p>
                                </div>
                            </Flex>
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {hideWeekendCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* 全屏模式 */}
                    <div className="example-section" id="calendar-fullscreen">
                        <h3 className="subsection-title">全屏模式</h3>
                        <p className="section-text">设置 fullscreen 为 true 可以使日历占满整个容器。</p>
                        <div className="example-demo">
                            <div style={{
                                height: 500,
                                border: '1px solid #d9d9d9',
                                borderRadius: 8,
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                            }}>
                                <Calendar fullscreen dateCellRender={dateCellRender} />
                            </div>
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {fullscreenCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* 小型日历 */}
                    <div className="example-section" id="calendar-small">
                        <h3 className="subsection-title">小型日历</h3>
                        <p className="section-text">设置 size 为 'small' 可以展示更紧凑的小型日历，适合空间有限的场景。</p>
                        <div className="example-demo">
                            <Flex gap={24} align="flex-start" wrap="wrap">
                                <Calendar size="small" />
                                <Calendar size="small" showLunar />
                                <div style={{
                                    padding: 24,
                                    background: 'linear-gradient(135deg, #f6ffed 0%, #f0fff4 100%)',
                                    borderRadius: 8,
                                    border: '1px solid #b7eb8f',
                                    maxWidth: 280
                                }}>
                                    <h4 style={{ marginBottom: 12, color: '#52c41a' }}>小型日历特性</h4>
                                    <ul style={{ margin: 0, paddingLeft: 20, color: 'rgba(0, 0, 0, 0.65)', lineHeight: 1.8 }}>
                                        <li>更小的尺寸 (240px)</li>
                                        <li>紧凑的日期单元格</li>
                                        <li>适合侧边栏、下拉面板</li>
                                        <li>支持农历显示</li>
                                    </ul>
                                </div>
                            </Flex>
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {smallCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* 日期单元格布局 */}
                    <div className="example-section" id="calendar-layout">
                        <h3 className="subsection-title">日期单元格布局</h3>
                        <p className="section-text">通过 layout 属性切换日期单元格布局，支持水平（horizontal）和垂直（vertical）两种布局方式。</p>
                        <div className="example-demo">
                            <Flex gap={24} align="flex-start" wrap="wrap">
                                <div>
                                    <p style={{ marginBottom: 12, fontWeight: 500 }}>水平布局（默认）</p>
                                    <Calendar size="small" showLunar />
                                </div>
                                <div>
                                    <p style={{ marginBottom: 12, fontWeight: 500 }}>垂直布局</p>
                                    <Calendar size="small" showLunar layout="vertical" />
                                </div>
                            </Flex>
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {layoutCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* 面板模式切换 */}
                    <div className="example-section" id="calendar-panel-mode">
                        <h3 className="subsection-title">面板模式切换</h3>
                        <p className="section-text">可以通过 mode 和 onPanelChange 控制面板显示模式。</p>
                        <div className="example-demo">
                            <Flex gap={24} align="flex-start" direction="column">
                                <Space gap={12}>
                                    <strong>当前模式：</strong>
                                    <Tag color="purple">{mode === 'month' ? '月份视图' : '年份视图'}</Tag>
                                    <Button size="small" onClick={() => setMode(mode === 'month' ? 'year' : 'month')}>切换模式</Button>
                                </Space>
                                <Calendar mode={mode} onPanelChange={handlePanelChange} />
                            </Flex>
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {panelModeCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* 农历显示 */}
                    <div className="example-section" id="calendar-lunar">
                        <h3 className="subsection-title">农历显示</h3>
                        <p className="section-text">通过 showLunar 属性启用农历显示，支持节气高亮显示。</p>
                        <div className="example-demo">
                            <Flex gap={24} align="flex-start" wrap="wrap">
                                <Calendar showLunar />
                                <div style={{
                                    padding: 24,
                                    background: 'linear-gradient(135deg, #fefbe6 0%, #fffbe6 100%)',
                                    borderRadius: 8,
                                    border: '1px solid #ffe58f',
                                    maxWidth: 280
                                }}>
                                    <h4 style={{ marginBottom: 12, color: '#faad14' }}>农历特性</h4>
                                    <ul style={{ margin: 0, paddingLeft: 20, color: 'rgba(0, 0, 0, 0.65)', lineHeight: 1.8 }}>
                                        <li>自动显示农历日期</li>
                                        <li>节气特殊高亮显示</li>
                                        <li>月初显示月份名称</li>
                                        <li>悬停查看完整信息</li>
                                    </ul>
                                </div>
                            </Flex>
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {lunarCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* 农历详情面板 */}
                    <div className="example-section" id="calendar-lunar-detail">
                        <h3 className="subsection-title">农历详情面板</h3>
                        <p className="section-text">通过 enableLunarDetail 属性启用双击查看农历详情功能，展示八字、黄道日、宜忌等详细信息。</p>
                        <div className="example-demo">
                            <Flex gap={24} align="flex-start" wrap="wrap">
                                <Calendar showLunar enableLunarDetail />
                                <div style={{
                                    padding: 24,
                                    background: 'linear-gradient(135deg, #f0f5ff 0%, #f0f0ff 100%)',
                                    borderRadius: 8,
                                    border: '1px solid #adc6ff',
                                    maxWidth: 280
                                }}>
                                    <h4 style={{ marginBottom: 12, color: '#722ed1' }}>详情面板特性</h4>
                                    <ul style={{ margin: 0, paddingLeft: 20, color: 'rgba(0, 0, 0, 0.65)', lineHeight: 1.8 }}>
                                        <li>双击日期打开详情</li>
                                        <li>展示农历八字信息</li>
                                        <li>黄道吉日/凶日判断</li>
                                        <li>彭祖百忌、宜忌事项</li>
                                        <li>吉神凶煞方位</li>
                                    </ul>
                                </div>
                            </Flex>
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {lunarDetailCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* 自定义农历渲染 */}
                    <div className="example-section" id="calendar-custom-lunar">
                        <h3 className="subsection-title">自定义农历渲染</h3>
                        <p className="section-text">通过 lunarRender 自定义农历显示内容，或使用 dateCellRender 结合农历信息。</p>
                        <div className="example-demo">
                            <Flex gap={24} align="flex-start" wrap="wrap">
                                <Calendar
                                    showLunar
                                    lunarRender={(lunarInfo) => {
                                        if (lunarInfo.term) return lunarInfo.term;
                                        if (lunarInfo.dayName === '初一') return lunarInfo.monthName;
                                        if (lunarInfo.dayName === '十五') return '🌕';
                                        return lunarInfo.dayName;
                                    }}
                                />
                                <div style={{
                                    padding: 24,
                                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
                                    borderRadius: 8,
                                    border: '1px solid #91d5ff',
                                    maxWidth: 280
                                }}>
                                    <h4 style={{ marginBottom: 12, color: '#1890ff' }}>自定义渲染</h4>
                                    <p style={{ margin: 0, fontSize: 13, color: 'rgba(0, 0, 0, 0.65)' }}>
                                        通过 lunarRender 属性可以完全自定义农历显示内容。示例中，十五显示满月图标 🌕，让日历更有趣。
                                    </p>
                                </div>
                            </Flex>
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {customLunarCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* 自定义头部 */}
                    <div className="example-section" id="calendar-header-render">
                        <h3 className="subsection-title">自定义头部</h3>
                        <p className="section-text">使用 headerRender 可以自定义日历头部。</p>
                        <div className="example-demo">
                            <Calendar
                                headerRender={({ value, onChange }) => (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px 20px',
                                        borderBottom: '1px solid #e8e8e8',
                                        background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                                        color: 'white',
                                    }}>
                                        <button
                                            onClick={() => onChange(new Date(value.getFullYear(), value.getMonth() - 1))}
                                            style={{
                                                background: 'rgba(255,255,255,0.2)',
                                                border: '1px solid rgba(255,255,255,0.5)',
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: 4,
                                                cursor: 'pointer',
                                                fontSize: 14,
                                            }}
                                        >
                                            上个月
                                        </button>
                                        <span style={{ fontSize: 18, fontWeight: 600 }}>
                                            {value.getFullYear()}年 {value.getMonth() + 1}月
                                        </span>
                                        <button
                                            onClick={() => onChange(new Date(value.getFullYear(), value.getMonth() + 1))}
                                            style={{
                                                background: 'rgba(255,255,255,0.2)',
                                                border: '1px solid rgba(255,255,255,0.5)',
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: 4,
                                                cursor: 'pointer',
                                                fontSize: 14,
                                            }}
                                        >
                                            下个月
                                        </button>
                                    </div>
                                )}
                            />
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {headerRenderCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* 日期信息编辑功能 */}
                    <div className="example-section" id="calendar-editable">
                        <h3 className="subsection-title">日期信息编辑</h3>
                        <p className="section-text">
                            启用 <code>editable</code> 属性后，点击任意日期即可打开编辑面板，添加、编辑或删除该日期的信息。适合用于日程管理、待办事项等场景。
                        </p>
                        <div className="example-demo">
                            <Flex gap={24} align="flex-start" wrap="wrap">
                                <Calendar
                                    editable
                                    dateInfo={dateInfo}
                                    onDateInfoChange={handleDateInfoChange}
                                />
                                <div style={{
                                    padding: 24,
                                    background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)',
                                    borderRadius: 8,
                                    border: '1px solid #91d5ff',
                                    maxWidth: 320
                                }}>
                                    <h4 style={{ marginBottom: 16, color: '#1890ff' }}>使用说明</h4>
                                    <div style={{ fontSize: 13, color: 'rgba(0, 0, 0, 0.65)', lineHeight: 1.8 }}>
                                        <p style={{ marginBottom: 12 }}>
                                            <strong style={{ color: '#1890ff' }}>操作指南：</strong>
                                        </p>
                                        <ul style={{ margin: 0, paddingLeft: 20, marginBottom: 16 }}>
                                            <li>点击任意日期打开编辑面板</li>
                                            <li>填写标题和内容</li>
                                            <li>选择颜色标记（可选）</li>
                                            <li>点击保存即可添加信息</li>
                                            <li>支持编辑和删除已有信息</li>
                                        </ul>
                                        <p style={{ marginBottom: 8 }}>
                                            <strong style={{ color: '#1890ff' }}>当前已有信息：</strong>
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {Object.entries(dateInfo).slice(0, 3).map(([date, items]) => (
                                                <div key={date} style={{
                                                    padding: 8,
                                                    background: 'white',
                                                    borderRadius: 4,
                                                    border: '1px solid #e8e8e8'
                                                }}>
                                                    <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                                                        {new Date(date).toLocaleDateString('zh-CN')}
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                        {items.map((item, idx) => (
                                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: item.color || '#1890ff' }} />
                                                                <span style={{ fontSize: 12 }}>{item.title}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            {Object.keys(dateInfo).length === 0 && (
                                                <div style={{ color: '#999', fontSize: 12, fontStyle: 'italic' }}>暂无信息，点击日期添加</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Flex>
                        </div>
                        <SyntaxHighlighter language="typescript" style={vscDarkPlus}>
                            {editableCode}
                        </SyntaxHighlighter>
                    </div>

                    {/* API 参考 */}
                    <div className="example-section" id="calendar-api">
                        <h3 className="subsection-title">API 参考</h3>
                        <div className="api-table">
                            <Table columns={apiColumns} dataSource={apiData} />
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
                                <Anchor.Link href="#calendar-intro" title="组件介绍" />
                                <Anchor.Link href="#calendar-basic" title="基础用法" />
                                <Anchor.Link href="#calendar-controlled" title="受控模式" />
                                <Anchor.Link href="#calendar-multiple" title="多选模式" />
                                <Anchor.Link href="#calendar-custom-render" title="自定义渲染" />
                                <Anchor.Link href="#calendar-disabled" title="禁用日期" />
                                <Anchor.Link href="#calendar-first-day" title="周起始日" />
                                <Anchor.Link href="#calendar-hide-weekend" title="隐藏周末" />
                                <Anchor.Link href="#calendar-fullscreen" title="全屏模式" />
                                <Anchor.Link href="#calendar-small" title="小型日历" />
                                <Anchor.Link href="#calendar-layout" title="单元格布局" />
                                <Anchor.Link href="#calendar-panel-mode" title="面板模式" />
                                <Anchor.Link href="#calendar-lunar" title="农历显示" />
                                <Anchor.Link href="#calendar-lunar-detail" title="农历详情" />
                                <Anchor.Link href="#calendar-custom-lunar" title="自定义农历" />
                                <Anchor.Link href="#calendar-header-render" title="自定义头部" />
                                <Anchor.Link href="#calendar-editable" title="日期编辑" />
                                <Anchor.Link href="#calendar-api" title="API 参考" />
                            </Anchor>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarExample;

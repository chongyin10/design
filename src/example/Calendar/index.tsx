import React, { useState } from 'react';
import { Flex, Calendar, Tag, Button, Space } from '../../components';
import { message } from '../../components/Message';
import type { CalendarProps, DateInfoData, DateInfoItem } from '../../components/Calendar/types';

/**
 * Calendar 组件示例
 * Calendar Component Examples
 */
const CalendarExample: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [mode, setMode] = useState<'month' | 'year'>('month');

    // 辅助函数：获取本地日期键 (YYYY-MM-DD)
    const getLocalDateKey = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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
        setSelectedDate(date);
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

    return (
        <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
            <h1 style={{ marginBottom: 8 }}>Calendar 日历</h1>
            <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 32 }}>按照日历形式展示数据的容器，支持丰富的交互和自定义渲染。</p>

            {/* 基础用法 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>基础用法</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>最简单的日历用法，支持月份和年份切换。包含今天高亮、选中状态等视觉效果。</p>
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
            </section>

            {/* 受控模式 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>受控模式</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>受控的日历组件，可以通过 value 和 onChange 控制选中日期。</p>
                <Flex gap={24} align="flex-start" direction="column">
                    <Space gap={12} style={{ marginBottom: 8 }}>
                        <strong>选中日期：</strong>
                        <Tag color="blue">{selectedDate.toLocaleDateString('zh-CN')}</Tag>
                    </Space>
                    <Calendar
                        value={selectedDate}
                        onChange={handleChange}
                    />
                </Flex>
            </section>

            {/* 自定义数据展示 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>自定义数据展示</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>使用 dateCellRender 和 monthCellRender 自定义日历单元格内容，适合用于日程、待办事项等场景。</p>
                <Flex gap={24} align="flex-start" wrap="wrap">
                    <Calendar
                        dateCellRender={dateCellRender}
                        monthCellRender={monthCellRender}
                    />
                    <div style={{
                        padding: 24,
                        background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)',
                        borderRadius: 8,
                        border: '1px solid #91d5ff',
                        maxWidth: 280
                    }}>
                        <h4 style={{ marginBottom: 16, color: '#1890ff' }}>日程说明</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <Space gap={8}>
                                <Tag size="small" color="blue">会议</Tag>
                                <span style={{ fontSize: 13, color: 'rgba(0, 0, 0, 0.65)' }}>团队周会</span>
                            </Space>
                            <Space gap={8}>
                                <Tag size="small" color="green">发布</Tag>
                                <span style={{ fontSize: 13, color: 'rgba(0, 0, 0, 0.65)' }}>版本发布</span>
                            </Space>
                            <Space gap={8}>
                                <Tag size="small" color="orange">评审</Tag>
                                <span style={{ fontSize: 13, color: 'rgba(0, 0, 0, 0.65)' }}>代码评审</span>
                            </Space>
                            <Space gap={8}>
                                <Tag size="small" color="red">截止</Tag>
                                <span style={{ fontSize: 13, color: 'rgba(0, 0, 0, 0.65)' }}>截止日期</span>
                            </Space>
                        </div>
                    </div>
                </Flex>
            </section>

            {/* 禁用日期 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>禁用日期</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>使用 disabledDate 函数来禁用某些日期，例如禁用过去的日期。</p>
                <Flex gap={24} align="flex-start" wrap="wrap">
                    <Calendar
                        disabledDate={disabledDate}
                    />
                    <div style={{
                        padding: 24,
                        background: 'linear-gradient(135deg, #fff2f0 0%, #fff5f5 100%)',
                        borderRadius: 8,
                        border: '1px solid #ffccc7',
                        maxWidth: 280
                    }}>
                        <h4 style={{ marginBottom: 12, color: '#f5222d' }}>禁用规则</h4>
                        <p style={{ margin: 0, fontSize: 13, color: 'rgba(0, 0, 0, 0.65)', lineHeight: 1.6 }}>
                            已过去的日期将被禁用，用户无法选择。禁用日期会显示为灰色半透明状态。
                        </p>
                    </div>
                </Flex>
            </section>

            {/* 周起始日 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>周起始日</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>通过 firstDayOfWeek 属性设置周起始日，0 为周日，1 为周一。</p>
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
            </section>

            {/* 隐藏周末 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>隐藏周末</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>设置 showWeekend 为 false 可以隐藏周末日期，适合工作日历场景。</p>
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
                        <p style={{ margin: 0, fontSize: 13, color: 'rgba(0, 0, 0, 0.65)', lineHeight: 1.6 }}>
                            隐藏周六和周日，仅显示工作日。适用于项目管理、排班系统等场景。
                        </p>
                    </div>
                </Flex>
            </section>

            {/* 全屏模式 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>全屏模式</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>设置 fullscreen 为 true 可以使日历占满整个容器。</p>
                <div style={{
                    height: 500,
                    border: '1px solid #d9d9d9',
                    borderRadius: 8,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}>
                    <Calendar
                        fullscreen
                        dateCellRender={dateCellRender}
                    />
                </div>
            </section>

            {/* 小型日历 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>小型日历</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>设置 size 为 'small' 可以展示更紧凑的小型日历，适合空间有限的场景。</p>
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
            </section>

            {/* 布局切换 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>日期单元格布局</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>通过 layout 属性切换日期单元格布局，支持水平（horizontal）和垂直（vertical）两种布局方式。</p>
                <Flex gap={24} align="flex-start" wrap="wrap">
                    <div>
                        <p style={{ marginBottom: 12, fontWeight: 500 }}>水平布局（默认）</p>
                        <Calendar size="small" showLunar />
                    </div>
                    <div>
                        <p style={{ marginBottom: 12, fontWeight: 500 }}>垂直布局</p>
                        <Calendar size="small" showLunar layout="vertical" />
                    </div>
                    <div style={{
                        padding: 24,
                        background: 'linear-gradient(135deg, #fff2e8 0%, #fff7e6 100%)',
                        borderRadius: 8,
                        border: '1px solid #ffbb96',
                        maxWidth: 280
                    }}>
                        <h4 style={{ marginBottom: 12, color: '#fa541c' }}>布局说明</h4>
                        <ul style={{ margin: 0, paddingLeft: 20, color: 'rgba(0, 0, 0, 0.65)', lineHeight: 1.8 }}>
                            <li>horizontal: 日期和农历水平排列</li>
                            <li>vertical: 日期和农历垂直居中排列</li>
                            <li>适合小型日历的紧凑显示</li>
                        </ul>
                    </div>
                </Flex>
            </section>

            {/* 面板模式切换 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>面板模式切换</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>可以通过 mode 和 onPanelChange 控制面板显示模式。</p>
                <Flex gap={24} align="flex-start" direction="column">
                    <Space gap={12} style={{ marginBottom: 8 }}>
                        <strong>当前模式：</strong>
                        <Tag color="purple">{mode === 'month' ? '月份视图' : '年份视图'}</Tag>
                        <Button
                            size="small"
                            onClick={() => setMode(mode === 'month' ? 'year' : 'month')}
                        >
                            切换模式
                        </Button>
                    </Space>
                    <Calendar
                        mode={mode}
                        onPanelChange={handlePanelChange}
                    />
                </Flex>
            </section>

            {/* 农历显示 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>农历显示</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>通过 showLunar 属性启用农历显示，支持节气高亮显示。</p>
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
            </section>

            {/* 农历详情面板 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>农历详情面板</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>通过 enableLunarDetail 属性启用双击查看农历详情功能，展示八字、黄道日、宜忌等详细信息。</p>
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
            </section>

            {/* 自定义农历渲染 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>自定义农历渲染</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>通过 lunarRender 自定义农历显示内容，或使用 dateCellRender 结合农历信息。</p>
                <Flex gap={24} align="flex-start" wrap="wrap">
                    <Calendar
                        showLunar
                        lunarRender={(lunarInfo) => {
                            // 节气或特殊节日优先显示
                            if (lunarInfo.term) return lunarInfo.term;
                            // 初一显示月份
                            if (lunarInfo.dayName === '初一') return lunarInfo.monthName;
                            // 十五显示月亮图标
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
                        <p style={{ margin: 0, fontSize: 13, color: 'rgba(0, 0, 0, 0.65)', lineHeight: 1.6 }}>
                            通过 lunarRender 属性可以完全自定义农历显示内容。示例中，十五显示满月图标 🌕，让日历更有趣。
                        </p>
                    </div>
                </Flex>
            </section>

            {/* 自定义头部 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>自定义头部</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>使用 headerRender 可以自定义日历头部。</p>
                <Flex gap={24} align="flex-start">
                    <Calendar
                        headerRender={({ value, onChange }) => (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px 20px',
                                    borderBottom: '1px solid #e8e8e8',
                                    background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                                    color: 'white',
                                }}
                            >
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
                </Flex>
            </section>

            {/* 日期信息编辑功能 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>日期信息编辑</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>
                    启用 <code>editable</code> 属性后，点击任意日期即可打开编辑面板，添加、编辑或删除该日期的信息。适合用于日程管理、待办事项等场景。
                </p>
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
                                                <div key={idx} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 6
                                                }}>
                                                    <span style={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: '50%',
                                                        backgroundColor: item.color || '#1890ff'
                                                    }} />
                                                    <span style={{ fontSize: 12 }}>{item.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {Object.keys(dateInfo).length === 0 && (
                                    <div style={{ color: '#999', fontSize: 12, fontStyle: 'italic' }}>
                                        暂无信息，点击日期添加
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Flex>
            </section>

            {/* 多种样式对比 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>现代化设计展示</h2>
                <p style={{ color: 'rgba(0, 0, 0, 0.65)', marginBottom: 24 }}>展示了日历组件的现代化设计特性。</p>
                <Flex gap={24} align="flex-start" wrap="wrap">
                    <div>
                        <p style={{ marginBottom: 12, fontWeight: 500 }}>默认样式</p>
                        <Calendar />
                    </div>
                    <div>
                        <p style={{ marginBottom: 12, fontWeight: 500 }}>选中状态</p>
                        <Calendar value={new Date()} />
                    </div>
                    <div>
                        <p style={{ marginBottom: 12, fontWeight: 500 }}>年份视图</p>
                        <Calendar mode="year" />
                    </div>
                </Flex>
            </section>

            {/* API 文档 */}
            <section style={{ marginBottom: 48 }}>
                <h2 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e8e8e8' }}>API</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead>
                            <tr style={{ background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)' }}>
                                <th style={{ padding: 12, textAlign: 'left', border: '1px solid #e8e8e8', fontWeight: 600 }}>参数</th>
                                <th style={{ padding: 12, textAlign: 'left', border: '1px solid #e8e8e8', fontWeight: 600 }}>说明</th>
                                <th style={{ padding: 12, textAlign: 'left', border: '1px solid #e8e8e8', fontWeight: 600 }}>类型</th>
                                <th style={{ padding: 12, textAlign: 'left', border: '1px solid #e8e8e8', fontWeight: 600 }}>默认值</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>value</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>当前日期（受控）</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>Date</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>-</td>
                            </tr>
                            <tr style={{ background: '#fafafa' }}>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>defaultValue</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>默认日期（非受控）</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>Date</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>new Date()</td>
                            </tr>
                            <tr>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>onChange</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>日期改变时的回调</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>(date: Date) ={'>'} void</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>-</td>
                            </tr>
                            <tr style={{ background: '#fafafa' }}>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>dateCellRender</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>自定义日期单元格渲染</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>(date: Date) ={'>'} ReactNode</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>-</td>
                            </tr>
                            <tr>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>monthCellRender</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>自定义月份单元格渲染</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>(date: Date) ={'>'} ReactNode</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>-</td>
                            </tr>
                            <tr style={{ background: '#fafafa' }}>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>disabledDate</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>不可选择的日期</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>(date: Date) ={'>'} boolean</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>-</td>
                            </tr>
                            <tr>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>headerRender</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>自定义头部渲染</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>函数</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>-</td>
                            </tr>
                            <tr style={{ background: '#fafafa' }}>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>mode</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>日历模式（受控）</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>'month' | 'year'</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>'month'</td>
                            </tr>
                            <tr>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>onPanelChange</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>面板切换回调</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>(date: Date, mode: 'month' | 'year') ={'>'} void</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>-</td>
                            </tr>
                            <tr style={{ background: '#fafafa' }}>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>fullscreen</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>是否全屏显示</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>boolean</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>true</td>
                            </tr>
                            <tr>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>size</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>日历尺寸</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>'default' | 'small'</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>'default'</td>
                            </tr>
                            <tr style={{ background: '#fafafa' }}>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>layout</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>日期单元格布局</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>'horizontal' | 'vertical'</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>'horizontal'</td>
                            </tr>
                            <tr>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>firstDayOfWeek</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>周起始日，0-6</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>0 | 1 | 2 | 3 | 4 | 5 | 6</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>0</td>
                            </tr>
                            <tr style={{ background: '#fafafa' }}>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>showWeekend</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>是否显示周末</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>boolean</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>true</td>
                            </tr>
                            <tr>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>editable</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>是否启用日期信息编辑</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>boolean</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>false</td>
                            </tr>
                            <tr style={{ background: '#fafafa' }}>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>dateInfo</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>日期信息数据</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>{'Record<string, DateInfoItem[]>'}</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>{ }</td>
                            </tr>
                            <tr>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>onDateInfoChange</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>日期信息变更回调</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>{'(date: Date, info: DateInfoItem[]) => void'}</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>-</td>
                            </tr>
                            <tr style={{ background: '#fafafa' }}>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>panelFormConfig</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>编辑面板表单配置</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>DatePanelFormConfig</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>-</td>
                            </tr>
                            <tr>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>showLunar</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>是否显示农历</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>boolean</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>false</td>
                            </tr>
                            <tr style={{ background: '#fafafa' }}>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>lunarRender</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>自定义农历渲染</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>{'(lunarInfo: LunarInfo) => ReactNode'}</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>-</td>
                            </tr>
                            <tr>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace', color: '#1890ff' }}>enableLunarDetail</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.65)' }}>是否启用双击查看农历详情</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', fontFamily: 'monospace' }}>boolean</td>
                                <td style={{ padding: 12, border: '1px solid #e8e8e8', color: 'rgba(0, 0, 0, 0.45)' }}>false</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default CalendarExample;

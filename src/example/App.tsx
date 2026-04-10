import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Icon, Menu, Input, Carousel } from '../components';
import ButtonExample from './Button';
import CheckboxExample from './Checkbox';
import MarqueeExample from './Marquee';
import TableExample from './Table';
import TopExample from './Top';
import TooltipExample from './Tooltip';
import IconExample from './Icon';
import DividerExample from './Divider';
import InputExample from './Input';
import NotificationExample from './Notification/index';
import ModalExample from './Modal';
import ColorPickerExample from './ColorPicker';
import CopyToClipboardExample from './CopyToClipboard';
import MessageExample from './Message';
import FlexExample from './Flex';
import VariablesExample from './Variables';
import RadioExample from './Radio';
import SelectExample from './Select';
import EmptyExample from './Empty';
import TypographyExample from './Typography';
import I18nExample from './I18n';
import MasonryExample from './Masonry';
import SpaceExample from './Space';
import AnchorExample from './Anchor';
import BreadcrumbExample from './Breadcrumb';
import DropdownExample from './Dropdown';
import MenuExample from './Menu';
import PaginationExample from './Pagination';
import StepsExample from './Steps';
import SwitchExample from './Switch';
import CarouselExample from './Carousel';
import TagExample from './Tag';
import GridExample from './Grid';
import TabsExample from './Tabs';
import CascaderExample from './Cascader';
import RateExample from './Rate';
import SliderExample from './Slider';
import TransferExample from './Transfer';
import LabelExample from './Label';
import TreeSelectExample from './TreeSelect';
import FormExample from './Form';
import DrawerExample from './Drawer';
import TextareaExample from './Input/Textarea';
import PopconfirmExample from './Popconfirm';
import ProgressExample from './Progress';
import TimePickerExample from './TimePicker';
import DatePickerExample from './DatePicker';
import TreeExample from './Tree';
import UploadExample from './Upload';
import SplitterExample from './Splitter';
import SpinExample from './Spin';
import CalendarExample from './Calendar';
import CardExample from './Card';
import { MessageProvider } from '../components/Message';
import '../components/variables.css';
import './App.css';
import LayoutExample from './Layout';

const { Header, Sider, Content } = Layout;

// 组件分类配置
const componentCategories: { key: string; label: string; icon?: string; components: string[] }[] = [
    {
        key: 'general',
        label: '通用',
        components: ['button', 'icon', 'typography']
    },
    {
        key: 'layout1',
        label: '布局',
        components: ['flex', 'grid', 'space', 'divider', 'layout', 'masonry', 'splitter']
    },
    {
        key: 'navigation',
        label: '导航',
        components: ['anchor', 'breadcrumb', 'dropdown', 'menu', 'pagination', 'steps', 'tabs', 'top']
    },
    {
        key: 'data-entry',
        label: '数据录入',
        components: ['cascader', 'checkbox', 'datepicker', 'form', 'input', 'radio', 'select', 'slider', 'switch', 'textarea', 'timepicker', 'transfer', 'treeselect', 'upload', 'rate', 'colorpicker']
    },
    {
        key: 'data-display',
        label: '数据展示',
        components: ['calendar', 'card', 'carousel', 'empty', 'label', 'table', 'tag', 'tree', 'tooltip']
    },
    {
        key: 'feedback',
        label: '反馈',
        components: ['drawer', 'message', 'modal', 'notification', 'popconfirm', 'progress', 'spin']
    },
    {
        key: 'other',
        label: '其他',
        components: ['copytoclipboard', 'i18n', 'marquee', 'variables']
    }
];

// 组件元数据
const componentMeta: Record<string, { name: string; description: string }> = {
    intro: { name: '简介', description: 'ZjpCy Design 组件库介绍' },
    install: { name: '安装', description: '安装指南' },
    calendar: { name: 'Calendar', description: '日历' },
    anchor: { name: 'Anchor', description: '锚点' },
    breadcrumb: { name: 'Breadcrumb', description: '层级结构' },
    button: { name: 'Button', description: '按钮' },
    checkbox: { name: 'Checkbox', description: '多选框' },
    card: { name: 'Card', description: '卡片' },
    carousel: { name: 'Carousel', description: '走马灯' },
    cascader: { name: 'Cascader', description: '级联选择器' },
    datepicker: { name: 'DatePicker', description: '日期选择器' },
    colorpicker: { name: 'ColorPicker', description: '颜色选择器' },
    copytoclipboard: { name: 'CopyToClipboard', description: '剪贴板' },
    divider: { name: 'Divider', description: '分割线' },
    drawer: { name: 'Drawer', description: '抽屉式浮层' },
    dropdown: { name: 'Dropdown', description: '下拉菜单' },
    empty: { name: 'Empty', description: '空状态' },
    flex: { name: 'Flex', description: 'Flex 布局' },
    form: { name: 'Form', description: '表单组件' },
    grid: { name: 'Grid', description: '24栅格系统' },
    icon: { name: 'Icon', description: '图标' },
    i18n: { name: 'I18n', description: '国际化' },
    input: { name: 'Input', description: '输入框' },
    label: { name: 'Label', description: '标签' },
    layout: { name: 'Layout', description: '页面布局' },
    marquee: { name: 'Marquee', description: '跑马灯' },
    masonry: { name: 'Masonry', description: '瀑布流布局' },
    menu: { name: 'Menu', description: '导航菜单' },
    message: { name: 'Message', description: '全局提示' },
    modal: { name: 'Modal', description: '模态对话框' },
    notification: { name: 'Notification', description: '通知提示框' },
    pagination: { name: 'Pagination', description: '分页器' },
    popconfirm: { name: 'Popconfirm', description: '气泡确认框' },
    progress: { name: 'Progress', description: '进度条' },
    radio: { name: 'Radio', description: '单选框' },
    rate: { name: 'Rate', description: '评分' },
    select: { name: 'Select', description: '选择器' },
    slider: { name: 'Slider', description: '滑动输入条' },
    spin: { name: 'Spin', description: '加载中' },
    splitter: { name: 'Splitter', description: '切分面板' },
    space: { name: 'Space', description: '间距' },
    steps: { name: 'Steps', description: '步骤条' },
    switch: { name: 'Switch', description: '开关' },
    table: { name: 'Table', description: '表格' },
    tag: { name: 'Tag', description: '标签' },
    tabs: { name: 'Tabs', description: '标签页' },
    textarea: { name: 'Textarea', description: '多行文本输入' },
    timepicker: { name: 'TimePicker', description: '时间选择器' },
    top: { name: 'Top', description: '返回顶部' },
    tooltip: { name: 'Tooltip', description: '提示' },
    transfer: { name: 'Transfer', description: '穿梭框' },
    tree: { name: 'Tree', description: '树形控件' },
    treeselect: { name: 'TreeSelect', description: '树型选择器' },
    typography: { name: 'Typography', description: '排版' },
    upload: { name: 'Upload', description: '文件上传' },
    variables: { name: 'Variables', description: '主题变量配置' },
};

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<string>('button');
    const [searchValue, setSearchValue] = useState<string>('');
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

    // 构建菜单项
    const menuItems = useMemo(() => {
        const items: { key: string; label: string; icon?: React.ReactNode; children?: { key: string; label: string }[] }[] = [
            { key: 'intro', label: '简介' },
            { key: 'install', label: '安装' },
        ];

        componentCategories.forEach(category => {
            const children = category.components
                .filter(key => componentMeta[key])
                .map(key => ({
                    key,
                    label: componentMeta[key].name,
                    description: componentMeta[key].description,
                }));

            if (children.length > 0) {
                items.push({
                    key: category.key,
                    label: category.label,
                    icon: category.icon ? <Icon type={category.icon as any} /> : undefined,
                    children
                });
            }
        });

        return items;
    }, []);

    // 从URL获取初始选中项
    const getInitialComponentId = useCallback(() => {
        const hash = window.location.hash;
        if (hash.startsWith('#/')) {
            const id = hash.slice(2);
            return componentMeta[id] ? id : 'button';
        }
        return 'button';
    }, []);

    // 监听URL变化
    useEffect(() => {
        const initialId = getInitialComponentId();
        setSelectedComponent(initialId);

        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#/')) {
                const id = hash.slice(2);
                if (componentMeta[id]) {
                    setSelectedComponent(id);
                }
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [getInitialComponentId]);

    // 处理菜单点击
    const handleMenuClick = useCallback((key: string) => {
        setSelectedComponent(key);
        window.location.hash = `#/${key}`;
        setMobileMenuVisible(false);
    }, []);

    // 处理搜索
    const handleSearch = useCallback(() => {
        if (!searchValue.trim()) return;

        const searchTerm = searchValue.toLowerCase().trim();
        const matchedKey = Object.keys(componentMeta).find(key => {
            const meta = componentMeta[key];
            return key.toLowerCase().includes(searchTerm) ||
                meta.name.toLowerCase().includes(searchTerm) ||
                meta.description.toLowerCase().includes(searchTerm);
        });

        if (matchedKey) {
            handleMenuClick(matchedKey);
            setSearchValue('');
        }
    }, [searchValue, handleMenuClick]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    // 渲染内容组件
    const renderContent = useCallback(() => {
        const components: Record<string, React.ReactNode> = {
            intro: <IntroContent />,
            install: <InstallContent />,
            calendar: <CalendarExample />,
            button: <ButtonExample />,
            card: <CardExample />,
            flex: <FlexExample />,
            grid: <GridExample />,
            marquee: <MarqueeExample />,
            table: <TableExample />,
            top: <TopExample />,
            icon: <IconExample />,
            divider: <DividerExample />,
            drawer: <DrawerExample />,
            input: <InputExample />,
            i18n: <I18nExample />,
            radio: <RadioExample />,
            select: <SelectExample />,
            slider: <SliderExample />,
            modal: <ModalExample />,
            notification: <NotificationExample />,
            colorpicker: <ColorPickerExample />,
            copytoclipboard: <CopyToClipboardExample />,
            message: <MessageExample />,
            empty: <EmptyExample />,
            typography: <TypographyExample />,
            variables: <VariablesExample />,
            masonry: <MasonryExample />,
            space: <SpaceExample />,
            anchor: <AnchorExample />,
            breadcrumb: <BreadcrumbExample />,
            checkbox: <CheckboxExample />,
            carousel: <CarouselExample />,
            cascader: <CascaderExample />,
            dropdown: <DropdownExample />,
            menu: <MenuExample />,
            pagination: <PaginationExample />,
            steps: <StepsExample />,
            switch: <SwitchExample />,
            tag: <TagExample />,
            tabs: <TabsExample />,
            popconfirm: <PopconfirmExample />,
            progress: <ProgressExample />,
            tooltip: <TooltipExample />,
            rate: <RateExample />,
            transfer: <TransferExample />,
            label: <LabelExample />,
            treeselect: <TreeSelectExample />,
            form: <FormExample />,
            layout: <LayoutExample />,
            textarea: <TextareaExample />,
            timepicker: <TimePickerExample />,
            datepicker: <DatePickerExample />,
            tree: <TreeExample />,
            upload: <UploadExample />,
            spin: <SpinExample />,
            splitter: <SplitterExample />,
        };

        return components[selectedComponent] || <ButtonExample />;
    }, [selectedComponent]);

    const selectedMeta = componentMeta[selectedComponent];

    // 查找当前选中项所属的父菜单
    const findParentKey = useCallback((key: string): string => {
        for (const category of componentCategories) {
            if (category.components.includes(key)) {
                return category.key;
            }
        }
        return key === 'intro' || key === 'install' ? key : '';
    }, []);

    const openKeys = useMemo(() => {
        const parentKey = findParentKey(selectedComponent);
        return parentKey ? [parentKey] : [];
    }, [selectedComponent, findParentKey]);

    return (
        <MessageProvider>
            <Layout className="app-layout">
                {/* 移动端遮罩 */}
                {mobileMenuVisible && (
                    <div
                        className="mobile-menu-mask"
                        onClick={() => setMobileMenuVisible(false)}
                    />
                )}

                <Header className="app-header">
                    <div className="header-left">
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
                        >
                            <Icon type={mobileMenuVisible ? 'close' : 'menu'} />
                        </button>
                        <div className="logo">
                            <Icon type="app" className="logo-icon" />
                            <span className="logo-text">ZjpCy Design</span>
                        </div>
                    </div>
                    <div className="header-right">
                        <Input.Search
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="搜索组件..."
                            className="header-search"
                            onSearch={handleSearch}
                        />
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="header-link"
                        >
                            <Icon type="github" />
                        </a>
                    </div>
                </Header>

                <Layout className="app-main">
                    <Sider
                        className={`app-sider ${mobileMenuVisible ? 'mobile-visible' : ''}`}
                        collapsible
                        collapsed={collapsed}
                        onCollapse={setCollapsed}
                        triggerPlacement="bottom"
                        width={256}
                    >
                        <Menu
                            items={menuItems}
                            selectedKey={selectedComponent}
                            defaultOpenKeys={openKeys}
                            onChange={(item) => handleMenuClick(item.key)}
                            mode="vertical-flat"
                            collapsed={collapsed}
                            className="app-menu"
                        />
                    </Sider>

                    <Content className="app-content">
                        <div className="content-container">
                            <div className="content-header">
                                <h1 className="content-title">{selectedMeta?.name}</h1>
                                <p className="content-desc">{selectedMeta?.description}</p>
                            </div>
                            <div className="content-body">
                                {renderContent()}
                            </div>
                            <footer className="content-footer">
                                <a target='_blank' href='https://beian.miit.gov.cn'>京ICP备2026009285号</a>
                            </footer>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </MessageProvider>
    );
};

// 简介内容组件
const IntroContent: React.FC = () => {
    const carouselItems = [
        {
            key: '1',
            image: '',
            title: '📦 开箱即用',
            description: '50+ 高质量 React 组件，经过严格测试，无需额外配置即可使用',
            render: () => (
                <div className="carousel-slide slide-ready">
                    <div className="slide-icon">📦</div>
                    <h3>开箱即用</h3>
                    <p>50+ 高质量 React 组件，经过严格测试<br/>无需额外配置即可使用</p>
                </div>
            )
        },
        {
            key: '2',
            image: '',
            title: '🎨 主题定制',
            description: '支持 CSS 变量和 StyledProvider 多种定制方式',
            render: () => (
                <div className="carousel-slide slide-theme">
                    <div className="slide-icon">🎨</div>
                    <h3>主题定制</h3>
                    <p>支持 CSS 变量和 StyledProvider<br/>轻松打造符合品牌的设计系统</p>
                </div>
            )
        },
        {
            key: '3',
            image: '',
            title: '⚡ 性能优秀',
            description: '虚拟滚动、懒加载等技术，确保流畅体验',
            render: () => (
                <div className="carousel-slide slide-perf">
                    <div className="slide-icon">⚡</div>
                    <h3>性能优秀</h3>
                    <p>采用虚拟滚动、懒加载等技术<br/>确保流畅的用户体验</p>
                </div>
            )
        },
        {
            key: '4',
            image: '',
            title: '🌍 国际化支持',
            description: '支持 4 种语言：简体中文、英文、日文、韩文',
            render: () => (
                <div className="carousel-slide slide-i18n">
                    <div className="slide-icon">🌍</div>
                    <h3>国际化支持</h3>
                    <p>内置 4 种语言包<br/>轻松应对全球化需求</p>
                </div>
            )
        }
    ];

    return (
        <div className="intro-content">
            {/* Hero Section with Gradient Background */}
            <div className="intro-hero">
                <div className="hero-bg-pattern" />
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-text">React UI Library</span>
                    </div>
                    <h1>ZjpCy Design</h1>
                    <p className="intro-subtitle">一套基于 React 的企业级 UI 设计语言和组件库</p>
                    <p className="intro-desc">
                        提供 50+ 高质量 React 组件，覆盖六大类别，
                        帮助开发者快速构建现代化的 Web 应用界面
                    </p>
                    <div className="intro-actions">
                        <a href="#/install" className="intro-btn intro-btn-primary">
                            <span>🚀</span> 开始使用
                        </a>
                        <a
                            href="https://www.npmjs.com/package/@zjpcy/simple-design"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="intro-btn"
                        >
                            <span>📦</span> NPM
                        </a>
                    </div>
                    <div className="intro-stats">
                        <div className="stat-item">
                            <div className="stat-icon">🧩</div>
                            <div className="stat-info">
                                <span className="stat-number">50+</span>
                                <span className="stat-label">组件</span>
                            </div>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <div className="stat-icon">📁</div>
                            <div className="stat-info">
                                <span className="stat-number">6</span>
                                <span className="stat-label">分类</span>
                            </div>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <div className="stat-icon">🌐</div>
                            <div className="stat-info">
                                <span className="stat-number">4</span>
                                <span className="stat-label">语言</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Carousel */}
            <div className="intro-section">
                <h2 className="section-title">
                    <span className="title-icon">✨</span>
                    核心特性
                </h2>
                <div className="carousel-wrapper">
                    <Carousel
                        items={carouselItems}
                        autoplay={true}
                        interval={4000}
                        effect="slide"
                        showIndicators={true}
                        indicatorPosition="bottom"
                        showArrows={true}
                        style={{ height: 280, borderRadius: 16 }}
                    />
                </div>
            </div>

            {/* Component Categories Grid */}
            <div className="intro-section">
                <h2 className="section-title">
                    <span className="title-icon">🗂️</span>
                    组件分类
                </h2>
                <div className="category-grid">
                    {[
                        { icon: '🎯', name: '通用', desc: 'Button、Icon、Typography', count: 3, color: '#1890ff' },
                        { icon: '📐', name: '布局', desc: 'Grid、Flex、Layout、Space', count: 7, color: '#52c41a' },
                        { icon: '🧭', name: '导航', desc: 'Menu、Tabs、Breadcrumb', count: 8, color: '#faad14' },
                        { icon: '📝', name: '数据录入', desc: 'Form、Input、Select', count: 16, color: '#722ed1' },
                        { icon: '📊', name: '数据展示', desc: 'Table、Tree、Tag', count: 8, color: '#13c2c2' },
                        { icon: '💬', name: '反馈', desc: 'Modal、Message、Notification', count: 9, color: '#eb2f96' },
                    ].map((cat, idx) => (
                        <div key={idx} className="category-card" style={{ '--cat-color': cat.color } as React.CSSProperties}>
                            <div className="category-header">
                                <span className="category-icon">{cat.icon}</span>
                                <span className="category-badge">{cat.count}个</span>
                            </div>
                            <h3 className="category-name">{cat.name}</h3>
                            <p className="category-desc">{cat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Start Section */}
            <div className="intro-section">
                <h2 className="section-title">
                    <span className="title-icon">⚡</span>
                    快速开始
                </h2>
                <div className="quickstart-container">
                    <div className="quickstart-card">
                        <div className="step-number">1</div>
                        <h4>安装依赖</h4>
                        <div className="code-block mini">
                            <pre><code>npm install @zjpcy/simple-design</code></pre>
                        </div>
                    </div>
                    <div className="step-arrow">→</div>
                    <div className="quickstart-card">
                        <div className="step-number">2</div>
                        <h4>引入样式</h4>
                        <div className="code-block mini">
                            <pre><code>import '@zjpcy/simple-design/dist/cjs/index.css'</code></pre>
                        </div>
                    </div>
                    <div className="step-arrow">→</div>
                    <div className="quickstart-card">
                        <div className="step-number">3</div>
                        <h4>开始使用</h4>
                        <div className="code-block mini">
                            <pre><code>{`<Button type="primary">按钮</Button>`}</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 安装内容组件
const InstallContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'npm' | 'yarn' | 'pnpm'>('npm');

    const installCommands = {
        npm: 'npm install @zjpcy/simple-design',
        yarn: 'yarn add @zjpcy/simple-design',
        pnpm: 'pnpm add @zjpcy/simple-design'
    };

    return (
        <div className="install-content">
            {/* 环境要求 */}
            <div className="install-alert">
            <div className="alert-icon">ℹ️</div>
            <div className="alert-content">
                <strong>环境要求</strong>
                <p>React {'>='} 16.8.0，React DOM {'>='} 16.8.0</p>
            </div>
        </div>

            {/* 安装 */}
            <section className="install-section">
                <h2 className="section-title">
                    <span className="title-icon">📦</span>
                    安装
                </h2>
                <p className="section-desc">使用 npm、yarn 或 pnpm 安装组件库</p>

                <div className="install-tabs">
                    {(['npm', 'yarn', 'pnpm'] as const).map((tab) => (
                        <button
                            key={tab}
                            className={`install-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="code-block">
                    <pre><code>{installCommands[activeTab]}</code></pre>
                </div>
            </section>

            {/* 引入样式 */}
            <section className="install-section">
                <h2 className="section-title">
                    <span className="title-icon">🎨</span>
                    引入样式
                </h2>
                <p className="section-desc">在应用入口文件中引入样式文件</p>

                <div className="code-block">
                    <div className="code-header">
                        <span>main.tsx / main.jsx / App.tsx</span>
                    </div>
                    <pre><code>{`// 引入样式文件（必须）
import '@zjpcy/simple-design/dist/cjs/index.css';

// 可选：引入 CSS 变量文件，用于自定义主题
import '@zjpcy/simple-design/dist/variables.css';`}</code></pre>
                </div>

                <div className="install-tip">
                    <div className="tip-icon">💡</div>
                    <div className="tip-content">
                        <strong>提示</strong>
                        <p>样式文件包含了组件的所有基础样式，必须在引入组件之前或同时引入。</p>
                    </div>
                </div>
            </section>

            {/* 使用示例 */}
            <section className="install-section">
                <h2 className="section-title">
                    <span className="title-icon">🚀</span>
                    使用示例
                </h2>

                {/* 基础使用 */}
                <div className="example-card">
                    <h3>基础使用</h3>
                    <p>直接引入需要的组件即可使用</p>
                    <div className="code-block">
                        <pre><code>{`import { Button, Message } from '@zjpcy/simple-design';

function App() {
  return (
    <Button
      type="primary"
      onClick={() => Message.success('Hello, ZjpCy Design!')}
    >
      点击我
    </Button>
  );
}`}</code></pre>
                    </div>
                </div>

                {/* 按需引入 */}
                <div className="example-card">
                    <h3>按需引入</h3>
                    <p>推荐按需引入，减小打包体积</p>
                    <div className="code-block">
                        <pre><code>{`// 推荐：按需引入单个组件
import Button from '@zjpcy/simple-design/dist/cjs/components/Button';
import 'zjpcy-design/dist/cjs/components/Button/Button.css';

// 或者使用路径别名（需配置）
import { Button } from '@zjpcy/simple-design';`}</code></pre>
                    </div>
                </div>

                {/* 使用 StyledProvider */}
                <div className="example-card">
                    <h3>使用 StyledProvider（推荐）</h3>
                    <p>使用 StyledProvider 可以更好地管理主题和样式隔离</p>
                    <div className="code-block">
                        <pre><code>{`import { StyledProvider } from '@zjpcy/simple-design';

function App() {
  return (
    <StyledProvider theme="light">
      <YourApp />
    </StyledProvider>
  );
}`}</code></pre>
                    </div>
                </div>
            </section>

            {/* TypeScript 支持 */}
            <section className="install-section">
                <h2 className="section-title">
                    <span className="title-icon">🔧</span>
                    TypeScript 支持
                </h2>
                <p className="section-desc">组件库使用 TypeScript 编写，提供了完整的类型定义</p>

                <div className="code-block">
                    <pre><code>{`import { Button, type ButtonProps } from '@zjpcy/simple-design';

// 使用类型定义
const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};`}</code></pre>
                </div>

                <div className="install-tip">
                    <div className="tip-icon">✨</div>
                    <div className="tip-content">
                        <strong>类型提示</strong>
                        <p>所有组件都导出了对应的 Props 类型，例如 ButtonProps、InputProps、TableProps 等。</p>
                    </div>
                </div>
            </section>

            {/* 浏览器兼容性 */}
            <section className="install-section">
                <h2 className="section-title">
                    <span className="title-icon">🌐</span>
                    浏览器兼容性
                </h2>

                <div className="browser-support">
                    <div className="browser-item">
                        <div className="browser-icon">🌐</div>
                        <span className="browser-name">Chrome</span>
                        <span className="browser-version">{'>='} 80</span>
                    </div>
                    <div className="browser-item">
                        <div className="browser-icon">🔥</div>
                        <span className="browser-name">Firefox</span>
                        <span className="browser-version">{'>='} 75</span>
                    </div>
                    <div className="browser-item">
                        <div className="browser-icon">🧭</div>
                        <span className="browser-name">Safari</span>
                        <span className="browser-version">{'>='} 13</span>
                    </div>
                    <div className="browser-item">
                        <div className="browser-icon">🌊</div>
                        <span className="browser-name">Edge</span>
                        <span className="browser-version">{'>='} 80</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default App;

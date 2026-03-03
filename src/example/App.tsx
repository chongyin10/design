import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Icon, Menu, Input } from '../components';
import ButtonExample from './Button';
import CheckboxExample from './Checkbox';
import NoticeExample from './Notice';
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
        key: 'layout',
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
        components: ['carousel', 'empty', 'label', 'table', 'tag', 'tree', 'tooltip']
    },
    {
        key: 'feedback',
        label: '反馈',
        components: ['drawer', 'message', 'modal', 'notification', 'notice', 'popconfirm', 'progress', 'spin']
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
    anchor: { name: 'Anchor', description: '锚点' },
    breadcrumb: { name: 'Breadcrumb', description: '层级结构' },
    button: { name: 'Button', description: '按钮' },
    checkbox: { name: 'Checkbox', description: '多选框' },
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
    notice: { name: 'Notice', description: '通知提醒' },
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
            button: <ButtonExample />,
            flex: <FlexExample />,
            grid: <GridExample />,
            notice: <NoticeExample />,
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
                                <p>ZjpCy Design ©2024 Created by IDP Team</p>
                            </footer>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </MessageProvider>
    );
};

// 简介内容组件
const IntroContent: React.FC = () => (
    <div className="intro-content">
        <div className="intro-hero">
            <h1>ZjpCy Design</h1>
            <p className="intro-subtitle">一套基于 React 的企业级 UI 设计语言和组件库</p>
            <div className="intro-actions">
                <a href="#/install" className="intro-btn intro-btn-primary">开始使用</a>
                <a
                    href="https://www.npmjs.com/package/@zjpcy/simple-design?activeTab=readme"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="intro-btn"
                >
                    GitHub
                </a>
            </div>
        </div>

        <div className="intro-features">
            <div className="feature-card">
                <div className="feature-icon">📦</div>
                <h3>开箱即用</h3>
                <p>提供高质量 React 组件，可直接使用，无需额外配置</p>
            </div>
            <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3>主题定制</h3>
                <p>支持自定义主题，轻松打造符合品牌的设计系统</p>
            </div>
            <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>性能优秀</h3>
                <p>精心优化的组件实现，确保流畅的用户体验</p>
            </div>
            <div className="feature-card">
                <div className="feature-icon">🌍</div>
                <h3>国际化支持</h3>
                <p>内置多语言支持，轻松应对全球化需求</p>
            </div>
        </div>
    </div>
);

// 安装内容组件
const InstallContent: React.FC = () => (
    <div className="install-content">
        <section className="install-section">
            <h2>安装</h2>
            <p>推荐使用 npm 或 yarn 安装</p>

            <div className="code-block">
                <div className="code-header">
                    <span>npm</span>
                </div>
                <pre><code>npm install @zjpcy/simple-design</code></pre>
            </div>

            <div className="code-block">
                <div className="code-header">
                    <span>yarn</span>
                </div>
                <pre><code>yarn add @zjpcy/simple-design</code></pre>
            </div>
        </section>

        <section className="install-section">
            <h2>本地安装</h2>
            <p>从本地文件安装：</p>

            <div className="code-block">
                <pre><code>npm install /path/to/@zjpcy/simple-design</code></pre>
            </div>
        </section>

        <section className="install-section">
            <h2>使用</h2>

            <div className="code-block">
                <div className="code-header">
                    <span>完整引入</span>
                </div>
                <pre><code>{`import React from 'react';
import { Button, Input } from '@zjpcy/simple-design';
import 'idp-design/dist/index.css';

const App = () => (
  <>
    <Button type="primary">按钮</Button>
    <Input placeholder="请输入" />
  </>
);`}</code></pre>
            </div>
        </section>
    </div>
);

export default App;

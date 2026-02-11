import React, { useState, useEffect, useCallback } from 'react';
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
import TestTextareaResize from './TestTextareaResize';
import PopconfirmExample from './Popconfirm';
import ProgressExample from './Progress';
import { MessageProvider } from '../components/Message';
import '../components/variables.css';
import './App.css';
import LayoutExample from './Layout';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    // 导航菜单项定义（按字母顺序排序）
    const navigationItems = [
        { key: 'intro', label: '简介', name: '简介', description: 'IDP Design 组件库介绍', icon: <span>📖</span> },
        { key: 'install', label: '安装', name: '安装', description: '如何安装和引用', icon: <span>📦</span> },
        { key: 'anchor', label: 'Anchor', name: 'Anchor', description: '锚点导航组件', icon: <span>🔗</span> },
        { key: 'breadcrumb', label: 'Breadcrumb', name: 'Breadcrumb', description: '面包屑组件', icon: <span>📁</span> },
        { key: 'button', label: 'Button', name: 'Button', description: '按钮组件', icon: <span>🔘</span> },
        { key: 'checkbox', label: 'Checkbox', name: 'Checkbox', description: '复选框组件', icon: <span>☑️</span> },
        { key: 'cascader', label: 'Cascader', name: 'Cascader', description: '级联选择器组件', icon: <span>🔀</span> },
        { key: 'colorpicker', label: 'ColorPicker', name: 'ColorPicker', description: '颜色选择器组件', icon: <span>🎨</span> },
        { key: 'copytoclipboard', label: 'CopyToClipboard', name: 'CopyToClipboard', description: '剪贴板复制组件', icon: <span>📋</span> },
        { key: 'divider', label: 'Divider', name: 'Divider', description: '分割线组件', icon: <span>➖</span> },
        { key: 'drawer', label: 'Drawer', name: 'Drawer', description: '抽屉组件', icon: <span>🗄️</span> },
        { key: 'dropdown', label: 'Dropdown', name: 'Dropdown', description: '下拉菜单组件', icon: <span>🔽</span> },
        { key: 'empty', label: 'Empty', name: 'Empty', description: '空状态组件', icon: <span>📭</span> },
        { key: 'flex', label: 'Flex', name: 'Flex', description: 'Flex布局组件', icon: <span>🧱</span> },
        { key: 'form', label: 'Form', name: 'Form', description: '表单组件', icon: <span>📝</span> },
        { key: 'grid', label: 'Grid', name: 'Grid', description: '栅格布局组件', icon: <span>🔲</span> },
        { key: 'icon', label: 'Icon', name: 'Icon', description: '图标组件', icon: <span>🖼️</span> },
        { key: 'i18n', label: 'I18n', name: 'I18n', description: '国际化组件', icon: <span>🌐</span> },
        { key: 'input', label: 'Input', name: 'Input', description: '输入框组件', icon: <span>🔤</span> },
        { key: 'label', label: 'Label', name: 'Label', description: '标签组件', icon: <span>🏷️</span> },
        { key: 'layout', label: 'Layout', name: 'Layout', description: '页面布局组件', icon: <span>📐</span> },
        { key: 'marquee', label: 'Marquee', name: 'Marquee', description: '跑马灯组件', icon: <span>📜</span> },
        { key: 'masonry', label: 'Masonry', name: 'Masonry', description: '瀑布流布局组件', icon: <span>🗂️</span> },
        { key: 'menu', label: 'Menu', name: 'Menu', description: '菜单组件', icon: <span>🍽️</span> },
        { key: 'message', label: 'Message', name: 'Message', description: '消息提示组件', icon: <span>💬</span> },
        { key: 'modal', label: 'Modal', name: 'Modal', description: '弹窗组件', icon: <span>🪟</span> },
        { key: 'notice', label: 'Notice', name: 'Notice', description: '公告栏组件', icon: <span>📢</span> },
        { key: 'notification', label: 'Notification', name: 'Notification', description: '通知组件', icon: <span>🔔</span> },
        { key: 'pagination', label: 'Pagination', name: 'Pagination', description: '分页器组件', icon: <span>📄</span> },
        { key: 'popconfirm', label: 'Popconfirm', name: 'Popconfirm', description: '气泡确认框组件', icon: <span>❓</span> },
        { key: 'progress', label: 'Progress', name: 'Progress', description: '进度条组件', icon: <span>📊</span> },
        { key: 'radio', label: 'Radio', name: 'Radio', description: '单选框组件', icon: <span>🔘</span> },
        { key: 'rate', label: 'Rate', name: 'Rate', description: '评分组件', icon: <span>⭐</span> },
        { key: 'select', label: 'Select', name: 'Select', description: '选择器组件', icon: <span>🔽</span> },
        { key: 'slider', label: 'Slider', name: 'Slider', description: '滑动条组件', icon: <span>🎚️</span> },
        { key: 'space', label: 'Space', name: 'Space', description: '组件间距设置', icon: <span>⚫</span> },
        { key: 'steps', label: 'Steps', name: 'Steps', description: '步骤条组件', icon: <span>📋</span> },
        { key: 'switch', label: 'Switch', name: 'Switch', description: '开关组件', icon: <span>🔛</span> },
        { key: 'table', label: 'Table', name: 'Table', description: '表格组件', icon: <span>📊</span> },
        { key: 'tag', label: 'Tag', name: 'Tag', description: '标签组件', icon: <span>🏷️</span> },
        { key: 'test-textarea-resize', label: 'TestTextareaResize', name: 'TestTextareaResize', description: 'Textarea拖拽测试', icon: <span>🧪</span> },
        { key: 'tabs', label: 'Tabs', name: 'Tabs', description: '选项卡组件', icon: <span>🗂️</span> },
        { key: 'top', label: 'Top', name: 'Top', description: '回到顶部组件', icon: <span>⬆️</span> },
        { key: 'tooltip', label: 'Tooltip', name: 'Tooltip', description: '提示框组件', icon: <span>💬</span> },
        { key: 'transfer', label: 'Transfer', name: 'Transfer', description: '穿梭框组件', icon: <span>🔄</span> },
        { key: 'treeselect', label: 'TreeSelect', name: 'TreeSelect', description: '树型选择器组件', icon: <span>🌲</span> },
        { key: 'typography', label: 'Typography', name: 'Typography', description: '排版组件', icon: <span>📝</span> },
        { key: 'variables', label: 'Variables', name: 'Variables', description: '自定义组件库主题颜色', icon: <span>🎨</span> },
    ];

    const [selectedComponent, setSelectedComponent] = useState<string>('button');
    const [searchValue, setSearchValue] = useState<string>('');

    // 从URL中获取初始选中的组件ID
    const getInitialComponentId = () => {
        const hash = window.location.hash;
        if (hash.startsWith('#/')) {
            const id = hash.slice(2);
            return navigationItems.some(item => item.key === id) ? id : 'button';
        }
        return 'button';
    };

    // 监听URL变化，更新选中的组件
    useEffect(() => {
        const initialId = getInitialComponentId();
        setSelectedComponent(initialId);

        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#/')) {
                const id = hash.slice(2);
                if (navigationItems.some(item => item.key === id)) {
                    setSelectedComponent(id);
                }
            }
        };

        // 监听hash变化事件
        window.addEventListener('hashchange', handleHashChange);

        // 清理函数
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    // 处理菜单项点击
    const handleMenuClick = useCallback((key: string) => {
        setSelectedComponent(key);
        window.location.hash = `#/${key}`;
    }, []);

    // 处理搜索
    const handleSearch = useCallback(() => {
        if (!searchValue.trim()) return;
        
        const searchTerm = searchValue.toLowerCase().trim();
        const matchedItem = navigationItems.find(item =>
            item.key.toLowerCase().includes(searchTerm) ||
            item.label.toLowerCase().includes(searchTerm) ||
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );
        
        if (matchedItem) {
            handleMenuClick(matchedItem.key);
            setSearchValue('');
        }
    }, [searchValue, handleMenuClick]);

    // 处理键盘回车
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    // 渲染内容组件
    const renderContent = () => {
        switch (selectedComponent) {
            case 'intro':
                return (
                    <div className="content-section">
                        <h2 className="section-title">1. 简介</h2>
                        <p className="section-text">IDP Design 是一个基于 React 的现代化 UI 组件库，提供了一系列简洁、美观、易用的组件，适用于各种 Web 应用开发。</p>
                    </div>
                );
            case 'install':
                return (
                    <div className="content-section">
                        <h2 className="section-title">2. 安装</h2>
                        <p className="section-text">IDP Design 组件库支持多种安装方式，您可以根据实际需求选择适合的安装方法。</p>

                        <h3 className="subsection-title">2.1 从本地文件安装</h3>
                        <p className="section-text">如果您已经获取了 IDP Design 组件库的本地文件，可以通过以下方式安装：</p>

                        <h4 className="subsubsection-title">2.1.1 使用 npm 从本地目录安装</h4>
                        <p className="section-text">将本地组件库目录作为依赖安装到您的项目中：</p>
                        <div className="code-block">
                            npm install /path/to/idp-design
                        </div>

                        <h4 className="subsubsection-title">2.1.2 使用 yarn 从本地目录安装</h4>
                        <p className="section-text">将本地组件库目录作为依赖安装到您的项目中：</p>
                        <div className="code-block">
                            yarn add /path/to/idp-design
                        </div>
                        <p className="section-text">其中 <code>/path/to/idp-design</code> 是您本地 IDP Design 组件库的绝对路径。</p>

                        <h3 className="subsection-title">2.2 从 Git 仓库安装</h3>
                        <p className="section-text">您可以直接从 Git 仓库安装 IDP Design 组件库，支持指定分支或标签：</p>

                        <h4 className="subsubsection-title">2.2.1 安装主分支最新版本</h4>
                        <div className="code-block">
                            npm install git+https://github.com/your-repo/idp-design.git
                        </div>
                        <div className="code-block">
                            yarn add git+https://github.com/your-repo/idp-design.git
                        </div>

                        <h4 className="subsubsection-title">2.2.2 安装指定分支</h4>
                        <div className="code-block">
                            npm install git+https://github.com/your-repo/idp-design.git#branch-name
                        </div>
                        <div className="code-block">
                            yarn add git+https://github.com/your-repo/idp-design.git#branch-name
                        </div>
                        <p className="section-text">将 <code>branch-name</code> 替换为您想要安装的分支名称，例如 <code>dev</code> 或 <code>feature/new-component</code>。</p>

                        <h4 className="subsubsection-title">2.2.3 安装指定标签版本</h4>
                        <div className="code-block">
                            npm install git+https://github.com/your-repo/idp-design.git#v1.0.0
                        </div>
                        <div className="code-block">
                            yarn add git+https://github.com/your-repo/idp-design.git#v1.0.0
                        </div>
                        <p className="section-text">将 <code>v1.0.0</code> 替换为您想要安装的具体版本标签。</p>

                        <h3 className="subsection-title">2.3 更新依赖</h3>
                        <p className="section-text">当 IDP Design 组件库有新版本发布时，您可以通过以下方式更新依赖：</p>

                        <h4 className="subsubsection-title">2.3.1 更新本地安装的依赖</h4>
                        <div className="code-block">
                            npm update idp-design
                        </div>
                        <div className="code-block">
                            yarn upgrade idp-design
                        </div>

                        <h4 className="subsubsection-title">2.3.2 重新安装本地文件依赖</h4>
                        <p className="section-text">如果您使用本地文件安装方式，需要重新安装以获取最新版本：</p>
                        <div className="code-block">
                            npm install /path/to/idp-design --force
                        </div>
                        <div className="code-block">
                            yarn add /path/to/idp-design --force
                        </div>
                        <p className="section-text">使用 <code>--force</code> 参数强制重新安装，确保获取最新的本地文件。</p>

                        <h4 className="subsubsection-title">2.3.3 更新 Git 仓库依赖</h4>
                        <p className="section-text">如果您使用 Git 仓库安装方式，可以通过以下命令更新：</p>
                        <div className="code-block">
                            npm install git+https://github.com/your-repo/idp-design.git#branch-name --force
                        </div>
                        <div className="code-block">
                            yarn add git+https://github.com/your-repo/idp-design.git#branch-name --force
                        </div>
                        <p className="section-text">或者先卸载再重新安装：</p>
                        <div className="code-block">
                            npm uninstall idp-design
npm install git+https://github.com/your-repo/idp-design.git#branch-name
                        </div>
                        <div className="code-block">
                            yarn remove idp-design
yarn add git+https://github.com/your-repo/idp-design.git#branch-name
                        </div>
                    </div>
                );
            case 'button':
                return <ButtonExample />;
            case 'flex':
                return <FlexExample />;
            case 'grid':
                return <GridExample />;
            case 'notice':
                return <NoticeExample />;
            case 'marquee':
                return <MarqueeExample />;
            case 'table':
                return <TableExample />;
            case 'top':
                return <TopExample />;
            case 'icon':
                return <IconExample />;
            case 'divider':
                return <DividerExample />;
            case 'drawer':
                return <DrawerExample />;
            case 'input':
                return <InputExample />;
            case 'i18n':
                return <I18nExample />;
            case 'radio':
                return <RadioExample />;
            case 'select':
                return <SelectExample />;
            case 'slider':
                return <SliderExample />;
            case 'modal':
                return <ModalExample />;
            case 'notification':
                return <NotificationExample />;
            case 'colorpicker':
                return <ColorPickerExample />;
            case 'copytoclipboard':
                return <CopyToClipboardExample />;
            case 'message':
                return <MessageExample />;
            case 'empty':
                return <EmptyExample />;
            case 'typography':
                return <TypographyExample />;
            case 'variables':
                return <VariablesExample />;
            case 'masonry':
                return <MasonryExample />;
            case 'space':
                return <SpaceExample />;
            case 'anchor':
                return <AnchorExample />;
            case 'breadcrumb':
                return <BreadcrumbExample />;
            case 'checkbox':
                return <CheckboxExample />;
            case 'cascader':
                return <CascaderExample />;
            case 'dropdown':
                return <DropdownExample />;
            case 'menu':
                return <MenuExample />;
            case 'pagination':
                return <PaginationExample />;
            case 'steps':
                return <StepsExample />;
            case 'switch':
                return <SwitchExample />;
            case 'tag':
                return <TagExample />;
            case 'tabs':
                return <TabsExample />;
            case 'popconfirm':
                return <PopconfirmExample />;
            case 'progress':
                return <ProgressExample />;
            case 'tooltip':
                return <TooltipExample />;
            case 'rate':
                return <RateExample />;
            case 'transfer':
                return <TransferExample />;
            case 'label':
                return <LabelExample />;
            case 'treeselect':
                return <TreeSelectExample />;
            case 'form':
                return <FormExample />;
            case 'layout':
                return <LayoutExample />;
            case 'test-textarea-resize':
                return <TestTextareaResize />;
            default:
                return <ButtonExample />;
        }
    };

    const selectedComponentData = navigationItems.find(c => c.key === selectedComponent);

    return (
        <MessageProvider>
            <Layout  style={{ minHeight: '100vh' }}>
                <Header>
                    <Icon type="home" size={24} />
                    <span style={{ marginLeft: '12px', fontSize: '18px', fontWeight: 600 }}>
                        IDP Design
                    </span>
                    {/* 搜索组件 */}
                    <div style={{
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Input.Search
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="搜索组件..."
                            style={{ width: '300px' }}
                        />
                    </div>
                </Header>
                <Layout>
                    <Sider
                        collapsible
                        collapsed={collapsed}
                        onCollapse={setCollapsed}
                        triggerPlacement="bottom"
                    >
                        <Menu
                            items={navigationItems}
                            selectedKey={selectedComponent}
                            onChange={(item) => handleMenuClick(item.key)}
                            mode="vertical"
                            collapsed={collapsed}
                        />
                    </Sider>
                    <Content style={{ padding: '0' }}>
                        {/* 内容头部 */}
                        <div className="content-header">
                            <h1 className="content-title">
                                {selectedComponentData?.name || 'API 参考'}
                            </h1>
                            <p className="content-subtitle">
                                {selectedComponentData?.description || '查看组件 API 文档'}
                            </p>
                        </div>

                        {/* 内容主体 */}
                        <div className="content-main">
                            {renderContent()}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </MessageProvider>
    );
};

export default App;

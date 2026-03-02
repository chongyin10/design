import React, { useState } from 'react';
import { I18nProvider, i18n, Table, useI18n } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import jaJP from './locales/ja-JP.json';
import koKR from './locales/ko-KR.json';

const I18nExample: React.FC = () => {
  // API参数列配置
  const providerApiColumns: Column[] = [
    { dataIndex: 'param', title: '参数名', width: '150px' },
    { dataIndex: 'type', title: '类型', width: '300px' },
    { dataIndex: 'default', title: '默认值', width: '150px' },
    { dataIndex: 'description', title: '描述', width: '300px' }
  ];

  // API参数数据源
  const providerApiDataSource = [
    { param: 'children', type: 'React.ReactNode', default: '-', description: '子组件' },
    { param: 'locale', type: 'string', default: 'zh-CN', description: '当前语言' },
    { param: 'resources', type: 'Record<string, any>', default: '-', description: '外部资源' }
  ];

  // load18n 工具函数 API参数
  const load18nApiColumns: Column[] = [
    { dataIndex: 'parameter', title: '参数/返回值', width: '150px' },
    { dataIndex: 'type', title: '类型', width: '300px' },
    { dataIndex: 'description', title: '描述', width: '300px' }
  ];

  const load18nApiDataSource = [
    { parameter: 'resources', type: 'Record<string, any>', description: '国际化资源对象' },
    { parameter: '', type: 'Record<string, any>', description: '返回格式化后的国际化资源对象，可直接传递给I18nProvider的resources属性' },
  ];

  // useI18n API参数
  const useI18nApiColumns: Column[] = [
    { dataIndex: 'property', title: '属性', width: '150px' },
    { dataIndex: 'type', title: '类型', width: '300px' },
    { dataIndex: 'description', title: '描述', width: '300px' }
  ];

  const useI18nApiDataSource = [
    { property: 't', type: '(key: string) => string', description: '翻译函数' },
    { property: 'i18n', type: 'object', description: 'i18next实例' },
    { property: 'ready', type: 'boolean', description: '翻译资源是否已加载' }
  ];

  // 当前语言状态
  const [currentLocale, setCurrentLocale] = useState<string>(i18n.language);

  const toggleLanguage = () => {
    setCurrentLocale(currentLocale === 'zh-CN' ? 'en-US' : 'zh-CN');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>国际化</h2>
      <p>ZjpCy Design 组件库提供了完善的国际化支持，允许您轻松切换不同语言。</p>

      {/* 基本使用示例 */}
      <div style={{ marginBottom: '40px' }}>
        <h3>基本使用</h3>
        <p>使用 I18nProvider 包裹应用并切换语言。</p>

        <div style={{ marginBottom: '20px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
          <h4>语言切换</h4>
          <p>当前语言: {currentLocale}</p>
          <button 
            onClick={toggleLanguage}
            style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
          >
            切换到 {currentLocale === 'zh-CN' ? '英文' : '中文'}
          </button>

          <I18nProvider locale={currentLocale}>
            <TranslationExample />
          </I18nProvider>
        </div>

        <div style={{ marginBottom: '20px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
          <h4>使用外部JSON文件</h4>
          <p>外部JSON文件支持以下语言：</p>
          <ul>
            <li>日语 (ja-JP): {jaJP.MODAL_TITLE}</li>
            <li>韩语 (ko-KR): {koKR.MODAL_TITLE}</li>
          </ul>
        </div>
      </div>

      {/* API 文档 */}
      <div style={{ marginBottom: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
        <h3>API 参数</h3>
        
        <h4 style={{ marginBottom: '10px' }}>I18nProvider</h4>
        <Table pagination={false} columns={providerApiColumns} dataSource={providerApiDataSource} />
        
        <h4 style={{ marginTop: '30px', marginBottom: '10px' }}>load18n 工具函数</h4>
        <Table pagination={false} columns={load18nApiColumns} dataSource={load18nApiDataSource} />
        
        <h4 style={{ marginTop: '30px', marginBottom: '10px' }}>useI18n</h4>
        <Table pagination={false} columns={useI18nApiColumns} dataSource={useI18nApiDataSource} />
      </div>

      {/* 代码示例 */}
      <div style={{ marginBottom: '40px' }}>
        <h3>代码示例</h3>
        
        <h4 style={{ marginBottom: '10px' }}>1. 基本用法</h4>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0 0 20px 0' }}>
{`import { I18nProvider, useI18n } from '@zjpcy/simple-design';

// 应用根组件
function App() {
  return (
    <I18nProvider locale="zh-CN">
      <MyComponent />
    </I18nProvider>
  );
}

// 自定义组件
const MyComponent: React.FC = () => {
  const { t } = useI18n();
  
  return (
    <div>
      <h1>{t('MODAL_TITLE')}</h1>
      <button>{t('MODAL_OKTEXT')}</button>
      <button>{t('MODAL_CANCELTEXT')}</button>
    </div>
  );
}`}
        </SyntaxHighlighter>

        <h4 style={{ marginBottom: '10px' }}>2. 语言切换</h4>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0 0 20px 0' }}>
{`import { useState } from 'react';
import { I18nProvider, i18n } from '@zjpcy/simple-design';

function App() {
  const [locale, setLocale] = useState(i18n.language);
  
  const toggleLanguage = () => {
    setLocale(locale === 'zh-CN' ? 'en-US' : 'zh-CN');
  };
  
  return (
    <I18nProvider locale={locale}>
      <button onClick={toggleLanguage}>
        切换到 {locale === 'zh-CN' ? '英文' : '中文'}
      </button>
      {/* 其他组件 */}
    </I18nProvider>
  );
}`}
        </SyntaxHighlighter>

        <h4 style={{ marginBottom: '10px' }}>3. 使用外部JSON文件</h4>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0 0 20px 0' }}>
{`import { I18nProvider } from '@zjpcy/simple-design';
import externalResources from './locales/resources.json';
import App from './App';

function Root() {
  return (
    <I18nProvider locale="zh-CN" resources={externalResources}>
      <App />
    </I18nProvider>
  );
}

// resources.json 文件格式示例
/*
{
  "en-US": {
    "translation": {
      "MODAL_TITLE": "Title",
      "MODAL_OKTEXT": "OK",
      "MODAL_CANCELTEXT": "Cancel"
    }
  },
  "zh-CN": {
    "translation": {
      "MODAL_TITLE": "标题",
      "MODAL_OKTEXT": "确认",
      "MODAL_CANCELTEXT": "取消"
    }
  }
}
*/`}
        </SyntaxHighlighter>
      </div>

      {/* 目录结构 */}
      <div style={{ marginBottom: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
        <h3>目录结构</h3>
        <p>组件库的国际化文件位于 <code>src/i18n</code> 目录下，结构如下：</p>
        <div style={{ padding: '10px', background: '#fff', borderRadius: '4px', fontFamily: 'monospace' }}>
src/i18n/<br/>
├── locales/            # 语言包目录<br/>
│   ├── en-US.json     # 英语（美国）语言包<br/>
│   └── zh-CN.json     # 中文（简体）语言包<br/>
├── I18nProvider.tsx   # 国际化上下文提供者<br/>
└── index.ts           # 国际化配置文件
        </div>
      </div>

      {/* 国际化格式 */}
      <div style={{ marginBottom: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
        <h3>国际化格式</h3>
        <p>所有国际化文件都遵循简单的键值对格式，其中：</p>
        <ul style={{ marginBottom: '15px' }}>
          <li>键（key）采用大写格式，单词之间使用下划线（_）分隔</li>
          <li>值（value）必须是字符串，不能包含嵌套对象</li>
          <li>避免使用点（.）作为键的分隔符，统一使用下划线（_）</li>
        </ul>
        
        <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0' }}>
{`// src/i18n/locales/zh-CN.json
{
    "MODAL_TITLE": "标题",
    "MODAL_OKTEXT": "确认",
    "MODAL_CANCELTEXT": "取消",
    "EMPTY_DESCRIPTION": "暂无数据",
    "SELECT_PLACEHOLDER": "请选择"
}`}
        </SyntaxHighlighter>
      </div>

      {/* 使用 load18n 工具函数 */}
      <div style={{ marginBottom: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
        <h3>使用 load18n 工具函数</h3>
        <p>load18n 工具函数可以帮助您轻松注册国际化资源：</p>

        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0' }}>
{`import React from 'react';
import { load18n, useI18n, I18nProvider } from '@zjpcy/simple-design';
import jaJP from './locales/ja-JP.json';
import zhHK from './locales/zh-HK.json';

// 使用 load18n 工具函数格式化语言资源
const resources = load18n({
  'ja-JP': jaJP,
  'zh-HK': zhHK
});

// 或者使用简写键名
// const resources = load18n({ JP: jaJP, HK: zhHK });

function App() {
  return (
    <I18nProvider locale="zh-CN" resources={resources}>
      <MyComponent />
    </I18nProvider>
  );
}

// 在组件内使用 useI18n 获取翻译
const MyComponent: React.FC = () => {
  const { t } = useI18n();
  
  return (
    <div>
      <h1>{t('MODAL_TITLE')}</h1>
      <button>{t('MODAL_OKTEXT')}</button>
    </div>
  );
}`}
        </SyntaxHighlighter>
      </div>

      {/* 在其他项目中引用 */}
      <div>
        <h3>在其他项目中引用</h3>
        <div style={{ margin: '15px 0' }}>
          <h4>1. 安装</h4>
          <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px' }}>
            {`npm i @zjpcy/simple-design`}
          </SyntaxHighlighter>
        </div>
        <div>
          <h4>2. 配置国际化</h4>
          <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px' }}>
{`// 在应用入口文件中
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nProvider, load18n } from '@zjpcy/simple-design';
import App from './App';
import jaJP from './locales/ja-JP.json';
import zhHK from './locales/zh-HK.json';

// 使用 load18n 工具函数注册国际化资源
const resources = load18n({
  'ja-JP': jaJP,
  'zh-HK': zhHK
});

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <I18nProvider locale="zh-CN" resources={resources}>
            <App />
        </I18nProvider>
    </React.StrictMode>
);`}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

// 翻译示例组件
const TranslationExample: React.FC = () => {
  const { t } = useI18n();
  
  return (
    <div>
      <h4 style={{ marginBottom: '10px' }}>{t('MODAL_TITLE')}</h4>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button style={{ padding: '8px 16px', cursor: 'pointer' }}>{t('MODAL_OKTEXT')}</button>
        <button style={{ padding: '8px 16px', cursor: 'pointer' }}>{t('MODAL_CANCELTEXT')}</button>
      </div>
    </div>
  );
};

export default I18nExample;
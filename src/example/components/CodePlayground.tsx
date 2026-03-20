import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from '../../components';
import Editor, { loader } from '@monaco-editor/react';
// @ts-ignore
import * as Babel from '@babel/standalone';
import { reactBaseLib } from '../utils';

// 配置 Monaco Editor loader 使用本地路径
loader.config({
  paths: {
    vs: '/monaco-editor/vs'
  }
});

// 注册预设
Babel.registerPreset('tsx', {
  presets: [
    [Babel.availablePresets['typescript'], { allExtensions: true, isTSX: true }],
    [Babel.availablePresets['env'], { modules: false }],
    [Babel.availablePresets['react']],
  ],
  plugins: [],
});

// LivePreview 组件 - 编译并执行代码
export const LivePreview: React.FC<{
  code: string;
  scope?: Record<string, unknown>;
}> = ({ code, scope = {} }) => {
  const [element, setElement] = useState<React.ReactElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 使用 ref 保存稳定的 scope 引用，避免每次渲染都创建新对象导致无限循环
  const scopeRef = useRef(scope);
  
  // 只在 scope 引用改变时更新 ref
  useEffect(() => {
    scopeRef.current = scope;
  }, [scope]);

  useEffect(() => {
    try {
      setError(null);

      // 转换 JSX 代码
      let transformed: string;
      try {
        const result = Babel.transform(code, {
          presets: ['tsx'],
          filename: 'example.tsx',
        });
        transformed = result.code;
      } catch (compileErr) {
        throw new Error(`编译错误: ${compileErr instanceof Error ? compileErr.message : String(compileErr)}`);
      }

      // 创建执行上下文
      const exports: { default?: React.FC } = {};
      const require = (name: string) => {
        if (name === 'react' || name === 'React') return React;
        return scopeRef.current[name] || {};
      };

      // 准备 scope 变量注入
      const scopeKeys = Object.keys(scopeRef.current);
      const scopeValues = scopeKeys.map(key => scopeRef.current[key]);

      // 包装代码以导出组件
      const wrappedCode = `
        "use strict";
        ${transformed}
        ;
        if (typeof Example !== 'undefined') {
          exports.default = Example;
        }
      `;

      // 执行代码，将 scope 变量注入为函数参数
      const fn = new Function('exports', 'require', 'React', ...scopeKeys, wrappedCode);
      fn(exports, require, React, ...scopeValues);

      if (exports.default) {
        const Component = exports.default;
        setElement(<Component />);
      } else {
        setError('未找到 Example 组件，请确保代码中定义了 const Example = () => {...}');
      }
    } catch (err) {
      console.error('LivePreview error:', err);
      setError(err instanceof Error ? err.message : '代码执行错误');
    }
  }, [code]);

  if (error) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff4d4f',
          padding: '16px',
          fontSize: '13px',
          background: '#fff2f0',
          border: '1px solid #ffccc7',
          borderRadius: '4px',
          overflow: 'auto',
        }}
      >
        <div>
          <strong>❌ 错误</strong>
          <pre style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{error}</pre>
        </div>
      </div>
    );
  }

  if (!element) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
        }}
      >
        加载中...
      </div>
    );
  }

  return <>{element}</>;
};

// 编辑器选项配置
export const defaultEditorOptions = {
  minimap: { enabled: false },
  fontSize: 13,
  lineNumbers: 'on' as const,
  roundedSelection: false,
  scrollBeyondLastLine: false,
  readOnly: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on' as const,
  padding: { top: 16 },
  // 启用自动补全
  quickSuggestions: {
    other: true,
    comments: false,
    strings: true, // 字符串内也启用快速建议
  },
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: 'on' as const,
  quickSuggestionsDelay: 10,
  // 启用自动触发建议（包括字符串值）
  parameterHints: { enabled: true },
};

// 配置 Monaco Editor TypeScript 选项
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const configureMonacoTypeScript = (monaco: any) => {
  // 配置 TypeScript 编译器选项
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: 'React',
    allowNonTsExtensions: true,
    esModuleInterop: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    noEmitOnError: false,
    strict: false,
    noImplicitAny: false,
    // 启用自动补全需要的选项
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    lib: ['es2020', 'dom', 'dom.iterable'],
  });

  // 配置诊断选项 - 保留验证以支持自动补全
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
    // 仅显示错误，不显示警告和信息
    diagnosticCodesToIgnore: [2304, 2307, 2345, 2322, 2786, 7006, 7031],
  });

  // 启用 suggest（检查方法是否存在，避免版本兼容问题）
  if (monaco.languages.typescript.typescriptDefaults.setModeConfiguration) {
    monaco.languages.typescript.typescriptDefaults.setModeConfiguration({
      completions: true,
      hovers: true,
      documentSymbols: true,
      definitions: true,
      documentHighlights: true,
      rename: true,
      diagnostic: false, // 不在编辑器中显示诊断
    });
  }

  // 注册完成项提供程序，调整建议排序
  monaco.languages.registerCompletionItemProvider('typescript', {
    triggerCharacters: ['"', "'", '='],
    provideCompletionItems: (model: any, position: any) => {
      // 获取当前行的文本
      const lineContent = model.getLineContent(position.lineNumber);
      const textUntilPosition = lineContent.substring(0, position.column - 1);
      
      // 检查是否在属性值位置（variant=" 或 variant='）
      const attrMatch = textUntilPosition.match(/(variant|size|gap|align|justify)\s*=\s*["']$/);
      if (attrMatch) {
        // 返回预定义的属性值，确保正确的大小写
        const suggestions: Record<string, string[]> = {
          variant: ['primary', 'secondary', 'danger', 'success', 'warning', 'link'],
          size: ['small', 'medium', 'large'],
          gap: ['small', 'middle', 'large'],
          align: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
          justify: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
        };
        
        const attrName = attrMatch[1];
        const values = suggestions[attrName] || [];
        
        // 计算单词范围（从引号后开始到当前位置）
        const wordUntil = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column - (wordUntil?.word?.length || 0),
          endColumn: position.column,
        };
        
        return {
          suggestions: values.map((value, index) => ({
            label: value,
            kind: monaco.languages.CompletionItemKind.EnumMember,
            insertText: value,
            filterText: value, // 确保过滤时使用原始大小写
            sortText: String(index).padStart(2, '0'), // 确保按顺序排列
            preselect: index === 0, // 第一个预选中
            range: range, // 设置插入范围
            insertTextRules: monaco.languages.CompletionItemInsertInsertTextRule.KeepWhitespace, // 保持原始文本格式
          })),
        };
      }
      
      return { suggestions: [] };
    },
  });
};

// ExtraLib 类型定义
export interface ExtraLib {
  content: string;
  filePath?: string;
}

// 可编辑的代码示例组件
export interface CodePlaygroundProps {
  initialCode: string;
  height?: number;
  scope?: Record<string, unknown>;
  beforeMount?: (monaco: typeof import('monaco-editor')) => void;
  extraLibs?: ExtraLib[];
}

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  initialCode,
  height,
  scope,
  beforeMount,
  extraLibs,
}) => {
  const [code, setCode] = useState(initialCode);

  // 根据代码行数计算编辑器高度（每行约 20px，最少 6 行，最多 30 行）
  const editorHeight = useMemo(() => {
    const lineCount = code.split('\n').length;
    const calculatedHeight = Math.min(Math.max(lineCount * 20 + 20, 150), 600);
    return `${calculatedHeight}px`;
  }, [code]);
  const [showEditor, setShowEditor] = useState(true);

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  }, []);

  // 使用 ref 存储依赖，避免 handleBeforeMount 重新创建
  const beforeMountRef = useRef(beforeMount);
  const extraLibsRef = useRef(extraLibs);

  useEffect(() => {
    beforeMountRef.current = beforeMount;
    extraLibsRef.current = extraLibs;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBeforeMount = useCallback((monaco: any) => {
    configureMonacoTypeScript(monaco);

    // 添加 React 基础类型定义
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      reactBaseLib.content,
      reactBaseLib.filePath
    );

    // 添加额外的类型定义
    if (extraLibsRef.current && extraLibsRef.current.length > 0) {
      extraLibsRef.current.forEach(lib => {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          lib.content,
          lib.filePath || 'extra-lib.d.ts'
        );
      });
    }

    beforeMountRef.current?.(monaco);
  }, []);

  return (
    <div>
      {/* 实时预览 */}
      <div
        style={{
          height,
          border: '1px solid #e8e8e8',
          borderRadius: showEditor ? '4px 4px 0 0' : '4px',
          overflow: 'hidden',
          background: '#fafafa',
          padding: '16px',
        }}
      >
        <LivePreview code={code} scope={scope} />
      </div>

      {/* 编辑器切换按钮 */}
      <div style={{ textAlign: 'center', marginTop: '-1px' }}>
        <Button
          size="small"
          onClick={() => setShowEditor(!showEditor)}
          style={{
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
          }}
        >
          {showEditor ? '▼ 隐藏代码编辑器' : '▶ 显示代码编辑器'}
        </Button>
      </div>

      {/* Monaco Editor */}
      {showEditor && (
        <div
          style={{
            border: '1px solid #e8e8e8',
            borderRadius: '4px',
            marginTop: '8px',
          }}
        >
          <Editor
            height={editorHeight}
            language="typescript"
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            beforeMount={handleBeforeMount}
            options={defaultEditorOptions}
            path="example.tsx"
          />
        </div>
      )}
    </div>
  );
};

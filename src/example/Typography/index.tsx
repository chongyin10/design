import React, { useState, useEffect } from 'react';
import { Typography, Anchor } from '../../components';
import { useI18n } from '../../components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const TypographyExample: React.FC = () => {
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 获取滚动容器
    const container = document.querySelector('.app-content') as HTMLElement;
    setScrollContainer(container);
  }, []);

  const { t } = useI18n();
  // 测试文本
  const longText = t('TYPOGRAPHY_LONG_TEXT');
  const mixedText = t('TYPOGRAPHY_MIXED_TEXT');
  const mixedText2 = t('TYPOGRAPHY_MIXED_TEXT_2');
  const defaultDisplay = t('TYPOGRAPHY_DEFAULT_DISPLAY');
  const limit1Row = t('TYPOGRAPHY_LIMIT_1_ROW');
  const limit2Rows = t('TYPOGRAPHY_LIMIT_2_ROWS');
  const limit3Rows = t('TYPOGRAPHY_LIMIT_3_ROWS');
  const differentWidths = t('TYPOGRAPHY_DIFFERENT_WIDTHS');
  const mixedTextTest = t('TYPOGRAPHY_MIXED_TEXT_TEST');
  const mixedTextTest2 = t('TYPOGRAPHY_MIXED_TEXT_TEST_2');
  const basicUsage = t('TYPOGRAPHY_BASIC_USAGE');
  const apiParameters = t('TYPOGRAPHY_API_PARAMETERS');
  const codeExample = t('TYPOGRAPHY_CODE_EXAMPLE');
  const componentTitle = t('TYPOGRAPHY_COMPONENT');
  const componentDescription = t('TYPOGRAPHY_COMPONENT_DESCRIPTION');
  const basicUsageDescription = t('TYPOGRAPHY_BASIC_USAGE_DESCRIPTION');
  const width200px = t('TYPOGRAPHY_WIDTH_200PX');
  const width300px = t('TYPOGRAPHY_WIDTH_300PX');
  const width500px = t('TYPOGRAPHY_WIDTH_500PX');

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 id="typography-intro">{componentTitle}</h1>
          <p>{componentDescription}</p>
      
          {/* 基本使用示例 */}
          <div id="typography-basic" style={{ marginBottom: '40px' }}>
        <h3>{basicUsage}</h3>
        <p>{basicUsageDescription}</p>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>{defaultDisplay}</h4>
          <Typography style={{ maxWidth: '400px' }}>
            {longText}
          </Typography>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>{limit1Row}</h4>
          <Typography width="400px" rows={1}>
            {longText}
          </Typography>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>{limit2Rows}</h4>
          <Typography width="400px" rows={2}>
            {longText}
          </Typography>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>{limit3Rows}</h4>
          <Typography width="400px" rows={3}>
            {longText}
          </Typography>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>{differentWidths}</h4>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <p>{width200px}</p>
              <Typography width="200px" rows={1}>
                {longText}
              </Typography>
            </div>
            <div>
              <p>{width300px}</p>
              <Typography width="300px" rows={2}>
                {longText}
              </Typography>
            </div>
            <div>
              <p>{width500px}</p>
              <Typography width="500px" rows={3}>
                {longText}
              </Typography>
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>{mixedTextTest}</h4>
          <Typography width="350px">
            {mixedText}
          </Typography>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>{mixedTextTest2}</h4>
          <Typography width="350px" rows={2}>
            {mixedText2}
          </Typography>
        </div>
      </div>
      
          {/* API 文档 */}
          <div id="typography-api" style={{ marginBottom: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
            <h3>{apiParameters}</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>参数名</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>类型</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>默认值</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>描述</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>children</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>ReactNode</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>-</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>文本内容</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>width</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>number | string</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>-</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>宽度限制</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>rows</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>number</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>-</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>行数限制</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>style</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>React.CSSProperties</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>-</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>自定义样式</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>className</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>string</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>-</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>自定义类名</td>
            </tr>
          </tbody>
            </table>
          </div>
      
          {/* 代码示例 */}
          <div id="typography-code" style={{ marginBottom: '40px' }}>
            <h3>{codeExample}</h3>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0' }}>
{`import Typography from '@zjpcy/simple-design';

// 默认显示（不限制行数）
<Typography width="400px">
  这是一段很长的测试文本...
</Typography>

// 限制1行
<Typography width="400px" rows={1}>
  这是一段很长的测试文本...
</Typography>

// 限制2行
<Typography width="400px" rows={2}>
  这是一段很长的测试文本...
</Typography>

// 限制3行
<Typography width="400px" rows={3}>
  这是一段很长的测试文本...
</Typography>
`}
            </SyntaxHighlighter>
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
                <Anchor.Link href="#typography-intro" title="组件介绍" />
                <Anchor.Link href="#typography-basic" title="基本使用" />
                <Anchor.Link href="#typography-api" title="API 文档" />
                <Anchor.Link href="#typography-code" title="代码示例" />
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypographyExample;
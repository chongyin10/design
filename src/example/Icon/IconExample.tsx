import React, { useState } from 'react';
import Icon from '../../components/Icon';
import ColorPicker from '../../components/ColorPicker';
import { Button, Table, Input, useMessage } from '../../components';
import type { Column } from '../../components/Table';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useOnCopy } from '../../components/CopyToClipboard';
import './IconExample.css';

const IconExample: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string>('#339af0');
  const [_, setCopyStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [filteredIcons, setFilteredIcons] = useState<string[]>([]);
  const copyFunction = useOnCopy();
  const message = useMessage();

  // 预设图标列表
  const iconList = [
    // 基础图标
    'search', 'loading', 'user', 'close', 'check', 'plus', 'minus',
    'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown',
    'setting', 'settings', 'eye', 'eyeOff', 'trash', 'delete', 'edit',
    'download', 'upload', 'refresh', 'home', 'menu',
    'more', 'bell', 'mail', 'calendar', 'clock',
    'star', 'starOutline', 'heart', 'heartOutline',
    'info', 'warning', 'error', 'success', 'question',
    'link', 'image', 'folder', 'file', 'cloud', 'exclamation',

    // 社交媒体图标
    'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'github', 'weibo', 'telegram',

    // 工具图标
    'copy', 'paste', 'cut', 'select', 'hammer', 'wrench', 'screwdriver', 'paintbrush',
    'tools', 'tool', 'mallet', 'driver',

    // 文档图标
    'fileText', 'filePdf', 'fileExcel', 'fileWord', 'fileEarmark', 'fileEarmarkText', 'fileEarmarkImage', 'fileEarmarkPdf',
    'document', 'directory', 'folder-open',

    // 箭头图标
    'arrowUpRight', 'arrowDownRight', 'arrowUpLeft', 'arrowDownLeft',
    'arrowUpRightSquare', 'arrowDownRightSquare', 'arrowUpLeftSquare', 'arrowDownLeftSquare',

    // 其他常用图标
    'filter', 'sort', 'searchPlus', 'searchMinus', 'shield', 'lock', 'unlock',
    'tag', 'bookmark', 'flag', 'map', 'message', 'phone', 'camera', 'video',
    'music', 'play', 'pause', 'stop', 'refreshCw', 'refreshCcw', 'undo', 'redo',
    'zoomIn', 'zoomOut', 'share', 'external-link', 'secure', 'open', 'view', 'off',
    'reload', 'volume-high', 'volume-off', 'schedule', 'grid', 'list',

    // 新增图标
    'shield-check', 'shield-off', 'key', 'key-outline', 'logout', 'login',
    'settings-2', 'sliders', 'chart-bar', 'chart-line', 'chart-pie',
    'clipboard', 'clipboard-check', 'clipboard-text', 'database', 'server',
    'terminal', 'code', 'bug', 'gift', 'cart', 'shopping-bag',
    'credit-card', 'wallet', 'tag-outline', 'bookmark-outline',
    'pin', 'pin-outline', 'bell-outline', 'bell-off',

    // 状态图标
    'infoCircle', 'warningCircle', 'errorCircle', 'checkCircle', 'questionCircle',
    'checkCircleFill', 'exclamationCircleFill', 'infoCircleFill',

    // 导航图标
    'compass', 'mapPin', 'location',

    // 编辑图标
    'pencilSquare', 'highlighter', 'bold',

    // 设备图标
    'laptop', 'tablet', 'mobile', 'printer', 'headphones', 'mouse',

    // 金融图标
    'dollar', 'euro',

    // 天气图标
    'sun', 'moon', 'cloudSun',
    
    // 多媒体图标
    'photograph'
  ];

  // 初始化时显示所有图标
  React.useEffect(() => {
    setFilteredIcons(iconList);
  }, []);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleCopy = async (content: string) => {
    try {
      await copyFunction(content);
      setCopyStatus('已复制');
      message.success('已复制');
      setContent(content);
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (error) {
      setCopyStatus('复制失败');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  // 搜索图标
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredIcons(iconList);
      return;
    }
    const filtered = iconList.filter(icon =>
      icon.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIcons(filtered);
  };


  // API参数列配置
  const apiColumns: Column[] = [
    { dataIndex: 'param', title: '属性名', width: '150px' },
    { dataIndex: 'type', title: '类型', width: '250px' },
    { dataIndex: 'default', title: '默认值', width: '200px' },
    { dataIndex: 'description', title: '描述', width: '300px' }
  ];

  // API参数数据源
  const apiDataSource = [
    { param: 'type', type: 'string', default: '-', description: '预设图标类型，如search, user, close等' },
    { param: 'path', type: 'string', default: '-', description: '自定义SVG路径' },
    { param: 'viewBox', type: 'string', default: '0 0 24 24', description: 'SVG的viewBox属性' },
    { param: 'size', type: 'number | "small" | "medium" | "large"', default: 'medium', description: '图标大小' },
    { param: 'color', type: 'string', default: '-', description: '图标颜色，默认为淡蓝色#339af0' },
    { param: 'hoverColor', type: 'string', default: '-', description: '悬停时的图标颜色' },
    { param: 'spin', type: 'boolean', default: 'false', description: '是否旋转' },
    { param: 'rotate', type: 'number', default: '0', description: '旋转角度' },
    { param: 'align', type: '"left" | "center" | "right"', default: 'center', description: '对齐方式' },
    { param: 'className', type: 'string', default: '""', description: '自定义CSS类名' },
    { param: 'style', type: 'React.CSSProperties', default: '{}', description: '自定义样式' },
    { param: 'onClick', type: '(e: React.MouseEvent<SVGSVGElement>) => void', default: '-', description: '点击事件，与颜色选择器功能兼容' }
  ];



  return (
    <div className="icon-example-container">
      <h1 className="icon-example-title">Icon 组件示例</h1>

      <h2 className="icon-example-subtitle">0. 颜色选择器</h2>
      <div className="icon-display-section">
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="home" size={24} color={selectedColor} />
              <div className="icon-label">点击选择颜色</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('home')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="home" size={24} color="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
      </div>

      <div className="copy-section">
        <div className="copy-label">复制当前值:</div>
        <div className="copy-content">{ content }</div>
      </div>

      <h2 className="icon-example-subtitle">1. 预设图标类型</h2>
      <div className="search-section">
        <Input
          type="text"
          placeholder="输入图标名称搜索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <Button onClick={handleSearch} className="search-button">搜索</Button>
      </div>
      <div className="icon-display-section">
        {filteredIcons.map((type) => (
          <div key={type}>
            <ColorPicker
              color={selectedColor}
              onChange={handleColorChange}
              presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
            >
              <div className="preset-icon-card">
                <Icon
                  type={type as any}
                  size={24}
                  color={selectedColor}
                />
                <div className="icon-label">{type}</div>
              </div>
            </ColorPicker>
            <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
              <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
              <Button size='small' onClick={() => handleCopy(type)}>复制icon值</Button>
              <Button size='small' onClick={() => handleCopy(`<Icon type="${type}" size={24} color="${selectedColor}" />`)}>复制Icon码</Button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="icon-example-subtitle">2. 不同尺寸</h2>
      <div className="icon-row-display">
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="home" size="small" color={selectedColor} />
              <div className="icon-label">small</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('home')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="home" size="small" color="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="home" size="medium" color={selectedColor} />
              <div className="icon-label">medium</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('home')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="home" size="medium" color="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="home" size="large" color={selectedColor} />
              <div className="icon-label">large</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('home')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="home" size="large" color="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="home" size={32} color={selectedColor} />
              <div className="icon-label">size=32</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('home')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="home" size={32} color="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
      </div>

      <h2 className="icon-example-subtitle">3. 不同颜色</h2>
      <div className="icon-row-display">
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="heart" color={selectedColor} />
              <div className="icon-label">heart</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('heart')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="heart" color="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="star" color={selectedColor} />
              <div className="icon-label">star</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('star')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="star" color="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="success" color={selectedColor} />
              <div className="icon-label">success</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('success')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="success" color="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="error" color={selectedColor} />
              <div className="icon-label">error</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('error')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="error" color="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="info" color={selectedColor} />
              <div className="icon-label">info</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('info')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="info" color="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
      </div>

      <h2 className="icon-example-subtitle">4. 悬停颜色效果</h2>
      <div className="icon-row-display">
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="heart" color="lightgray" hoverColor={selectedColor} />
              <div className="icon-label">heart</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('heart')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="heart" color="lightgray" hoverColor="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="star" color="lightgray" hoverColor={selectedColor} />
              <div className="icon-label">star</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('star')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="star" color="lightgray" hoverColor="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="success" color="lightgray" hoverColor={selectedColor} />
              <div className="icon-label">success</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('success')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="success" color="lightgray" hoverColor="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
      </div>

      <h2 className="icon-example-subtitle">5. 旋转效果</h2>
      <div className="icon-row-display">
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="arrowLeft" rotate={0} color={selectedColor} />
              <div className="icon-label">arrowLeft</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('arrowLeft')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="arrowLeft" rotate={0} color="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="arrowRight" rotate={45} color={selectedColor} />
              <div className="icon-label">arrowRight</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('arrowRight')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="arrowRight" rotate={45} color="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="arrowUp" rotate={90} color={selectedColor} />
              <div className="icon-label">arrowUp</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('arrowUp')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="arrowUp" rotate={90} color="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="arrowDown" rotate={180} color={selectedColor} />
              <div className="icon-label">arrowDown</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('arrowDown')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="arrowDown" rotate={180} color="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon type="refresh" spin={true} color={selectedColor} />
              <div className="icon-label">refresh</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('refresh')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon type="refresh" spin={true} color="${selectedColor}" />`)}>复制Icon码</Button>
          </div>
        </div>
      </div>

      <h2 className="icon-example-subtitle">6. 自定义路径 SVG 图标</h2>
      <div className="icon-row-display">
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon
                path="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                viewBox="0 0 24 24"
                color={selectedColor}
                size={32}
              />
              <div className="icon-label">自定义路径1</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('自定义路径')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon path="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" viewBox="0 0 24 24" color="${selectedColor}" size={32} />`)}>复制Icon码</Button>
          </div>
        </div>
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon
                path="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                viewBox="0 0 24 24"
                color={selectedColor}
                size={32}
              />
              <div className="icon-label">自定义路径2</div>
            </div>
          </ColorPicker>
          <div style={{ fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#339af0', display: 'flex', justifyContent: 'center', gap: '8px', flexFlow: 'column', marginTop: '5px' }}>
            <Button size='small' onClick={() => handleCopy(selectedColor)}>复制颜色值</Button>
            <Button size='small' onClick={() => handleCopy('自定义路径')}>复制icon值</Button>
            <Button size='small' onClick={() => handleCopy(`<Icon path="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" viewBox="0 0 24 24" color="${selectedColor}" size={32} />`)}>复制Icon码</Button>
          </div>
        </div>
      </div>

      <h2 className="icon-example-subtitle">7. 点击事件</h2>
      <div className="icon-row-display">
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon
                type="heart"
                color="lightgray"
                hoverColor={selectedColor}
                size={24}
                onClick={() => message.success('点击了心形图标!')}
              />
              <div className="icon-label">heart</div>
            </div>
          </ColorPicker>
        </div>
        <div>
          <ColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
          >
            <div className="preset-icon-card">
              <Icon
                type="star"
                color="lightgray"
                hoverColor={selectedColor}
                size={24}
                onClick={() => message.success('点击了星形图标!')}
              />
              <div className="icon-label">star</div>
            </div>
          </ColorPicker>
        </div>
      </div>

      <h2 className="icon-example-subtitle">8. 对齐方式</h2>
      <div className="icon-column-display">
        <ColorPicker
          color={selectedColor}
          onChange={handleColorChange}
          presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
        >
          <div className="align-row">
            <span>左对齐: </span>
            <div>
              <Icon type="home" align="left" color={selectedColor} />
            </div>
            <span>内容</span>
          </div>
        </ColorPicker>
        <ColorPicker
          color={selectedColor}
          onChange={handleColorChange}
          presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
        >
          <div className="align-row-center">
            <span>居中对齐: </span>
            <div>
              <Icon type="home" align="center" color={selectedColor} />
            </div>
            <span>内容</span>
          </div>
        </ColorPicker>
        <ColorPicker
          color={selectedColor}
          onChange={handleColorChange}
          presetColors={['#339af0', '#1976d2', '#e53935', '#ff9800', '#52b788', '#f3722c']}
        >
          <div className="align-row-bottom">
            <span>右对齐: </span>
            <div>
              <Icon type="home" align="right" color={selectedColor} />
            </div>
            <span>内容</span>
          </div>
        </ColorPicker>
      </div>

      {/* API 文档 */}
      <div className="api-documentation">
        <h3 className="api-title">API 参数</h3>
        <Table pagination={false} columns={apiColumns} dataSource={apiDataSource} />
      </div>

      {/* 代码示例 */}
      <div className="code-example-section">
        <h3 className="code-example-title">代码示例</h3>
        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
          {`import { Icon } from '@zjpcy/simple-design';

// 基本用法
<Icon type="search" />

// 不同尺寸
<Icon type="user" size="small" />
<Icon type="user" size="medium" />
<Icon type="user" size="large" />
<Icon type="user" size={32} />

// 自定义颜色
<Icon type="heart" color="red" />
<Icon type="star" color="gold" />

// 悬停颜色效果
<Icon type="heart" color="lightgray" hoverColor="red" />

// 旋转效果
<Icon type="arrowRight" rotate={45} />
<Icon type="refresh" spin={true} />

// 自定义路径 SVG
<Icon
  path="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
  viewBox="0 0 24 24"
  color="#FFD700"
  size={32}
/>

// 点击事件
<Icon type="heart" onClick={() => console.log('Clicked!')} />

// 对齐方式
<Icon type="home" align="left" />
<Icon type="home" align="center" />
<Icon type="home" align="right" />

`}
        </SyntaxHighlighter>
      </div>

      {/* 在其他项目中引用示例 */}
      <div className="reference-section">
        <h3 className="reference-title">在其他项目中引用</h3>
        <div className="reference-subtitle">
          <h4>1. 安装</h4>
          <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
            {`npm i @zjpcy/simple-design`}
          </SyntaxHighlighter>
        </div>
        <div>
          <h4>2. 引用组件</h4>
          <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '6px', margin: '0', fontSize: '14px', fontFamily: 'monospace' }}>
            {`// 方式一：单独引入
import Icon from '@zjpcy/simple-design/lib/Icon';
import '@zjpcy/simple-design/lib/Icon/index.css';

// 方式二：批量引入
import { Icon } from '@zjpcy/simple-design';
import '@zjpcy/simple-design/lib/index.css';`}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default IconExample;
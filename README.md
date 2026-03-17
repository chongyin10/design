# ZjpCy Design Component Library Usage Guide

## 1. Introduction

ZjpCy Design is a modern UI component library based on React, offering a range of concise, visually appealing, and user-friendly components suitable for various web application developments.

- 🎨 Modern design style with consistent visual language
- ⚡️ Lightweight and high performance
- 📱 Responsive design support
- 🌐 Internationalization (i18n) support
- 📝 TypeScript support with complete type definitions

## 2. Installation

```bash
# Install with npm
npm i @zjpcy/simple-design

# Install with yarn
yarn add @zjpcy/simple-design

# Install with pnpm
pnpm add @zjpcy/simple-design
```

## 3. Import CSS

```tsx
// Reference CSS variables from component libraries
import '@zjpcy/simple-design/dist/variables.css';
// Reference the style of the component library
import '@zjpcy/simple-design/dist/cjs/index.css';
```

## 4. Quick Start

### Basic Usage

```tsx
import React from 'react';
import { Button, Message } from '@zjpcy/simple-design';

function App() {
  const handleClick = () => {
    Message.success('Hello, ZjpCy Design!');
  };

  return (
    <Button type="primary" onClick={handleClick}>
      Click Me
    </Button>
  );
}

export default App;
```

### With StyledProvider (Recommended)

For theme customization and better style isolation:

```tsx
import { StyledProvider } from '@zjpcy/simple-design';

function App() {
  return (
    <StyledProvider theme="light">
      <YourApp />
    </StyledProvider>
  );
}
```

## 5. Component List

### General Components

| Component | Description |
|-----------|-------------|
| `Button` | Button component with multiple variants |
| `Icon` | Icon component with SVG support |
| `Typography` | Text formatting component |

### Layout Components

| Component | Description |
|-----------|-------------|
| `Flex` | Flexible box layout |
| `Grid` / `Row` / `Col` | 24-column grid system |
| `Layout` | Page layout structure (Header, Content, Footer, Sider) |
| `Space` | Spacing component |
| `Splitter` | Resizable split panel |

### Navigation Components

| Component | Description |
|-----------|-------------|
| `Anchor` | Page anchor navigation |
| `Breadcrumb` | Breadcrumb navigation |
| `Dropdown` | Dropdown menu |
| `Menu` | Navigation menu |
| `Pagination` | Pagination component |
| `Steps` | Step-by-step navigation |
| `Tabs` | Tab navigation |
| `Top` | Back to top button |

### Form Components

| Component | Description |
|-----------|-------------|
| `AutoComplete` | Autocomplete input |
| `Cascader` | Cascading selector |
| `Checkbox` | Checkbox |
| `ColorPicker` | Color picker |
| `DatePicker` / `RangePicker` | Date selection |
| `Form` | Form container with validation |
| `Input` | Input field |
| `InputNumber` | Numeric input |
| `InputSearch` | Search input |
| `Radio` | Radio button |
| `Rate` | Star rating |
| `Select` | Dropdown selector |
| `Slider` | Slider input |
| `Switch` | Toggle switch |
| `TimePicker` | Time selection |
| `Transfer` | Shuttle box |
| `TreeSelect` | Tree selector |
| `Upload` | File upload |

### Data Display Components

| Component | Description |
|-----------|-------------|
| `Calendar` | Calendar display |
| `Carousel` | Carousel/slider |
| `Empty` | Empty state placeholder |
| `Marquee` | Scrolling text |
| `Masonry` | Waterfall layout |
| `Table` | Data table |
| `Tag` | Tag component |
| `Tree` | Tree structure |

### Feedback Components

| Component | Description |
|-----------|-------------|
| `Drawer` | Slide-out panel |
| `Message` | Message prompt |
| `Modal` | Modal dialog |
| `Notice` | Notification message |
| `Notification` | Notification box |
| `Popconfirm` | Confirmation popup |
| `Progress` | Progress bar |
| `Spin` | Loading spinner |
| `Tooltip` | Text tooltip |

### Utility Components

| Component | Description |
|-----------|-------------|
| `CopyToClipboard` | Copy to clipboard |
| `Divider` | Divider line |
| `Label` | Label component |

## 6. Internationalization (i18n)

ZjpCy Design supports multiple languages:

```tsx
import { I18nProvider, useI18n } from '@zjpcy/simple-design';

function App() {
  return (
    <I18nProvider locale="zh-CN">
      <YourApp />
    </I18nProvider>
  );
}
```

Supported locales: `zh-CN`, `en-US`, `ja-JP`, `ko-KR`

## 7. Local Development

To enable local development, follow these steps:

1. Clone the repository: `git clone https://github.com/zjpcy/idp-design.git`
2. Navigate to the project directory: `cd idp-design`
3. Install dependencies: `npm install` or `yarn install`
4. Start the development server: `npm run dev` or `yarn dev`

## 8. Build

```bash
# Build for production
npm run build

# Build types only
npm run build:types

# Build with Rollup only
npm run build:rollup
```

## 9. Browser Support

- Chrome >= 80
- Firefox >= 75
- Safari >= 13
- Edge >= 80

## 10. License

MIT License © 2025 ZjpCy Design

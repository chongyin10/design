# ZjpCy Design Component Library Usage Guide

## 1. Introduction

ZjpCy Design is a modern UI component library based on React, offering a range of concise, visually appealing, and user-friendly components suitable for various web application developments.

## 2. Installation

```bash
# Install with npm
npm i @zjpcy/simple-design

# Install with yarn
yarn add @zjpcy/simple-design
```

# 3. Import CSS

```tsx
// Reference CSS variables from component libraries
import '@zjpcy/simple-design/dist/variables.css';
// Reference the style of the component library
import '@zjpcy/simple-design/dist/cjs/index.css';
```

# 4. Import Components

```tsx
import React from 'react';
import { Button } from '@zjpcy/simple-design';
```

# 5. Component List

- Button
- Checkbox
- ColorPicker
- CopyToClipboard
- Divider
- Flex
- Icon
- Input
- InputNumber
- InputSearch
- Message
- Modal
- Notice
- Notification
- Radio
- Select
- Table
- Top

# 6. Local Development

To enable local development, follow these steps:

1. Clone the repository: `git clone https://github.com/zjpcy/idp-design.git`
2. Navigate to the project directory: `cd idp-design`
3. Install dependencies: `npm install` or `yarn install`
4. Start the development server: `npm dev` or `yarn dev`

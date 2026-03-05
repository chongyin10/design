const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Steps/Steps.css');
let content = fs.readFileSync(filePath, 'utf-8');

// 替换规则：将 .class1.class2 改为 .class1 .class2（后代选择器）
// 或者改为 .class1-class2（组合类名）

const replacements = [
  // 类型类
  { from: /\.idp-steps\.panel/g, to: '.idp-steps .idp-steps-panel' },
  // 方向类
  { from: /\.idp-steps\.horizontal/g, to: '.idp-steps .idp-steps-direction-horizontal' },
  { from: /\.idp-steps\.vertical/g, to: '.idp-steps .idp-steps-direction-vertical' },
  // 尺寸类
  { from: /\.idp-steps\.small/g, to: '.idp-steps .idp-steps-size-small' },
  // 步骤项的状态类
  { from: /\.idp-step\.wait/g, to: '.idp-step .idp-step-wait' },
  { from: /\.idp-step\.process/g, to: '.idp-step .idp-step-process' },
  { from: /\.idp-step\.finish/g, to: '.idp-step .idp-step-finish' },
  { from: /\.idp-step\.error/g, to: '.idp-step .idp-step-error' },
  { from: /\.idp-step\.disabled/g, to: '.idp-step .idp-step-disabled' },
  // 步骤节点的状态类
  { from: /\.idp-step-node\.wait/g, to: '.idp-step-node .idp-step-node-wait' },
  { from: /\.idp-step-node\.process/g, to: '.idp-step-node .idp-step-node-process' },
  { from: /\.idp-step-node\.finish/g, to: '.idp-step-node .idp-step-node-finish' },
  { from: /\.idp-step-node\.error/g, to: '.idp-step-node .idp-step-node-error' },
];

replacements.forEach(({ from, to }) => {
  content = content.replace(from, to);
});

fs.writeFileSync(filePath, content);
console.log('Steps.css fixed!');

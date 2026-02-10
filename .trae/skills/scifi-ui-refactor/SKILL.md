---
name: "scifi-ui-refactor"
description: "将游戏界面重构为科幻风格，使用玻璃拟态、发光边框、扫描线动画等效果。Invoke when user asks to refactor any game screen with sci-fi styling."
---

# 科幻风格 UI 重构 Skill

## 概述

将游戏界面重构为统一的科幻风格，与探索界面和舰桥界面保持一致。

## 设计规范

### 色彩系统
- **主背景**: `#000000` 或深空渐变
- **面板背景**: `rgba(0, 20, 40, 0.85)` 带毛玻璃效果
- **主色调**: `#00d4ff` (科技蓝)
- **次要色**: `#7c3aed` (能量紫)
- **强调色**: `#f59e0b` (警告橙)
- **文字**: `#ffffff` (主文字), `#a1a1aa` (次要文字)

### 玻璃拟态效果
```css
background: rgba(0, 20, 40, 0.85);
backdrop-filter: blur(12px);
border: 1px solid rgba(0, 212, 255, 0.3);
```

### 发光边框动画
```css
@keyframes borderFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### 扫描线效果
```css
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
```

## 组件模式

### 顶部导航栏
- 玻璃拟态背景
- 发光底部边框
- 返回按钮带悬停效果
- 标题居中，带科技字体

### 分类标签
- 胶囊形状
- 选中状态：发光背景 + 边框
- 未选中：透明背景 + 暗淡边框
- 平滑过渡动画

### 物品格子
- 方形，圆角 8px
- 品质颜色边框
- 悬停/选中发光效果
- 数量角标

### 弹窗
- 居中显示
- 玻璃拟态背景
- 顶部彩色边框
- 渐入动画

## 实现步骤

1. **分析原界面** - 理解布局结构和功能
2. **应用背景** - 添加星空或科技背景
3. **重构容器** - 应用玻璃拟态和边框
4. **美化组件** - 按钮、标签、格子等
5. **添加动画** - 扫描线、发光、流动边框
6. **优化移动端** - 确保触摸友好

## 代码模板

### 样式常量
```typescript
const SCIFI_COLORS = {
  primary: '#00d4ff',
  secondary: '#7c3aed',
  warning: '#f59e0b',
  danger: '#ef4444',
  success: '#22c55e',
  background: 'rgba(0, 20, 40, 0.85)',
  border: 'rgba(0, 212, 255, 0.3)',
};
```

### 玻璃面板
```tsx
<div style={{
  background: 'rgba(0, 20, 40, 0.85)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(0, 212, 255, 0.3)',
  borderRadius: '12px',
  boxShadow: '0 0 20px rgba(0, 212, 255, 0.1), inset 0 0 20px rgba(0, 212, 255, 0.05)',
}}>
```

### 发光按钮
```tsx
<button style={{
  background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(124, 58, 237, 0.2))',
  border: '1px solid rgba(0, 212, 255, 0.5)',
  color: '#00d4ff',
  boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)',
}}>
```

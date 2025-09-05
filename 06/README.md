# 第 06 题：React 购物车应用（30 分）

> 基于 React 18 + Vite 构建

## 任务描述

完成一个 React 版本的购物车应用。这道题考核 React 的核心概念，包括组件化开发、Hooks 使用、JSX 语法和状态管理。

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build
```

## TODO 任务

### TODO_01（10 分）：商品组件 JSX 实现

- **文件位置：** `src/App.jsx:14-36`
- **任务要求：**
  - ✅ 完善 ProductCard 组件的 JSX 结构
  - ✅ 正确显示商品信息和处理点击事件
  - ✅ 实现库存状态的条件渲染
  - ✅ 使用合适的 CSS 类名来匹配样式

### TODO_02（10 分）：购物车操作和组件

- **文件位置：** `src/App.jsx:38-69, 126-163`
- **任务要求：**
  - ✅ 完善 CartItem 组件的 JSX 结构
  - ✅ 实现 `increaseQuantity`、`decreaseQuantity`、`removeFromCart` 方法
  - ✅ 正确处理购物车商品的增减删除逻辑
  - ✅ 显示商品名称、单价、数量和小计

### TODO_03（10 分）：Hooks 和条件渲染

- **文件位置：** `src/App.jsx:75-94, 198-217`
- **任务要求：**
  - ✅ 使用 `useMemo` 实现购物车统计计算
  - ✅ 实现购物车空状态的条件渲染
  - ✅ 正确显示购物车统计数据
  - ✅ 计算总价、总数量和判断购物车状态

## 技术栈

- React 18 (Function Components + Hooks)
- Vite
- CSS3
- ESLint

## 功能特性

- 🛒 商品展示和购物车管理
- 📊 实时计算总价和数量
- 🔄 库存管理和状态检查
- 📱 响应式设计
- ✨ 现代化 UI 界面
- 🚀 组件化开发

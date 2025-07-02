# neug WebUI

一个现代化的 SQL Notebook 界面，专为 neug 引擎设计。

## 功能特性

### 🎯 核心功能

- **三栏布局**: 左侧 Notebooks 和数据库树，中间 SQL 编辑区，右侧结果统计
- **多 Cell 支持**: 支持多个查询 Cell，每个 Cell 可独立运行
- **SQL 编辑器**: 支持语法高亮和自动补全
- **结果可视化**: 自动分析查询结果，提供字段统计和类型分布
- **拖拽调整**: 支持拖拽调整左右面板宽度

### 📊 数据管理

- **Notebook 管理**: 创建、重命名、删除 Notebook
- **数据库树**: 可视化数据库和表结构
- **查询结果**: 表格展示、CSV 导出、复制功能

### 🎨 界面设计

- **现代化 UI**: 基于 shadcn/ui 组件库
- **响应式布局**: 适配不同屏幕尺寸
- **深色模式**: 支持主题切换
- **极简风格**: 参考 duckdb-ui 设计理念

## 技术栈

- **前端框架**: React 18+
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **组件库**: shadcn/ui
- **状态管理**: Zustand
- **SQL 编辑器**: Monaco Editor
- **图表库**: ECharts

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── ui/             # 基础 UI 组件
│   ├── Layout.tsx      # 主布局组件
│   ├── LeftPanel.tsx   # 左侧面板
│   ├── MainPanel.tsx   # 中间主区域
│   ├── RightPanel.tsx  # 右侧面板
│   └── QueryCell.tsx   # 查询 Cell 组件
├── store/              # 状态管理
│   └── useStore.ts     # Zustand store
├── lib/                # 工具函数
│   └── utils.ts        # 通用工具
└── App.tsx             # 应用入口
```

## 使用说明

### 创建 Notebook

1. 在左侧面板点击 "Notebooks" 下的 "+" 按钮
2. 输入 Notebook 名称
3. 开始添加查询 Cell

### 添加查询 Cell

1. 在 Notebook 中点击 "添加 Cell" 按钮
2. 在 SQL 编辑器中输入查询语句
3. 点击运行按钮执行查询

### 查看结果统计

1. 执行查询后，右侧面板会自动显示结果统计
2. 包括字段类型、数值统计、字符串统计等信息

### 调整面板宽度

- 拖拽左右面板之间的分隔线来调整宽度
- 支持 200px - 500px 的宽度范围

## 开发计划

- [ ] 集成 Monaco Editor 提供更好的 SQL 编辑体验
- [ ] 添加 ECharts 图表可视化
- [ ] 实现与 neug 引擎的后端接口对接
- [ ] 添加查询历史记录
- [ ] 支持查询结果导出为多种格式
- [ ] 添加数据库连接管理
- [ ] 实现查询性能分析

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进项目。

## 许可证

MIT License

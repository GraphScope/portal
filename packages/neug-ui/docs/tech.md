# neug WebUI 技术方案

## 1. 技术选型

- **构建工具**：Vite
- **前端框架**：React 18+
- **组件库**：shadcn/ui
- **样式方案**：Tailwind CSS
- **图表库**：echarts 或 @visx/visx（可选，负责右侧栏字段统计可视化）
- **SQL 编辑器**：monaco-editor 或 codemirror（支持 SQL 高亮、补全）
- **状态管理**：Zustand

## 2. 目录结构建议

- `src/components`：通用组件
- `src/layouts`：三栏布局
- `src/pages`：页面入口
- `src/features`：notebook、database、query、result 等业务模块
- `src/utils`：工具函数

## 3. 主要技术点

- **三栏自适应布局**：flex/grid 实现，支持拖拽调整宽度
- **Notebook/数据库树**：递归渲染、虚拟滚动优化
- **SQL 编辑器集成**：嵌入 monaco/codemirror，支持多 cell 独立实例
- **查询结果可视化**：字段分布统计、类型分布、简单图表
- **右侧栏联动**：根据当前激活 cell 自动展示对应结果统计
- **响应式与主题切换**：Tailwind + shadcn 支持

## 4. 其他

- 预留后端接口适配层，便于与 neug 引擎对接
- 支持插件/扩展能力

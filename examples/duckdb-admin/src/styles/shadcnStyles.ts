// Shadcn UI 风格的CSS覆盖样式
// 这些样式会通过useDynamicStyle注入到页面中
export const shadcnStyles = `
  /* 基础变量 - 用于增强shadcn风格 */
  :root {
    --radius: 0.5rem;
    --ring-color: rgba(15, 23, 42, 0.1);
  }

  /* 按钮样式增强 - 仅当使用shadcn主题时应用 */
  .shadcn-theme .ant-btn {
    font-weight: 500;
    transition: background-color 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
    letter-spacing: -0.01em;
    border-radius: 8px !important; /* 强制应用圆角 */
  }

  .shadcn-theme .ant-btn-sm {
    border-radius: 6px !important;
  }

  .shadcn-theme .ant-btn-lg {
    border-radius: 12px !important;
  }

  .shadcn-theme .ant-btn-primary {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .shadcn-theme .ant-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .shadcn-theme .ant-btn-primary:active {
    transform: translateY(0);
  }

  /* 输入框样式增强 */
  .shadcn-theme .ant-input, 
  .shadcn-theme .ant-input-number, 
  .shadcn-theme .ant-select .ant-select-selector {
    transition: border-color 0.2s, box-shadow 0.2s;
    border-radius: 8px !important; /* 强制应用圆角 */
  }
  
  .shadcn-theme .ant-input:hover, 
  .shadcn-theme .ant-input-number:hover, 
  .shadcn-theme .ant-select:hover .ant-select-selector {
    border-color: rgba(15, 23, 42, 0.3) !important;
  }
  
  .shadcn-theme .ant-input:focus, 
  .shadcn-theme .ant-input-number:focus, 
  .shadcn-theme .ant-select-focused .ant-select-selector {
    box-shadow: 0 0 0 2px var(--ring-color) !important;
    border-color: rgba(15, 23, 42, 0.5) !important;
  }

  /* 卡片样式增强 */
  .shadcn-theme .ant-card {
    border: 1px solid rgba(15, 23, 42, 0.05);
    overflow: hidden;
    border-radius: 12px !important; /* 强制应用圆角 */
  }

  .shadcn-theme .ant-card-head {
    border-bottom: 1px solid rgba(15, 23, 42, 0.07);
    font-weight: 600;
  }

  /* 表格样式增强 */
  .shadcn-theme .ant-table {
    border-radius: var(--radius);
    overflow: hidden;
  }

  .shadcn-theme .ant-table-thead > tr > th {
    background: transparent !important;
    font-weight: 600;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    color: rgba(15, 23, 42, 0.9);
  }

  .shadcn-theme .ant-table-cell {
    border-bottom: 1px solid rgba(15, 23, 42, 0.05) !important;
  }

  /* 标签页样式增强 */
  .shadcn-theme .ant-tabs-tab {
    transition: color 0.2s, background-color 0.2s;
    padding: 8px 12px;
  }

  .shadcn-theme .ant-tabs-tab:hover {
    color: rgba(15, 23, 42, 0.9);
  }

  .shadcn-theme .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    font-weight: 600;
  }

  .shadcn-theme .ant-tabs-ink-bar {
    height: 2px !important;
  }

  /* 下拉菜单样式增强 */
  .shadcn-theme .ant-dropdown-menu {
    border-radius: var(--radius);
    padding: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  }

  .shadcn-theme .ant-dropdown-menu-item {
    border-radius: calc(var(--radius) - 2px);
    padding: 6px 12px;
    transition: background-color 0.2s;
  }

  /* 复选框和单选框样式增强 */
  .shadcn-theme .ant-checkbox-checked .ant-checkbox-inner {
    border-color: currentColor;
    background-color: currentColor;
  }

  .shadcn-theme .ant-radio-checked .ant-radio-inner {
    border-color: currentColor;
  }

  .shadcn-theme .ant-radio-inner::after {
    background-color: currentColor;
  }

  /* 开关样式增强 */
  .shadcn-theme .ant-switch {
    background: rgba(15, 23, 42, 0.2);
  }

  .shadcn-theme .ant-switch-checked {
    background: currentColor;
  }

  /* 深色模式特殊调整 */
  .dark.shadcn-theme .ant-card {
    border-color: rgba(255, 255, 255, 0.08);
    background-color: #1e293b;
  }

  .dark.shadcn-theme .ant-table-thead > tr > th {
    color: rgba(248, 250, 252, 0.9);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .dark.shadcn-theme .ant-table-cell {
    border-bottom-color: rgba(255, 255, 255, 0.05) !important;
  }

  .dark.shadcn-theme .ant-input:hover, 
  .dark.shadcn-theme .ant-input-number:hover, 
  .dark.shadcn-theme .ant-select:hover .ant-select-selector {
    border-color: rgba(255, 255, 255, 0.3) !important;
  }

  .dark.shadcn-theme .ant-input:focus, 
  .dark.shadcn-theme .ant-input-number:focus, 
  .dark.shadcn-theme .ant-select-focused .ant-select-selector {
    border-color: rgba(255, 255, 255, 0.5) !important;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1) !important;
  }

  .dark.shadcn-theme .ant-btn {
    border-color: rgba(255, 255, 255, 0.12);
  }

  /* 设置特有样式 */
  .shadcn-theme .settings-card {
    border-radius: var(--radius);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s;
  }

  .shadcn-theme .settings-card:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  }
`;

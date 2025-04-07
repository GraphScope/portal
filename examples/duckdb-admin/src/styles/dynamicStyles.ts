// 定义全局样式
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap');

  body {
    font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f8fafc;
    color: #0f172a;
  }

  .app-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .header {
    background-color: #1a1a1e;
    color: white;
    padding: 16px 0;
    margin-bottom: 20px;
    box-shadow:
      0 1px 3px 0 rgba(0, 0, 0, 0.1),
      0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 24px;
    font-weight: 600;
    font-family: 'Geist', sans-serif;
  }

  .nav {
    display: flex;
    gap: 16px;
  }

  .nav a {
    color: white;
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 6px;
    transition: background-color 0.2s;
    font-family: 'Geist', sans-serif;
    font-weight: 500;
  }

  .nav a:hover {
    background-color: rgba(255, 255, 255, 0.1);
    text-decoration: none;
  }

  .card {
    background: white;
    border-radius: 8px;
    box-shadow:
      0 1px 3px 0 rgba(0, 0, 0, 0.1),
      0 1px 2px 0 rgba(0, 0, 0, 0.06);
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid #e2e8f0;
  }

  .table-container {
    overflow-x: auto;
    max-height: 400px;
    overflow-y: auto;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
    font-family: 'Geist', sans-serif;
  }

  th {
    background-color: #f8fafc;
    font-weight: 500;
    color: #0f172a;
  }

  .query-editor {
    width: 100%;
    min-height: 120px;
    font-family: 'Geist Mono', monospace;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    margin-bottom: 16px;
    resize: vertical;
    background-color: #ffffff;
    color: #0f172a;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }

  .query-editor:focus {
    outline: none;
    border-color: #1a1a1e;
    box-shadow: 0 0 0 2px rgba(26, 26, 30, 0.2);
  }

  .button-group {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  /* 为 Ant Design 组件添加 Geist 字体 */
  .ant-btn, .ant-input, .ant-select, .ant-table, .ant-modal, .ant-form, .ant-card {
    font-family: 'Geist', sans-serif;
  }
`;

// 可以根据需要添加更多特定组件的样式

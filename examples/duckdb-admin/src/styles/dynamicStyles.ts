// 定义全局样式
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap');

  body {
    font-family: 'Geist', -apple-system, BlinkSans, sans-serif;
    margin: 0;
    padding: 0;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* 明暗主题基本颜色 - 与shadcn主题保持一致 */
  body {
    background-color: #ffffff;
    color: #0f172a;
  }

  body.dark {
    background-color: #0f172a;
    color: #f8fafc;
  }

  .app-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .header {
    background-color: #0f172a;
    color: white;
    padding: 16px 0;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    transition: background-color 0.3s ease;
  }

  .dark .header {
    background-color: #0c1322;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
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
    border-radius: 0.5rem;
    transition: background-color 0.2s;
    font-family: 'Geist', sans-serif;
    font-weight: 500;
  }

  .nav a:hover {
    background-color: rgba(255, 255, 255, 0.1);
    text-decoration: none;
  }

  .table-container {
    overflow-x: auto;
    max-height: 400px;
    overflow-y: auto;
    border-radius: 0.5rem;
    transition: border-color 0.3s ease;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 12px 16px;
    text-align: left;
    font-family: 'Geist', sans-serif;
    transition: border-color 0.3s ease, color 0.3s ease, background-color 0.3s ease;
  }

  .query-editor {
    width: 100%;
    min-height: 120px;
    font-family: 'Geist Mono', monospace;
    padding: 12px;
    border-radius: 0.5rem;
    margin-bottom: 16px;
    resize: vertical;
    transition: border-color 0.2s, box-shadow 0.2s, background-color 0.3s ease, color 0.3s ease;
  }

  .button-group {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  /* 设置页面样式 */
  .settings-card {
    margin-bottom: 20px;
  }

  .setting-item {
    margin-bottom: 24px;
  }

  .theme-switch {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  /* 链接样式 */
  a {
    color: #0f172a;
    text-decoration: none;
    transition: color 0.2s;
  }

  a:hover {
    text-decoration: underline;
  }

  .dark a {
    color: #f8fafc;
  }

  /* 平滑过渡效果 */
  * {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
`;

// 可以根据需要添加更多特定组件的样式

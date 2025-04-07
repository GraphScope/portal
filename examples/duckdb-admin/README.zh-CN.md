# DuckDB CSV 查询工具

一个基于 DuckDB-WASM 构建的强大浏览器端 CSV 数据查询工具。该工具允许您直接在浏览器中使用 SQL 管理和查询 CSV 数据集，无需服务器支持。

## ✨ 功能特点

- 📊 上传和管理多个 CSV 数据集
- 🔍 使用标准 SQL 查询数据
- 💾 浏览器端持久化存储
- 📤 导出结果为 CSV、JSON 或 TSV 格式
- 🚀 完全在浏览器中运行
- 🔒 注重隐私：所有数据都保存在浏览器中

## 🚀 快速开始

```bash
npm run dev
```

访问 `http://localhost:3000` 开始使用应用。

## 🛠️ 技术栈

- **DuckDB-WASM** - 在浏览器中运行的 SQL 数据库
- **React** - 用户界面框架
- **Ant Design** - UI 组件库
- **IndexedDB** - 用于持久化存储数据
- **Web Workers** - 用于在后台处理数据

### SQL 示例

以下是一些实用的 SQL 查询示例：

```sql
-- 带限制的基本查询
SELECT * FROM "my_dataset" LIMIT 100;

-- 数据筛选
SELECT * FROM "my_dataset" WHERE column_name > 100;

-- 分组聚合
SELECT category, COUNT(*) as count, AVG(value) as average
FROM "my_dataset"
GROUP BY category
ORDER BY count DESC;

-- 多数据集连接
SELECT a.*, b.additional_column
FROM "dataset_a" a
JOIN "dataset_b" b ON a.id = b.id;
```

## 🔒 数据安全与隐私

- 所有数据都存储在本地浏览器中
- 不会上传数据到任何服务器
- 数据持久化由浏览器的 IndexedDB 处理
- 清除浏览器数据会导致存储的数据集丢失

## 🙏 致谢

- [DuckDB](https://duckdb.org/) - 让这一切成为可能的优秀 SQL 数据库
- [React](https://reactjs.org/) - 用户界面框架
- [Ant Design](https://ant.design/) - UI 组件库

# DuckDB CSV 查询工具

这是一个基于 DuckDB-WASM 的 CSV 数据查询工具，支持数据集管理和持久化存储。您可以上传 CSV 文件，然后使用 SQL 查询您的数据。

## 功能特点

- 上传和管理多个 CSV 数据集
- 使用 SQL 查询您的数据
- 数据在浏览器中持久化存储
- 导出查询结果为 CSV、JSON 或 TSV 格式
- 完全在浏览器中运行，无需服务器

## 技术实现

- **DuckDB-WASM** - 在浏览器中运行的 SQL 数据库
- **React** - 用户界面框架
- **Ant Design** - UI 组件库
- **IndexedDB** - 用于持久化存储数据
- **Web Workers** - 用于在后台处理数据

## 使用说明

### 数据集管理

1. 前往"数据集"页面
2. 点击"上传新数据集"按钮
3. 为您的数据集提供一个唯一的名称
4. 选择要上传的 CSV 文件
5. 点击"上传"按钮

### 查询数据

1. 前往"查询"页面
2. 从下拉菜单中选择一个数据集
3. 在查询编辑器中输入您的 SQL 查询
4. 点击"执行查询"按钮
5. 在"结果"标签页中查看查询结果
6. 根据需要导出结果

### SQL 示例

以下是一些您可能会用到的 SQL 查询示例：

```sql
-- 基本查询
SELECT * FROM "my_dataset" LIMIT 100;

-- 筛选数据
SELECT * FROM "my_dataset" WHERE column_name > 100;

-- 聚合查询
SELECT category, COUNT(*) as count, AVG(value) as average
FROM "my_dataset"
GROUP BY category
ORDER BY count DESC;

-- 连接查询（多个数据集）
SELECT a.*, b.additional_column
FROM "dataset_a" a
JOIN "dataset_b" b ON a.id = b.id;
```

## 数据安全

所有数据都存储在您的浏览器中，不会上传到任何服务器。数据使用浏览器的 IndexedDB 存储机制进行持久化存储。清除浏览器数据会导致存储的数据集丢失。

# DuckDB CSV Query Tool

A powerful browser-based CSV data query tool built with DuckDB-WASM. This tool allows you to manage and query your CSV datasets directly in the browser using SQL, with no server required.

## Features

- 🚀 Runs completely in the browser with no server required
- 📊 Upload and query CSV files
- 📝 Write and execute SQL queries
- 💾 Save datasets for later use
- 📥 Export query results as CSV, JSON, or TSV
- 🌐 Multi-language interface support
- 📁 Support for multiple tables within a dataset, matching SQL user expectations
- 🔍 Query data using standard SQL
- 🔒 Privacy-focused: all data stays in your browser

## 🛠️ Development

## 🚀 Quick Start

```bash
npm run dev

```

Navigate to `http://localhost:3000` to start using the application.

## 🛠️ Technical Stack

- **DuckDB-WASM** - SQL database running in the browser
- **React** - User interface framework
- **Ant Design** - UI component library
- **IndexedDB** - For persistent data storage
- **Web Workers** - For background data processing

### SQL Examples

Here are some useful SQL query examples:

```sql
-- Basic query with limit
SELECT * FROM "my_dataset" LIMIT 100;

-- Filter data
SELECT * FROM "my_dataset" WHERE column_name > 100;

-- Aggregation with grouping
SELECT category, COUNT(*) as count, AVG(value) as average
FROM "my_dataset"
GROUP BY category
ORDER BY count DESC;

-- Join multiple datasets
SELECT a.*, b.additional_column
FROM "dataset_a" a
JOIN "dataset_b" b ON a.id = b.id;
```

## 🔒 Data Security & Privacy

- All data is stored locally in your browser
- No data is uploaded to any server
- Data persistence is handled by browser's IndexedDB
- Clearing browser data will remove stored datasets

## 🙏 Acknowledgments

- [DuckDB](https://duckdb.org/) - The amazing SQL database that makes this possible
- [React](https://reactjs.org/) - The UI framework
- [Ant Design](https://ant.design/) - The UI component library

# DuckDB CSV Query Tool

A browser-based CSV data query tool built with DuckDB-WASM, supporting dataset management and persistent storage. You can upload CSV files and query your data using SQL.

## Features

- Upload and manage multiple CSV datasets
- Query your data using SQL
- Persistent storage in the browser
- Export query results in CSV, JSON, or TSV formats
- Runs entirely in the browser, no server required

## Technical Stack

- **DuckDB-WASM** - SQL database running in the browser
- **React** - User interface framework
- **Ant Design** - UI component library
- **IndexedDB** - For persistent data storage
- **Web Workers** - For background data processing

## Getting Started

### Dataset Management

1. Navigate to the "Datasets" page
2. Click the "Upload New Dataset" button
3. Provide a unique name for your dataset
4. Select the CSV file to upload
5. Click the "Upload" button

### Querying Data

1. Go to the "Query" page
2. Select a dataset from the dropdown menu
3. Enter your SQL query in the query editor
4. Click the "Execute Query" button
5. View the results in the "Results" tab
6. Export results as needed

### SQL Examples

Here are some SQL query examples you might find useful:

```sql
-- Basic query
SELECT * FROM "my_dataset" LIMIT 100;

-- Filter data
SELECT * FROM "my_dataset" WHERE column_name > 100;

-- Aggregation query
SELECT category, COUNT(*) as count, AVG(value) as average
FROM "my_dataset"
GROUP BY category
ORDER BY count DESC;

-- Join query (multiple datasets)
SELECT a.*, b.additional_column
FROM "dataset_a" a
JOIN "dataset_b" b ON a.id = b.id;
```

## Data Security

All data is stored in your browser and is not uploaded to any server. Data is persisted using the browser's IndexedDB storage mechanism. Clearing browser data will result in the loss of stored datasets.

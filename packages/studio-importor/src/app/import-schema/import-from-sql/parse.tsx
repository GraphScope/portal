//@ts-nocheck
/**
 * Convert SQL DDL to Property Graph structure
 * @param {string} sqlDDL - The SQL DDL string
 * @returns {object} - The property graph structure
 */
export function convertDDLToPropertyGraph(sqlDDL) {
  const tableRegex = /CREATE TABLE (\w+)\s*\(([^;]+)\);/gi;
  const columnRegex = /(\w+)\s+([\w()]+(?:\s+NOT NULL|\s+UNIQUE|\s+DEFAULT\s+\S+|\s+CHECK\s*\(.*?\))?)/gi;
  const primaryKeyRegex = /PRIMARY KEY\s*\(([^)]+)\)/i;
  const foreignKeyRegex = /FOREIGN KEY\s*\(([^)]+)\)\s*REFERENCES\s*(\w+)\s*\(([^)]+)\)/gi;
  const indexRegex = /CREATE INDEX\s*(\w+)\s*ON\s*(\w+)\s*\(([^)]+)\);/gi;

  const propertyGraph = {
    nodes: [],
    edges: [],
  };

  const tables = {};

  let match;
  while ((match = tableRegex.exec(sqlDDL)) !== null) {
    const tableName = match[1];
    const columnsString = match[2];

    const tableNode = {
      id: tableName,
      label: 'table',
      properties: {},
      primaryKey: [],
      foreignKeys: [],
      indexes: [],
    };

    let columnMatch;
    while ((columnMatch = columnRegex.exec(columnsString)) !== null) {
      const columnName = columnMatch[1];
      const columnType = columnMatch[2].split(' ')[0];
      const constraints = columnMatch[2].split(' ').slice(1).join(' ');

      tableNode.properties[columnName] = {
        type: columnType,
        constraints: constraints,
      };
    }

    const primaryKeyMatch = primaryKeyRegex.exec(columnsString);
    if (primaryKeyMatch) {
      tableNode.primaryKey = primaryKeyMatch[1].split(',').map(col => col.trim());
    }

    let foreignKeyMatch;
    while ((foreignKeyMatch = foreignKeyRegex.exec(columnsString)) !== null) {
      const foreignKey = {
        columns: foreignKeyMatch[1].split(',').map(col => col.trim()),
        references: {
          table: foreignKeyMatch[2],
          columns: foreignKeyMatch[3].split(',').map(col => col.trim()),
        },
      };
      tableNode.foreignKeys.push(foreignKey);
    }

    tables[tableName] = tableNode;
    propertyGraph.nodes.push(tableNode);
  }

  while ((match = indexRegex.exec(sqlDDL)) !== null) {
    const indexName = match[1];
    const tableName = match[2];
    const columns = match[3].split(',').map(col => col.trim());

    if (tables[tableName]) {
      tables[tableName].indexes.push({ name: indexName, columns });
    }
  }

  for (const tableName in tables) {
    const tableNode = tables[tableName];

    tableNode.foreignKeys.forEach(fk => {
      fk.columns.forEach((col, index) => {
        const targetTable = fk.references.table;
        const targetColumn = fk.references.columns[index];

        propertyGraph.edges.push({
          source: tableNode.id,
          target: targetTable,
          fromColumn: col,
          toColumn: targetColumn,
          type: 'foreign_key',
        });
      });
    });
  }

  return propertyGraph;
}

// Example usage
const sqlDDL = `
CREATE TABLE users (
    id INT NOT NULL,
    name VARCHAR(100) UNIQUE,
    email VARCHAR(100) NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (id),
    CHECK (email LIKE '%@%')
);
CREATE TABLE orders (
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (order_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_user_email ON users (email);
`;

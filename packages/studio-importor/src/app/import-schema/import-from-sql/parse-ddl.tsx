import { Parser } from 'sql-ddl-to-json-schema';
const parser = new Parser('mysql');
export function schemaToPropertyGraph(SQL_DDL) {
  const compactJsonTablesArray = parser.feed(SQL_DDL).toCompactJson(parser.results);
  const nodes: any[] = [];
  const edges: any[] = [];
  const sourceColumns = ['src', 'source', 'src_id'];
  const targetColumns = ['dst', 'target', 'dst_id'];
  compactJsonTablesArray.forEach(table => {
    const { name, columns, primaryKey, foreignKeys } = table;
    const isEdge = foreignKeys?.length === 2 && primaryKey?.columns?.length === 2;
    if (isEdge) {
      //@ts-ignore
      const source = foreignKeys.find(fk => sourceColumns.includes(fk.columns[0].column));
      //@ts-ignore
      const target = foreignKeys.find(fk => targetColumns.includes(fk.columns[0].column));
      const edge = {
        id: name,
        label: name,
        source: source?.reference.table,
        target: target?.reference.table,
        properties: columns,
        primaryKey,
      };
      edges.push(edge);
    } else {
      const node = {
        id: name,
        label: name,
        properties: columns,
        primaryKey,
      };
      nodes.push(node);
    }
  });
  return {
    nodes,
    edges,
  };
}

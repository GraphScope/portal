import { Parser } from 'sql-ddl-to-json-schema';

const parser = new Parser('mysql');
import { uuid } from 'uuidv4';
import { parseFile } from './parseCSV';
import type { ParsedFile } from './parseCSV';

export async function parseSQL(file: File): Promise<ParsedFile[]> {
  const SQL_DDL = await parseFile(file);
  const compactJsonTablesArray = parser.feed(SQL_DDL).toCompactJson(parser.results);
  const sourceColumns = ['src', 'source', 'src_id'];
  const targetColumns = ['dst', 'target', 'dst_id'];

  const tables = compactJsonTablesArray.map(table => {
    return table.name;
  });
  const files: ParsedFile[] = compactJsonTablesArray.map(table => {
    const { name, columns, primaryKey, foreignKeys } = table;
    const inferredEdgeType = foreignKeys?.length === 2 && primaryKey?.columns?.length === 2;

    const inferredSource = (foreignKeys || []).find(fk => {
      const column = fk && fk.columns && fk.columns[0] && fk.columns[0].column;
      if (column) {
        return sourceColumns.includes(column);
      }
      return {};
    });
    const inferredTarget = (foreignKeys || []).find(fk => {
      const column = fk && fk.columns && fk.columns[0] && fk.columns[0].column;
      if (column) {
        return targetColumns.includes(column);
      }
      return {};
    });
    const sourceField = inferredSource?.reference.table;
    const targetField = inferredTarget?.reference.table;
    return {
      id: uuid(),
      meta: {
        size: 'table',
        header: tables,
        delimiter: '',
        name,
        graphFields: {
          idField: name,
          type: inferredEdgeType ? 'Edge' : 'Vertex',
          sourceField,
          targetField,
        },
      },
      contents: columns,
    };
  });
  return files;
}

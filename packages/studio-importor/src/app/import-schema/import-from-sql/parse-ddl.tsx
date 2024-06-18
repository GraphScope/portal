import { Parser } from 'sql-ddl-to-json-schema';
const parser = new Parser('mysql');
import type { ParsedFile } from '../import-from-csv/parseCSV';
import { ISchemaEdge, ISchemaNode } from '../../typing';
import { uuid } from 'uuidv4';

export const parseFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // 以文本形式读取文件
    reader.readAsText(file);
    // 监听读取完成事件
    reader.onload = function (event) {
      // 读取文件内容
      if (event) {
        const contents = event.target!.result as string;
        resolve(contents);
      }
    };
    // 监听读取失败事件
    reader.onerror = function (event) {
      reject([event.target!.error]);
    };
  });
};

export function getTablesBySql(SQL_DDL): ParsedFile[] {
  const compactJsonTablesArray = parser.feed(SQL_DDL).toCompactJson(parser.results);
  const nodes: any[] = [];
  const edges: any[] = [];
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
      id: name,
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
      contents: SQL_DDL,
      data: columns,
    };
  });
  return files;
}

export const covertSchemaByTables = (tables: ParsedFile[]) => {
  const nodes: ISchemaNode[] = [];
  const edges: ISchemaEdge[] = [];
  tables.forEach(table => {
    const { meta, data, id } = table;
    const { graphFields } = meta;
    const { type, sourceField, targetField } = graphFields;
    if (type === 'Vertex') {
      nodes.push({
        id,
        position: {
          x: 0,
          y: 0,
        },
        data: {
          label: id,
          properties: (data || []).map(item => {
            const { name, type } = item;
            return {
              name,
              type: type.datatype,
              key: uuid(),
              disable: false,
              primaryKey: false,
            };
          }),
        },
      });
    }
    if (type === 'Edge') {
      edges.push({
        id: uuid(),
        source: sourceField || '',
        target: targetField || '',
        data: {
          label: id,
          properties: (data || []).map(item => {
            const { name, type } = item;
            return {
              name,
              type: type.datatype,
              key: uuid(),
              disable: false,
              primaryKey: false,
            };
          }),
        },
      });
    }
  });
  return { nodes, edges };
};

import type { ParsedFile } from '@graphscope/studio-components';
import { ISchemaEdge, ISchemaNode } from '../../typing';
import { v4 as uuidv4 } from 'uuid';

export const covertSchemaByTables = (tables: ParsedFile[]) => {
  const nodes: ISchemaNode[] = [];
  const edges: ISchemaEdge[] = [];
  tables.forEach(table => {
    const { meta, contents, id } = table;
    const { graphFields } = meta;
    const { type, sourceField, targetField } = graphFields;
    const data = JSON.parse(contents) || [];
    if (type === 'Vertex') {
      nodes.push({
        id,
        position: {
          x: 0,
          y: 0,
        },
        data: {
          label: id,
          properties: data.map(item => {
            const { name, type } = item;
            return {
              name,
              type: type.datatype,
              key: uuidv4(),
              disable: false,
              primaryKey: false,
            };
          }),
        },
      });
    }
    if (type === 'Edge') {
      edges.push({
        id: uuidv4(),
        source: sourceField || '',
        target: targetField || '',
        data: {
          label: id,
          properties: data.map(item => {
            const { name, type } = item;
            return {
              name,
              type: type.datatype,
              key: uuidv4(),
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

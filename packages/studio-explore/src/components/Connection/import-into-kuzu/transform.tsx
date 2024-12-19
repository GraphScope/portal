import { ParsedFile } from '@graphscope/studio-components';
import type { GraphSchema } from '@graphscope/studio-graph';
type IMeta = ParsedFile['meta'];
const DATA_TYPE_MAPPING = {
  number: 'DT_DOUBLE',
  string: 'DT_STRING',
};
interface ISchema {
  nodes: {
    meta: IMeta;
    properties: {
      name: string;
      type: string;
    }[];
    label: string;
  }[];
  edges: {
    source: string;
    target: string;
    meta: IMeta;
    properties: {
      name: string;
      type: string;
    }[];
    label: string;
  }[];
}
export const transform = (schemaData: ISchema): GraphSchema => {
  const nodes = schemaData.nodes.map(item => {
    const { label, properties, meta } = item;
    const { idField } = meta.graphFields;
    return {
      label: label,
      meta,
      properties: properties.map(p => {
        const { name, type } = p;
        const IS_PK = idField === name;
        const dataType = DATA_TYPE_MAPPING[type];
        return {
          name,
          type: dataType === 'DT_DOUBLE' && IS_PK ? 'DT_SIGNED_INT64' : dataType,
          primaryKey: IS_PK,
        };
      }),
    };
  });

  const edges = schemaData.edges.map(item => {
    const { label, properties, source, target, meta } = item;
    const { sourceField, targetField } = meta.graphFields;

    return {
      label,
      source,
      target,

      properties: properties
        .map(p => {
          const { name, type } = p;
          /**
           * TODO：目前 interactive 边的属性支持的数量只有一个，因此这里需要先把source和target从属性中过滤
           */
          const IS_PK = sourceField === name || targetField === name;
          if (IS_PK) {
            return null;
          }
          return {
            name,
            type: IS_PK ? 'DT_SIGNED_INT32' : DATA_TYPE_MAPPING[type],
            primaryKey: false,
          };
        })
        .filter(
          (
            item,
          ): item is {
            name: string;
            type: any;
            key: string;
            disable: boolean;
            primaryKey: boolean;
          } => {
            return item !== null;
          },
        ),
    };
  });
  return {
    nodes,
    edges,
  };
};

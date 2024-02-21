import { GraphApiFactory } from '@graphscope/studio-server';

type IProperty = {
  key: string;
  property_id: string;
  property_name: string;
  property_type: {
    primitive_type: string;
  };
  columntype: number;
};

type ISchemaType = {
  type_name: string;
  type_id: string;
  properties: IProperty[];
  primary_keys: string[];
};
export const getSchema = async (pramas: string) => {
  const schema = await GraphApiFactory(undefined, location.origin)
    .getSchema(pramas)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });
  const { vertex_types, edge_types } = schema;

  const nodes = vertex_types.map((item: ISchemaType) => {
    const { type_name, type_id, properties, primary_keys } = item;
    const types = properties.map(v => {
      const { property_id, property_type, property_name } = v;
      return {
        key: property_id,
        properties: property_name,
        type: property_type.primitive_type,
        main_key: primary_keys.includes(property_name),
        columntype: 0,
      };
    });
    return {
      key: type_id,
      label: type_name,
      datatype: 'ODPS',
      filelocation: 'nodes',
      isBind: false,
      properties: types,
    };
  });
  const edges = edge_types.map((item: ISchemaType) => {
    const { type_name, type_id, properties } = item;
    const types = properties.map(v => {
      const { property_id, property_type, property_name } = v;
      return {
        key: property_id,
        properties: property_name,
        type: property_type.primitive_type,
        main_key: true,
        columntype: 0,
      };
    });
    return {
      key: type_id,
      label: type_name,
      datatype: 'ODPS',
      filelocation: 'nodes1',
      isBind: false,
      properties: types,
    };
  });

  return { nodes, edges };
};

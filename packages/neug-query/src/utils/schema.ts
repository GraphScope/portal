interface Property {
  property_id: number;
  property_name: string;
  property_type: any;
}

interface VertexType {
  primary_keys: string[];
  properties: Property[];
  type_id: number;
  type_name: string;
}

interface VertexTypePairRelation {
  destination_vertex: string;
  relation: string;
  source_vertex: string;
}

interface EdgeType {
  properties?: Property[];
  type_id: number;
  type_name: string;
  vertex_type_pair_relations: VertexTypePairRelation[];
}

interface TransformedNode {
  label: string;
  properties: { name: string; type: string }[];
  primary: string;
}

interface TransformedEdge {
  label: string;
  properties: { name: string; type: string }[];
  primary: string;
  constraints: [string, string][];
}

interface TransformedSchema {
  nodes: TransformedNode[];
  edges: TransformedEdge[];
}

export function transformSchema(originalSchema: {
  vertex_types: VertexType[];
  edge_types: EdgeType[];
}): TransformedSchema {
  const transformNode = (vertexType: VertexType): TransformedNode => ({
    label: vertexType.type_name,
    properties: vertexType.properties.map(({ property_name, property_type }) => ({
      name: property_name,
      type: 'primitive_type' in property_type ? property_type.primitive_type : 'DT_STRING',
    })),
    primary: vertexType.primary_keys[0],
  });

  const transformEdge = (edgeType: EdgeType): TransformedEdge => ({
    label: edgeType.type_name,
    properties: (edgeType.properties || []).map(({ property_name, property_type }) => ({
      name: property_name,
      type: 'primitive_type' in property_type ? property_type.primitive_type : 'DT_STRING',
    })),
    primary: edgeType.type_name,
    constraints: edgeType.vertex_type_pair_relations.map(({ source_vertex, destination_vertex }) => [
      source_vertex,
      destination_vertex,
    ]),
  });

  const transformedSchema: TransformedSchema = {
    nodes: originalSchema.vertex_types.map(transformNode),
    edges: originalSchema.edge_types.map(transformEdge),
  };

  return transformedSchema;
}

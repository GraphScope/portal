import { useCallback, useEffect } from 'react';
import { useNodeStore } from '../../stores/useNodeStore';
import { Property } from '../../types/property';
import _ from 'lodash';
import { useEdgeStore } from '../../stores/useEdgeStore';
import { Node } from '../../types/node';

// 目前 GPE 只设计 model.json
export const useEncodeCypher = () => {
  const nodes = useNodeStore(state => state.nodes);
  const editNode = useNodeStore(state => state.editNode);
  const edges = useEdgeStore(state => state.edges);
  const editEdge = useEdgeStore(state => state.editEdge);

  const encodeProperties = useCallback(() => {
    nodes.forEach((node: Node) => {
      const newProperties =
        node.properties &&
        node.properties.map((property: Property) => {
          return {
            ...property,
            statement: `${property.name} ${property.compare} ${property.value}`,
          };
        });
      const isEqual = _.isEqual(node.properties, newProperties);
      !isEqual && editNode && editNode({ ...node, properties: newProperties });
    });
  }, [nodes]);

  const encodeNodes = useCallback(() => {
    nodes.forEach(node => {
      const newStatement = node.data.data.label && `:${node.data.data.label}`;
      newStatement && editNode && editNode({ ...node, statement: newStatement });
    });
  }, [nodes]);

  const encodeEdges = useCallback(() => {
    edges.forEach(edge => {
      // @ts-ignore
      const newStatement = edge.data.data.label && `:${edge.data.data.label}`;
      newStatement && editEdge && editEdge({ ...edge, statement: newStatement });
    });
  }, [edges]);

  return {
    encodeProperties,
    encodeNodes,
    encodeEdges,
  };
};

import { useCallback } from 'react';
import { useNodeStore } from '../../stores/useNodeStore';
import { Property } from '../../types/property';
import _ from 'lodash';
import { useEdgeStore } from '../../stores/useEdgeStore';
import { Node } from '../../types/node';
import { Edge } from '../../types/edge';
import { isArrayExist } from '../../utils';
import { encodeNodes, encodeEdges, generateMATCH, generateWHERE, encodeProperties } from '../../utils/encode';

// 目前 GPE 只设计 model.json
export const useEncodeCypher = () => {
  const nodes = useNodeStore(state => state.nodes);
  const editNode = useNodeStore(state => state.editNode);
  const edges = useEdgeStore(state => state.edges);
  const editEdge = useEdgeStore(state => state.editEdge);

  const updateNodeProperties = useCallback(() => {
    const editProperties = (node: Node, pre: Property[], current: Property[]) => {
      const isEqual = _.isEqual(pre, current);
      !isEqual && editNode && editNode({ ...node, properties: current });
    };

    encodeProperties(nodes, editProperties);
  }, [nodes]);

  const updateNodeStatements = useCallback(() => {
    const editNodeStatement = (pre: Node, current: Node) => {
      const isEqual = _.isEqual(pre.statement, current.statement);
      !isEqual && editNode && editNode({ ...current });
    };

    encodeNodes(nodes, editNodeStatement);
  }, [nodes]);

  const updateEdgeStatements = useCallback(() => {
    const editEdgeStatement = (pre: Edge, current: Edge) => {
      const isEqual = _.isEqual(pre.statement, current.statement);
      !isEqual && editEdge && editEdge({ ...current });
    };

    encodeEdges(edges, editEdgeStatement);
  }, [edges]);

  const createMatchClauses = useCallback(() => {
    return generateMATCH(nodes, edges);
  }, [nodes, edges]);

  const createWhereClause = useCallback(() => {
    return generateWHERE(nodes);
  }, [nodes]);

  return {
    encodeProperties: updateNodeProperties,
    encodeNodes: updateNodeStatements,
    encodeEdges: updateEdgeStatements,
    generateMATCH: createMatchClauses,
    generateWHERE: createWhereClause,
  };
};

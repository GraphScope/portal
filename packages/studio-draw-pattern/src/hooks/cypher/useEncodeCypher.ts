import { useCallback } from 'react';
import { useNodeStore } from '../../stores/useNodeStore';
import { Properties, Property } from '../../types/property';
import _ from 'lodash';
import { useEdgeStore } from '../../stores/useEdgeStore';
import { Node } from '../../types/node';
import { Edge } from '../../types/edge';
import { encodeNodes, encodeEdges, generateMATCH, generateWHERE, encodeProperties } from '../../utils/encode';
import { usePropertiesStore } from '../../stores/usePropertiesStore';

// 目前 GPE 只设计 model.json
export const useEncodeCypher = () => {
  const nodes = useNodeStore(state => state.nodes);
  const editNode = useNodeStore(state => state.editNode);
  const edges = useEdgeStore(state => state.edges);
  const editEdge = useEdgeStore(state => state.editEdge);
  const properties = usePropertiesStore(state => state.properties);
  const editPropertiesStore = usePropertiesStore(state => state.editProperties);
  const addVariableForNode = useNodeStore(state => state.addVariableForNode);

  const updateNodeProperties = useCallback(() => {
    const editProperties = (changeProperties: Properties, pre: Property[], current: Property[]) => {
      const isEqual = _.isEqual(pre, current);
      !isEqual && editPropertiesStore({ ...changeProperties, data: current });
    };

    encodeProperties(editProperties, properties);
  }, [nodes, properties]);

  const updateNodeStatements = useCallback(() => {
    let count = 0;

    const editNodeStatement = (pre: Node, current: Node) => {
      const isEqual = _.isEqual(pre.statement, current.statement);
      let newVariableName = `n${count}`;

      addVariableForNode && addVariableForNode(current.nodeKey, newVariableName);

      !isEqual && editNode && editNode({ ...current });

      count++;
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
    return generateWHERE(nodes, properties);
  }, [nodes, properties]);

  return {
    encodeProperties: updateNodeProperties,
    encodeNodes: updateNodeStatements,
    encodeEdges: updateEdgeStatements,
    generateMATCH: createMatchClauses,
    generateWHERE: createWhereClause,
  };
};

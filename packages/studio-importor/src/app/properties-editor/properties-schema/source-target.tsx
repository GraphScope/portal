import * as React from 'react';

import { Typography, Input, Flex } from 'antd';
import { MappingFields } from '@graphscope/studio-components';
import { useContext } from '../../useContext';
import useModel from './useModel';
import type { ISchemaEdge, ImportorProps, IEdgeData } from '../../typing';
type ISourceTargetProps = {
  mappingColumn: ImportorProps['mappingColumn'];
  source_vertex_fields: IEdgeData['source_vertex_fields'];
  target_vertex_fields: IEdgeData['target_vertex_fields'];
} & Pick<ISchemaEdge, 'source' | 'target' | 'id'>;

// Constants for field names
const SOURCE_VERTEX_FIELDS = 'source_vertex_fields';
const TARGET_VERTEX_FIELDS = 'target_vertex_fields';

// Extracted and memoized outside the component to avoid re-creation on each render
const getLabelById = (nodes, source, target) => {
  const sourceNode = nodes.find(node => node.id === source);
  const targetNode = nodes.find(node => node.id === target);

  return {
    source_label: sourceNode?.data.label,
    target_label: targetNode?.data.label,
    target_primary_key: targetNode?.data.properties.find(prop => prop.primaryKey)?.name,
    source_primary_key: sourceNode?.data.properties.find(prop => prop.primaryKey)?.name,
  };
};

const SourceTarget: React.FunctionComponent<ISourceTargetProps> = props => {
  const { id, source, target, mappingColumn, source_vertex_fields, target_vertex_fields } = props;
  const { store } = useContext();
  const { nodes } = store;
  const { handleDataFieldsChange } = useModel({ type: 'edges', id });
  // Memoize the result of getLabelById to avoid unnecessary computations
  const { source_label, target_label, source_primary_key, target_primary_key } = React.useMemo(
    () => getLabelById(nodes, source, target),
    [nodes, source, target],
  );

  return (
    <>
      <Flex justify="space-between" gap="12px" align="center">
        <Flex vertical gap="small" flex="1">
          <Typography.Text>Source</Typography.Text>
          <Input value={source_label} disabled size="small" />
        </Flex>
        {mappingColumn && (
          <Flex vertical gap="small">
            <Typography.Text>Data Fields</Typography.Text>
            <MappingFields
              value={source_vertex_fields}
              onChange={val => handleDataFieldsChange(val, SOURCE_VERTEX_FIELDS, source_primary_key)}
              mappingColumn={mappingColumn}
            />
          </Flex>
        )}
      </Flex>
      <Flex justify="space-between" gap="12px" style={{ marginTop: '4px' }}>
        <Flex vertical gap="small" flex="1">
          <Typography.Text>Target</Typography.Text>
          <Input value={target_label} disabled size="small" />
        </Flex>
        {mappingColumn && (
          <Flex vertical gap="small">
            <Typography.Text>Data Fields</Typography.Text>
            <MappingFields
              value={target_vertex_fields}
              onChange={val => handleDataFieldsChange(val, TARGET_VERTEX_FIELDS, target_primary_key)}
              mappingColumn={mappingColumn}
            />
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default SourceTarget;

import * as React from 'react';

import { Typography, Input, Flex } from 'antd';
import { MappingFields } from '@graphscope/studio-components';
import { useContext } from '../../useContext';
import useModel from './useModel';
import type { ISchemaEdge, ImportorProps, IEdgeData } from '../../typing';
type ISourceTargetProps = {
  isUpload: boolean;
  mappingColumn: ImportorProps['mappingColumn'];
  source_vertex_fields: IEdgeData['source_vertex_fields'];
  target_vertex_fields: IEdgeData['target_vertex_fields'];
} & Pick<ISchemaEdge, 'source' | 'target' | 'id'>;

const getLabelById = (nodes, source, target) => {
  let source_label, target_label;
  let source_primary_key, target_primary_key;
  nodes.forEach(item => {
    if (item.id === source) {
      source_label = item.data.label;
      source_primary_key = item.data.properties.find(item => {
        return item.primaryKey;
      });
    }
    if (item.id === target) {
      target_label = item.data.label;
      target_primary_key = item.data.properties.find(item => {
        return item.primaryKey;
      });
    }
  });
  return {
    source_label,
    target_label,
    target_primary_key: target_primary_key?.name,
    source_primary_key: source_primary_key?.name,
  };
};
const SourceTarget: React.FunctionComponent<ISourceTargetProps> = props => {
  const { id, source, target, isUpload, mappingColumn, source_vertex_fields, target_vertex_fields } = props;
  const { store } = useContext();
  const { nodes } = store;
  const { handleDataFieldsChange } = useModel({ type: 'edges', id });
  const { source_label, target_label, target_primary_key, source_primary_key } = getLabelById(nodes, source, target);

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
              isUpload={isUpload}
              onChange={val => handleDataFieldsChange(val, 'source_vertex_fields', source_primary_key)}
              componentType={mappingColumn?.type || 'Select'}
              options={mappingColumn?.options || []}
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
              isUpload={isUpload}
              onChange={val => handleDataFieldsChange(val, 'target_vertex_fields', target_primary_key)}
              componentType={mappingColumn?.type || 'Select'}
              options={mappingColumn?.options || []}
            />
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default SourceTarget;

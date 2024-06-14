import * as React from 'react';

import { Typography, Input, Flex } from 'antd';
import { MappingFields } from '@graphscope/studio-components';
import { useContext } from '../../useContext';
import useModel from './useModel';
import type { ImportorProps } from '../../typing';
type ISourceTargetProps = Pick<ImportorProps, 'mappingColumn'> & {
  id: string;
  source: string;
  target: string;
  source_data_fields: { index: number; token: string };
  target_data_fields: { index: number; token: string };
};

const getLabelById = (nodes, source, target) => {
  let source_label, target_label;
  nodes.forEach(item => {
    if (item.id === source) {
      source_label = item.data.label;
    }
    if (item.id === target) {
      target_label = item.data.label;
    }
  });
  return {
    source_label,
    target_label,
  };
};
const SourceTarget: React.FunctionComponent<ISourceTargetProps> = props => {
  const { id, source, target, mappingColumn, source_data_fields, target_data_fields } = props;
  const { store } = useContext();
  const { nodes } = store;
  const { handleDataFieldsChange } = useModel({ type: 'edges', id });
  const { source_label, target_label } = getLabelById(nodes, source, target);

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
              value={source_data_fields}
              onChange={val => handleDataFieldsChange(val, source_label, 'source_data_fields')}
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
              value={target_data_fields}
              onChange={val => handleDataFieldsChange(val, source_label, 'target_data_fields')}
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

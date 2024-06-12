import * as React from 'react';

import { Typography, Input, Flex } from 'antd';
import Controller from './Controller';
import { useContext } from '../../useContext';
import useModel from './useModel';
import type { ImportorProps } from '../../typing';
type ISourceTargetProps = Pick<ImportorProps, 'mappingColumn'> & {
  id: string;
  source: string;
  target: string;
  source_data_fields: { index: number; columnName: string };
  target_data_fields: { index: number; columnName: string };
};

const SourceTarget: React.FunctionComponent<ISourceTargetProps> = props => {
  const { id, source, target, mappingColumn, source_data_fields, target_data_fields } = props;
  const { store } = useContext();
  const { nodes } = store;
  const { handleDataFieldsChange } = useModel({ type: 'edges', id });
  let source_label, target_label;
  nodes.forEach(item => {
    if (item.id === source) {
      source_label = item.data.label;
    }
    if (item.id === target) {
      target_label = item.data.label;
    }
  });

  return (
    <>
      <Flex justify="space-between" gap="small">
        <div style={{ width: mappingColumn ? '70%' : '100%' }}>
          <Typography.Text>Source</Typography.Text>
          <Input value={source_label} disabled style={{ marginTop: '8px' }} />
        </div>
        {mappingColumn && (
          <div style={{ width: '50%' }}>
            <Typography.Text>Data Fields</Typography.Text>
            <Controller
              value={source_data_fields}
              onChange={val => handleDataFieldsChange(val, source_label, 'source_data_fields')}
              componentType={mappingColumn?.type || 'Select'}
              options={mappingColumn?.options || []}
            />
          </div>
        )}
      </Flex>
      <Flex justify="space-between" gap="small">
        <div style={{ width: mappingColumn ? '70%' : '100%' }}>
          <Typography.Text>Target</Typography.Text>
          <Input value={target_label} disabled style={{ marginTop: '8px' }} />
        </div>
        {mappingColumn && (
          <div style={{ width: '50%' }}>
            <Typography.Text>Data Fields</Typography.Text>
            <Controller
              value={target_data_fields}
              onChange={val => handleDataFieldsChange(val, target_label, 'target_data_fields')}
              componentType={mappingColumn.type || 'Select'}
              options={mappingColumn?.options || []}
            />
          </div>
        )}
      </Flex>
    </>
  );
};

export default SourceTarget;

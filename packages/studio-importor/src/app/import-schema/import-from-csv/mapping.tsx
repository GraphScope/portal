import React from 'react';

import { Select, Space, Typography, Flex } from 'antd';
import type { IMeta, ParsedFile } from './parseCSV';

interface IMappingProps {
  id: string;
  meta: IMeta;
  updateState: React.Dispatch<
    React.SetStateAction<{
      files: ParsedFile[];
      loading: boolean;
    }>
  >;
}
const styles = {
  Select: {
    width: '200px',
  },
};

const Mapping: React.FunctionComponent<IMappingProps> = props => {
  const { meta, updateState, id } = props;
  const { header, graphFields } = meta;
  const { idField, sourceField, targetField, type } = graphFields;

  const dataFields = header.map(item => {
    return {
      value: item,
      label: item,
    };
  });

  const handleChangeType = (type, value) => {
    updateState(preState => {
      const newFiles = preState.files.map(item => {
        if (item.id === id) {
          return {
            ...item,
            meta: {
              ...meta,
              graphFields: {
                ...meta.graphFields,
                [type]: value,
              },
            },
          };
        }
        return item;
      });
      return {
        ...preState,
        files: newFiles,
      };
    });
  };
  return (
    <div>
      <Flex align="center" justify="space-between" style={{ marginBottom: '12px' }}>
        <Typography.Text>File type</Typography.Text>
        <Select
          value={type}
          style={styles.Select}
          onChange={value => handleChangeType('type', value)}
          options={[
            { value: 'Vertex', label: 'Vertex' },
            { value: 'Edge', label: 'Edge' },
          ]}
        />
      </Flex>
      {type === 'Vertex' && (
        <Flex align="center" justify="space-between" style={{ marginBottom: '12px' }}>
          <Typography.Text>ID field</Typography.Text>
          <Select
            value={idField}
            style={styles.Select}
            onChange={value => handleChangeType('idField', value)}
            options={dataFields}
          />
        </Flex>
      )}
      {type === 'Edge' && (
        <>
          <Flex align="center" justify="space-between" style={{ marginBottom: '12px' }}>
            <Typography.Text>Source field</Typography.Text>
            <Select
              value={sourceField}
              style={styles.Select}
              onChange={value => handleChangeType('sourceField', value)}
              options={dataFields}
            />
          </Flex>
          <Flex align="center" justify="space-between">
            <Typography.Text>Target field</Typography.Text>
            <Select
              value={targetField}
              style={styles.Select}
              onChange={value => handleChangeType('targetField', value)}
              options={dataFields}
            />
          </Flex>
        </>
      )}
    </div>
  );
};

export default Mapping;

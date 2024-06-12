import React from 'react';

import { Select, Space, Typography, Flex } from 'antd';
import type { IMeta, ParsedFile } from './parseJSON';

interface IMappingProps {
  id: string;
  data: { nodes: any[]; edges: any[] };
  meta: IMeta;
  updateState: React.Dispatch<
    React.SetStateAction<{
      files: ParsedFile[];
    }>
  >;
}
const styles = {
  Select: {
    width: '200px',
  },
};
const getOptions = (keys: string[]) => {
  return keys.map(item => {
    return {
      value: item,
      label: item,
    };
  });
};
const Mapping: React.FunctionComponent<IMappingProps> = props => {
  const { meta, updateState, id, data } = props;
  const { graphFields } = meta;
  const { idField, sourceField, targetField } = graphFields;
  const nodeDataFields = Object.keys(data.nodes[0] || {}).map(key => {
    return {
      value: key,
      label: key,
    };
  });
  const edgeDataFields = Object.keys(data.edges[0] || {}).map(key => {
    return {
      value: key,
      label: key,
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
        <Typography.Text>Vertex ID Field</Typography.Text>
        <Select
          value={idField}
          style={styles.Select}
          onChange={value => handleChangeType('idField', value)}
          options={nodeDataFields}
        />
      </Flex>

      <Flex align="center" justify="space-between" style={{ marginBottom: '12px' }}>
        <Typography.Text>Edge Source Field</Typography.Text>
        <Select
          value={sourceField}
          style={styles.Select}
          onChange={value => handleChangeType('sourceField', value)}
          options={edgeDataFields}
        />
      </Flex>
      <Flex align="center" justify="space-between">
        <Typography.Text>Edge Target Field</Typography.Text>
        <Select
          value={targetField}
          style={styles.Select}
          onChange={value => handleChangeType('targetField', value)}
          options={edgeDataFields}
        />
      </Flex>
    </div>
  );
};

export default Mapping;

import React from 'react';

import { Select, Space, Typography, Flex } from 'antd';
import type { IMeta, ParsedFile } from '../Utils/parseCSV';

interface IMappingProps {
  id: string;
  meta: IMeta;
  updateState: React.Dispatch<
    React.SetStateAction<{
      files: ParsedFile[];
      loading: boolean;
      csvFiles: File[];
    }>
  >;
}
interface IOptions {
  value: string;
  label: string;
}
const styles = {
  Select: {
    width: '200px',
  },
};

const OPTIONS: IOptions[] = [
  { value: 'Vertex', label: 'Vertex' },
  { value: 'Edge', label: 'Edge' },
];
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
  const splitModule = (title, selectValue: string, options: IOptions[]) => {
    const style = { marginBottom: title === 'Target field' ? '0px' : '12px' };
    return (
      <Flex align="center" justify="space-between" style={style}>
        <Typography.Text>{title}</Typography.Text>
        <Select
          value={selectValue}
          style={styles.Select}
          onChange={value => handleChangeType(`${selectValue}`, value)}
          options={options}
        />
      </Flex>
    );
  };
  return (
    <div>
      {splitModule('File type', type, OPTIONS)}
      {type === 'Vertex' && splitModule('ID field', idField, dataFields)}
      {type === 'Edge' && (
        <>
          {splitModule('Source field', sourceField as string, dataFields)}
          {splitModule('Target field', targetField as string, dataFields)}
        </>
      )}
    </div>
  );
};

export default Mapping;

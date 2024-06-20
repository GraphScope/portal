import React, { useState } from 'react';
import UploadFile from './update-file';
import { Button, Collapse, Space } from 'antd';
import Mapping from './mapping';
import type { ParsedFile } from '../Utils/parseCSV';

import { CaretRightOutlined } from '@ant-design/icons';

import MappingHeader from './mapping-header';
export interface IState {
  files: ParsedFile[];
  loading: boolean;
}
export interface IImportFromFileProps {
  upload: {
    // 限制文件类型
    accept: string;
    title: string;
    description: string;
  };
  children: (state: IState, setState: React.Dispatch<React.SetStateAction<IState>>) => React.ReactNode;
}

const ImportFromCSV: React.FunctionComponent<IImportFromFileProps> = props => {
  const { upload, children } = props;
  const [state, setState] = useState<IState>({
    files: [],
    loading: false,
  });
  const { files } = state;
  const onChange = (value: ParsedFile[]) => {
    console.log(value);
    setState(preState => {
      return {
        ...preState,
        files: [...preState.files, ...value],
      };
    });
  };

  const onClear = () => {
    setState(preState => {
      return {
        ...preState,
        files: [],
      };
    });
  };
  const isEmpty = files.length === 0;

  const items = files.map((item, index) => {
    const { meta, id } = item;
    return {
      key: index,
      label: <MappingHeader id={id} meta={meta} updateState={setState} />,
      children: <Mapping id={id} meta={meta} updateState={setState} />,
    };
  });

  return (
    <div
      style={{
        border: isEmpty ? '1px dashed #ddd' : 'none',
        height: '100%',
        width: '100%',
        borderRadius: '6px',
        position: 'relative',
      }}
    >
      {isEmpty ? (
        <UploadFile onChange={onChange} {...upload} />
      ) : (
        <Collapse
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          items={items}
          defaultActiveKey={['0']}
        />
      )}
      {!isEmpty && (
        <Space style={{ position: 'absolute', bottom: '0px', right: '0px' }}>
          <Button type="default" onClick={onClear}>
            Clear all files
          </Button>
          {children(state, setState)}
        </Space>
      )}
    </div>
  );
};

export default ImportFromCSV;

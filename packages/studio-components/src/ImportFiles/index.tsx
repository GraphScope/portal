import React, { forwardRef, useState, LegacyRef } from 'react';
import UploadFile from './update-file';
import { Button, Collapse, Space, Typography } from 'antd';
import Mapping from './mapping';
import type { ParsedFile } from '../Utils/parseCSV';

import { CaretRightOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import MappingHeader from './mapping-header';
import localforage from 'localforage';
export interface IState {
  files: ParsedFile[];
  loading: boolean;
  csvFiles: File[];
}

export interface IImportFromFileProps {
  /** 是否保存上传的原始文件 */
  isSaveFiles?: boolean;
  upload: {
    // 限制文件类型
    accept: string;
    title: string | React.ReactNode;
    description: string | React.ReactNode;
  };
  children: (state: IState, setState: React.Dispatch<React.SetStateAction<IState>>) => React.ReactNode;
  type?: 'json' | 'csv';
}

const ImportFromCSV = forwardRef((props: IImportFromFileProps, ref: LegacyRef<HTMLDivElement>) => {
  const { upload, children, isSaveFiles, type } = props;
  const [state, setState] = useState<IState>({
    files: [],
    loading: false,
    csvFiles: [],
  });

  const { files } = state;
  const onChange = (value: ParsedFile[], csvFiles?: File[]) => {
    console.log(value);
    setState(preState => {
      return {
        ...preState,
        files: [...preState.files, ...value],
        csvFiles: [...preState.csvFiles, ...(csvFiles || [])],
      };
    });
  };

  const onClear = () => {
    setState(preState => {
      return {
        ...preState,
        files: [],
        csvFiles: [],
      };
    });
    localforage.setItem('DRAFT_GRAPH_FILES', []);
  };
  const isEmpty = files.length === 0;

  const items = files.map((item, index) => {
    const { meta, id } = item;
    return {
      key: index,
      label: <MappingHeader id={id} meta={meta} updateState={setState} />,
      children: <Mapping id={id} meta={meta} updateState={setState} type={type} />,
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      ref={ref}
    >
      <div
        style={{
          position: 'absolute',
          left: '0px',
          right: '0px',
          top: '0px',
          bottom: isEmpty ? '0px' : '40px',
          //为了滚动条好看
          margin: '-12px',
          padding: '12px',
          overflowY: 'scroll',
        }}
      >
        {isEmpty ? (
          <UploadFile isSaveFiles={isSaveFiles} onChange={onChange} {...upload} />
        ) : (
          <>
            {/* <Typography.Text type="secondary">fffdsaf</Typography.Text> */}
            <Collapse
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              items={items}
              defaultActiveKey={['0']}
            />
          </>
        )}
      </div>
      {!isEmpty && (
        <div
          style={{
            position: 'absolute',
            left: 'unset',
            right: '0px',
            bottom: '0px',
          }}
        >
          <Space>
            <Button type="default" onClick={onClear} style={{ width: '150px' }}>
              <FormattedMessage id="Clear all files" />
            </Button>
            {children(state, setState)}
          </Space>
        </div>
      )}
    </div>
  );
});

export default ImportFromCSV;

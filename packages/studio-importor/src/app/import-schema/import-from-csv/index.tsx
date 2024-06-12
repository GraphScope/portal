import React, { useState } from 'react';
import UploadFile from './update-file';
import { Button, Collapse, Space, Tag, Flex, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import Mapping from './mapping';
import type { ParsedFile } from './parseCSV';
import { useContext } from '../../useContext';
import { CaretRightOutlined, MoreOutlined } from '@ant-design/icons';

import { Utils } from '@graphscope/studio-components';

import { getSchemaData } from './web-worker';
import { transform } from './transform';
import MappingHeader from './mapping-header';
interface IImportFromCSVProps {}

const ImportFromCSV: React.FunctionComponent<IImportFromCSVProps> = props => {
  const { updateStore } = useContext();
  const [state, setState] = useState<{
    files: ParsedFile[];
    loading: boolean;
  }>({
    files: [],
    loading: false,
  });
  const { files } = state;
  const onChange = (value: any) => {
    console.log(value);
    setState(preState => {
      return {
        ...preState,
        files: [...preState.files, value],
      };
    });
  };

  const onSubmit = async () => {
    setState(preState => {
      return {
        ...preState,
        loading: true,
      };
    });
    const { result: schemaData, duration } = await Utils.asyncFunctionWithWorker(getSchemaData)(state.files);
    const { nodes, edges } = transform(schemaData);
    console.log(duration, schemaData);
    updateStore(draft => {
      draft.hasLayouted = false;
      draft.nodes = nodes;
      draft.edges = edges;
    });
    setState(preState => {
      return {
        ...preState,
        loading: false,
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
        borderRadius: '6px',
        position: 'relative',
      }}
    >
      {isEmpty ? (
        <UploadFile onChange={onChange} />
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
            clear files
          </Button>
          <Button type="primary" onClick={onSubmit} loading={state.loading}>
            Generate Graph Schema
          </Button>
        </Space>
      )}
    </div>
  );
};

export default ImportFromCSV;

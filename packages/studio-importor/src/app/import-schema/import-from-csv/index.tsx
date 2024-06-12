import React, { useState } from 'react';
import UploadFile from './update-file';
import { Button, Collapse, Space } from 'antd';
import Mapping from './mapping';
import type { ParsedFile } from './parseCSV';
import { useContext } from '../../useContext';

import { Utils } from '@graphscope/studio-components';

import { getSchemaData } from './web-worker';
import { transform } from './transform';
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

  const items = files.map((item, index) => {
    const { meta, id } = item;
    const { name } = meta;
    return {
      key: index,
      label: name,
      //@ts-ignore
      children: <Mapping meta={meta} updateState={setState} id={id} />,
    };
  });

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
  return (
    <div
      style={{
        border: '1px dashed #ddd',
        height: '100%',
        borderRadius: '6px',
      }}
    >
      {files.length === 0 ? <UploadFile onChange={onChange} /> : <Collapse items={items} defaultActiveKey={['1']} />}
      {files.length !== 0 && (
        <Space>
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

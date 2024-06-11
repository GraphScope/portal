import React, { useState } from 'react';
import UploadFile from './update-file';
import { Button, Collapse, Space } from 'antd';
import Mapping from './mapping';
import type { IMeta, ParsedFile } from './parseCSV';
import { useContext } from '../../useContext';
import { uuid } from 'uuidv4';

interface IImportFromCSVProps {}

const ImportFromCSV: React.FunctionComponent<IImportFromCSVProps> = props => {
  // const { updateStore } = useContext();
  const [state, setState] = useState<{
    files: ParsedFile[];
  }>({
    files: [],
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
    const { data, meta, id } = item;
    const { name } = meta;
    return {
      key: index,
      label: name,
      children: <Mapping data={data} meta={meta} updateState={setState} id={id} />,
    };
  });

  const onSubmit = () => {
    console.log('state', state.files);
    const nodes: any[] = [];
    state.files.forEach(item => {
      const { id, data, meta } = item;
      const { graphFields, name, header } = meta;
      const { idField, sourceField, targetField, type } = graphFields;
      const label = name.split('.csv')[0];
      if (type === 'Vertex') {
        nodes.push({
          id: uuid(),
          type: 'graph-node',
          position: {
            x: Math.round(Math.random() * 500),
            y: Math.round(Math.random() * 500),
          },
          data: {
            label,
            properties: header.map(p => {
              return {
                key: uuid(),
                disable: true,
                name: p,
                primaryKey: false,
                type: 'DT_SIGNED_INT32',
              };
            }),
          },
        });
      }
    });
    // updateStore(draft => {
    //   draft.hasLayouted = false;
    //   draft.nodes = nodes;
    // });
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
          <Button type="primary" onClick={onSubmit}>
            Generate Graph Schema
          </Button>
        </Space>
      )}
    </div>
  );
};

export default ImportFromCSV;

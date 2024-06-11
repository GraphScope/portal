import React, { useState } from 'react';
import UploadFile from './update-file';
import { Button, Collapse, Space } from 'antd';
import Mapping from './mapping';
import type { IMeta, ParsedFile } from './parseCSV';
import type { NodeData, EdgeData } from '../typing';
import { useContext } from '../useContext';
import { uuid } from 'uuidv4';

interface IImportFromCSVProps {}

const ImportFromCSV: React.FunctionComponent<IImportFromCSVProps> = props => {
  const { store, updateStore } = useContext();
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
    const nodes: NodeData[] = [];
    const edges: EdgeData[] = [];
    state.files.forEach(item => {
      const { id, data, meta } = item;
      const { graphFields, name, header } = meta;
      const { idField, sourceField = 'source', targetField = 'target', type } = graphFields;
      const label = name.split('.csv')[0];

      if (type === 'Vertex') {
        data.forEach(node => {
          nodes.push({
            label,
            id: node[idField],
            type: 'circle',
            data: node,
          });
        });
      }
      if (type === 'Edge') {
        data.forEach(edge => {
          edges.push({
            label,
            id: `${edge[sourceField]}-${edge[targetField]}`,
            source: edge[sourceField],
            target: edge[targetField],
            data: edge,
          });
        });
      }
    });
    console.log('graph data', { nodes, edges });
    updateStore(draft => {
      draft.edges = edges;
      draft.nodes = nodes;
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

import React, { useState } from 'react';
import UploadFile from './update-file';
import { Button, Collapse, Space } from 'antd';
import Mapping from './mapping';
import type { IMeta, ParsedFile } from './parseCSV';
import { useContext } from '../../useContext';
import { uuid } from 'uuidv4';
import { Utils } from '@graphscope/studio-components';
import { transformEdges, transformGraphNodes } from '../../elements/index';

interface IImportFromCSVProps {}
export const getGraphData = files => {
  const nodes: any[] = [];
  const edges: any[] = [];
  files.forEach(item => {
    const { id, data, meta } = item;
    const { graphFields, name, header } = meta;
    const { idField, sourceField = 'source', targetField = 'target', type } = graphFields;
    const label = name.split('.csv')[0];

    if (type === 'Vertex') {
      data.forEach(node => {
        nodes.push({
          id: node[idField],
          label,
          data: node,
        });
      });
    }
    if (type === 'Edge') {
      data.forEach(edge => {
        edges.push({
          id: `${edge[sourceField]}-${edge[targetField]}`,
          label,
          source: edge[sourceField],
          target: edge[targetField],
          data: edge,
        });
      });
    }
  });
  return { nodes, edges };
};

const DATA_TYPE_MAPPING = {
  number: 'DT_DOUBLE',
  string: 'DT_SIGNED_INT32',
};

const ImportFromCSV: React.FunctionComponent<IImportFromCSVProps> = props => {
  const { updateStore } = useContext();
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
    //@ts-ignore
    const graphData = getGraphData(state.files);
    //@ts-ignore
    const schemaData = Utils.generatorSchemaByGraphData(graphData);
    const nodes = schemaData.nodes.map(item => {
      const { label, properties } = item;
      return {
        id: label,
        label,
        properties: properties.map(p => {
          const { name, type } = p;
          return {
            name,
            type: DATA_TYPE_MAPPING[type],
            key: uuid(),
            disable: false,
            primaryKey: false,
          };
        }),
      };
    });

    const edges = schemaData.edges.map(item => {
      const { label, properties, source, target } = item;
      return {
        id: label,
        label,
        source,
        target,
        properties: properties.map(p => {
          const { name, type } = p;
          return {
            name,
            type: DATA_TYPE_MAPPING[type],
            key: uuid(),
            disable: false,
            primaryKey: false,
          };
        }),
      };
    });

    updateStore(draft => {
      draft.hasLayouted = false;
      draft.nodes = transformGraphNodes(nodes, 'graph');
      draft.edges = transformEdges(edges, 'graph');
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
          <Button type="primary" onClick={onSubmit}>
            Generate Graph Schema
          </Button>
        </Space>
      )}
    </div>
  );
};

export default ImportFromCSV;

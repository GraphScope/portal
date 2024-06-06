import { Button, notification } from 'antd';
import * as React from 'react';
import { AppstoreOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { useContext } from '../../layouts/useContext';
import { Icons } from '@graphscope/studio-components';
import { useContext as useModeling } from '@graphscope/studio-importor';
import { createGraph, getSchema, getDataloadingConfig } from './services';

interface SaveModelingProps {}
export const getSchemaOptions = (nodes, edges) => {
  let errors: string[] = [];
  const _nodes = nodes.map(item => {
    const { data, id } = item;
    const { label, properties } = data;
    if (properties) {
      return {
        id,
        label,
        properties,
      };
    } else {
      errors.push(label);
    }
  });
  const _edges = edges.map(item => {
    const { data, id, source, target } = item;
    const { label, properties } = data;
    return {
      label,
      id,
      source,
      target,
      properties,
    };
  });
  if (errors.length !== 0) {
    notification.warning({
      message: `Properties error`,
      description: `Vertex ${errors.join(',')} need add Properties`,
      duration: 3,
    });
    return false;
  }
  return {
    nodes: _nodes,
    edges: _edges,
  };
};

const SaveModeling: React.FunctionComponent<SaveModelingProps> = props => {
  const { store } = useContext();

  const { store: modelingStore } = useModeling();
  const { elementOptions, appMode, nodes, edges } = modelingStore;
  const { draftGraph } = store;
  console.log(store, modelingStore);

  const { graphId } = store;
  const disabled = !elementOptions.isEditable;

  const handleClick = () => {
    if (graphId === 'draft-graph') {
      console.log(draftGraph, nodes, edges);
      const schema = getSchemaOptions(nodes, edges);
      if (schema) {
        //@ts-ignore
        createGraph(graphId, { nodes: schema.nodes, edges: schema.edges, graphName: draftGraph.name });
      }
    }
  };
  const text = disabled ? 'View Schema' : 'Save Importing';

  if (appMode === 'DATA_MODELING') {
    return (
      <Button disabled={disabled} type="primary" icon={<SaveOutlined />} onClick={handleClick}>
        {text}
      </Button>
    );
  }
  return null;
};

export default SaveModeling;

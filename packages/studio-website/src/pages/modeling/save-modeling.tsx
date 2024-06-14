import { Button, notification, Modal, Form, Alert, Result } from 'antd';
import React, { useState } from 'react';
import { AppstoreOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { useContext } from '../../layouts/useContext';
import { Icons } from '@graphscope/studio-components';
import { useContext as useModeling } from '@graphscope/studio-importor';
import { createGraph, getSchema, getDataloadingConfig } from './services';
import ChooseEngineType from '@/pages/instance/create-instance/choose-enginetype';
import type { ISchemaNode, ISchemaEdge, ISchemaOptions } from '@graphscope/studio-importor';
import { Utils } from '@graphscope/studio-components';
import { history } from 'umi';
interface SaveModelingProps {}
export const getSchemaOptions = (nodes: ISchemaNode[], edges: ISchemaEdge[]) => {
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
  const [state, setState] = useState<{
    isLoading: boolean;
    open: boolean;
    status: string;
    schema: ISchemaOptions;
    id: string;
    message: string;
  }>({
    isLoading: false,
    open: false,
    status: 'success',
    message: '',
    schema: {
      nodes: [],
      edges: [],
    },
    id: 'DRAFT_GRAPH',
  });
  const { store, updateStore } = useContext();
  const [form] = Form.useForm();
  const { store: modelingStore } = useModeling();
  const { elementOptions, appMode, nodes, edges } = modelingStore;
  const { draftGraph, draftId } = store;

  const { isLoading, open, status, schema } = state;

  const { graphId } = store;
  const disabled = graphId !== draftId;

  const handleSave = async () => {
    setState(preState => {
      return {
        ...preState,
        open: true,
      };
    });
    const schema = { nodes, edges };

    if (schema) {
      let _status = '',
        _message = '';
      //@ts-ignore
      const graph_id = await createGraph(graphId, {
        nodes: schema.nodes,
        edges: schema.edges,
        //@ts-ignore
        graphName: draftGraph.name,
      })
        .then((res: any) => {
          if (res.status === 200) {
            _status = 'success';
            _message = `The graph model contains ${schema.nodes.length} types of nodes and ${schema.edges.length} types of edges.`;
            return res.data && res.data.graph_id;
          }
          _status = 'error';
          _message = res.message;
        })
        .catch(error => {
          _status = 'error';
          _message = error.response.data;
        });

      setState(preState => {
        return {
          ...preState,
          status: _status,
          message: _message,
          schema: schema,
          //@ts-ignore
          id: graph_id,
        };
      });
    }
  };
  const handleClose = () => {
    setState(preState => {
      return {
        ...preState,
        open: false,
      };
    });
  };

  const handleGotoGraphs = () => {
    Utils.setSearchParams({
      graph_id: state.id,
    });
    history.push(`/graphs?graph_id=${state.id}`);
    updateStore(draft => {
      draft.draftGraph = {};
      draft.graphId = state.id;
      draft.currentnNav = '/graphs';
    });
  };
  const handleGotoImporting = () => {
    Utils.setSearchParams({
      graph_id: state.id,
    });
    history.push(`/importing?graph_id=${state.id}`);
    updateStore(draft => {
      draft.draftGraph = {};
      draft.graphId = state.id;
      draft.currentnNav = '/importing';
    });
  };
  const handleGoback = () => {
    setState(preState => {
      return {
        ...preState,
        open: false,
      };
    });
  };

  const text = disabled ? 'View Schema' : 'Save Modeling';
  const title = status === 'success' ? 'Successfully saved the graph model' : 'Failed to save the graph model';
  const SuccessAction = [
    <Button onClick={handleGotoGraphs}>Goto Graphs</Button>,
    <Button type="primary" onClick={handleGotoImporting}>
      Goto Importing
    </Button>,
  ];
  const ErrorAction = [
    <Button type="primary" onClick={handleGoback}>
      Go back to modify the graph model.
    </Button>,
  ];
  const Action = status === 'success' ? SuccessAction : ErrorAction;

  if (appMode === 'DATA_MODELING') {
    return (
      <>
        <Button disabled={disabled} type="primary" icon={<SaveOutlined />} onClick={handleSave}>
          {text}
        </Button>
        <Modal title={null} open={open} footer={null} closable={false}>
          <Result status={status as 'error' | 'success'} title={title} subTitle={state.message} extra={Action} />
        </Modal>
      </>
    );
  }
  return null;
};

export default SaveModeling;

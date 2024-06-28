import { Button, notification, Modal, Form, Result, Tooltip } from 'antd';
import React, { useState } from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { useContext } from '../../layouts/useContext';
import { useContext as useModeling, getTitle } from '@graphscope/studio-importor';
import { createGraph, getSchema } from './services';
import type { ISchemaNode, ISchemaEdge, ISchemaOptions } from '@graphscope/studio-importor';
import { Utils } from '@graphscope/studio-components';
import { history } from 'umi';
import localforage from 'localforage';
import { FormattedMessage } from 'react-intl';

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
  const { elementOptions, appMode, nodes, edges, csvFiles } = modelingStore;
  const { draftGraph, draftId } = store;

  const { isLoading, open, status, schema } = state;

  const { graphId } = store;
  const disabled = graphId !== draftId;

  const handleSave = async () => {
    const schema = { nodes, edges };
    setState(preState => {
      return {
        ...preState,
        open: true,
      };
    });

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

      await localforage.setItem(`GRAPH_SCHEMA_OPTIONS_${graph_id}`, Utils.fakeSnapshot(schema));
      //@ts-ignore
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
  const title =
    status === 'success' ? (
      <FormattedMessage id="Successfully saved the graph model" />
    ) : (
      <FormattedMessage id="Failed to save the graph model" />
    );
  const SuccessAction = [
    <Button onClick={handleGotoGraphs}>
      <FormattedMessage id="Goto Graphs" />
    </Button>,
    <Button type="primary" onClick={handleGotoImporting}>
      <FormattedMessage id="Goto Importing" />
    </Button>,
  ];
  const ErrorAction = [
    <Button type="primary" onClick={handleGoback}>
      <FormattedMessage id="Go back to modify the graph model." />
    </Button>,
  ];
  const Action = status === 'success' ? SuccessAction : ErrorAction;
  const controlTooltip = butChange(JSON.parse(JSON.stringify(nodes)), JSON.parse(JSON.stringify(edges)));

  if (appMode === 'DATA_MODELING') {
    return (
      <>
        <Tooltip title={controlTooltip[0] ? <FormattedMessage id={`${controlTooltip[1]}`} /> : ''}>
          <Button disabled={disabled || controlTooltip[0]} type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            <FormattedMessage id={text} />
          </Button>
        </Tooltip>
        <Modal title={null} open={open} footer={null} closable={false}>
          <Result status={status as 'error' | 'success'} title={title} subTitle={state.message} extra={Action} />
        </Modal>
      </>
    );
  }
  return null;
};

export function butChange(nodes: ISchemaNode[], edges: ISchemaEdge[]): [boolean, string[]] {
  const verifyElements = (elements: any[], elementType: string) => {
    return elements.map((item: any) => {
      const { label, properties = [] } = item.data;
      const verifyAttributes = getTitle({
        appMode: 'DATA_MODELING',
        type: elementType as 'node' | 'edge',
        properties,
      });
      console.log(elementType === 'node' ? 1 : 2, verifyAttributes);
      return { verify: Boolean(verifyAttributes), title: verifyAttributes || '' };
    });
  };

  const [nodeResults, edgeResults] = [nodes, edges].map((typeElements, index) =>
    verifyElements(typeElements, ['node', 'edge'][index]),
  );

  const hasTrueVerifications = nodeResults.some(result => result.verify) || edgeResults.some(result => result.verify);

  const tooltipTitles = [...nodeResults, ...edgeResults].filter(result => result.title).map(result => result.title);

  return [hasTrueVerifications, tooltipTitles];
}
export default SaveModeling;

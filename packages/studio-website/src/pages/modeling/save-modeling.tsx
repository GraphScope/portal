import { Button, notification, Modal, Form, Result, Tooltip } from 'antd';
import React, { useState } from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { useContext } from '../../layouts/useContext';
import { useContext as useModeling, validateProperties } from '@graphscope/studio-importor';
import { createGraph, getSchema } from './services';
import type { ISchemaNode, ISchemaEdge, ISchemaOptions } from '@graphscope/studio-importor';
import { Utils } from '@graphscope/studio-components';
import { history } from 'umi';
import localforage from 'localforage';
import { FormattedMessage } from 'react-intl';
import type { INTERNAL_Snapshot } from 'valtio';

interface SaveModelingProps {}
const { GS_ENGINE_TYPE } = window;
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

  const IS_DRAFT_GRAPH = graphId === draftId;

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
          if (res.status === 200 || res === 'Import schema successfully') {
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
      /** groot 接口缺陷，等后期后端完善 */
      const id = Utils.getSearchParams('graph_id');
      await localforage.setItem(`GRAPH_SCHEMA_OPTIONS_${graph_id ?? id}`, Utils.fakeSnapshot(schema));
      //@ts-ignore
      setState(preState => {
        return {
          ...preState,
          status: _status,
          message: _message,
          schema: schema,
          //@ts-ignore
          id: graph_id ?? id,
        };
      });
    }
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

  const text = IS_DRAFT_GRAPH || GS_ENGINE_TYPE === 'groot' ? 'Save Modeling' : 'View Schema';
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

  const { passed: validatePassed, message: validateMessage } = validate(nodes, edges);

  const canSave =
    GS_ENGINE_TYPE === 'interactive'
      ? nodes.length !== 0 && IS_DRAFT_GRAPH && validatePassed
      : !elementOptions.isEditable && validatePassed;
  if (appMode === 'DATA_MODELING') {
    return (
      <>
        <Tooltip title={validatePassed ? '' : validateMessage}>
          <Button disabled={!canSave} type="primary" icon={<SaveOutlined />} onClick={handleSave}>
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

export function validate(
  nodes: INTERNAL_Snapshot<ISchemaNode[]>,
  edges: INTERNAL_Snapshot<ISchemaEdge[]>,
): { passed: boolean; message: string } {
  const verifyElements = (
    elements: INTERNAL_Snapshot<ISchemaNode[]> | INTERNAL_Snapshot<ISchemaEdge[]>,
    elementType: 'nodes' | 'edges',
  ) => {
    return elements.map((item: any) => {
      const { label, properties = [] } = item.data;
      const verifyMessage = validateProperties({
        appMode: 'DATA_MODELING',
        type: elementType as 'nodes' | 'edges',
        properties,
      });

      return { label, passed: !verifyMessage, message: verifyMessage || '' };
    });
  };
  const verifyNodes = verifyElements(nodes, 'nodes');
  const verifyEdges = verifyElements(edges, 'edges');

  return [...verifyNodes, ...verifyEdges].reduce(
    (acc, curr) => {
      const message = curr.passed ? '' : `  ${curr.label}`;
      return {
        passed: acc.passed && curr.passed,
        message: acc.message + message,
      };
    },
    {
      passed: true as boolean,
      message: 'please check element: ',
    },
  );
}

export default SaveModeling;

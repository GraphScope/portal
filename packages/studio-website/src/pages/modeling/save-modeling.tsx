import { Button, Modal, Result, Tooltip } from 'antd';
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

  const { store: modelingStore } = useModeling();
  const { nodes, edges } = modelingStore;
  const { draftGraph, draftId, graphId } = store;
  const IS_DRAFT_GRAPH = graphId === draftId;
  const { open, status } = state;

  const handleSave = async () => {
    const schema = { nodes, edges };
    if (schema) {
      let _status = '',
        _message = '';
      const goot_graph_id = Utils.getSearchParams('id');

      const graph_id = await createGraph(
        //@ts-ignore

        {
          nodes: schema.nodes,
          edges: schema.edges,
          //@ts-ignore
          graphName: draftGraph.name,
        },
        goot_graph_id,
      )
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
      /** 修改 URL */
      Utils.storage.set('DRAFT_GRAPH', {});
      Utils.setSearchParams({ graph_id: state.id });
      /** 设置Schema */
      await localforage.setItem(`GRAPH_SCHEMA_OPTIONS_${graph_id}`, Utils.fakeSnapshot(schema));
      //@ts-ignore
      setState(preState => {
        return {
          ...preState,
          status: _status,
          message: _message,
          schema: schema,
          open: true,
          id: graph_id,
        };
      });
    }
  };

  const handleGotoGraphs = () => {
    history.push(`/graphs?graph_id=${state.id}`);
    updateStore(draft => {
      draft.draftGraph = {};
      draft.graphId = state.id;
      draft.currentnNav = '/graphs';
    });
  };
  const handleGotoImporting = () => {
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
  const buttonStatus = getButtonStatus({ IS_DRAFT_GRAPH, nodes, validatePassed });

  return (
    <>
      <Tooltip title={validatePassed ? '' : validateMessage}>
        <Button disabled={buttonStatus.disabled} type="primary" icon={<SaveOutlined />} onClick={handleSave}>
          <FormattedMessage id={buttonStatus.text} />
        </Button>
      </Tooltip>
      <Modal title={null} open={open} footer={null} closable={false}>
        <Result status={status as 'error' | 'success'} title={title} subTitle={state.message} extra={Action} />
      </Modal>
    </>
  );
};

export default SaveModeling;

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

export function getButtonStatus(params: {
  IS_DRAFT_GRAPH: boolean;
  validatePassed: boolean;
  nodes: INTERNAL_Snapshot<ISchemaNode[]>;
}) {
  const { IS_DRAFT_GRAPH, validatePassed, nodes } = params;

  if (GS_ENGINE_TYPE === 'interactive') {
    if (IS_DRAFT_GRAPH && nodes.length !== 0) {
      return {
        text: 'Save Modeling',
        disabled: !validatePassed,
      };
    }
    return {
      text: 'View Schema',
      disabled: true,
    };
  }

  if (GS_ENGINE_TYPE === 'groot') {
    const everySaved = nodes.every(node => {
      return node.data.saved;
    });
    return {
      text: 'Save Modeling',
      disabled: !validatePassed || everySaved,
    };
  }

  return {
    text: 'View Schema',
    disabled: true,
  };
}

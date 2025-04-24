import * as React from 'react';
import { Button, Tooltip } from 'antd';
import {useContext} from '../../../useContext'
import { LinkOutlined, CheckOutlined } from '@ant-design/icons';

import type { ImportorProps, ISchemaNode, ISchemaEdge } from '../../../typing';
import { bindDatasourceInBatch, unbindVertexDatasource, unbindEdgeDatasource } from './services';
import { FormattedMessage } from 'react-intl';
interface IDeleteButtonProps {
  nodesMap?: Record<string, ISchemaNode>;
  type: 'nodes' | 'edges';
  schema: ISchemaNode | ISchemaEdge;
}

const BindButton: React.FunctionComponent<IDeleteButtonProps> = props => {
  const { schema, type, nodesMap } = props;
  const { data, id } = schema;
  const { label, isBind } = data;

  const { updateStore, store } = useContext();
  const { appMode, nodes } = store;
  const [state, setState] = React.useState({
    loading: false,
  });
  const handleUnBind = async event => {
    event.stopPropagation();
    setState(preState => {
      return {
        ...preState,
        loading: true,
      };
    });

    if (type === 'nodes') {
      const res = await unbindVertexDatasource(label, schema);
      if (res) {
        updateStore(draft => {
          draft.nodes = draft.nodes.map(item => {
            if (item.id === id) {
              item.data.isBind = false;
            }
            return item;
          });
        });
      }
    }
    if (type === 'edges' && nodesMap) {
      const { source, target } = schema as ISchemaEdge;
      const sourceVertex = nodesMap[source];
      const targetVertex = nodesMap[target];

      const res = await unbindEdgeDatasource(label, sourceVertex.data.label, targetVertex.data.label, schema);
      if (res) {
        updateStore(draft => {
          draft.edges = draft.edges.map(item => {
            if (item.id === id) {
              item.data.isBind = false;
            }
            return item;
          });
        });
      }
    }
    setState(preState => {
      return {
        ...preState,
        loading: false,
      };
    });
  };
  const handleBind = async event => {
    event.stopPropagation();

    setState(preState => {
      return {
        ...preState,
        loading: true,
      };
    });
    if (type === 'nodes') {
      const res = await bindDatasourceInBatch({ nodes: [schema], edges: [] });
      if (res) {
        updateStore(draft => {
          draft.nodes = draft.nodes.map(item => {
            if (item.id === id) {
              item.data.isBind = true;
            }
            return item;
          });
        });
      }
    }
    if (type === 'edges') {
      const res = await bindDatasourceInBatch({ nodes: nodes, edges: [schema] });
      if (res) {
        updateStore(draft => {
          draft.edges = draft.edges.map(item => {
            if (item.id === id) {
              item.data.isBind = true;
            }
            return item;
          });
        });
      }
    }

    setState(preState => {
      return {
        ...preState,
        loading: false,
      };
    });
  };
  if (appMode === 'DATA_IMPORTING' && window.GS_ENGINE_TYPE === 'groot') {
    if (isBind) {
      return (
        <Tooltip title={<FormattedMessage id="Click to rebind datasource" />}>
          <Button
            size="small"
            type="text"
            loading={state.loading}
            onClick={handleUnBind}
            icon={<CheckOutlined style={{ color: 'green' }} />}
          ></Button>
        </Tooltip>
      );
    }
    return (
      <Tooltip title={<FormattedMessage id="Click to bind datasource" />}>
        <Button
          size="small"
          type="text"
          loading={state.loading}
          onClick={handleBind}
          icon={<LinkOutlined style={isBind ? { color: 'green' } : { color: 'red' }} />}
        ></Button>
      </Tooltip>
    );
  }
  return null;
};

export default BindButton;

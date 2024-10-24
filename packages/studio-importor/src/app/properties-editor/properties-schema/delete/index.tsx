import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { Icons } from '@graphscope/studio-components';
import { useContext } from '@graphscope/use-zustand';

import type { ImportorProps, ISchemaNode, ISchemaEdge } from '../../../typing';

import { FormattedMessage } from 'react-intl';
interface IDeleteButtonProps {
  onDeleteLabel: ImportorProps['onDeleteLabel'];
  nodesMap?: Record<string, ISchemaNode>;
  type: 'nodes' | 'edges';
  schema: ISchemaNode | ISchemaEdge;
}

const DeleteButton: React.FunctionComponent<IDeleteButtonProps> = props => {
  const { onDeleteLabel = () => true, schema, type, nodesMap } = props;
  const { data, id } = schema;
  const { saved, label } = data;

  const { updateStore, store } = useContext();
  const { appMode } = store;
  const [state, setState] = React.useState({
    loading: false,
  });
  const handleDelete = async event => {
    event.stopPropagation();
    setState(preState => {
      return {
        ...preState,
        loading: true,
      };
    });
    let res = true;
    if (type === 'nodes') {
      if (saved) {
        res = await onDeleteLabel(type, label);
      }
      if (res) {
        updateStore(draft => {
          draft.nodes = draft.nodes.filter(item => item.id !== id);
          draft.edges = draft.edges.filter(item => item.source !== id && item.target !== id);
        });
      }
    }

    if (type === 'edges' && nodesMap) {
      const { source, target } = schema as ISchemaEdge;
      const sourceVertex = nodesMap[source];
      const targetVertex = nodesMap[target];
      if (saved) {
        res = await onDeleteLabel(type, label, sourceVertex.data.label, targetVertex.data.label);
      }
      if (res) {
        updateStore(draft => {
          draft.edges = draft.edges.filter(item => item.id !== id);
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
  if (appMode === 'DATA_MODELING') {
    return (
      <Tooltip title={<FormattedMessage id="Delete label" />}>
        <Button size="small" type="text" loading={state.loading} onClick={handleDelete} icon={<Icons.Trash />}></Button>
      </Tooltip>
    );
  }
  return null;
};

export default DeleteButton;

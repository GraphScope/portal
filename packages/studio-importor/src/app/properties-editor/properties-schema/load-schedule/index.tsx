import * as React from 'react';
import { Button, Tooltip, Popover, Typography, Drawer } from 'antd';
import { Icons } from '@graphscope/studio-components';
import { useContext } from '@graphscope/use-zustand';
import { LinkOutlined, ScheduleOutlined } from '@ant-design/icons';

import type { ImportorProps, ISchemaNode, ISchemaEdge } from '../../../typing';
import { getLoadScheduleConfig } from './services';

import { FormattedMessage } from 'react-intl';
interface IDeleteButtonProps {
  nodesMap?: Record<string, ISchemaNode>;
  type: 'nodes' | 'edges';
  schema: ISchemaNode | ISchemaEdge;
  updateScheduleDrawer: (params: any) => void;
}

const LoadScheduleButton: React.FunctionComponent<IDeleteButtonProps> = props => {
  const { schema, type, nodesMap, updateScheduleDrawer } = props;
  const { data, id } = schema;
  const { saved, label, isBind } = data;

  const { updateStore, store } = useContext();
  const { appMode, nodes } = store;
  const [state, setState] = React.useState({
    loading: false,
  });
  const handleClick = async event => {
    event.stopPropagation();
    let res = '';
    if (type === 'nodes') {
      res = await getLoadScheduleConfig({ nodes: [schema], edges: [] }, type);
    }
    if (type === 'edges') {
      const { source, target } = schema as ISchemaEdge;
      const _nodes = nodes.filter(item => {
        return item.id === source || item.id === target;
      });
      res = await getLoadScheduleConfig({ nodes: _nodes, edges: [schema] }, type);
    }

    if (res) {
      updateScheduleDrawer({
        open: true,
        content: res,
        label: label,
      });
    }
  };
  if (appMode === 'DATA_IMPORTING' && window.GS_ENGINE_TYPE === 'groot') {
    const title = isBind ? 'Preview dataloading configuration' : 'Please bind datasource first';

    return (
      <Tooltip title={<FormattedMessage id={title} />}>
        <Button
          size="small"
          type="text"
          loading={state.loading}
          onClick={handleClick}
          icon={<ScheduleOutlined />}
          disabled={!isBind}
        ></Button>
      </Tooltip>
    );
  }
  return null;
};

export default LoadScheduleButton;

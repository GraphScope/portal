import * as React from 'react';
import { Button, Tooltip, notification } from 'antd';
import { useHistory, Utils } from '@graphscope/studio-components';
import {useContext} from '../../../useContext'
import { LinkOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { bindDatasourceInBatch, submitDataloadingJob } from './services';
import type { ImportorProps, ISchemaNode, ISchemaEdge } from '../../../typing';

import { FormattedMessage } from 'react-intl';
import { it } from 'node:test';
interface IDeleteButtonProps {
  nodesMap?: Record<string, ISchemaNode>;
  type: 'nodes' | 'edges';
  schema: ISchemaNode | ISchemaEdge;
}

const LoadNowButton: React.FunctionComponent<IDeleteButtonProps> = props => {
  const { schema, type, nodesMap } = props;
  const { data, id } = schema;
  const { saved, label, isBind } = data;

  const { updateStore, store } = useContext();
  const { appMode, nodes, edges } = store;
  const [state, setState] = React.useState({
    loading: false,
  });
  const history = useHistory();
  const gotoJob = (jobId: string) => {
    const graph_id = Utils.getSearchParams('graph_id');
    if (jobId.startsWith('SCHEDULER')) {
      history.push(`/job`);
    } else {
      history.push(`/job/detail?graph_id=${graph_id}&jobId=${jobId}`);
    }
  };
  const handleStartLoad = async event => {
    event.stopPropagation();

    setState(preState => {
      return {
        ...preState,
        loading: true,
      };
    });
    let res;
    if (type === 'nodes') {
      res = await submitDataloadingJob({ nodes: [schema], edges: [] }, type);
    }
    if (type === 'edges') {
      const { source, target } = schema as ISchemaEdge;
      const _nodes = nodes.filter(item => {
        return item.id === source || item.id === target;
      });
      res = await submitDataloadingJob({ nodes: _nodes, edges: [schema] }, type);
    }
    if (res) {
      const { jobId, status, message } = res;

      const gotoBtn = (
        <Button style={{ width: '128px' }} type="primary" onClick={() => gotoJob(jobId)}>
          Goto Jobs
        </Button>
      );
      notification[status]({
        message: `load data ${status}`,
        description: message,
        btn: status === 'success' ? gotoBtn : null,
      });
    }
    setState(preState => {
      return {
        ...preState,
        loading: false,
      };
    });
  };
  if (appMode === 'DATA_IMPORTING' && window.GS_ENGINE_TYPE === 'groot') {
    const title = isBind ? 'Load data right now' : 'Please bind datasource first';
    return (
      <Tooltip title={<FormattedMessage id={title} />}>
        <Button
          size="small"
          type="text"
          loading={state.loading}
          onClick={handleStartLoad}
          icon={<CloudUploadOutlined />}
          disabled={!isBind}
        ></Button>
      </Tooltip>
    );
  }
  return null;
};

export default LoadNowButton;

import { Button, Typography, Tooltip } from 'antd';
import * as React from 'react';
import { useContext } from '../../layouts/useContext';
import { useContext as useImporting } from '@graphscope/studio-importor';
import { bindDatasourceInBatch } from './services';

import { FormattedMessage } from 'react-intl';

import { CheckOutlined, LinkOutlined } from '@ant-design/icons';

const { Text } = Typography;
interface StartImportingProps {
  onClick?: () => void;
  id: string;
  refresh: () => void;
}
const { useState } = React;
const DataBind: React.FunctionComponent<StartImportingProps> = props => {
  const { refresh } = props;
  const { store } = useContext(props.id);
  const { store: importingStore, updateStore: updateImportingStore } = useImporting();
  const { appMode, nodes, edges } = importingStore;
  const { graphId } = store;
  console.log(nodes, edges);

  const [state, updateState] = useState<{
    open: boolean;
  }>({
    open: false,
  });
  const { open } = state;

  const handleBind = async () => {
    const bindStatus = await bindDatasourceInBatch(graphId || '', {
      nodes: nodes,
      edges: edges,
    });
    if (bindStatus) {
      updateState(preset => {
        return {
          ...preset,
          open: true,
        };
      });
      refresh();
    }
  };

  const onColse = () => {
    updateState(preset => {
      return {
        ...preset,
        open: false,
        result: undefined,
      };
    });
  };
  const isAllNodesBind = nodes.every(node => {
    return node.data.isBind;
  });
  const isAllEdgesBind = edges.every(edge => {
    return edge.data.isBind;
  });
  const isBind = isAllNodesBind && isAllEdgesBind;

  const has_all_nodes_filelocation = nodes.every(node => {
    return node.data.filelocation;
  });
  const has_all_edges_filelocation = edges.every(edge => {
    return edge.data.filelocation;
  });
  const has_all_filelocation = has_all_nodes_filelocation && has_all_edges_filelocation;
  console.log(has_all_nodes_filelocation, has_all_edges_filelocation);

  if (appMode === 'DATA_IMPORTING') {
    if (isBind) {
      return (
        <>
          {/* <Tooltip title={<FormattedMessage id="Binding all datasource in batch" />}> */}
          <Button disabled icon={<CheckOutlined style={{ color: 'green' }} />} type="text"></Button>
          {/* </Tooltip> */}
        </>
      );
    }
    const title = has_all_filelocation ? (
      <FormattedMessage id="Binding all datasource in batch" />
    ) : (
      <FormattedMessage id="Bind all the datasource, but first, please check if the location for each label is filled in correctly." />
    );

    return (
      <>
        <Tooltip title={title}>
          <Button
            disabled={!has_all_filelocation}
            onClick={handleBind}
            icon={<LinkOutlined style={{ color: 'red' }} />}
            type="text"
          ></Button>
        </Tooltip>
      </>
    );
  }
  return null;
};

export default DataBind;

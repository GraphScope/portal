import { Button } from 'antd';
import * as React from 'react';
import { useContext } from '../../layouts/useContext';
import { useContext as useImporting } from '@graphscope/studio-importor';
import { submitDataloadingJob, bindDatasourceInBatch } from './services';

interface StartImportingProps {
  onClick?: () => void;
}

const StartImporting: React.FunctionComponent<StartImportingProps> = props => {
  const { store } = useContext();
  const { store: importingStore } = useImporting();
  const { appMode, nodes, edges } = importingStore;
  const { graphId } = store;
  const handleClick = async () => {
    //先绑定数据
    const bindStatus = await bindDatasourceInBatch(graphId, {
      nodes: nodes.map(item => item.data),
      edges: edges.map(item => item.data),
    });
    return;
    // 再倒入数据
    const res = await submitDataloadingJob(graphId, {
      nodes,
      edges,
    });
    console.log('res', res);
  };

  if (appMode === 'DATA_IMPORTING') {
    return (
      <>
        <Button type="primary" onClick={handleClick}>
          Start importing
        </Button>
      </>
    );
  }
  return null;
};

export default StartImporting;

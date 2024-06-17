import { Button, Modal } from 'antd';
import * as React from 'react';
import { useContext } from '../../layouts/useContext';
import { useContext as useImporting } from '@graphscope/studio-importor';
import { submitDataloadingJob, bindDatasourceInBatch } from './services';
import type { FieldType } from './load-config';
import LoadConfig from './load-config';
interface StartImportingProps {
  onClick?: () => void;
}
const { useState } = React;
const StartImporting: React.FunctionComponent<StartImportingProps> = props => {
  const { store } = useContext();
  const { store: importingStore } = useImporting();
  const { appMode, nodes, edges } = importingStore;
  const { graphId } = store;

  const [state, updateState] = useState({
    open: false,
    /** 是否导入完成 */
    isImportFinish: false,
  });
  const { open, isImportFinish } = state;
  const handleClick = async (values: FieldType) => {
    /** loading config */
    console.log(values);
    //先绑定数据
    const bindStatus = await bindDatasourceInBatch(graphId, {
      nodes: nodes.map(item => item.data),
      edges: edges.map(item => item.data),
    });
    // 再倒入数据
    const res = await submitDataloadingJob(graphId, {
      nodes,
      edges,
    });
    console.log('res', res);
    updateState(preset => {
      return {
        ...preset,
        isImportFinish: true,
      };
    });

  };

  if (appMode === 'DATA_IMPORTING') {
    return (
      <>
        <Button
          type="primary"
          onClick={() => {
            updateState(preset => {
              return {
                ...preset,
                open: true,
              };
            });
          }}
        >
          Start importing
        </Button>
        <LoadConfig
          open={open}
          isImportFinish={isImportFinish}
          onFinish={handleClick}
          onColse={() =>
            updateState(preset => {
              return {
                ...preset,
                open: false,
              };
            })
          }
        />
      </>
    );
  }
  return null;
};

export default StartImporting;

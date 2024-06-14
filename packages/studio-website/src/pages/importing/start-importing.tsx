import { Button, Modal } from 'antd';
import * as React from 'react';
import { useContext } from '../../layouts/useContext';
import { useContext as useImporting } from '@graphscope/studio-importor';
import { submitDataloadingJob, bindDatasourceInBatch } from './services';
import ModalType from './modal-type';
import type { FieldType } from './modal-type';
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
  });
  const { open } = state;
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
        open: false,
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
        <Modal title="Loading Config" open={open} footer={null} closable={false}>
          <ModalType handleFinish={handleClick} />
        </Modal>
      </>
    );
  }
  return null;
};

export default StartImporting;

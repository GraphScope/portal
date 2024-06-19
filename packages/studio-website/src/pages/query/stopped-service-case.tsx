import React, { useEffect, useState } from 'react';
import { Modal, Result, Button, Space } from 'antd';
import { useContext } from '@/layouts/useContext';
import { startService, listGraphs } from '@/pages/instance/lists/service';

interface IEmptyModelCaseProps {}

const StoppedServiceCase: React.FunctionComponent<IEmptyModelCaseProps> = props => {
  const { store, updateStore } = useContext();
  const { graphId, draftId, graphs } = store;
  const [state, setState] = useState({
    open: false,
    isLoading: false,
  });
  useEffect(() => {
    if (graphId !== draftId) {
      const matchGraph = graphs.find(item => item.id === graphId) || { status: '' };
      const { status } = matchGraph;
      if (status === 'Stopped') {
        setState(preState => {
          return {
            ...preState,
            open: true,
          };
        });
      }
    }
  }, [graphId]);
  const { open } = state;
  const handleRestart = async () => {
    setState(preState => {
      return {
        ...preState,
        isLoading: true,
      };
    });
    const status = await startService(graphId || '');
    const newGraphs = await listGraphs();
    setState(preState => {
      return {
        ...preState,
        isLoading: false,
        open: false,
      };
    });
    updateStore(draft => {
      //@ts-ignore
      draft.graphs = newGraphs || [];
    });
  };
  const handleClose = () => {
    setState(preState => {
      return {
        ...preState,
        open: false,
      };
    });
  };

  console.log('state', state.isLoading);
  if (graphId !== draftId) {
    return (
      <div>
        <Modal title={null} open={open} footer={null} closable={false}>
          <Result
            status="403"
            title="The Graph Service is Stopped"
            subTitle="Click the 'Start Service' button below to activate the service, or select a running graph instance to proceed with querying data."
            extra={
              <Space>
                <Button type="primary" onClick={handleRestart} loading={state.isLoading} style={{ width: '128px' }}>
                  Start Server
                </Button>
                <Button onClick={handleClose} style={{ width: '128px' }}>
                  Close
                </Button>
              </Space>
            }
          />
        </Modal>
      </div>
    );
  }
  return null;
};

export default StoppedServiceCase;

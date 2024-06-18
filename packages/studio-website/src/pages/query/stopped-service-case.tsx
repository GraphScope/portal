import React, { useEffect, useState } from 'react';
import { Modal, Result, Button } from 'antd';
import { useContext } from '@/layouts/useContext';
import { startService } from '@/pages/instance/lists/service';
interface IEmptyModelCaseProps {}

const StoppedServiceCase: React.FunctionComponent<IEmptyModelCaseProps> = props => {
  const { store, updateStore } = useContext();
  const { graphId, draftId, graphs } = store;
  const [state, setState] = useState({
    open: false,
  });
  useEffect(() => {
    if (graphId !== draftId) {
      const matchGraph = graphs.find(item => item.id === graphId) || { status: '' };
      const { status } = matchGraph;
      if (status === 'Stopped') {
        setState({
          open: true,
        });
      }
    }
  }, []);
  const { open } = state;
  const handleRestart = async () => {
    const result = await startService(graphId || '');
    setState({
      open: false,
    });
  };

  if (graphId !== draftId) {
    return (
      <div>
        <Modal title={null} open={open} footer={null} closable={false} width={1000}>
          <Result
            status="403"
            title="The Graph Service is Stopped"
            subTitle="Click the 'Start Service' button below to activate the service, or select a running graph instance to proceed with querying data."
            extra={
              <Button type="primary" onClick={handleRestart}>
                Start Server
              </Button>
            }
          />
        </Modal>
      </div>
    );
  }
  return null;
};

export default StoppedServiceCase;

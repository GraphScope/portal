import React, { useEffect, useState } from 'react';
import { Modal, Result, Button, Col, Row, Flex, Divider } from 'antd';
import { useContext } from '@/layouts/useContext';
import { history } from 'umi';
import ConnectEndpoint from './connect-endpoint';
import { SplitSection } from '@graphscope/studio-components';
interface IEmptyModelCaseProps {}

const EmptyModelCase: React.FunctionComponent<IEmptyModelCaseProps> = props => {
  const { store, updateStore } = useContext();
  const { graphId, draftId } = store;
  const [state, setState] = useState({
    open: false,
  });
  useEffect(() => {
    if (graphId === draftId) {
      setState({
        open: true,
      });
    }
  }, []);
  const { open } = state;
  const handleGotoModeling = () => {
    history.push(`/modeling?graph_id=${draftId}`);
    updateStore(draft => {
      draft.currentnNav = '/modeling';
    });
  };
  /** 连接参数 */
  const handleFinish = (values: any) => {
    console.log(values);
  };
  if (graphId === draftId) {
    return (
      <div>
        <Modal title={null} open={open} footer={null} closable={false} width={1000}>
          <SplitSection
            leftSide={
              <ConnectEndpoint
                handleFinish={handleFinish}
                handleColse={() =>
                  setState({
                    open: false,
                  })
                }
              />
            }
            rightSide={
              <Result
                status="403"
                title="Please create the graph model first"
                subTitle="Sorry, the system detected that there is no available graph model. Please create a graph model before importing data"
                extra={
                  <Button type="primary" onClick={handleGotoModeling}>
                    Goto Modeling
                  </Button>
                }
              />
            }
          />
        </Modal>
      </div>
    );
  }
  return null;
};

export default EmptyModelCase;

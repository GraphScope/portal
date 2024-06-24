import React, { useEffect, useState } from 'react';
import { Modal, Result, Button } from 'antd';
import { useContext } from '@/layouts/useContext';
import { history } from 'umi';
import { FormattedMessage } from 'react-intl';
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
  if (graphId === draftId) {
    return (
      <div>
        <Modal title={null} open={open} footer={null} closable={false}>
          <Result
            status="403"
            title={<FormattedMessage id="Please create the graph model first" />}
            subTitle={
              <FormattedMessage id="Sorry, the system detected that there is no available graph model. Please create a graph model before importing data" />
            }
            extra={
              <Button type="primary" onClick={handleGotoModeling}>
                <FormattedMessage id="Goto Modeling" />
              </Button>
            }
          />
        </Modal>
      </div>
    );
  }
  return null;
};

export default EmptyModelCase;

import { Button, Modal, Result, Typography } from 'antd';
import * as React from 'react';
import { useContext } from '../../layouts/useContext';
import { useContext as useImporting } from '@graphscope/studio-importor';
import { bindDatasourceInBatch } from './services';
import { SplitSection } from '@graphscope/studio-components';
import { FormattedMessage } from 'react-intl';
import StartLoad from './start-load';
const { Text } = Typography;
interface StartImportingProps {
  onClick?: () => void;
}
const { useState } = React;
const StartImporting: React.FunctionComponent<StartImportingProps> = props => {
  const { store } = useContext();
  const { store: importingStore } = useImporting();
  const { appMode, nodes, edges } = importingStore;
  const { graphId } = store;

  const [state, updateState] = useState<{
    open: boolean;
    status: string;
    message: string;
  }>({
    open: false,
    status: '',
    message: '',
  });
  const { open, status, message } = state;

  const handleBind = async () => {
    let _status = '';
    let _message = '';
    const bindStatus = await bindDatasourceInBatch(graphId || '', {
      nodes: nodes,
      edges: edges,
    })
      .then((res: any) => {
        if (res.status === 200) {
          _status = 'success';
          _message = `You have successfully bound the data source. Please complete the configuration to start importing data.`;
          return res.data;
        }
        _status = 'error';
        _message = res.message;
      })
      .catch(error => {
        _status = 'error';
        _message = error.response.data;
      });

    updateState(preset => {
      return {
        ...preset,
        open: true,
        status: _status,
        message: _message,
      };
    });
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

  if (appMode === 'DATA_IMPORTING') {
    return (
      <>
        <Button type="primary" onClick={handleBind}>
          <FormattedMessage id="Data source binding" />
        </Button>
        <Modal title="" open={open} footer={null} closable={false} width={1000}>
          <SplitSection
            splitText=""
            span={8}
            leftSide={
              <Result
                status="404"
                subTitle={
                  <>
                    <Text type={status === 'success' ? 'secondary' : 'danger'}>{message}</Text>
                  </>
                }
              />
            }
            rightSide={<StartLoad onColse={onColse} graphId={graphId || ''} />}
          />
        </Modal>
      </>
    );
  }
  return null;
};

export default StartImporting;

import React, { useEffect, useState } from 'react';
import { useContext } from '@graphscope/studio-graph';
import { SplitSection, Utils } from '@graphscope/studio-components';
import { theme, Flex, Input, Modal, Button, Typography } from 'antd';
import { ApiOutlined } from '@ant-design/icons';
import ImportIntoKuzu from './import-into-kuzu';
import { ConnectEndpoint } from '@graphscope/studio-query';
import { LoadCSV } from '@graphscope/studio-graph';

interface IInitProps {}

const Init: React.FunctionComponent<IInitProps> = props => {
  const { id, store } = useContext();
  const { token } = theme.useToken();
  const [visible, setVisible] = React.useState(false);

  const handleToggle = () => {
    setVisible(!visible);
  };
  const handleClose = () => {
    setVisible(false);
  };
  const handleConnect = params => {
    handleClose();
  };
  useEffect(() => {
    const query_endpoint = Utils.storage.get('query_endpoint');
    if (!query_endpoint) {
      setVisible(true);
    }
  }, []);
  return (
    <>
      <Button onClick={handleToggle} icon={<ApiOutlined />} type="text"></Button>
      <Modal open={visible} onClose={handleClose} onCancel={handleClose} width={'80%'} footer={null}>
        <SplitSection
          leftSide={<ConnectEndpoint onConnect={handleConnect} />}
          rightSide={
            <Flex vertical style={{ padding: '12px', display: 'flex', flex: 1, height: '90%' }}>
              <Typography.Title level={3} style={{ marginBottom: '16px' }}>
                Load CSV Files
              </Typography.Title>
              <ImportIntoKuzu handleClose={handleClose} />
            </Flex>
          }
        />
      </Modal>
    </>
  );
};

export default Init;

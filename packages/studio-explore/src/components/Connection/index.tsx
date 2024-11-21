import React, { useState } from 'react';
import { useContext } from '@graphscope/studio-graph';
import { SplitSection } from '@graphscope/studio-components';
import { theme, Flex, Input, Modal, Button } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';
import LoadKuzuWasm from './import-from-csv';
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
    console.log('params');
    handleClose();
  };
  return (
    <>
      <Button onClick={handleToggle} icon={<DatabaseOutlined />} type="text"></Button>
      <Modal open={visible} onClose={handleClose} onCancel={handleClose} width={'80%'} footer={null}>
        <SplitSection leftSide={<ConnectEndpoint onConnect={handleConnect} />} rightSide={<LoadCSV />} />
      </Modal>
    </>
  );
};

export default Init;

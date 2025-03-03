import React, { useEffect, useState } from 'react';
import { useContext } from '@graphscope/studio-graph';
import { SplitSection, Utils } from '@graphscope/studio-components';
import { theme, Flex, Input, Modal, Button, Typography, Divider, Row, Col, Card } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import { ConnectEndpoint } from '@graphscope/studio-query';

interface IInitProps {}

const Setting: React.FunctionComponent<IInitProps> = props => {
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

  return (
    <>
      <Button onClick={handleToggle} icon={<SettingOutlined />} type="text"></Button>
      <Modal open={visible} onClose={handleClose} onCancel={handleClose} width={'80%'} footer={null}>
        <Flex vertical gap={12}>
          <Typography.Title level={3}>Settings</Typography.Title>

          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Card>
                <Typography.Title level={5}>Searchbar</Typography.Title>
                <Typography.Text type="secondary">dddd</Typography.Text>
              </Card>
            </Col>
            <Col span={12}>
              {/* <Card>
                <Typography.Title level={5}>Searchbar</Typography.Title>
                <Typography.Text type="secondary">dddd</Typography.Text>
              </Card> */}
            </Col>
          </Row>
        </Flex>
      </Modal>
    </>
  );
};

export default Setting;

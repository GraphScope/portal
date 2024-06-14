import * as React from 'react';
import { Flex, Typography, Button, Select, Form, Switch, Input, Row, Col } from 'antd';
import { EditOutlined } from '@ant-design/icons';

interface IConnectEndpointProps {
  handleFinish: (values: FieldType) => void;
  handleColse: () => void;
}
const { Title, Text } = Typography;
export type FieldType = {
  instance_name: string;
  protocol: string;
  connection_url: string;
  database_user: string;
  password: string;
  connection: boolean;
};
// const { useState } = React;
const ConnectEndpoint: React.FunctionComponent<IConnectEndpointProps> = props => {
  const { handleFinish, handleColse } = props;
  // const [state, updateState] = useState({
  //   instanceEdit: false,
  // });
  // const { instanceEdit } = state;
  return (
    <Flex vertical>
      <div style={{ textAlign: 'center' }}>
        <Title level={2}>GraphScope</Title>
        {/* <Title level={2}>Connect to instance</Title> */}
        {/* <Text>
            6a2a413b.databases.neo4j.io:7687
            <EditOutlined
              onClick={() => {
                updateState(preset => {
                  return {
                    ...preset,
                    instanceEdit: true,
                  };
                });
              }}
            />
          </Text> */}
      </div>
      <Form name="modal_type" layout="vertical" style={{ marginTop: '24px' }} onFinish={handleFinish}>
        {/* {instanceEdit && (
          <>
            <Form.Item<FieldType> label="Instance name" name="instance_name" style={{ marginBottom: '6px' }}>
              <Input disabled />
            </Form.Item>
            <Text>Readable name of your choice, does not affect connection and is visible only to you</Text>
          </>
        )} */}
        <Row gutter={[12, 0]} style={{ marginTop: '16px' }}>
          <Col span={6}>
            <Form.Item<FieldType> label="Protocol" name="protocol">
              <Select
                allowClear
                options={[
                  { label: 'csv', value: 'csv' },
                  { label: 'odps', value: 'odps' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item<FieldType> label="Connection URL" name="connection_url">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item<FieldType> label="Database user" name="database_user">
          <Select
            allowClear
            options={[
              { label: 'user1', value: 'user1' },
              { label: 'user2', value: 'user2' },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType> label="Password" name="password">
          <Select
            allowClear
            options={[
              { label: 'xxx', value: 'xxx' },
              { label: 'xxxx', value: 'xxxx' },
            ]}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Flex vertical gap={12}>
            <Button type="primary" htmlType="submit">
              Connect
            </Button>
            <Button onClick={() => handleColse}>Cancel</Button>
          </Flex>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default ConnectEndpoint;

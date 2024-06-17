import * as React from 'react';
import { Flex, Typography, Button, Select, Form, Input, Row, Col } from 'antd';
import { EditOutlined } from '@ant-design/icons';

interface IConnectEndpointProps {
  onFinish: (values: FieldType) => void;
  onColse: () => void;
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
  const { onFinish, onColse } = props;
  // const [state, updateState] = useState({
  //   instanceEdit: false,
  // });
  // const { instanceEdit } = state;
  return (
    <Flex vertical style={{ marginRight: '12px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>
        GraphScope
      </Title>
      <Form name="modal_type" layout="vertical" style={{ marginTop: '24px' }} onFinish={onFinish}>
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
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Password" name="password">
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <Button type="primary" htmlType="submit">
            Connect
          </Button>
          <Button onClick={onColse}>Cancel</Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default ConnectEndpoint;

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

const ConnectEndpoint: React.FunctionComponent<IConnectEndpointProps> = props => {
  const { onFinish, onColse } = props;
  return (
    <Flex vertical style={{ padding: '12px 24px' }}>
      <Title level={3} style={{ marginBottom: '12px' }}>
        Connect Endpoint
      </Title>
      <Text type="secondary" style={{ marginBottom: '16px' }}>
        If you have already started the GraphScope endpoint through other means, you can directly connect to it and
        start querying data.
      </Text>
      <Form name="modal_type" layout="vertical" onFinish={onFinish}>
        <Row gutter={[12, 0]} style={{ marginTop: '16px' }}>
          <Col span={6}>
            <Form.Item<FieldType> label="Protocol" name="protocol">
              <Select allowClear options={[{ label: 'neo4j', value: 'neo4j://' }]} />
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

        <Form.Item style={{ marginTop: '48px' }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: '128px', marginBottom: '12px', marginRight: '12px' }}
          >
            Connect
          </Button>
          <Button style={{ width: '128px' }} onClick={onColse}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default ConnectEndpoint;

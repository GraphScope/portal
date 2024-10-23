import * as React from 'react';
import { Flex, Typography, Button, Select, Input, Row, Col, Result, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Utils } from '@graphscope/studio-components';
const { storage } = Utils;
const { Title, Text } = Typography;

export type FieldType = {
  query_language?: string;
  query_endpoint?: string;
  query_initiation?: 'Browser' | 'Server';
  query_username?: string;
  query_password?: string;
};

export interface IConnectEndpointProps extends FieldType {
  onConnect: (values: FieldType) => void;
  onClose?: () => void;
}
const ConnectEndpoint: React.FunctionComponent<IConnectEndpointProps> = props => {
  const [form] = Form.useForm();
  const { onConnect, onClose } = props;
  React.useEffect(() => {
    form.setFieldsValue({
      query_language: props.query_language || storage.get('query_language') || 'cypher',
      query_endpoint: props.query_endpoint || storage.get('query_endpoint') || 'neo4j://127.0.0.1:7687',
      query_initiation: props.query_initiation || storage.get('query_initiation') || 'Browser',
      query_username: props.query_username || storage.get('query_username') || 'admin',
      query_password: props.query_password || storage.get('query_password') || 'password',
    });
  }, []);
  const handleConnect = () => {
    const values = form.getFieldsValue(true);
    Object.keys(values).forEach(key => {
      storage.set(key, values[key]);
    });
    onConnect && onConnect(form.getFieldsValue(true));
  };

  return (
    <Flex vertical style={{ padding: '12px 24px' }}>
      <Title level={3} style={{ marginBottom: '12px' }}>
        <FormattedMessage id="Connect Endpoint" />
      </Title>

      <Form layout="vertical" form={form}>
        <Form.Item<FieldType> label={<FormattedMessage id="Connection URL" />} name="query_endpoint">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label={<FormattedMessage id="Query language" />} name="query_language">
          <Select
            allowClear
            options={[
              { label: 'Cypher', value: 'cypher' },
              { label: 'Gremlin', value: 'gremlin' },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType> label={<FormattedMessage id="Query initiation method" />} name="query_initiation">
          <Select
            allowClear
            options={[
              { label: 'Browser (client-side)', value: 'Browser' },
              {
                label: `Server (Ensure that your "${location.origin}/query" endpoint is available)`,
                value: 'Server',
              },
            ]}
          />
        </Form.Item>

        <Form.Item<FieldType> label={<FormattedMessage id="Username" />} name="query_username">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label={<FormattedMessage id="Password" />} name="query_password">
          <Input.Password />
        </Form.Item>

        <Form.Item style={{ marginTop: '48px' }}>
          <Flex justify="start">
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%', marginBottom: '12px', marginRight: '12px' }}
              onClick={handleConnect}
            >
              <FormattedMessage id="Connect" />
            </Button>
            {onClose && (
              <Button style={{ width: '100%', marginBottom: '12px', marginRight: '12px' }} onClick={onClose}>
                <FormattedMessage id="Close" />
              </Button>
            )}
          </Flex>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default ConnectEndpoint;

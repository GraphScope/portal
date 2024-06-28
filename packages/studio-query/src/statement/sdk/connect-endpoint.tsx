import * as React from 'react';
import { Flex, Typography, Button, Select, Form, Input, Row, Col, Result } from 'antd';
import { FormattedMessage } from 'react-intl';
import { SplitSection } from '@graphscope/studio-components';
import { Utils } from '@graphscope/studio-components';

export interface IConnectEndpointProps {
  onConnect: (values: FieldType) => void;
}
const { Title, Text } = Typography;
export type FieldType = {
  language: string;
  endpoint: string;
  username: string;
  password: string;
};

const ConnectInfo = (props: IConnectEndpointProps) => {
  const { onConnect } = props;

  return (
    <Flex vertical style={{ padding: '12px 24px' }}>
      <Title level={3} style={{ marginBottom: '12px' }}>
        <FormattedMessage id="Connect Endpoint" />
      </Title>

      <Form name="modal_type" layout="vertical" onFinish={onConnect}>
        <Row gutter={[12, 0]} style={{ marginTop: '16px' }}>
          <Col style={{ width: '110px' }}>
            <Form.Item<FieldType> label={<FormattedMessage id="language" />} name="language">
              <Select
                allowClear
                options={[
                  { label: 'Cypher', value: 'cypher' },
                  { label: 'Gremlin', value: 'gremlin' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col style={{ flex: '1' }}>
            <Form.Item<FieldType> label={<FormattedMessage id="Connection URL" />} name="endpoint">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item<FieldType> label={<FormattedMessage id="Database user" />} name="username">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label={<FormattedMessage id="Password" />} name="password">
          <Input.Password />
        </Form.Item>

        <Form.Item style={{ marginTop: '48px' }}>
          <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: '12px', marginRight: '12px' }}>
            <FormattedMessage id="Connect" />
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};
const LeftSide = () => {
  return (
    <Result
      status={404}
      subTitle={
        <Text type="secondary" style={{ marginBottom: '16px' }}>
          <FormattedMessage
            id="If you have already started the GraphScope endpoint through other means, you can directly connect to it and
    start querying data."
          />
        </Text>
      }
    />
  );
};
const ConnectEndpoint: React.FunctionComponent<IConnectEndpointProps> = props => {
  const { onConnect } = props;
  return <SplitSection splitText="" leftSide={<LeftSide />} rightSide={<ConnectInfo onConnect={onConnect} />} />;
};

export default ConnectEndpoint;

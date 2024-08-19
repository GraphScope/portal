import * as React from 'react';
import ReactDOM from 'react-dom';
import { Container } from '../../components';

interface ICreateProps {}

import { Flex, Typography, Button, Select, Input, Row, Col, Result, Form, Upload } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Utils } from '@graphscope/studio-components';
const { storage } = Utils;
const { Title, Text } = Typography;

export type FieldType = {
  model: string;
  base_url: string;
  api_key: string;
  model_kargs: string;
};

export interface IConnectEndpointProps {
  onStart?: (values: FieldType) => void;
  onClose?: () => void;
}
const Setting: React.FunctionComponent<IConnectEndpointProps> = props => {
  const [form] = Form.useForm();
  const { onStart, onClose } = props;
  //   React.useEffect(() => {
  //     form.setFieldsValue({
  //       query_language: storage.get('query_language'),
  //       query_endpoint: storage.get('query_endpoint'),
  //       query_initiation: storage.get('query_initiation'),
  //       query_username: storage.get('query_username'),
  //       query_password: storage.get('query_password'),
  //     });
  //   }, []);
  const handleConnect = () => {
    const values = form.getFieldsValue(true);
    console.log('form.getFieldsValue()', values);
    Object.keys(values).forEach(key => {
      storage.set(key, values[key]);
    });
    onStart && onStart(form.getFieldsValue(true));
  };

  return (
    <Flex vertical style={{ padding: '24px' }}>
      <Form layout="vertical" form={form}>
        <Form.Item<FieldType> label={<FormattedMessage id="unstructured data type" />}>
          <Select
            allowClear
            options={[
              { label: 'PDF', value: 'PDF' },
              { label: 'Video', value: 'Video' },
              { label: 'Text', value: 'Text' },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType> label={<FormattedMessage id="Upload" />}>
          <Upload />
        </Form.Item>
        <Form.Item style={{ marginTop: '48px' }}>
          <Flex justify="start">
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginBottom: '12px', marginRight: '12px' }}
              onClick={handleConnect}
            >
              <FormattedMessage id="Start Extract" />
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Flex>
  );
};

const Create: React.FunctionComponent<ICreateProps> = props => {
  return (
    <Container
      breadcrumb={[
        {
          title: 'Home',
        },
        {
          title: <a href="/dataset">dataset</a>,
        },
        {
          title: 'create',
        },
      ]}
    >
      <Setting />
    </Container>
  );
};

export default Create;

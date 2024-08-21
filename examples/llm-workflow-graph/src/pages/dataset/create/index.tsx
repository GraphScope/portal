import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Container } from '../../components';
import { InboxOutlined } from '@ant-design/icons';
import { createDataset } from '../service';
interface ICreateProps {}

import { Flex, Typography, Button, Select, Input, Row, Col, Result, Form, Upload } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Utils } from '@graphscope/studio-components';
import { useNavigate } from 'react-router-dom';
const { storage } = Utils;
const { Title, Text } = Typography;

export type FieldType = {
  model: string;
  base_url: string;
  api_key: string;
  model_kargs: string;
};

export interface IConnectEndpointProps {}
const Setting: React.FunctionComponent<IConnectEndpointProps> = props => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [state, setState] = useState({
    loading: false,
  });
  const { loading } = state;
  //   React.useEffect(() => {
  //     form.setFieldsValue({
  //       query_language: storage.get('query_language'),
  //       query_endpoint: storage.get('query_endpoint'),
  //       query_initiation: storage.get('query_initiation'),
  //       query_username: storage.get('query_username'),
  //       query_password: storage.get('query_password'),
  //     });
  //   }, []);
  const handleConnect = async () => {
    const values = form.getFieldsValue(true);
    console.log('form.getFieldsValue()', values);
    Object.keys(values).forEach(key => {
      storage.set(key, values[key]);
    });
    setState(preState => {
      return {
        ...preState,
        loading: true,
      };
    });
    await createDataset({}).then(res => {
      console.log(res);
    });
    setState(preState => {
      return {
        ...preState,
        loading: false,
      };
    });
    navigate('/dataset');
  };

  return (
    <Flex vertical style={{ padding: '12px 32px' }}>
      <Form layout="vertical" form={form}>
        <Form.Item<FieldType> label={<FormattedMessage id="Unstructured data type" />}>
          <Select
            allowClear
            value={'PDF'}
            options={[
              { label: 'PDF', value: 'PDF' },
              { label: 'Video', value: 'Video', disabled: true },
              { label: 'Text', value: 'Text', disabled: true },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType> label={<FormattedMessage id="Upload" />}>
          <div
            style={{
              width: '100%',
              background: '#fafafa',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              border: '1px dashed #ddd',
              borderRadius: '6px',
              padding: '24px',
              boxSizing: 'border-box',
            }}
          >
            <Upload>
              <Flex align="center" vertical>
                <Typography.Link>
                  <InboxOutlined style={{ fontSize: '40px' }} />
                </Typography.Link>
                <br />
                <Typography.Text>Click or drag file to this area to upload</Typography.Text>
                <Typography.Text type="secondary">
                  Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned
                  files.
                </Typography.Text>
              </Flex>
            </Upload>
          </div>
        </Form.Item>
        <Form.Item style={{ marginTop: '48px' }}>
          <Flex justify="start">
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginBottom: '12px', marginRight: '12px' }}
              onClick={handleConnect}
              loading={loading}
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

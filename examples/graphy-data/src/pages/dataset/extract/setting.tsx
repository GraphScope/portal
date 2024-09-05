import * as React from 'react';
import { Flex, Typography, Button, Select, Input, Row, Col, Result, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Utils } from '@graphscope/studio-components';
const { storage } = Utils;
const { Title, Text } = Typography;
import { updateExtractConfig, getExtractConfig } from '../service';
import { useNavigate } from 'react-router-dom';
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
const ExractSetting: React.FunctionComponent<IConnectEndpointProps> = props => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { onStart, onClose } = props;
  React.useEffect(() => {
    // form.setFieldsValue({
    //   model: 'Qwen-Max',
    //   base_url: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    //   api_key: '',
    //   model_kargs: '{\n  "temperature": 0,\n  "stop": [\n    ""\n  ],\n  "max_tokens": 1024,\n  "streaming": true\n}',
    // });
    const datasetId = Utils.getSearchParams('id');
    getExtractConfig(datasetId).then(res => {
      form.setFieldsValue(res);
    });
  }, []);
  const handleConnect = async () => {
    const values = form.getFieldsValue(true);
    onStart && onStart(form.getFieldsValue(true));
    const datasetId = Utils.getSearchParams('id');
    await updateExtractConfig(datasetId, values);
    navigate('/dataset');
  };

  return (
    <Flex vertical style={{ padding: '12px 32px' }}>
      <Form layout="vertical" form={form}>
        <Form.Item<FieldType> label={<FormattedMessage id="LLM Model" />} name="model">
          <Select
            allowClear
            options={[
              { label: 'Qwen-Max', value: 'Qwen-Max' },
              { label: 'OpenAI', value: 'OpenAI' },
              { label: 'Ollama', value: 'Ollama' },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType> label={<FormattedMessage id="Base URL" />} name="base_url">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label={<FormattedMessage id="API Key" />} name="api_key">
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label={<FormattedMessage id="Model Kargs" />} name="model_kargs">
          <Input.TextArea rows={8} />
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

export default ExractSetting;

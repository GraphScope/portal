import * as React from 'react';
import { Flex, Typography, Button, Select, Input, Row, Col, Result, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Utils } from '@graphscope/studio-components';
const { storage } = Utils;
const { Title, Text } = Typography;
import { updateExtractConfig, getExtractConfig, runExtract } from '../service';
import { useNavigate } from 'react-router-dom';
export type FieldType = {
  llm_model: string;
  base_url: string;
  api_key: string;
  model_kwargs: string;
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
  const handleStartExtract = async () => {
    const datasetId = Utils.getSearchParams('id');
    const data = await runExtract(datasetId);
    console.log('data', data);
    navigate('/dataset');
  };

  return (
    <Flex vertical style={{ padding: '12px 32px' }}>
      <Form layout="vertical" form={form}>
        <Form.Item<FieldType> label={<FormattedMessage id="LLM Model" />} name="llm_model">
          <Select
            allowClear
            options={[
              { label: 'Qwen-Plus', value: 'qwen-plus' },
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

        <Form.Item<FieldType> label={<FormattedMessage id="Model Kargs" />} name="model_kwargs">
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
              <FormattedMessage id="Save Extract Setting" />
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default ExractSetting;

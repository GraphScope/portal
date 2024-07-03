import React, { useEffect } from 'react';
import { Button, Select, Form, Flex, Typography } from 'antd';
import type { DataloadingJobConfigLoadingConfigImportOptionEnum } from '@graphscope/studio-server';
import { FormattedMessage, useIntl } from 'react-intl';
export type FieldType = {
  type?: string;
  delimiter?: string;
  import_option?: DataloadingJobConfigLoadingConfigImportOptionEnum;
  header_row: boolean;
};
type ILeftSide = {
  onFinish: (value: any) => void;
  onColse: () => void;
  datatype?: string;
  delimiter?: string;
};
const { Title, Text } = Typography;
const LeftSide: React.FC<ILeftSide> = props => {
  const { onFinish, onColse, delimiter, datatype } = props;
  const [form] = Form.useForm();
  const intl = useIntl();
  console.log(intl);

  const handleClick = () => {
    const data = form.getFieldsValue();
    onFinish(data);
  };
  useEffect(() => {
    form.setFieldsValue({
      type: datatype || 'csv',
      delimiter: delimiter || '|',
      import_option: 'overwrite',
      header_row: true,
    });
  }, [delimiter, datatype]);
  return (
    <div style={{ padding: '12px 36px' }}>
      <Title level={2}>
        <FormattedMessage id="Configuration" />
      </Title>
      <Text type="secondary">
        <FormattedMessage id="You have successfully bound the data source. Please complete the configuration to start importing data." />
      </Text>
      <Form
        name="modal_type"
        layout="vertical"
        style={{ margin: '12px 12px 0px 0px' }}
        labelCol={{ span: 8 }}
        form={form}
      >
        <Form.Item<FieldType> label="Type" name="type">
          <Select
            allowClear
            options={[
              { label: 'csv', value: 'csv' },
              { label: 'odps', value: 'odps' },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType> label="Delimiter" name="delimiter">
          <Select
            allowClear
            options={[
              { label: '|', value: '|' },
              { label: ',', value: ',' },
              { label: ';', value: ';' },
              { label: <>\t</>, value: '\t' },
              { label: ' ', value: ' ' },
              { label: ':', value: ':' },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType> label="Header Row" name="header_row">
          <Select
            allowClear
            options={[
              { label: 'true', value: true },
              { label: 'false', value: false },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType> label="Import Option" name="import_option">
          <Select
            allowClear
            options={[
              { label: 'overwrite', value: 'overwrite' },
              { label: 'init', value: 'init' },
            ]}
          />
        </Form.Item>
        <Flex justify="end" gap={12}>
          <Button style={{ width: '128px' }} type="primary" onClick={handleClick}>
            <FormattedMessage id="Load data" />
            {/* {intl ? '加载数据' : 'Load data'} */}
          </Button>
          <Button style={{ width: '128px' }} onClick={onColse}>
            <FormattedMessage id="Close" />
          </Button>
        </Flex>
      </Form>
    </div>
  );
};

export default LeftSide;

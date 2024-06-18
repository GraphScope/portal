import React, { useEffect } from 'react';
import { history } from 'umi';
import { Button, Select, Form, Flex, Typography } from 'antd';
import type { IModalType } from '.';
import type { DataloadingJobConfigLoadingConfigImportOptionEnum } from '@graphscope/studio-server';
export type FieldType = {
  type?: string;
  delimiter?: string;
  import_option?: DataloadingJobConfigLoadingConfigImportOptionEnum;
  header_row: boolean;
};
type ILeftSide = Pick<IModalType, 'onFinish' | 'onColse' | 'datatype' | 'delimiter'>;
const { Title, Text } = Typography;
const LeftSide: React.FC<ILeftSide> = props => {
  const { onFinish, onColse, delimiter, datatype } = props;
  const [form] = Form.useForm();
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
      <Title level={2}>Configuration</Title>
      <Text type="secondary">
        You have successfully bound the data source. Please complete the configuration to start importing data.
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
            Load data
          </Button>
          <Button style={{ width: '128px' }} onClick={onColse}>
            Close
          </Button>
        </Flex>
      </Form>
    </div>
  );
};

export default LeftSide;

import React from 'react';
import { history } from 'umi';
import { Button, Select, Form, Flex, Typography } from 'antd';
import type { IModalType } from '.';
export type FieldType = {
  type?: string;
  delimiter?: string;
  import_option?: string;
  header_row: boolean;
};
type ILeftSide = Pick<IModalType, 'onFinish' | 'onColse'>;
const { Title } = Typography;
const LeftSide: React.FC<ILeftSide> = props => {
  const { onFinish, onColse } = props;
  const [form] = Form.useForm();
  const handleClick = () => {
    const data = form.getFieldsValue();
    onFinish(data);
  };
  return (
    <div style={{ padding: '0px 24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginTop: '0px' }}>
        LoadConfig
      </Title>
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

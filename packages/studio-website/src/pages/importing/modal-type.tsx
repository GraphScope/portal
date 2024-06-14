import React from 'react';
import type { FormProps } from 'antd';
import { Button, Select, Form, Input } from 'antd';

export type FieldType = {
  type?: string;
  delimiter?: string;
  import_option?: string;
};

interface IModalType {
  handleFinish: (values: FieldType) => void;
}
const ModalType: React.FC<IModalType> = props => {
  const { handleFinish } = props;
  return (
    <Form name="modal_type" style={{ marginTop: '24px' }} labelCol={{ span: 5 }} onFinish={handleFinish}>
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

      <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ModalType;

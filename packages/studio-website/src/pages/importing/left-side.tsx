import React from 'react';
import { Button, Select, Form, Flex } from 'antd';
import type { IModalType } from './modal-type';
export type FieldType = {
  type?: string;
  delimiter?: string;
  import_option?: string;
  header_row: boolean;
};
type ILeftSide = Pick<IModalType, 'handleFinish' | 'handleColse'> & {
  finish: boolean;
  handleState: () => void;
};
const LeftSide: React.FC<ILeftSide> = props => {
  const { finish, handleFinish, handleColse, handleState } = props;
  const [form] = Form.useForm();
  const handleClick = () => {
    handleState();
    const data = form.getFieldsValue();
    handleFinish(data);
  };
  return (
    <div style={{ marginRight: '12px' }}>
      <Form name="modal_type" layout="vertical" labelCol={{ span: 8 }} form={form}>
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
      </Form>
      <>
        {finish ? (
          <Flex vertical align="end" gap={12}>
            <Button
              style={{ width: '240px' }}
              type="primary"
              onClick={() => {
                handleFinish;
              }}
            >
              Goto Jobs
            </Button>
            <Button style={{ width: '240px' }} onClick={handleColse}>
              Close
            </Button>
          </Flex>
        ) : (
          <Flex vertical align="end">
            <Button style={{ width: '240px' }} type="primary" onClick={handleClick}>
              Load data
            </Button>
          </Flex>
        )}
      </>
    </div>
  );
};

export default LeftSide;

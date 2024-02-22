import React from 'react';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext } from '../useContext';
import { registerReceiver } from '../service';

type FieldType = {
  type: string;
  webhook_url: string;
  at_user_ids: string;
  is_at_all: string;
};
const RECEIVEROPTION = [{ label: 'WebHook', value: 'webhook' }];
const CreateRecep: React.FC = () => {
  const { store, updateStore } = useContext();
  const { alertRecep } = store;
  const onFinish = async (values: any) => {
    console.log('Success:', values);
    const { at_user_ids } = values;
    await registerReceiver({ ...values, at_user_ids: [at_user_ids], enable: true });
    updateStore(draft => {
      draft.isEditRecep = false;
    });
  };
  return (
    <Form name="basic" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} onFinish={onFinish}>
      <Form.Item<FieldType>
        label={<FormattedMessage id="Receiver Type" />}
        name="type"
        rules={[{ required: true, message: 'Please input your Receiver!' }]}
      >
        <Select options={RECEIVEROPTION} />
      </Form.Item>

      <Form.Item<FieldType>
        label={<FormattedMessage id="WebHook URL" />}
        name="webhook_url"
        rules={[{ required: true, message: 'Please input your WebHook URL!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<FieldType> label={<FormattedMessage id="At User Ids" />} name="at_user_ids">
        <Input />
      </Form.Item>

      <Form.Item<FieldType> label={<FormattedMessage id="Is At All" />} name="is_at_all" valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          <FormattedMessage id="Submit" />
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateRecep;

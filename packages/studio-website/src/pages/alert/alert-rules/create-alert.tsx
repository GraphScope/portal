import React from 'react';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext } from '../useContext';
import { registerReceiver } from '../service';

type FieldType = {
  receiver: string;
  webhookUrl: string;
  id: string;
  isAll: string;
};
const RECEIVEROPTION = [{ label: 'WebHook', value: 'WebHook' }];
const CreateRecep: React.FC = () => {
  const { store, updateStore } = useContext();
  const { alertRecep } = store;
  const onFinish = async (values: any) => {
    console.log('Success:', values);
    // await porstAlertReceiver(values);
    updateStore(draft => {
      draft.isEditRecep = false;
      draft.alertRecep = [...alertRecep, { ...values, status: '激活' }];
    });
  };
  return (
    <Form name="basic" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} onFinish={onFinish}>
      <Form.Item<FieldType>
        label={<FormattedMessage id="Receiver Type" />}
        name="receiver"
        rules={[{ required: true, message: 'Please input your Receiver!' }]}
      >
        <Select options={RECEIVEROPTION} />
      </Form.Item>

      <Form.Item<FieldType>
        label={<FormattedMessage id="WebHook URL" />}
        name="webhookUrl"
        rules={[{ required: true, message: 'Please input your WebHook URL!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<FieldType> label={<FormattedMessage id="At User Ids" />} name="id">
        <Input />
      </Form.Item>

      <Form.Item<FieldType> label={<FormattedMessage id="Is At All" />} name="isAll" valuePropName="checked">
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

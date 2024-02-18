import React from 'react';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { useContext } from '../useContext';

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
  const onFinish = (values: any) => {
    console.log('Success:', values);
    updateStore(draft => {
      draft.isEditRecep = false;
      draft.alertRecep = [...alertRecep, { ...values, status: '激活' }];
    });
  };
  return (
    <Form name="basic" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} onFinish={onFinish}>
      <Form.Item<FieldType>
        label="Receiver 类型"
        name="receiver"
        rules={[{ required: true, message: 'Please input your Receiver!' }]}
      >
        <Select options={RECEIVEROPTION} />
      </Form.Item>

      <Form.Item<FieldType>
        label="WebHook URL"
        name="webhookUrl"
        rules={[{ required: true, message: 'Please input your WebHook URL!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<FieldType> label="被@人的用户ID" name="id">
        <Input />
      </Form.Item>

      <Form.Item<FieldType> label="所有人" name="isAll" valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateRecep;

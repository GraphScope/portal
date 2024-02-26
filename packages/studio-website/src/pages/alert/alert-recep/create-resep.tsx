import React, { useEffect } from 'react';
import { Button, Checkbox, Form, Input, Select, Modal, Flex, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import { registerReceiver, updateReceiverById } from '../service';
import { Item } from './index';

type FieldType = {
  type: string;
  webhook_url: string;
  at_user_ids: string;
  is_at_all: boolean;
  enable: boolean;
};
const RECEIVEROPTION = [{ label: 'WebHook', value: 'webhook' }];
type ICreateRecepProps = {
  isCreateRecep: boolean;
  handelChange(val: boolean): void;
  editDatas: Item;
};
const CreateRecep: React.FC<ICreateRecepProps> = props => {
  const { isCreateRecep, handelChange, editDatas } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    Object.keys(editDatas).length > 0 && form.setFieldsValue(editDatas);
  }, []);
  const onFinish = async () => {
    /** 编辑告警接收 */
    if (Object.keys(editDatas).length > 0) {
      const { receiver_id } = editDatas;
      const { at_user_ids } = form.getFieldsValue();
      const userid = Array.isArray(at_user_ids) ? at_user_ids : at_user_ids.split(',');
      const data = { ...form.getFieldsValue(), at_user_ids: userid };
      const res = await updateReceiverById(receiver_id, data);
      await message.success(res);
    } else {
      /** 创建告警接收 */
      const { at_user_ids } = form.getFieldsValue();
      const res = await registerReceiver({ ...form.getFieldsValue(), at_user_ids: [at_user_ids], enable: true });
      await message.success(res);
    }
    handelChange(false);
  };
  return (
    <Modal
      title={<FormattedMessage id="Create Alert Recep" />}
      width="35%"
      open={isCreateRecep}
      footer={null}
      onCancel={() => {
        handelChange(false);
        form.resetFields();
      }}
    >
      <Form name="basic" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} form={form}>
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
        <Form.Item<FieldType> label={<FormattedMessage id="Status" />} name="enable" valuePropName="checked">
          <Checkbox />
        </Form.Item>
      </Form>
      <Flex justify="center">
        <Button type="primary" htmlType="submit" onClick={() => onFinish()}>
          <FormattedMessage id="Submit" />
        </Button>
      </Flex>
    </Modal>
  );
};

export default CreateRecep;

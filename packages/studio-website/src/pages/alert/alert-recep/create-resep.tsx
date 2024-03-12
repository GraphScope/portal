import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Select, Modal, Flex, message, Tooltip, Switch } from 'antd';
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
  const [state, updateState] = useState({
    status: false,
    is_at_all: false,
  });
  const { status, is_at_all } = state;
  /** 首次查询并回填告警接收数据 */
  useEffect(() => {
    if (Object.keys(editDatas).length > 0) {
      const { enable, is_at_all } = editDatas;
      form.setFieldsValue(editDatas);
      updateState(preset => {
        return {
          ...preset,
          is_at_all: is_at_all,
          status: enable,
        };
      });
    }
  }, []);
  /** 创建｜编辑 告警接收 */
  const onFinish = async () => {
    /** 编辑告警接收 */
    if (Object.keys(editDatas).length > 0) {
      const { receiver_id } = editDatas;
      const { at_user_ids } = form.getFieldsValue();
      const userid = Array.isArray(at_user_ids) ? at_user_ids : at_user_ids.split(',');
      const data = { ...form.getFieldsValue(), at_user_ids: userid, enable: status, is_at_all };
      const res = await updateReceiverById(receiver_id, data);
      await message.success(res);
    } else {
      /** 创建告警接收 */
      const { at_user_ids } = form.getFieldsValue();
      const res = await registerReceiver({
        ...form.getFieldsValue(),
        at_user_ids: [at_user_ids],
        enable: true,
        is_at_all,
      });
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
      <Form name="basic" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={form} style={{ marginTop: '24px' }}>
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
          <Tooltip title={is_at_all ? 'enable' : 'disable'}>
            <Switch
              value={is_at_all}
              onChange={e => {
                updateState(preset => {
                  return {
                    ...preset,
                    is_at_all: e,
                  };
                });
              }}
            />
          </Tooltip>
        </Form.Item>
        <Form.Item<FieldType> label={<FormattedMessage id="Status" />} name="enable" valuePropName="checked">
          <Tooltip title={status ? 'enable' : 'disable'}>
            <Switch
              value={status}
              onChange={e => {
                updateState(preset => {
                  return {
                    ...preset,
                    status: e,
                  };
                });
              }}
            />
          </Tooltip>
        </Form.Item>
      </Form>
      <Flex justify="end">
        <Button type="primary" htmlType="submit" onClick={() => onFinish()}>
          <FormattedMessage id="Submit" />
        </Button>
      </Flex>
    </Modal>
  );
};

export default CreateRecep;

import React, { useEffect } from 'react';
import { Button, Form, Input, Select, Alert, Flex } from 'antd';
import { FormattedMessage } from 'react-intl';
import CodeMirror from '@uiw/react-codemirror';
import UploadFiles from './upload-files';
import { createProcedure } from '../service';

type FieldType = {
  type: string;
  name: string;
  editcode: string;
  instance: boolean;
};
const TYPEOPTION = [{ label: 'CPP', value: 'CPP' }];
const INSTANCEOPTION = [{ label: 'DEFAULT Movies', value: 'DEFAULT Movies' }];
type ICreateRecepProps = {
  handelChange(val: boolean): void;
};
const CreatePlugins: React.FC<ICreateRecepProps> = props => {
  const { handelChange } = props;
  const [form] = Form.useForm();
  const onFinish = async () => {
    console.log(form.getFieldsValue());
    const { name } = form.getFieldsValue();
    // {
    //   "name": "string",
    //   "bound_graph": "string",
    //   "description": "string",
    //   "type": "cpp",
    //   "query": "string",
    //   "enable": true,
    //   "runnable": true,
    //   "params": [
    //     {
    //       "name": "string",
    //       "type": "string"
    //     }
    //   ],
    //   "returns": [
    //     {
    //       "name": "string",
    //       "type": "string"
    //     }
    //   ]
    // }

    // await createProcedure(name, form.getFieldsValue());
    handelChange(false);
  };
  return (
    <Flex vertical gap="middle">
      <Alert message="如果您已有算法插件文件，可以上传至这里，这将帮助您快速创建插件." type="info" showIcon closable />
      <UploadFiles />
      <Form name="basic" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} form={form}>
        <Form.Item<FieldType>
          label={<FormattedMessage id="Name" />}
          name="name"
          rules={[{ required: true, message: 'Please input your Receiver!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label={<FormattedMessage id="Plugin Type" />}
          name="type"
          rules={[{ required: true, message: 'Please input your WebHook URL!' }]}
        >
          <Select options={TYPEOPTION} />
        </Form.Item>
        <Form.Item<FieldType>
          label={<FormattedMessage id="Graph Instance" />}
          name="instance"
          rules={[{ required: true, message: 'Please input your WebHook URL!' }]}
        >
          <Select options={INSTANCEOPTION} />
        </Form.Item>
        <Form.Item<FieldType> label={<FormattedMessage id="Edit Code" />} name="editcode">
          <CodeMirror height="150px" extensions={[]} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={() => onFinish()}>
            <FormattedMessage id="Create Plugin" />
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default CreatePlugins;

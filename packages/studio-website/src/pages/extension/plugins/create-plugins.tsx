import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Alert, Flex, Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import CodeMirror from '@uiw/react-codemirror';
import UploadFiles from './upload-files';
import { createProcedure } from '../service';

type FieldType = {
  name: string;
  type: string;
  bound_graph: string;
  query: string;
  instance: boolean;
};
const TYPEOPTION = [{ label: 'CPP', value: 'cpp' }];
/** 接口返回 */
const INSTANCEOPTION = [{ label: 'DEFAULT Movies', value: 'DEFAULT Movies' }];
type ICreateRecepProps = {
  handelChange(val: boolean): void;
};
const CreatePlugins: React.FC<ICreateRecepProps> = props => {
  const { handelChange } = props;
  const [form] = Form.useForm();
  const [info, setInfo] = useState(null);
  useEffect(() => {
    form.setFieldsValue({ type: 'cpp' });
  }, []);
  info && form.setFieldsValue({ query: info });
  const onFinish = async () => {
    console.log(form.getFieldsValue());
    const { name, bound_graph, type, query } = form.getFieldsValue();
    console.log(info);
    const { file } = info;
    const data = {
      name,
      bound_graph,
      description: '',
      type,
      query,
      enable: true,
      runnable: true,
      params: [
        {
          name: file.name,
          type: '',
        },
      ],
      returns: [
        {
          name: '',
          type: '',
        },
      ],
    };
    await createProcedure(name, data);
    handelChange(false);
  };
  return (
    <div style={{ padding: '14px 24px' }}>
      <Flex vertical gap="middle">
        <Breadcrumb
          items={[
            {
              title: (
                <a href="/extension">
                  <FormattedMessage id="Extensions" />
                </a>
              ),
            },
            {
              title: <FormattedMessage id="Create Plugin" />,
            },
          ]}
        />
        <Alert
          message="如果您已有算法插件文件，可以上传至这里，这将帮助您快速创建插件."
          type="info"
          showIcon
          closable
        />
        <UploadFiles handleChange={val => setInfo(val)} />
        <Form name="basic" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} form={form}>
          <Form.Item<FieldType>
            label={<FormattedMessage id="Name" />}
            name="name"
            rules={[{ required: true, message: 'Please input your Graph Name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label={<FormattedMessage id="Plugin Type" />}
            name="type"
            rules={[{ required: true, message: 'Please input your Plugin Type!' }]}
          >
            <Select options={TYPEOPTION} />
          </Form.Item>
          <Form.Item<FieldType>
            label={<FormattedMessage id="Graph Instance" />}
            name="bound_graph"
            rules={[{ required: true, message: 'Please input your Graph Instance!' }]}
          >
            <Select options={INSTANCEOPTION} />
          </Form.Item>
          <Form.Item<FieldType> label={<FormattedMessage id="Edit Code" />} name="query">
            <CodeMirror height="150px" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={() => onFinish()}>
              <FormattedMessage id="Create Plugin" />
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </div>
  );
};

export default CreatePlugins;

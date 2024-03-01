import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Alert, Flex, Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import CodeMirror from '@uiw/react-codemirror';
import UploadFiles from './upload-files';
import { createProcedure, listProcedures } from '../service';

type FieldType = {
  name: string;
  type: string;
  bound_graph: string;
  query: string;
  instance: boolean;
};
const TYPEOPTION = [{ label: 'CPP', value: 'cpp' }];

type ICreateRecepProps = {
  handelChange(val: boolean): void;
};
const CreatePlugins: React.FC<ICreateRecepProps> = props => {
  const { handelChange } = props;
  const [form] = Form.useForm();
  const [state, updateState] = useState<{
    info: string | null;
    editCode: string;
    instanceOption: { label: string; value: string }[];
  }>({
    info: null,
    editCode: '',
    instanceOption: [],
  });
  const { info, editCode, instanceOption } = state;
  useEffect(() => {
    form.setFieldsValue({ type: 'cpp' });
    listProcedures().then(res => {
      const INSTANCEOPTION = res.map(item => {
        const { bound_graph } = item;
        return {
          label: bound_graph as string,
          value: bound_graph as string,
        };
      });
      updateState(preset => {
        return {
          ...preset,
          instanceOption: INSTANCEOPTION,
        };
      });
    });
  }, []);
  info && form.setFieldsValue({ query: info });
  const onFinish = async () => {
    console.log(form.getFieldsValue());
    const { name, bound_graph, type } = form.getFieldsValue();
    const data = {
      name,
      bound_graph,
      description: '',
      type,
      query: editCode,
      enable: true,
      runnable: true,
      params: [
        {
          name: info?.file?.name,
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
  /** 获取editcode */
  const handleCodeMirror = (val: string) => {
    updateState(preset => {
      return {
        ...preset,
        editCode: val,
      };
    });
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
        <UploadFiles
          handleChange={val => {
            //@ts-ignore
            updateState(preset => {
              return {
                ...preset,
                info: val,
              };
            });
          }}
        />
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
            label={<FormattedMessage id="Binding Graph" />}
            name="bound_graph"
            rules={[{ required: true, message: 'Please input your Graph Instance!' }]}
          >
            <Select options={instanceOption} />
          </Form.Item>
          <Form.Item<FieldType> label={<FormattedMessage id="Edit Code" />} name="query">
            <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
              <CodeMirror height="150px" value={editCode} onChange={e => handleCodeMirror(e)} />
            </div>
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

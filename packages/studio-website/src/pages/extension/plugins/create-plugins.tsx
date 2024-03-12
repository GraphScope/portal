import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Alert, Flex, Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import CodeMirror from '@uiw/react-codemirror';
import UploadFiles from './upload-files';
import { createProcedure, updateProcedure, listProceduresByGraph, listGraphs } from '../service';
import { getSearchParams } from '@/pages/utils';

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
  const { path, searchParams } = getSearchParams(window.location);
  const edit = searchParams.get('bound_graph') || '';
  const [state, updateState] = useState<{
    editCode: string;
    instanceOption: { label: string; value: string }[];
  }>({
    editCode: '',
    instanceOption: [],
  });
  const { editCode, instanceOption } = state;
  useEffect(() => {
    form.setFieldsValue({ type: 'cpp' });
    listGraphs().then(res => {
      //@ts-ignore
      updateState(preset => {
        return {
          ...preset,
          instanceOption: res,
        };
      });
    });
    edit && getlistProceduresByGraph(edit);
  }, []);
  /** 获取插件信息并回填 */
  const getlistProceduresByGraph = async (bound_graph: string) => {
    const res = await listProceduresByGraph(bound_graph);
    const { query } = res;
    form.setFieldsValue(res);
    updateState(preset => {
      return {
        ...preset,
        editCode: query,
      };
    });
  };
  /** 创建插件 */
  const onFinish = async () => {
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
          name: '',
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
    /** 修改插件 */
    if (edit === 'extension') {
      await updateProcedure(bound_graph, name, data);
    } else {
      await createProcedure(name, data);
    }
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
          message={
            <FormattedMessage id="If you already have an algorithm plugin file, you can upload it here, which will help you quickly create a plugin." />
          }
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
                editCode: val,
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
          <Form.Item<FieldType> label={<FormattedMessage id="Edit Code" />} name="query" style={{}}>
            <div style={{ overflow: 'scroll', border: '1px solid #D9D9D9', borderRadius: '8px' }}>
              <CodeMirror height="200px" value={editCode} onChange={e => handleCodeMirror(e)} />
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

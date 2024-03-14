import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Flex, Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import { history } from 'umi';
import CodeMirror from '@uiw/react-codemirror';
import UploadFiles from './upload-files';
import { createProcedure, updateProcedure, listProceduresByGraph, listGraphs } from '../service';

type FieldType = {
  name: string;
  type: string;
  bound_graph: string;
  query: string;
  instance: boolean;
};
const TYPEOPTION = [{ label: 'CPP', value: 'cpp' }];

type ICreateRecepProps = {};
const CreatePlugins: React.FC<ICreateRecepProps> = props => {
  const [form] = Form.useForm();
  const getSearchParams = new URLSearchParams(window.location.href.split('?')[1]);
  const graph_name = getSearchParams.get('graph_name');
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
    graph_name && getlistProceduresByGraph(graph_name);
  }, []);
  const getlistProceduresByGraph = async (bound_graph: string) => {
    const res = await listProceduresByGraph(bound_graph);
    console.log(res);

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
    if (graph_name) {
      /** 修改插件 */
      await updateProcedure(bound_graph, name, data);
    } else {
      /** 新建插件 */
      await createProcedure(name, data);
    }
    history.push('/extension');
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
        <Form name="basic" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} form={form} onFinish={() => onFinish()}>
          <Form.Item<FieldType>
            style={{ marginBottom: '12px' }}
            label={<FormattedMessage id="Name" />}
            name="name"
            rules={[{ required: true, message: 'Please input your Graph Name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            style={{ marginBottom: '12px' }}
            label={<FormattedMessage id="Plugin Type" />}
            name="type"
            rules={[{ required: true, message: 'Please input your Plugin Type!' }]}
          >
            <Select options={TYPEOPTION} />
          </Form.Item>
          <Form.Item<FieldType>
            style={{ marginBottom: '12px' }}
            label={<FormattedMessage id="Binding Graph" />}
            name="bound_graph"
            rules={[{ required: true, message: 'Please input your Graph Instance!' }]}
          >
            <Select options={instanceOption} />
          </Form.Item>
          <Form.Item<FieldType>
            style={{ marginBottom: '12px' }}
            label={<FormattedMessage id="Edit Code" />}
            name="query"
          >
            <div style={{ overflow: 'scroll', border: '1px solid #D9D9D9', borderRadius: '8px' }}>
              <CodeMirror height="200px" value={editCode} onChange={e => handleCodeMirror(e)} />
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="Create Plugin" />
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </div>
  );
};

export default CreatePlugins;

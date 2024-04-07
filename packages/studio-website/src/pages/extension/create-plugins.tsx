import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Flex, Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import { history } from 'umi';
import { searchParamOf } from '@/components/utils/index';
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { useContext } from '@/layouts/useContext';
import UploadFiles from './upload-files';
import { createProcedure, updateProcedure, listProceduresByGraph, listGraphs } from './service';

type FieldType = {
  name: string;
  type: string;
  bound_graph: string;
  query: string;
  instance: boolean;
};
const TYPEOPTION = [{ label: 'CPP', value: 'cpp' }];

const CreatePlugins: React.FC = () => {
  const [form] = Form.useForm();
  const graph_name = searchParamOf('graph_name') || '';
  const [state, updateState] = useState<{
    editCode: string;
    instanceOption: { label: string; value: string }[];
  }>({
    editCode: '',
    instanceOption: [],
  });
  const { editCode, instanceOption } = state;
  const { store } = useContext();
  const { mode } = store;
  //@ts-ignore
  const myTheme = createTheme({
    theme: mode === 'defaultAlgorithm' ? 'light' : 'dark',
    settings: {
      background: mode === 'defaultAlgorithm' ? '#fff' : '#151515',
      backgroundImage: '',
      foreground: mode === 'defaultAlgorithm' ? '#212121' : '#FFF',
      gutterBackground: mode === 'defaultAlgorithm' ? '#fff' : '#151515',
    },
  });

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
    if (graph_name) {
      getlistProceduresByGraph(graph_name);
    }
  }, []);
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
            rules={[{ required: true, message: 'Please input your Graph name!' }]}
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
            label={<FormattedMessage id="Binding graph" />}
            name="bound_graph"
            rules={[{ required: true, message: 'Please input your Graph Instance!' }]}
          >
            <Select options={instanceOption} />
          </Form.Item>
          <Form.Item<FieldType>
            style={{ marginBottom: '12px' }}
            label={<FormattedMessage id="Edit code" />}
            name="query"
          >
            <div
              style={{
                overflow: 'scroll',
                border: `1px solid ${mode === 'defaultAlgorithm' ? '#efefef' : '#323232'}`,
                borderRadius: '8px',
              }}
            >
              <CodeMirror height="200px" value={editCode} onChange={e => handleCodeMirror(e)} theme={myTheme} />
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

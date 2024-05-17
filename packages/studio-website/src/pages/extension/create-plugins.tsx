import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Button, Form, Input, Select, Flex, Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import { history } from 'umi';
import { searchParamOf } from '@/components/utils/index';
import { useEditorTheme } from '@/pages/utils';
import CodeMirror from '@uiw/react-codemirror';
import { useContext } from '@/layouts/useContext';
import UploadFiles from './upload-files';
import { createProcedure, updateProcedure, listGraphs, getProcedure } from './service';

type FieldType = {
  name: string;
  type: string;
  bound_graph: string;
  query: string;
  instance: boolean;
  description: string;
};
const TYPEOPTION = [
  { label: 'Cypher', value: 'cypher' },
  // { label: 'Cpp', value: 'cpp' },
];

const CreatePlugins: React.FC = () => {
  const [form] = Form.useForm();
  const graph_id = searchParamOf('graph_id') || '';
  const procedure_id = searchParamOf('procedure_id') || '';

  const [state, updateState] = useState<{
    editCode: string;
    instanceOption: { label: string; value: string }[];
    isEdit: boolean;
  }>({
    editCode: '',
    instanceOption: [],
    isEdit: false,
  });
  const { editCode, instanceOption, isEdit } = state;
  const { store } = useContext();
  const { mode } = store;

  /** 获取插件某条数据 */
  const getProcedures = useCallback(async (graph_id: string, procedure_id: string) => {
    const res = await getProcedure(graph_id, procedure_id);
    const { query } = res;
    form.setFieldsValue(res);
    updateState(preset => {
      return {
        ...preset,
        editCode: query,
        isEdit: true,
      };
    });
  }, []);

  /** 创建插件 */
  const handleSubmit = useCallback(async () => {
    /** bound_graph 是 graph_ids */
    const { name, bound_graph, type, description } = form.getFieldsValue();
    console.log(editCode);
    const data = {
      name,
      // bound_graph,
      description,
      type,
      query: editCode,
      // enable: true,
      // runnable: true,
      // params: [],
      // returns: [],
    };
    if (graph_id) {
      /** 修改插件 */
      await updateProcedure(bound_graph, procedure_id, data);
    } else {
      /** 新建插件 */
      await createProcedure(bound_graph, data);
    }
    history.push('/extension');
  }, [editCode, form.getFieldsValue()]);
  /** 获取editcode */
  const onCodeMirrorChange = useCallback((val: string) => {
    updateState(preset => {
      return {
        ...preset,
        editCode: val,
      };
    });
  }, []);
  useEffect(() => {
    form.setFieldsValue({ type: 'cypher' });
    listGraphs().then(res => {
      //@ts-ignore
      updateState(preset => {
        return {
          ...preset,
          instanceOption: res,
        };
      });
    });
    if (graph_id && procedure_id) {
      getProcedures(graph_id, procedure_id);
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
          disabled={isEdit}
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
        <Form name="basic" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} form={form} onFinish={() => handleSubmit()}>
          <Form.Item<FieldType>
            style={{ marginBottom: '12px' }}
            label={<FormattedMessage id="Name" />}
            name="name"
            rules={[{ required: true, message: 'Please input your Graph name!' }]}
          >
            <Input disabled={isEdit} />
          </Form.Item>

          <Form.Item<FieldType>
            style={{ marginBottom: '12px' }}
            label={<FormattedMessage id="Plugin Type" />}
            name="type"
            rules={[{ required: true, message: 'Please input your Plugin Type!' }]}
          >
            <Select options={TYPEOPTION} disabled={isEdit} />
          </Form.Item>
          <Form.Item<FieldType>
            style={{ marginBottom: '12px' }}
            label={<FormattedMessage id="Binding graph" />}
            name="bound_graph"
            rules={[{ required: true, message: 'Please input your Graph Instance!' }]}
          >
            <Select options={instanceOption} disabled={isEdit} />
          </Form.Item>
          <Form.Item<FieldType>
            style={{ marginBottom: '12px' }}
            label={<FormattedMessage id="Description" />}
            name="description"
            rules={[{ required: true, message: 'Please input your Description!' }]}
          >
            <Input />
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
              <CodeMirror
                height="200px"
                value={editCode}
                onChange={e => onCodeMirrorChange(e)}
                theme={useEditorTheme(mode, isEdit)}
                readOnly={isEdit}
              />
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

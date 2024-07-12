import React, { useEffect, useState, useCallback } from 'react';
import { Button, Form, Input, Select, Flex } from 'antd';
import { FormattedMessage } from 'react-intl';
import { history } from 'umi';
import { Utils, useThemeContainer, SplitSection } from '@graphscope/studio-components';
import { useEditorTheme } from '@/pages/utils';
import CodeMirror from '@uiw/react-codemirror';
import UploadFiles from './upload-files';
import Section from '@/components/section';

import { createProcedure, updateProcedure, listGraphs, getProcedure } from './service';
const { searchParamOf, getUrlParams } = Utils;

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
const CreatePlugins: React.FC = props => {
  console.log(getUrlParams());
  const { graph_id, procedure_id } = getUrlParams();
  const [form] = Form.useForm();
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
  const { pluginBorder } = useThemeContainer();
  /** 获取插件某条数据 */
  const getProcedures = async (graph_id: string, procedure_id: string) => {
    const res = await getProcedure(graph_id, procedure_id);
    const { query } = res;
    form.setFieldsValue(res);
    updateState(preset => {
      return { ...preset, editCode: query, isEdit: true };
    });
  };

  /** 创建插件 */
  const handleSubmit = useCallback(async () => {
    /** bound_graph 是 graph_ids */
    const { name, bound_graph, type, description } = form.getFieldsValue();
    const data = { name: name.trim(), description, type, query: editCode };
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
      return { ...preset, editCode: val };
    });
  }, []);
  useEffect(() => {
    form.setFieldsValue({ type: 'cypher' });
    listGraphs().then(res => {
      updateState(preset => {
        return { ...preset, instanceOption: res };
      });
    });
    if (graph_id && procedure_id) {
      getProcedures(graph_id, procedure_id);
    }
  }, []);
  const LeftSide = () => {
    return (
      <>
        {!editCode ? (
          <UploadFiles disabled={isEdit} handleChange={onCodeMirrorChange} />
        ) : (
          <div
            style={{
              overflow: 'scroll',
              border: `1px solid ${pluginBorder}`,
              borderRadius: '8px',
            }}
          >
            <CodeMirror
              height="240px"
              value={editCode}
              onChange={e => onCodeMirrorChange(e)}
              theme={useEditorTheme(isEdit)}
              readOnly={isEdit}
            />
          </div>
        )}
      </>
    );
  };
  const RightSide = () => {
    return (
      <Form name="basic" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} form={form} onFinish={handleSubmit}>
        <Form.Item<FieldType>
          label={<FormattedMessage id="Name" />}
          name="name"
          rules={[{ required: true, message: 'Please input your Graph name!', pattern: /^[^\s]*$/ }]}
        >
          <Input disabled={isEdit} />
        </Form.Item>

        <Form.Item<FieldType>
          label={<FormattedMessage id="Plugin Type" />}
          name="type"
          rules={[{ required: true, message: 'Please input your Plugin Type!' }]}
        >
          <Select options={TYPEOPTION} disabled={isEdit} />
        </Form.Item>
        <Form.Item<FieldType>
          label={<FormattedMessage id="Binding graph" />}
          name="bound_graph"
          rules={[{ required: true, message: 'Please input your Graph Instance!' }]}
        >
          <Select options={instanceOption} disabled={isEdit} />
        </Form.Item>
        <Form.Item<FieldType> label={<FormattedMessage id="Description" />} name="description">
          <Input />
        </Form.Item>
        <Form.Item style={{ display: 'flex', justifyContent: 'end', marginBottom: '0px' }}>
          <Button type="primary" htmlType="submit">
            <FormattedMessage id="Create Plugin" />
          </Button>
        </Form.Item>
      </Form>
    );
  };
  return (
    <Section
      breadcrumb={[
        {
          title: 'Extensions',
        },
        {
          title: 'Create Plugin',
        },
      ]}
      desc="Expand its functionality or offer solutions that are finely tuned to specific needs."
    >
      <SplitSection splitText="" span={8} splitSpan={1} leftSide={<LeftSide />} rightSide={<RightSide />} />
    </Section>
  );
};

export default CreatePlugins;

import React, { useEffect, useState, useCallback } from 'react';
import { Form, Card, Button, Divider, message } from 'antd';
import { history } from 'umi';
import { FormattedMessage } from 'react-intl';
import { Utils, SplitSection } from '@graphscope/studio-components';
import Section from '@/components/section';
import LeftSide from './left-side';
import RightSide from './right-side';
import type { FieldType } from './right-side';
import { createProcedure, updateProcedure, listGraphs, getProcedure } from './service';
const { getUrlParams } = Utils;
const CreatePlugins: React.FC = () => {
  console.log(getUrlParams());
  const { graph_id, procedure_id } = getUrlParams();
  const [form] = Form.useForm();
  const [state, updateState] = useState<{
    editCode: string;
    instanceOption: { label: string; value: string }[];
    isEdit: boolean;
    isLoading: boolean;
  }>({
    editCode: '',
    instanceOption: [],
    isEdit: false,
    isLoading: false,
  });
  const { editCode, instanceOption, isEdit, isLoading } = state;
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
  const handleSubmit = useCallback(() => {
    form.validateFields().then(async res => {
      updateState(preset => {
        return { ...preset, isLoading: true };
      });
      /** bound_graph 是 graph_ids */
      const { name, bound_graph, type, description } = res;
      const data = { name, description, type, query: editCode };
      try {
        if (graph_id) {
          /** 修改插件 */
          await updateProcedure(bound_graph, procedure_id, data);
        } else {
          /** 新建插件 */
          await createProcedure(bound_graph, data);
        }
      } finally {
        await updateState(preset => {
          return { ...preset, isLoading: false };
        });
      }
      await history.push('/extension');
    });
  }, [editCode, form.getFieldsValue()]);
  /** 获取editcode */
  const onCodeMirrorChange = useCallback((type: string, value: FieldType | string) => {
    if (type === '') {
      updateState(preset => {
        return { ...preset, editCode: value as string };
      });
    }
    if (type === 'application/x-yaml') {
      const { query } = value as FieldType;
      form.setFieldsValue(value);
      updateState(preset => {
        return { ...preset, editCode: query };
      });
    }
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
      <SplitSection
        splitText=""
        span={12}
        splitSpan={1}
        leftSide={<LeftSide editCode={editCode} isEdit={isEdit} onCodeMirrorChange={onCodeMirrorChange} />}
        rightSide={<RightSide form={form} isEdit={isEdit} options={instanceOption} />}
      />
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button type="primary" onClick={handleSubmit} loading={isLoading} style={{ width: '128px' }}>
          {graph_id ? <FormattedMessage id="Edit Plugin" /> : <FormattedMessage id="Create Plugin" />}
        </Button>
      </div>
    </Section>
  );
};

export default CreatePlugins;

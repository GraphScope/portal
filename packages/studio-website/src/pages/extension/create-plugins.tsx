import React, { useEffect, useState, useCallback } from 'react';
import { Form, Button, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Utils, SplitSection } from '@graphscope/studio-components';
import Section from '../../components/section';
import LeftSide from './left-side';
import RightSide from './right-side';
import type { FieldType } from './right-side';
import SelectCards from '../../components/select-cards';
import { createProcedure, updateProcedure, listGraphs, getProcedure } from './service';
import { useHistory } from '../../hooks/';
const { getUrlParams } = Utils;
const CreatePlugins: React.FC = () => {
  console.log(getUrlParams());
  const { graph_id, procedure_id } = getUrlParams();
  const [form] = Form.useForm();
  const history = useHistory();
  const [state, updateState] = useState<{
    editCode: string;
    instanceOption: { label: string; value: string }[];
    isEdit: boolean;
    isLoading: boolean;
    storeType: string;
  }>({
    editCode: '',
    instanceOption: [],
    isEdit: false,
    isLoading: false,
    storeType: 'Stored procedures',
  });
  const { editCode, instanceOption, isEdit, isLoading, storeType } = state;
  /** 获取插件某条数据 */
  const getProcedures = async (graph_id: string, procedure_id: string) => {
    const res = await getProcedure(graph_id, procedure_id);
    //@ts-ignore
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
  const onCodeMirrorChange = useCallback((value: FieldType) => {
    const { query } = value;
    form.setFieldsValue(value);
    handleCodeMirror(query);
  }, []);
  const handleCodeMirror = (query: string) => {
    updateState(preset => {
      return { ...preset, editCode: query };
    });
  };
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
  const engines = [
    {
      id: 'Stored procedures',
      value: 'Stored procedures',
      type: 'Stored procedures',
      title: 'Stored procedures',
    },
  ];
  const chooseStoreType = (obj: { id: string }) => {
    updateState(preset => {
      return {
        ...preset,
        storeType: obj.id,
      };
    });
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
      <SelectCards
        style={{ position: 'absolute', top: '3px', right: '3px', fontSize: '20px' }}
        value={storeType}
        //@ts-ignore
        items={engines}
        onChange={chooseStoreType}
      />
      <Divider />
      <SplitSection
        splitText=""
        span={12}
        splitSpan={1}
        leftSide={
          <LeftSide
            editCode={editCode}
            isEdit={isEdit}
            onCodeMirrorChange={onCodeMirrorChange}
            onChange={handleCodeMirror}
          />
        }
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

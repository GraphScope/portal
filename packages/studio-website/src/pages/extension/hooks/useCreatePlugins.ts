import { useState, useEffect, useCallback } from 'react';
import { Form } from 'antd';
import { createProcedure, updateProcedure, listGraphs, getProcedure } from '../service';
import { Utils } from '@graphscope/studio-components';
import { useHistory } from '../../../hooks/';
const { getUrlParams } = Utils;

// 定义状态接口
interface State {
  editCode: string;
  instanceOption: { label: string; value: string }[];
  isEdit: boolean;
  isLoading: boolean;
  storeType: string;
}

export const useCreatePlugins = () => {
  const { graph_id, procedure_id } = getUrlParams();
  const [form] = Form.useForm();
  const history = useHistory();

  // 初始化状态
  const [state, updateState] = useState<State>({
    editCode: '',
    instanceOption: [],
    isEdit: false,
    isLoading: false,
    storeType: 'Stored procedures',
  });

  const { editCode } = state;

  // 获取存储过程详情
  const getProcedures = async (graph_id: string, procedure_id: string) => {
    try {
      const res = await getProcedure(graph_id, procedure_id);
      if (res && 'query' in res) {
        const { query } = res;
        form.setFieldsValue(res);
        updateState(preset => ({ ...preset, editCode: query, isEdit: true }));
      }
    } catch (error) {
      console.error('Failed to fetch procedure details:', error);
    }
  };

  // 提交表单
  const handleSubmit = useCallback(() => {
    form.validateFields().then(async res => {
      updateState(preset => ({ ...preset, isLoading: true }));
      const { name, bound_graph, type, description } = res;
      const data = { name, description, type, query: editCode };

      try {
        if (graph_id) {
          await updateProcedure(bound_graph, procedure_id, data);
        } else {
          await createProcedure(bound_graph, data);
        }
      } finally {
        updateState(preset => ({ ...preset, isLoading: false }));
      }
      history.push('/extension');
    });
  }, [editCode, form, graph_id, procedure_id, history]);

  // 处理代码编辑器的变化
  const onCodeMirrorChange = useCallback((value: { query: string }) => {
    const { query } = value;
    form.setFieldsValue(value);
    handleCodeMirror(query);
  }, []);

  // 更新代码编辑器内容
  const handleCodeMirror = (query: string) => {
    updateState(preset => ({ ...preset, editCode: query }));
  };

  // 选择存储类型
  const chooseStoreType = (obj: { id: string }) => {
    updateState(preset => ({ ...preset, storeType: obj.id }));
  };

  // 初始化数据
  useEffect(() => {
    // 设置表单默认值
    form.setFieldsValue({ type: 'cypher' });

    // 获取图实例列表
    const fetchGraphs = async () => {
      try {
        const res = await listGraphs();
        updateState(preset => ({ ...preset, instanceOption: res }));
      } catch (error) {
        console.error('Failed to fetch graph instances:', error);
      }
    };

    fetchGraphs();

    // 如果有 graph_id 和 procedure_id，则获取存储过程详情
    if (graph_id && procedure_id) {
      getProcedures(graph_id, procedure_id);
    }
  }, [graph_id, procedure_id]);

  return {
    form,
    state,
    handleSubmit,
    onCodeMirrorChange,
    handleCodeMirror,
    chooseStoreType,
  };
};

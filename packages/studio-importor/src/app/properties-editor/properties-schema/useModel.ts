import React from 'react';
import { useContext } from '../../useContext';
import { Property } from '@graphscope/studio-components';
interface IuseModel {
  type: string;
  id: string;
  label?: string;
  source?: string;
  target?: string;
  properties?: any;
  disabled?: boolean;
  createVertexTypeOrEdgeType?: (type: string, params: any) => boolean;
  deleteVertexTypeOrEdgeType?: (type: string, label: string, source?: string, target?: string, nodes?: any) => boolean;
}
export default function useModel({
  type,
  id,
  label,
  source,
  target,
  properties,
  disabled,
  createVertexTypeOrEdgeType,
  deleteVertexTypeOrEdgeType,
}: IuseModel) {
  const { store, updateStore } = useContext();
  const { nodes } = store;
  /** 修改label */
  const handleChangeLabel = e => {
    const label = e.target.value;
    updateStore(draft => {
      draft.displayMode = 'table';
      if (type === 'edges') {
        draft.edges.forEach(item => {
          if (item.id === id) {
            item.data.label = label;
          }
        });
      }
      if (type === 'nodes') {
        draft.nodes.forEach(item => {
          if (item.id === id) {
            item.data.label = label;
          }
        });
      }
    });
  };

  const handleProperty = e => {
    console.log('e|||||', e);

    updateStore(draft => {
      if (type === 'edges') {
        draft.edges.map(item => {
          if (item.id === id) {
            item.data.properties = e;
          }
        });
      }
      if (type === 'nodes') {
        draft.nodes.map(item => {
          if (item.id === id) {
            item.data.properties = e;
          }
        });
      }
    });
  };
  /** 修改source/target 的dataFiles */
  const handleDataFieldsChange = (
    val: Property,
    data_field: 'source_vertex_fields' | 'target_vertex_fields',
    vertext_primary_key,
  ) => {
    updateStore(draft => {
      draft.edges.forEach(item => {
        if (item.id === id) {
          const { index, token } = val;
          item.data[data_field] = {
            key: id,
            index,
            name: vertext_primary_key,
            token: token,
          };
        }
      });
    });
  };

  /** groot 保存节点或边*/
  const handleSubmit = async () => {
    let response: boolean = true;
    if (type === 'nodes') {
      response = (createVertexTypeOrEdgeType && createVertexTypeOrEdgeType(type, { label, properties })) || false;
      /** 置灰不可编辑，转化为正常查询数据 */
      if (response) {
        updateStore(draft => {
          draft.nodes = draft.nodes.map(item => {
            if (item.id === id) {
              return {
                ...item,
                data: { ...item.data, disabled: true },
              };
            }
            return item;
          });
        });
      }
    }
    if (type === 'edges') {
      response =
        (createVertexTypeOrEdgeType &&
          createVertexTypeOrEdgeType(type, { nodes, label, source, target, properties })) ||
        false;
      /** 置灰不可编辑，转化为正常查询数据 */
      if (response) {
        updateStore(draft => {
          draft.edges = draft.edges.map(item => {
            if (item.id === id) {
              return {
                ...item,
                data: { ...item.data, disabled: true },
              };
            }
            return item;
          });
        });
      }
    }
  };
  /** groot 删除节点或边*/
  const handleDelete = async () => {
    if (type === 'nodes') {
      let response: boolean = true;
      if (disabled) {
        response = (deleteVertexTypeOrEdgeType && (await deleteVertexTypeOrEdgeType(type, label as string))) || false;
      }
      if (response) {
        updateStore(draft => {
          draft.nodes = draft.nodes.filter(item => item.id !== id);
          draft.edges = draft.edges.filter(item => item.source !== id && item.target !== id);
          draft.elementOptions.isEditable = !!draft.nodes.length;
        });
      }
    }
    if (type === 'edges') {
      if (disabled) {
        deleteVertexTypeOrEdgeType && (await deleteVertexTypeOrEdgeType(type, label as string, source, target, nodes));
      }
      updateStore(draft => {
        draft.edges = draft.edges.filter(item => item.id !== id);
      });
    }
  };

  return {
    handleChangeLabel,
    handleDataFieldsChange,
    handleProperty,
    handleSubmit,
    handleDelete,
  };
}

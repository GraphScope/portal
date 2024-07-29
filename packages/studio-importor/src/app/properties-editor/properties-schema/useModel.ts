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
  disable?: boolean;
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
  disable,
  createVertexTypeOrEdgeType,
  deleteVertexTypeOrEdgeType,
}: IuseModel) {
  const { store, updateStore } = useContext();
  const { nodes, edges } = store;
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
      response =
        (createVertexTypeOrEdgeType && (await createVertexTypeOrEdgeType(type, { label, properties }))) || false;
      /** 置灰不可编辑，转化为正常查询数据 */
      if (response) {
        updateStore(draft => {
          draft.nodes = draft.nodes.map(item => {
            if (item.id === id) {
              return {
                ...item,
                data: { ...item.data, disable: true },
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
          (await createVertexTypeOrEdgeType(type, { nodes, label, source, target, properties }))) ||
        false;
      /** 置灰不可编辑，转化为正常查询数据 */
      if (response) {
        updateStore(draft => {
          draft.edges = draft.edges.map(item => {
            if (item.id === id) {
              return {
                ...item,
                data: { ...item.data, disable: true },
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
      if (disable) {
        response = (deleteVertexTypeOrEdgeType && (await deleteVertexTypeOrEdgeType(type, label as string))) || false;
      }
      if (response) {
        /** 删除本地节点数据 */
        const nodeList = nodes.filter(item => item.id !== id);
        /** 删除节点时，需要删除与节点相关联边 */
        const edgeList = edges.filter(item => item.source !== id && item.target !== id);
        await updateStore(draft => {
          draft.nodes = JSON.parse(JSON.stringify(nodeList));
          draft.edges = JSON.parse(JSON.stringify(edgeList));
          draft.isQueryData = !!nodeList.length;
        });
      }
    }
    if (type === 'edges') {
      if (disable) {
        deleteVertexTypeOrEdgeType && (await deleteVertexTypeOrEdgeType(type, label as string, source, target, nodes));
      }
      /** 删除本地边数据 */
      const edgeList = edges.filter(item => item.id !== id);
      await updateStore(draft => {
        draft.edges = JSON.parse(JSON.stringify(edgeList));
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

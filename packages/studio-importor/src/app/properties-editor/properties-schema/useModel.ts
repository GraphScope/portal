import React from 'react';
import { useContext } from '../../useContext';
import { Property } from '@graphscope/studio-components';
interface IuseModel {
  type: string;
  id: string;
}
export default function useModel({ type, id }: IuseModel) {
  const { updateStore } = useContext();
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

  return {
    handleChangeLabel,
    handleDataFieldsChange,
    handleProperty,
  };
}

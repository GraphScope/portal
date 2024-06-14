import React from 'react';
import { useContext } from '../../useContext';
export default function useModel({ type, id }) {
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
    console.log('e|||||', e);
    updateStore(draft => {
      if (type === 'edges') {
        draft.edges.map(item => {
          if (item.id === id) {
            //@ts-ignore
            item.data.properties = e;
          }
        });
      }
      if (type === 'nodes') {
        draft.nodes.map(item => {
          if (item.id === id) {
            //@ts-ignore
            item.data.properties = e;
          }
        });
      }
    });
  };
  /** 修改source/target 的dataFiles */
  const handleDataFieldsChange = (val: { index: number; token: string }, name: string, data_fields) => {
    updateStore(draft => {
      draft.edges.forEach(item => {
        if (item.id === id) {
          const { index, token } = val;
          item.data[data_fields] = {
            id,
            key: id,
            index,
            name,
            type: '',
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

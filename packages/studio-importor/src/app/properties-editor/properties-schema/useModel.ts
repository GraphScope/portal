import React from 'react';
import { updateStore } from '../../useContext';
export default function useModel({ type, id }) {
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
  return {
    handleChangeLabel,
    handleProperty,
  };
}

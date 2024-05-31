import React from 'react';
import { useContext } from '../../../useContext';
export function useHandleChange({ type, id }) {
  const { store, updateStore } = useContext();
  /** 改变数据源类型 */
  const onChangeType = (datatype: string) => {
    updateStore(draft => {
      if (type === 'edges') {
        draft.edges.map(item => {
          if (item.id === id) {
            //@ts-ignore
            item.datatype = datatype;
          }
        });
      }
      if (type === 'nodes') {
        draft.nodes.map(item => {
          if (item.id === id) {
            //@ts-ignore
            item.datatype = datatype;
          }
        });
      }
    });
  };
  /** 改变数据源地址 isUpload判断是否为上传*/
  const onChangeValue = (value: string, isUpload?: boolean) => {
    updateStore(draft => {
      if (type === 'edges') {
        draft.edges.map(item => {
          if (item.id === id) {
            //@ts-ignore
            item.filelocation = value;
            item.isBind = value !== '';
            item.isEidtProperty = true;
            item.isUpload = isUpload;
          }
        });
      }
      if (type === 'nodes') {
        draft.nodes.map(item => {
          if (item.id === id) {
            //@ts-ignore
            item.filelocation = value;
            item.isBind = value !== '';
            item.isEidtProperty = true;
            item.isUpload = isUpload;
          }
        });
      }
    });
  };
  /** 聚焦到数据源的时候 */
  const onChangeFocus = () => {
    updateStore(draft => {
      if (type === 'edges') {
        draft.edges.map(item => {
          if (item.id === id) {
            //@ts-ignore
            item.isEidtProperty = true;
          }
        });
      }
      if (type === 'nodes') {
        draft.nodes.map(item => {
          if (item.id === id) {
            //@ts-ignore
            item.isEidtProperty = true;
          }
        });
      }
    });
  };
  const onChangeDataFields = (header?: { dataFields: string[]; delimiter: string }) => {
    updateStore(draft => {
      if (type === 'edges') {
        draft.edges.map(item => {
          if (item.id === id) {
            //@ts-ignore
            item.dataFields = header?.dataFields;
            item.delimiter = header?.delimiter;
          }
        });
      }
      if (type === 'nodes') {
        draft.nodes.map(item => {
          if (item.id === id) {
            //@ts-ignore
            item.dataFields = header?.dataFields;
            item.delimiter = header?.delimiter;
          }
        });
      }
    });
  };
  /** 删除文件 */
  const deleteFile = () => {
    onChangeValue('', false);
    onChangeDataFields();
  };
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
            item.properties = e;
          }
        });
      }
      if (type === 'nodes') {
        draft.nodes.map(item => {
          if (item.id === id) {
            //@ts-ignore
            item.properties = e;
          }
        });
      }
    });
  };
  return {
    onChangeType,
    onChangeValue,
    onChangeFocus,
    onChangeDataFields,
    deleteFile,
    handleChangeLabel,
    handleProperty,
  };
}

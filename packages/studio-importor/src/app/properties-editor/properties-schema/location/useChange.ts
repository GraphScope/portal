import React from 'react';
import { useContext } from '../../../useContext';
export default function useChange({ type, id }) {
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
            //@ts-ignore
            item.isBind = value !== '';
            //@ts-ignore
            item.isEidtProperty = true;
            //@ts-ignore
            item.isUpload = isUpload;
          }
        });
      }
      if (type === 'nodes') {
        draft.nodes.map(item => {
          if (item.id === id) {
            //@ts-ignore
            item.filelocation = value;
            //@ts-ignore
            item.isBind = value !== '';
            //@ts-ignore
            item.isEidtProperty = true;
            //@ts-ignore
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
            //@ts-ignore
            item.delimiter = header?.delimiter;
          }
        });
      }
      if (type === 'nodes') {
        draft.nodes.map(item => {
          if (item.id === id) {
            //@ts-ignore
            item.dataFields = header?.dataFields;
            //@ts-ignore
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

  return {
    onChangeType,
    onChangeValue,
    onChangeFocus,
    onChangeDataFields,
    deleteFile,
  };
}

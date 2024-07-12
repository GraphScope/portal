import { useContext } from '../../../useContext';
import { ISchemaEdge, ISchemaNode } from '../../../typing';
import { Utils } from '@graphscope/studio-components';
export const useChange = ({ type, id }) => {
  const { updateStore } = useContext();
  /** 上传文件 */
  const handleChangeUpload = (file_location, header) => {
    const { dataFields = [], delimiter = '' } = header || {};
    updateStore(draft => {
      draft[type].forEach((item: ISchemaNode | ISchemaEdge) => {
        if (item.id === id) {
          item.data.filelocation = file_location;
          item.data.dataFields = dataFields;
          item.data.delimiter = delimiter;
          item.data.properties?.forEach(p => {
            p.token = p.name;
            p.index = dataFields.findIndex(d => d === p.name);
          });
          if (type === 'edges') {
            /** 和解析CSV文件的逻辑保持一致 */
            const graphFields = Utils.inferredGraphFields(dataFields);
            const { sourceField, targetField } = graphFields;
            console.log(dataFields, graphFields);
            item.data.source_vertex_fields = {
              index: dataFields?.findIndex(d => d === sourceField),
              token: sourceField || '',
            };
            item.data.target_vertex_fields = {
              index: dataFields?.findIndex(d => d === targetField),
              token: targetField || '',
            };
          }
        }
      });
    });
  };
  /** 手动修改文件位置 */
  const handleChangeInput = e => {
    updateStore(draft => {
      draft[type].forEach((item: ISchemaNode | ISchemaEdge) => {
        if (item.id === id) {
          item.data.filelocation = e.target.value;
        }
      });
    });
  };
  /** 删除文件位置 */
  const handleDeleteLocation = () => {
    updateStore(draft => {
      draft[type].forEach((item: ISchemaNode | ISchemaEdge) => {
        if (item.id === id) {
          item.data.filelocation = '';
          item.data.dataFields = [];
          item.data.delimiter = '';
          item.data.properties?.forEach((p, pIndex) => {
            p.token = '';
            p.index = pIndex;
          });
          if (type === 'edges') {
            /** 和解析CSV文件的逻辑保持一致 */

            item.data.source_vertex_fields = {
              index: 0,
              token: '',
            };
            item.data.target_vertex_fields = {
              index: 0,
              token: '',
            };
          }
        }
      });
    });
  };

  return {
    handleChangeUpload,
    handleChangeInput,
    handleDeleteLocation,
  };
};

import {useContext} from '../../../useContext'
import { ISchemaEdge, ISchemaNode } from '../../../typing';
import { Utils } from '@graphscope/studio-components';
export const useChange = ({ type, id }) => {
  const { updateStore } = useContext();
  /** 手动修改文件位置 */
  const handleChangeInput = e => {
    updateStore(draft => {
      draft[type].forEach((item: ISchemaNode | ISchemaEdge) => {
        if (item.id === id) {
          item.data.dataFields = [];
          item.data.filelocation = e.target.value;
          // item.data.properties?.forEach((p, pIndex) => {
          //   p.token = '';
          //   p.index = pIndex;
          // });
        }
      });
    });
  };

  return {
    handleChangeInput,
  };
};

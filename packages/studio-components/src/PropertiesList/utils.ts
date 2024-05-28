import { uuid } from 'uuidv4';
export interface Property {
  key: string;
  name: string;
  type: string;
  index: number;
  primaryKey: boolean;
  disable?: boolean;
}
export interface IState {
  properties: Property[];
}
interface IStore {
  handleAdd(state: IState): Property[];
  handleDelete(state: IState & { selectedRowKeys: string[] }): Property[];
  handleBlur(evt: { target: { value: string } }, record: { key: string }, state: IState): Property[];
  handlePrimaryKey(record: { key: string }, state: IState): Property[];
  handleDoubleClick(record: { key: string }, state: IState): Property[];
  handleType(value: string, row: { key: string }, state: IState): Property[];
}
let index = 0;
export default function useStore(): IStore {
  const handleAdd = (state: IState): Property[] => {
    const newProperty = {
      key: uuid(),
      name: `property_${index++}`,
      type: '',
      primaryKey: false,
      disable: true,
    };
    const properties = [...state.properties, newProperty] as Property[];
    return properties;
  };
  const handleDelete = (state: IState & { selectedRowKeys: string[] }): Property[] => {
    const properties = state.properties.filter(item => !state.selectedRowKeys.includes(item.key));
    return properties;
  };
  /** input->blur */
  const handleBlur = (evt: { target: { value: string } }, record: { key: string }, state: IState): Property[] => {
    const properties = state.properties.map(item => {
      return {
        ...item,
        name: item.key === record.key ? evt.target.value : item.name,
        disable: true,
      };
    });
    return properties;
  };
  const handlePrimaryKey = (record: { key: string }, state: IState): Property[] => {
    const properties = state.properties.map(item => {
      if (item.key == record.key && item.primaryKey) {
        return {
          ...item,
          primaryKey: false,
        };
      } else {
        if (item.key == record.key && !item.primaryKey) {
          return {
            ...item,
            primaryKey: true,
          };
        } else {
          return {
            ...item,
            primaryKey: false,
          };
        }
      }
    });
    return properties;
  };

  /** 双击编辑 */
  const handleDoubleClick = (record: { key: string }, state: IState): Property[] => {
    const properties = state.properties.map(item => {
      return {
        ...item,
        disable: item.key !== record.key,
      };
    });
    return properties;
  };

  const handleType = (value: string, row: { key: string }, state: IState): Property[] => {
    const properties = state.properties.map(item => {
      if (item.key === row.key) {
        return {
          ...item,
          type: value,
        };
      }
      return item;
    });
    return properties;
  };
  return {
    handleAdd,
    handleDelete,
    handleBlur,
    handlePrimaryKey,
    handleDoubleClick,
    handleType,
  };
}

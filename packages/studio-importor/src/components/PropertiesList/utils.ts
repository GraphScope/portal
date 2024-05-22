import { uuid } from 'uuidv4';
let index = 0;
export const handleAdd = (state, updateState, onChange) => {
  const newProperty = {
    key: uuid(),
    name: `property_${index++}`,
    type: '',
    primaryKey: false,
  };

  updateState(preState => {
    const properties = [...preState.properties, newProperty];
    onChange(properties);
    return {
      ...state,
      properties,
    };
  });
};
export const handleDelete = (state, updateState, onChange) => {
  updateState(preState => {
    const properties = preState.properties.filter(item => !preState.selectedRowKeys.includes(item.key));
    onChange(properties);
    return {
      ...state,
      properties,
      selectedRowKeys: [],
    };
  });
};
/** input->blur */
export const handleBlur = (evt, record, updateState, onChange) => {
  updateState(preset => {
    const properties = preset.properties.map(item => {
      return {
        ...item,
        name: item.key === record.key ? evt.target.value : item.name,
      };
    });
    onChange(properties);
    return {
      ...preset,
      properties,
    };
  });
};
export const handlePrimaryKey = (record, updateState, onChange) => {
  updateState(preset => {
    const properties = preset.properties.map(item => {
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
    onChange(properties);
    return {
      ...preset,
      properties,
    };
  });
};

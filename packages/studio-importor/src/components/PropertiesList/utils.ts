import React from 'react';
import { uuid } from 'uuidv4';
let index = 0;
export const handleAdd = state => {
  const newProperty = {
    key: uuid(),
    name: `property_${index++}`,
    type: '',
    primaryKey: false,
    disable: true,
  };
  const properties = [...state.properties, newProperty];
  return properties;
};
export const handleDelete = state => {
  const properties = state.properties.filter(item => !state.selectedRowKeys.includes(item.key));
  return properties;
};
/** input->blur */
export const handleBlur = (evt, record, state) => {
  const properties = state.properties.map(item => {
    return {
      ...item,
      name: item.key === record.key ? evt.target.value : item.name,
      disable: true,
    };
  });
  return properties;
};
export const handlePrimaryKey = (record, state) => {
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
export const handleDoubleClick = (record, state) => {
  const properties = state.properties.map(item => {
    return {
      ...item,
      disable: item.key !== record.key,
    };
  });
  return properties;
};

export const handleType = (value, row, state) => {
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

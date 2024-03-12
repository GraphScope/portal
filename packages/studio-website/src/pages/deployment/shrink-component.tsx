import { useState } from 'react';
import { Button, Tag } from 'antd';
export default (data: { result: any; name: any; num: number }) => {
  const { result, name, num } = data;
  const [state, updateState] = useState({
    expand: '',
    value: '',
  });
  const { expand, value } = state;
  const variable = Object.entries(result);
  const expandable = (val: string) => {
    updateState(preset => {
      return {
        ...preset,
        value: val,
      };
    });
    if (value === val) {
      updateState(preset => {
        return {
          ...preset,
          expand: '',
        };
      });
      if (!expand) {
        updateState(preset => {
          return {
            ...preset,
            expand: val,
          };
        });
      }
    } else {
      updateState(preset => {
        return {
          ...preset,
          expand: val,
        };
      });
    }
  };
  return (
    <div>
      {variable.slice(0, num).map((item, index) => (
        <div>
          <Tag key={index}>
            <span>{item[0]}</span> : <span>{item[1]}</span>
          </Tag>
        </div>
      ))}
      {expand == name
        ? variable.slice(num, variable.length).map(item => (
            <div>
              <Tag key={item[0]}>
                <span>{item[0]}</span> : <span>{item[1]}</span>
              </Tag>
            </div>
          ))
        : null}
      <Button type="text" disabled={variable.length < num} onClick={() => expandable(name)}>
        {expand && expand == name ? 'COLLAPSE' : 'EXPAND_ALL'}
      </Button>
    </div>
  );
};

import * as React from 'react';
import { Space } from 'antd';
export type ISelectColorProps = {
  value: string;
  onChange(value: string): void;
};

export const colors: string[] = [
  '#1978FF',
  '#5B55F9',
  '#9F35A0',
  '#ED4292',
  '#DF2A30',
  '#F4811F',
  '#0CB96C',
  '#F4801D',
];

const styles = {
  color: {
    width: '16px',
    height: '16px',
    display: 'block',
    borderRadius: '50%',
    cursor: 'pointer',
  },
};

const SelectColor: React.FunctionComponent<ISelectColorProps> = props => {
  const { value, onChange } = props;
  return (
    <Space style={{ marginLeft: '16px' }}>
      {colors.map(color => {
        const isActive = value.toLocaleUpperCase() === color;
        return (
          <span
            key={color}
            onClick={() => {
              onChange(color);
            }}
            style={{
              ...styles.color,
              backgroundColor: color,
              boxSizing: 'border-box',
              border: isActive ? '2px solid blue`' : 'none',
            }}
          ></span>
        );
      })}
    </Space>
  );
};

export default SelectColor;

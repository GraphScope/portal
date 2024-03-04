import * as React from 'react';
import { Space, theme } from 'antd';
const { useToken } = theme;
import { useContext } from '@/layouts/useContext';
export type ISelectColorProps = {
  color: string;
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
  const { color } = props;
  const { token } = useToken();
  const { updateStore } = useContext();

  const activeStyle = `2px solid blue`;
  return (
    <Space style={{ marginLeft: '16px' }}>
      {colors.map(item => {
        const isActive = color == item;
        return (
          <span
            key={item}
            onClick={() => {
              updateStore(draft => {
                draft.primaryColor = item;
              });
            }}
            style={{
              ...styles.color,
              backgroundColor: item,
              boxSizing: 'border-box',
              border: isActive ? activeStyle : 'none',
            }}
          ></span>
        );
      })}
    </Space>
  );
};

export default SelectColor;

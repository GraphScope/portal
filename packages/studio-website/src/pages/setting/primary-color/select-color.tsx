import * as React from 'react';
import { Space } from 'antd';
import { useContext } from '@/layouts/useContext';
import localStorage from '@/components/utils/localStorage';
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
  const { updateStore } = useContext();
  const { setItem, getItem } = localStorage;
  const activeStyle = `2px solid blue`;
  /** 修改主题颜色 */
  const handlePrimaryColor = (item: string) => {
    setItem('primaryColor', item);
    const primaryColor = getItem('primaryColor');
    updateStore(draft => {
      draft.primaryColor = primaryColor;
    });
  };
  return (
    <Space style={{ marginLeft: '16px' }}>
      {colors.map(item => {
        const isActive = color === item;
        return (
          <span
            key={item}
            onClick={() => {
              handlePrimaryColor(item);
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

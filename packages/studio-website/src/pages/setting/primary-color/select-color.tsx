import * as React from 'react';
import { Space, theme } from 'antd';
import { useContext } from '@/layouts/useContext';
import localStorage from '@/components/utils/localStorage';
import { useThemeContainer } from '@graphscope/studio-components';
const { useToken } = theme;
export type ISelectColorProps = {
  value: string;
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
  const { value } = props;
  const { handleTheme } = useThemeContainer();
  const activeStyle = `2px solid blue`;
  /** 修改主题颜色 */
  const handlePrimaryColor = (color: string) => {
    handleTheme({ token: { colorPrimary: color } });
  };
  return (
    <Space style={{ marginLeft: '16px' }}>
      {colors.map(color => {
        const isActive = value === color;
        return (
          <span
            key={color}
            onClick={() => {
              handlePrimaryColor(color);
            }}
            style={{
              ...styles.color,
              backgroundColor: color,
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

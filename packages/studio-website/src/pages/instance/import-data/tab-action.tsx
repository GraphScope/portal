import React, { useState } from 'react';
import { Space, Typography, theme } from 'antd';
type ITabActionProps = {
  items: {
    label: string | React.ReactNode;
    value: string;
  }[];
  tabChange(val: string): void;
};
const { Text } = Typography;
const { useToken } = theme;

const TabAction: React.FC<ITabActionProps> = props => {
  const { items, tabChange } = props;
  const { token } = useToken();
  const [currentType, updatCurrentType] = useState(items[0].value);
  const styles: React.CSSProperties = {
    borderBottom: `2px solid ${token.colorPrimary}`,
    paddingBottom: '7px',
  };
  const activeStyles: React.CSSProperties = {
    borderBottom: 'none',
    paddingBottom: '7px',
  };
  const handleChange = (val: string) => {
    updatCurrentType(val);
    tabChange(val);
  };
  return (
    <Space>
      {items.map((item, index) => {
        const { label, value } = item;
        return (
          <Text key={index} style={currentType === value ? styles : activeStyles} onClick={() => handleChange(value)}>
            {label}
          </Text>
        );
      })}
    </Space>
  );
};

export default TabAction;

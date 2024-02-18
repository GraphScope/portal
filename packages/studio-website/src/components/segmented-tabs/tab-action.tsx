import React, { useState } from 'react';
import { Space, Typography, theme } from 'antd';
type ITabActionProps = {
  tabItems: {
    label: string;
    value: string;
  }[];
  tabChange(val: string): void;
};
const { Text } = Typography;
const { useToken } = theme;

const TabAction: React.FC<ITabActionProps> = props => {
  const { tabItems, tabChange } = props;
  const { token } = useToken();
  const [currentType, updatCurrentType] = useState(tabItems[0].value);
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
    <div style={{ marginBottom: '7px' }}>
      <Space>
        {tabItems.map(item => {
          const { label, value } = item;
          return (
            <Text key={value} style={currentType == value ? styles : activeStyles} onClick={() => handleChange(value)}>
              {label}
            </Text>
          );
        })}
      </Space>
    </div>
  );
};

export default TabAction;

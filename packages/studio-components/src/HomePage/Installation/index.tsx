import React, { useState } from 'react';
import { Flex, Typography, Segmented, theme } from 'antd';
import { useEnv } from '../Hooks';
export interface IInstallationProps {
  items: {
    type: string;
    description: string;
  }[];
}

const Installation: React.FunctionComponent<IInstallationProps> = props => {
  const { token } = theme.useToken();
  const { isMobile } = useEnv();
  const { items } = props;
  const options = items.map(item => item.type);
  const defaultItem = items[0];

  const [state, setState] = useState({
    type: defaultItem.type,
  });
  const { type } = state;
  const handleChange = value => {
    setState(preState => {
      return {
        ...preState,
        type: value,
      };
    });
  };
  const match = items.find(item => item.type === type) || defaultItem;

  return (
    <Flex
      vertical
      style={{
        width: '100%',
        // maxWidth: '60rem'
      }}
      gap={24}
      align="center"
    >
      <Typography.Title level={2}>Installation</Typography.Title>
      <Segmented
        options={options}
        block
        style={{ width: isMobile ? '100%' : '50%' }}
        onChange={handleChange}
        value={type}
      />
      <pre
        style={{
          color: token.colorText,
          //   fontSize: '12px',
          padding: '12px 24px',
          background: token.colorBgLayout,
          boxSizing: 'border-box',
          width: '100%',
          borderRadius: token.borderRadius,
          whiteSpace: 'pre-wrap' /* 保留空格和换行符，但允许自动换行 */,
          wordWrap: 'break-word' /* 允许长单词换行 */,
        }}
      >
        {match.description}
      </pre>
    </Flex>
  );
};

export default Installation;

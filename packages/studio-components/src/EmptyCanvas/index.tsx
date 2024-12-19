import * as React from 'react';
import { Typography } from 'antd';
import Image from './image';
import { isDarkTheme } from '../Utils';
interface IEmptyProps {
  description?: string | React.ReactNode;
  isLight?: boolean;
}

const Empty: React.FunctionComponent<IEmptyProps> = props => {
  const { description, isLight } = props;
  const isDark = isLight || isDarkTheme();

  return (
    <div
      style={{
        fontSize: '14px',
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image isDark={isDark} />
      <Typography.Text
        type="secondary"
        style={{
          position: 'absolute',
        }}
      >
        {description}
      </Typography.Text>
    </div>
  );
};

export default Empty;

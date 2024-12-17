import * as React from 'react';
import { Typography, theme, Flex } from 'antd';
import Image from './image';

interface IEmptyProps {
  description?: string | React.ReactNode;
}

const Empty: React.FunctionComponent<IEmptyProps> = props => {
  const { description } = props;

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{
        fontSize: '14px',
        height: '100%',
        width: '100%',
      }}
    >
      <Image
        style={{
          position: 'absolute',
          zIndex: 2,
        }}
      />
      <Typography.Text
        type="secondary"
        style={{
          position: 'absolute',
          zIndex: 3,
        }}
      >
        {description}
      </Typography.Text>
    </Flex>
  );
};

export default Empty;

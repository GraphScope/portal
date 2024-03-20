import React from 'react';

import { Typography, Flex } from 'antd';

interface IContainerProps {
  children: React.ReactNode;
  title: string;
  extra?: React.ReactNode;
}

const Section: React.FunctionComponent<IContainerProps> = props => {
  const { children, title } = props;
  return (
    <Flex vertical style={{ height: '100%', overflow: 'hidden' }}>
      <Typography.Title level={5} style={{ margin: '0px', flexBasis: '30px', padding: '12px' }}>
        {title}
      </Typography.Title>
      {children}
    </Flex>
  );
};

export default Section;

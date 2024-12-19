import React from 'react';

import { Typography, Flex, theme } from 'antd';
import { FormattedMessage } from 'react-intl';

interface IContainerProps {
  children: React.ReactNode;
  title: string;
  extra?: React.ReactNode;
}

const Section: React.FunctionComponent<IContainerProps> = props => {
  const { children, title } = props;
  const { token } = theme.useToken();
  return (
    <Flex
      vertical
      style={{
        height: '100%',
        overflow: 'hidden',
        borderTop: `1px solid ${token.colorBorder}`,
        marginTop: '-2px',
        marginLeft: '-4px',
        marginRight: '-8px',
      }}
    >
      <Typography.Title level={5} style={{ margin: '0px', flexBasis: '30px', padding: '12px' }}>
        <FormattedMessage id={title} />
      </Typography.Title>
      <div style={{ height: '100%', overflow: 'hidden', marginBottom: '8px' }}>{children}</div>
    </Flex>
  );
};

export default Section;

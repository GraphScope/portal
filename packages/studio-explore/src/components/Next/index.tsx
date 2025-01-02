import * as React from 'react';
import { Divider, Flex, Typography } from 'antd';
import Neighbors from './Neighbors';

interface NextProps {}

const Next: React.FunctionComponent<NextProps> = props => {
  return <Neighbors />;
};

export default Next;

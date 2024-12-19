import * as React from 'react';
import { Flex, Divider } from 'antd';
import Properties from './Properties';
import TotalCounts from './TotalCounts';

interface IUploadProps {
  children?: React.ReactNode;
}

const Statistics: React.FunctionComponent<IUploadProps> = props => {
  return (
    <Flex vertical>
      <TotalCounts />
      <Divider />
      <Properties />
    </Flex>
  );
};

export default Statistics;

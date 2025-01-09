import * as React from 'react';
import { Typography, Flex } from 'antd';
interface ISettingProps {}

const Setting: React.FunctionComponent<ISettingProps> = props => {
  return (
    <Flex>
      <Typography.Text>Settings</Typography.Text>
    </Flex>
  );
};

export default Setting;

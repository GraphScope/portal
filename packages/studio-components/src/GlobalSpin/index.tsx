import * as React from 'react';
import { Flex, Spin } from 'antd';
interface IGlobalSpinProps {}

const GlobalSpin: React.FunctionComponent<IGlobalSpinProps> = props => {
  return (
    <Flex
      justify="center"
      align="center"
      vertical
      style={{
        position: 'fixed',
        top: '0px',
        left: '0px',
        right: '0px',
        bottom: '0px',
      }}
    >
      <Spin size="large" />
    </Flex>
  );
};

export default GlobalSpin;

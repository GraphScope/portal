import * as React from 'react';
import { Flex, Typography } from 'antd';
import { Illustration } from '@graphscope/studio-components';
import { useContext } from '../../hooks/useContext';
interface IPlaceholderProps {}

const Placeholder: React.FunctionComponent<IPlaceholderProps> = props => {
  const { store } = useContext();
  const { data } = store;
  const isEmpty = data.nodes.length === 0;
  if (!isEmpty) {
    return null;
  }
  return (
    <Flex
      vertical
      justify="center"
      align="center"
      style={{
        position: 'absolute',
        top: '0px',
        left: '0px',
        bottom: '0px',
        right: '0px',
      }}
      gap={8}
    >
      <Illustration.Explore style={{ width: '50%', height: '50%' }} />
      <Typography.Text type="secondary">Connect the Complex, Simplify the Insights.</Typography.Text>
    </Flex>
  );
};

export default Placeholder;

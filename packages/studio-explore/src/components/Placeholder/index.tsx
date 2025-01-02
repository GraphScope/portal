import * as React from 'react';
import { Flex, Typography } from 'antd';
import { Illustration } from '@graphscope/studio-components';
import { useContext } from '@graphscope/studio-graph';
import { version } from '../../../package.json';
interface IPlaceholderProps {}

const Placeholder: React.FunctionComponent<IPlaceholderProps> = props => {
  const { store } = useContext();
  const { data } = store;
  const isEmpty = data.nodes.length === 0;
  if (!isEmpty) {
    return (
      <Typography.Text type="secondary" italic style={{ opacity: 0.3, position: 'absolute', bottom: 12, left: 12 }}>
        GraphScope Portal @ v{version}
      </Typography.Text>
    );
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
        opacity: 0.5,
      }}
      gap={8}
    >
      <Illustration.DesignSchema style={{ width: '50%', height: '50%' }} />
      <Typography.Title level={3} italic>
        GraphScope Portal
      </Typography.Title>
      <Typography.Text type="secondary" italic>
        Connect the Complex, Simplify the Insights.
      </Typography.Text>
      <Typography.Text type="secondary" italic>
        version: {version}
      </Typography.Text>
    </Flex>
  );
};

export default Placeholder;

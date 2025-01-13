import * as React from 'react';
import { Button, Typography, Flex } from 'antd';
interface IRelatedWorkProps {}
import { query } from '../Copilot/query';
import { Message } from '../Copilot/utils/message';
import { useContext } from '@graphscope/studio-graph';

const RelatedWork: React.FunctionComponent<IRelatedWorkProps> = props => {
  const { store } = useContext();
  const { selectNodes } = store;
  const handleClick = async () => {
    console.log('selectNodes', selectNodes);
    await query([
      new Message({
        role: 'user',
        content: `Write Related Work`,
      }),
    ]);
  };
  return (
    <Flex vertical gap={12}>
      <Button onClick={handleClick}> Write Related Work</Button>
      <Typography.Text>Selected {selectNodes.length} nodes</Typography.Text>
    </Flex>
  );
};

export default RelatedWork;

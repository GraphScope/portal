import * as React from 'react';
import { Typography, Button } from 'antd';
import { useContext } from '@graphscope/studio-graph';
import { ShareAltOutlined, DeleteOutlined, OpenAIOutlined } from '@ant-design/icons';

interface INeighborQueryProps {}

const RunAI: React.FunctionComponent<INeighborQueryProps> = props => {
  const { store, updateStore } = useContext();
  const { selectNodes } = store;

  const handleClick = () => {
    const scripts = `I have selected those data: ${JSON.stringify(selectNodes, null, 2)}`;
    //@ts-ignore
    window.runAI(scripts);
  };
  return (
    <Button
      onClick={handleClick}
      icon={<OpenAIOutlined />}
      type="text"
      style={{ width: '100%', justifyContent: 'left' }}
    >
      Run Copilot
    </Button>
  );
};

export default RunAI;

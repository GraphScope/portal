import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { useContext } from '../../';
import { BranchesOutlined } from '@ant-design/icons';

interface IDagreModeProps {}

const DagreMode: React.FunctionComponent<IDagreModeProps> = props => {
  const { store } = useContext();
  const { graph } = store;
  const [dagreMode, setToogle] = React.useState(false);
  const handleClick = () => {
    if (graph) {
      if (!dagreMode) {
        graph.dagMode('lr');
      } else {
        graph.dagMode(null);
      }
    }
    setToogle(!dagreMode);
  };
  const title = dagreMode ? 'Force Mode' : 'Dagre Mode';

  return (
    <Tooltip title={title} placement="left">
      <Button onClick={handleClick} icon={<BranchesOutlined />} type="text" />
    </Tooltip>
  );
};

export default DagreMode;

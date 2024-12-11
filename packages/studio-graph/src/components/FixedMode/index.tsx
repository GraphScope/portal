import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { useContext } from '../../';
import { BranchesOutlined, PushpinOutlined } from '@ant-design/icons';

interface IDagreModeProps {}

const FixedMode: React.FunctionComponent<IDagreModeProps> = props => {
  const { store } = useContext();
  const { graph } = store;
  const [globalFixed, setToogle] = React.useState(false);
  const handleClick = () => {
    if (graph) {
      if (!globalFixed) {
        graph.onNodeDragEnd(node => {
          node.fx = node.x;
          node.fy = node.y;
        });
      } else {
        graph.onNodeDragEnd(node => {
          node.fx = undefined;
          node.fy = undefined;
        });
      }
    }
    setToogle(!globalFixed);
  };
  const title = globalFixed ? 'unFixed nodes when dragging' : 'Fixed nodes when dragging';

  return (
    <Tooltip title={title} placement="left">
      <Button onClick={handleClick} icon={<PushpinOutlined rotate={globalFixed ? 0 : 90} />} type="text" />
    </Tooltip>
  );
};

export default FixedMode;

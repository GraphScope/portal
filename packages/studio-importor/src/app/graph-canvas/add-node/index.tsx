import * as React from 'react';
import { Button } from 'antd';
import { uuid } from 'uuidv4';
import { useReactFlow } from 'reactflow';
import { AddNode as AddNodeIcon } from '../../../components/Icons';
import { createNodeLabel } from '../../utils';
interface IAddNodeProps {
  style?: React.CSSProperties;
}
import { useContext } from '../../useContext';
let addNodeIndex = 0;
const AddNode: React.FunctionComponent<IAddNodeProps> = props => {
  const { style } = props;
  const { setCenter } = useReactFlow();
  const { updateStore } = useContext();

  const handleAddVertex = () => {
    updateStore(draft => {
      const label = createNodeLabel();
      const x = addNodeIndex * 200;
      const y = addNodeIndex * 100;
      addNodeIndex++;
      draft.nodes.push({
        id: uuid(),
        position: {
          x,
          y,
        },
        type: 'graph-node',
        data: { label },
      });
      setCenter(x + 100 / 2, y + 100 / 2, { duration: 600, zoom: 1 });
    });
  };

  return <Button onClick={handleAddVertex} style={style} type="text" icon={<AddNodeIcon />}></Button>;
};

export default AddNode;

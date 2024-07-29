import * as React from 'react';
import { Button } from 'antd';
import { useContext } from '../../hooks/useContext';
import { Icons, Utils } from '@graphscope/studio-components';

export interface IRunClusterProps {}

const RunCluster: React.FunctionComponent<IRunClusterProps> = props => {
  const { store, updateStore } = useContext();
  const { graph, data, source } = store;
  const handleClick = () => {
    const groups = Utils.groupBy(data.nodes, node => {
      return node.label;
    });
    console.log('groups', groups);
    graph?.d3Force('grouping', () => {
      data.nodes.forEach(node => {
        console.log('grouping node', node);
      });
      //   updateStore(draft => {
      //     draft.data.nodes = [];
      //   });
    });
  };
  React.useEffect(() => {
    setTimeout(() => {
      handleClick();
    }, 200);
  }, []);

  return <Button onClick={handleClick} icon={<Icons.AddNode />} type="text"></Button>;
};

export default RunCluster;

import * as React from 'react';
import { Tooltip, Space, Button } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useContext, IQueryStatement } from '@graphscope/studio-graph';
import { Utils } from '@graphscope/studio-components';
interface IAddNodesProps {
  label: string;
}

const AddNodes: React.FunctionComponent<IAddNodesProps> = props => {
  const { label } = props;
  const { store, updateStore } = useContext();
  const { schema, getService, data } = store;
  const match = schema.edges.find(item => {
    const { source, target } = item;
    return target === label;
  });
  if (!match || !label.startsWith('Dimension_')) {
    return null;
  }

  const handleClick = async () => {
    if (!match) {
      return;
    }
    const ids = data.nodes
      .filter(item => item.label === match.source)
      .map(item => {
        return item.id;
      })
      .join(',');

    const script = `MATCH (a:${match.source})-[b:${match.label}]->(c:${match.target}) WHERE elementId(a) in [${ids}] return a,b,c`;

    const res = await getService<IQueryStatement>('queryStatement')(script);

    const newData = Utils.handleExpand(data, res);

    updateStore(draft => {
      draft.data = newData;
      draft.source = newData;
      // draft.isLoading = false;
    });
  };
  return (
    <Tooltip title="Please first ensure that the current canvas contains these types of nodes and edges.">
      <Button type="text" icon={<PlayCircleOutlined />} onClick={handleClick}></Button>
    </Tooltip>
  );
};

export default AddNodes;

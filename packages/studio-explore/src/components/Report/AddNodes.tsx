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

  const handleClick = async () => {
    console.log('click', schema, label);
    const match = schema.edges.find(item => {
      const { source, target } = item;
      return target === label;
    });
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
    console.log('script', match, script);
    const res = await getService<IQueryStatement>('queryStatement')(script);

    const newData = Utils.handleExpand(data, res);
    console.log('res', res, newData);
    updateStore(draft => {
      draft.data = newData;
      draft.source = newData;
      // draft.isLoading = false;
    });
  };
  return (
    <Tooltip title="Please first ensure that the current canvas contains these types of nodes and edges.">
      <Button type="text" icon={<PlayCircleOutlined />} onClick={handleClick}>
        {' '}
      </Button>
    </Tooltip>
  );
};

export default AddNodes;

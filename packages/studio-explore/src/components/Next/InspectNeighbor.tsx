import React, { useState } from 'react';
import { Flex, Typography } from 'antd';
import { Illustration } from '@graphscope/studio-components';
import ChartView from '../ChartView';
import { useContext, type INeighborQueryData, type NodeData } from '@graphscope/studio-graph';
import { getPropertyOptions } from '../Statistics/Properties/utils';
interface IInspectNeighborProps {
  data: NodeData[];
}

const InspectNeighbor: React.FunctionComponent<IInspectNeighborProps> = props => {
  const { store } = useContext();
  const { getService, schema } = store;
  const { data } = props;
  const [state, setState] = useState({
    charts: [],
  });

  const options = [
    {
      label: 'label',
      title: 'label',
    },
    getPropertyOptions(schema)[0],
  ];
  console.log('options', options);

  const queryNeighbors = async () => {
    const selectIds = data.map(item => item.id);
    const res1 = await getService<INeighborQueryData>('queryNeighborData')({
      selectIds: selectIds,
      key: '(a)-[b]-(c)',
    });
    let res2 = [];
    if (res1.nodes.length > 0) {
      res2 = await getService<INeighborQueryData>('queryNeighborData')({
        selectIds: res1.nodes.map(item => item.id),
        key: '(a)-[b]-(c)',
      });
      console.log('res2', res2);
    }
    return {
      hop1: res1,
      hop2: res2,
    };
  };
  React.useEffect(() => {
    queryNeighbors().then(res => {
      const { hop1, hop2 } = res;

      setState(preState => {
        return {
          ...preState,
          charts: [],
        };
      });
    });
  }, [data]);
  return (
    <Flex vertical>
      <Flex gap={12}>
        <div style={{ flexBasis: '100px' }}>
          <Illustration.Next style={{ height: '90px', width: '90px' }} />
        </div>
        <Typography.Text type="secondary" italic>
          System have pre-queried the first-degree neighbors for you, and the data characteristics are as follows.
        </Typography.Text>
      </Flex>
    </Flex>
  );
};

export default InspectNeighbor;

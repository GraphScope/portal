import React, { useState } from 'react';
import { Flex, Typography } from 'antd';
import { Illustration } from '@graphscope/studio-components';
import PropertyChart from './ChartView';
import { useContext, type INeighborQueryData, type NodeData, type IQueryStatement } from '@graphscope/studio-graph';

interface IInspectNeighborProps {
  data: NodeData[];
}
export interface IQueryNeighborStatics {
  id: 'queryNeighborStatics';
  query: (property: string, selecteIds: string[]) => Promise<{ [key: string]: any }>;
}

const InspectNeighbor: React.FunctionComponent<IInspectNeighborProps> = props => {
  const { store } = useContext();
  const { getService, schema } = store;
  const { data } = props;
  const [state, setState] = useState({
    charts: [],
    onehopSelectIds: data.map(item => item.id),
    twoHopSelectIds: [],
  });
  const { onehopSelectIds, twoHopSelectIds } = state;

  const queryNeighbors = async (property: string, hop: number) => {
    let selectIds: any[] = [];
    if (hop === 1) {
      selectIds = onehopSelectIds;
    }
    if (hop === 2) {
      selectIds = twoHopSelectIds;
    }
    const res = await getService<IQueryNeighborStatics>('queryNeighborStatics')(property, selectIds);

    return res;
  };

  //   const onChartClick = async (e) => {
  //     const script = ``;

  //       const queryCypher = getService<IQueryStatement>('queryStatement');
  //       const data = await queryCypher(
  //         `
  //           MATCH(a)
  //           WHERE a.${property}='${e.data.data[property]}'
  //           return a
  //           `,
  //       );
  //       updateStore(draft => {
  //         draft.data = data;
  //         draft.source = data;
  //       });

  //   };

  return (
    <Flex vertical gap={12}>
      <Flex gap={12}>
        <Typography.Text type="secondary" italic>
          System have pre-queried the first-degree neighbors for you, and the data statistics are as follows.
        </Typography.Text>
      </Flex>
      <PropertyChart
        // onChartClick={onChartClick}
        extra={
          <Typography.Text type="secondary" italic>
            One Hop Neighbors
          </Typography.Text>
        }
        queryChart={property => queryNeighbors(property, 1)}
      />
      <PropertyChart
        extra={
          <Typography.Text type="secondary" italic>
            Two Hop Neighbors
          </Typography.Text>
        }
        queryChart={property => queryNeighbors(property, 2)}
      />
    </Flex>
  );
};

export default InspectNeighbor;

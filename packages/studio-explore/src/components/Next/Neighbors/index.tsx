import React, { useState } from 'react';
import { Flex, Typography } from 'antd';
import { Illustration } from '@graphscope/studio-components';
import PropertyChart from './ChartView';
import { useContext, type INeighborQueryData, type NodeData, type IQueryStatement } from '@graphscope/studio-graph';

export interface IQueryNeighborStatics {
  id: 'queryNeighborStatics';
  query: (property: string, selecteIds: string[]) => Promise<{ [key: string]: any }>;
}

const InspectNeighbor = props => {
  const { store } = useContext();
  const { getService, selectNodes } = store;
  const [state, setState] = useState({
    label: '',
  });
  const { label } = state;

  const queryNeighbors = async (property: string, hop: number) => {
    const selectIds = selectNodes.map(item => item.id);
    const res = await getService<IQueryNeighborStatics>('queryNeighborStatics')(property, selectIds);
    return res;
  };
  const onLabelChartClick = e => {
    const { label } = e.data.data;
    console.log('e', e);
    setState(preState => {
      return {
        ...preState,
        label,
      };
    });
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
  console.log(label, 'render...label');
  return (
    <Flex vertical gap={12}>
      <Flex align="center" gap={12}>
        <Illustration.Welcome style={{ height: '100px', width: '100px' }} />
        <Typography.Text type="secondary" italic>
          What is the next exploration? System have pre-queried the first-degree neighbors for you, and the data
          statistics are as follows.
        </Typography.Text>
      </Flex>

      <PropertyChart
        // options={{
        //   transpose: true,
        // }}
        defaultProperty={'label'}
        // onChartClick={onChartClick}
        extra={
          <Typography.Text type="secondary" italic>
            One Hop Statistics
          </Typography.Text>
        }
        queryChart={property => queryNeighbors(property, 1)}
        onChartClick={onLabelChartClick}
      />
      {label && (
        <PropertyChart
          extra={
            <Typography.Text type="secondary" italic>
              {label}' Properties Statistics
            </Typography.Text>
          }
          queryChart={property => queryNeighbors(property, 2)}
        />
      )}
    </Flex>
  );
};

export default InspectNeighbor;

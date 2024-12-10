import React, { useEffect, useState } from 'react';
import Chart from '../../ChartView/index';
import { useContext, IQueryStatement } from '@graphscope/studio-graph';
import { Flex, Card } from 'antd';
interface ILabelsProps {}

const Labels: React.FunctionComponent<ILabelsProps> = props => {
  const { store } = useContext();
  const { schema, getService } = store;
  const [state, setState] = useState({
    nodes: [],
  });
  const query = async () => {
    const { nodes } = schema;
    if (nodes.length === 0) {
      return;
    }
    const allFetch = nodes.map(item => {
      const { label } = item;
      const script = `MATCH (n:${label}) RETURN count(n) as ${label}`;
      return getService<IQueryStatement>('queryStatement')(script);
    });
    Promise.all(allFetch).then(res => {
      console.log(res);
      const data = res.map(item => {
        const { table } = item;
        const [name, value] = Object.entries(table[0])[0];
        return {
          name,
          value,
        };
      });
      //@ts-ignore
      setState(preState => {
        return {
          ...preState,
          nodes: data,
        };
      });
    });
  };
  useEffect(() => {
    query();
  }, [schema]);
  console.log(state.nodes);

  return (
    <Flex gap={12} style={{ width: '300px' }}>
      <Chart data={state.nodes} type="pie" xField="name" yField="value" style={{ height: 120, padding: 10 }} />
    </Flex>
  );
};

export default Labels;

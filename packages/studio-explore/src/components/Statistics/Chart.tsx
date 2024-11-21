import React, { useEffect, useRef, useState } from 'react';
import { Select, Space, SelectProps, Tag, Flex } from 'antd';
import { Chart } from '@antv/g2';
import { useContext, IQueryStatement } from '@graphscope/studio-graph';

interface ITableViewProps {
  property: string;
}

const ChartView: React.FunctionComponent<ITableViewProps> = props => {
  const { property } = props;
  const ChartContainerRef = useRef(null);
  const { store, updateStore } = useContext();
  const { getService } = store;
  const [state, setState] = useState({
    data: [],
    isReady: false,
  });
  const { data, isReady } = state;

  const queryData = async () => {
    const queryCypher = getService<IQueryStatement>('queryStatement');
    try {
      const data = await queryCypher(
        `
          MATCH(a) where a.${property} IS NOT NULL AND a.year <> ""
          WITH a.${property} AS ${property}
          return ${property},COUNT(${property}) as counts 
          ORDER BY ${property === 'year' ? 'year' : 'counts'} DESC
          `,
      );
      return data.raw;
    } catch (error) {
      console.log('error', error);
      return [];
    }
  };
  const renderChart = (data: any) => {
    const type = 'interval';
    const x = property;
    const y = 'counts';
    let chart;

    if (ChartContainerRef.current) {
      chart = new Chart({
        container: ChartContainerRef.current,
        autoFit: true,
      });
      chart.options({
        type: type,
        data: data,
        encode: {
          x,
          y,
          //   color: 'color',
        },
        transform: [{ type: 'stackY' }],
        interaction: { elementSelect: { single: true } },
        state: { selected: { fill: '#f4bb51' }, unselected: { opacity: 0.6 } },
      });

      chart.render();
    }
    return chart;
  };
  useEffect(() => {
    queryData().then(res => {
      setState(preState => {
        return {
          data: res,
          isReady: true,
        };
      });
    });
  }, []);

  useEffect(() => {
    let chart;
    const handleClick = async e => {
      const queryCypher = getService<IQueryStatement>('queryStatement');
      const data = await queryCypher(
        `
        MATCH(a) 
        WHERE a.${property}='${e.data.data[property]}'
        return a
        `,
      );
      updateStore(draft => {
        draft.data = data;
        draft.source = data;
      });
    };
    if (isReady) {
      chart = renderChart(data);
      chart.on('interval:click', handleClick);
    }
    return () => {
      if (ChartContainerRef.current && chart) {
        chart.off('interval:click', handleClick);
        chart.destroy();
      }
    };
  }, [ChartContainerRef, data, isReady]);

  return (
    <div style={{ padding: '16px', overflowX: 'hidden' }}>
      <div ref={ChartContainerRef} style={{ width: '100%' }}></div>
    </div>
  );
};

const Charts = props => {
  const { store } = useContext();
  const { getService } = store;
  const queryCypher = getService<IQueryStatement>('queryStatement');

  const { schema } = store;
  const properties = new Set();
  schema.nodes.forEach(node => {
    node.properties.forEach(property => {
      properties.add(property.name);
    });
  });
  const options = [...properties.values()].map(item => {
    return {
      value: item,
      label: item,
    };
  });

  const [state, setState] = useState({
    value: ['year'],
  });

  const handleChange = value => {
    setState(preState => {
      return {
        ...preState,
        value,
      };
    });
  };
  const { value } = state;

  return (
    <Flex vertical gap={0}>
      <Select mode="tags" onChange={handleChange} defaultValue={['year']} style={{ width: '100%' }} options={options} />
      {value.map(item => {
        return <ChartView property={item} key={item} />;
      })}
    </Flex>
  );
};
export default Charts;

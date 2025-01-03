import React, { useEffect, useState } from 'react';
import { Select, Space, Flex, Card, Button, Typography, Skeleton } from 'antd';
import { useContext, IQueryStatement } from '@graphscope/studio-graph';
import { BarChartOutlined, DeleteOutlined } from '@ant-design/icons';
import Chart from '../ChartView/index';

import { Illustration } from '@graphscope/studio-components';
export interface IQueryPropertyStatics {
  id: 'queryPropertyStatics';
  query: (property: string, label?: string) => Promise<{ [key: string]: any }>;
}

interface ITableViewProps {
  label: string;
  property: string;
}
const ChartView: React.FunctionComponent<ITableViewProps> = props => {
  const { store, updateStore } = useContext();
  const { getService, schema } = store;

  const [state, setState] = useState<{
    data: { [key: string]: any };
    isLoading: boolean;
  }>({
    data: [],
    isLoading: false,
  });
  useEffect(() => {
    setState(preState => {
      return {
        ...preState,
        property: props.property,
      };
    });
  }, [props.property]);
  const { data, isLoading } = state;
  const { property, label } = props;

  useEffect(() => {
    (async () => {
      if (!property) {
        return;
      }
      setState(preState => {
        return {
          ...preState,
          isLoading: true,
        };
      });

      try {
        const data = await getService<IQueryPropertyStatics>('queryPropertyStatics')(property, label);
        setState(preState => {
          return {
            ...preState,
            data: data,
            isLoading: false,
          };
        });
      } catch (error) {
        console.log('error', error);
        setState(preState => {
          return {
            ...preState,
            isLoading: false,
          };
        });
      }
    })();
  }, [property]);

  const handleChartClick = async e => {
    if (!property) {
      return;
    }
    const queryCypher = getService<IQueryStatement>('queryStatement');
    console.log('e.data.data[property]', e.data.data[property]);
    const data = await queryCypher(
      `
        MATCH(a:${label}) 
        WHERE a.${property}='${e.data.data[property]}'
        return a
        `,
    );
    updateStore(draft => {
      draft.data = data;
      draft.source = data;
    });
  };

  return (
    <Flex vertical>
      <Typography.Text type="secondary" italic>
        You can click on the `{property}` charts below to start a query, or use the search bar above for detailed
        searches.
      </Typography.Text>
      {isLoading && <Skeleton active style={{ padding: '24px' }} />}
      {!isLoading &&
        (property ? (
          <Chart data={data} xField={property} yField="counts" onClick={handleChartClick} />
        ) : (
          <Flex vertical justify="center" align="center">
            <Illustration.Charts style={{ height: '160px', width: '160px' }} />
            <Typography.Text type="secondary" style={{ textAlign: 'center' }}>
              Select the properties you're interested in
            </Typography.Text>
          </Flex>
        ))}
    </Flex>
  );
};

export default ChartView;

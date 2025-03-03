import React, { useEffect, useState } from 'react';
import { Select, Space, Flex, Card, Button, Typography, Skeleton, theme } from 'antd';
import { useContext, IQueryStatement } from '@graphscope/studio-graph';
import { BarChartOutlined, DeleteOutlined } from '@ant-design/icons';
import Chart from '../ChartView/index';
import Setting from './PropertyChartSetting';

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
  const { token } = theme.useToken();

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
        data.sort((a, b) => {
          if (a[property] > b[property]) {
            return 1;
          }
          if (a[property] === b[property]) {
            return 0;
          }
          return -1;
        });
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

    const property_keys = e.map(item => {
      return item[property];
    });

    const queryCypher = getService<IQueryStatement>('queryStatement');
    const script = `MATCH(a:${label}) WHERE a.${property} in ${JSON.stringify(property_keys)} return a`;
    console.log('%c[QueryStatement:Chart]', 'color:red', script);
    const data = await queryCypher(script);

    updateStore(draft => {
      draft.data = data;
      draft.source = data;
    });
  };
  console.log('data', data, isLoading);
  if (isLoading) {
    return <Skeleton active style={{ padding: '24px' }} />;
  }
  if (data && data.length === 0) {
    return (
      <Flex vertical>
        <Typography.Text type="secondary">
          This property lacks statistical significance,please search directly
          <Illustration.FunArrow style={{ height: '20px', width: '26px', color: token.colorPrimary }} />
        </Typography.Text>
        <Typography.Text type="secondary">
          If you need a statistical chart, please set up the statistical fields <Setting />
        </Typography.Text>
        <Illustration.Charts style={{ height: '160px', width: '160px' }} />
      </Flex>
    );
  }

  return (
    <Flex vertical style={{ height: '400px' }}>
      <Typography.Text type="secondary" italic>
        You can click on the `{property}` charts below to start a query, or use the search bar above for detailed
        searches.
      </Typography.Text>
      <Chart data={data} xField={property} yField="counts" onClick={handleChartClick} />
    </Flex>
  );
};

export default ChartView;

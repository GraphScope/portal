import React, { useEffect, useState } from 'react';
import { Select, Space, Flex, Card, Button, Typography, Skeleton } from 'antd';

import { useContext, IQueryStatement, useApis } from '@graphscope/studio-graph';
import { getPropertyOptions } from './utils';
import { BarChartOutlined, DeleteOutlined } from '@ant-design/icons';
import Chart from '../../ChartView/index';
import { getChartData } from '../utils';

import { Illustration } from '@graphscope/studio-components';
export interface IQueryPropertyStatics {
  id: 'queryPropertyStatics';
  query: (property: string) => Promise<{ [key: string]: any }>;
}

interface ITableViewProps {
  property?: string;
  onRemove: () => void;
}
const ChartView: React.FunctionComponent<ITableViewProps> = props => {
  const { onRemove } = props;
  const { store, updateStore } = useContext();
  const { focusNodes } = useApis();
  const { schema, source } = store;
  const options = getPropertyOptions(schema);

  const [state, setState] = useState<{
    data: { [key: string]: any };
    isLoading: boolean;
    property?: string;
  }>({
    data: [],
    isLoading: false,
    property: props.property,
  });
  const { data, isLoading, property } = state;

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
        const chartData = getChartData(source, property, 'node');
        const data = [...chartData.entries()].map(c => {
          const [key, value] = c;
          return {
            [property]: key,
            counts: value.counts,
            ids: [...value.ids],
          };
        });
        data.sort((a, b) => {
          console.log(b[property], a[property], b[property] > a[property]);
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
  }, [property, source]);

  const handleChange = value => {
    setState(preState => {
      return {
        ...preState,
        property: value,
      };
    });
  };

  const handleChartClick = async e => {
    if (!property) {
      return;
    }

    const { ids } = e.data.data;
    updateStore(draft => {
      draft.source.nodes.forEach(node => {
        draft.nodeStatus[node.id] = {
          disabled: true,
        };
      });
      draft.source.edges.forEach(node => {
        draft.edgeStatus[node.id] = {
          disabled: true,
        };
      });

      ids.forEach(id => {
        draft.nodeStatus[id] = {
          selected: true,
        };
      });

      draft.selectNodes = draft.data.nodes.filter(node => {
        return ids.indexOf(node.id) > -1;
      });
    });
    focusNodes(ids);
  };

  return (
    <Card
      title={
        <Select
          allowClear
          variant="borderless"
          onChange={handleChange}
          defaultValue={property}
          style={{ width: '160px' }}
          options={options}
          placeholder="Select property"
        />
      }
      extra={
        <Space size={0}>
          <Button type="text" icon={<BarChartOutlined />} />
          <Button type="text" icon={<DeleteOutlined />} onClick={onRemove} />
        </Space>
      }
      styles={{
        header: {
          padding: '0px 8px',
          minHeight: '36px',
          fontSize: '14px',
          fontWeight: 400,
        },
        body: {
          padding: '4px',
          height: '210px',
        },
      }}
    >
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
    </Card>
  );
};

export default ChartView;

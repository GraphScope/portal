import React, { useEffect, useState } from 'react';
import { Select, Space, Flex, Card, Button, Typography, Skeleton } from 'antd';

import { useContext, IQueryStatement } from '@graphscope/studio-graph';
import { getPropertyOptions } from './utils';
import { BarChartOutlined, DeleteOutlined } from '@ant-design/icons';
import Chart from '../../ChartView/index';

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
  const { getService, schema } = store;
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
        const data = await getService<IQueryPropertyStatics>('queryPropertyStatics')(property);
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

import React, { useEffect, useState } from 'react';
import { Select, Space, Flex, Card, Button, Typography, Skeleton } from 'antd';

import { useContext, IQueryStatement } from '@graphscope/studio-graph';
import { getPropertyOptions } from '../../Statistics/Properties/utils';
import { BarChartOutlined, DeleteOutlined } from '@ant-design/icons';
import Chart from '../../ChartView/index';

import { Illustration } from '@graphscope/studio-components';

interface IChartViewProps {
  defaultProperty?: string;
  queryChart: (property: string) => Record<string, any>;
  onChartClick?: (property: string) => void;
  extra?: any;
}

const PropertyChart: React.FunctionComponent<IChartViewProps> = props => {
  const { queryChart, onChartClick, extra } = props;
  const { store } = useContext();
  const { schema } = store;
  const options = getPropertyOptions(schema);
  const cardRef = React.createRef<HTMLDivElement>();
  console.log('options', options);
  const [state, setState] = useState<{
    data: { [key: string]: any };
    isLoading: boolean;
    property?: string;
  }>({
    data: [],
    isLoading: false,
    property: props.defaultProperty,
  });
  const { data, isLoading, property } = state;
  console.log(state);

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
        const data = await queryChart(property);

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

  return (
    <Card
      ref={cardRef}
      title={
        <Select
          allowClear
          variant="borderless"
          onChange={handleChange}
          defaultValue={property}
          style={{ width: '160px' }}
          options={options}
          placeholder="Select property"
          getPopupContainer={() => cardRef.current as HTMLDivElement}
        />
      }
      extra={extra}
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
          <Chart data={data} xField={property} yField="counts" onClick={onChartClick} />
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

export default PropertyChart;

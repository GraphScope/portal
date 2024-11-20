import React, { useEffect, useRef, useState } from 'react';
import { Card, Space, Button } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { Chart } from '@antv/g2';

interface ITableViewProps {
  data: any;
  xField: string;
  yField: string;
  type?: string;
  title?: string;
}

const ChartView: React.FunctionComponent<ITableViewProps> = props => {
  const { data, xField, yField, type = 'interval', title = 'Chart Statistics' } = props;
  const ChartContainerRef = useRef(null);
  console.log(props);

  useEffect(() => {
    const chart = renderChart(data);
    return () => {
      chart.destroy();
    };
  }, [data]);
  const renderChart = (data: any) => {
    let chart;

    if (ChartContainerRef.current) {
      chart = new Chart({
        container: ChartContainerRef.current,
        autoFit: true,
        height: 200,
        padding: 10,
      });
      chart.options({
        type,
        data,
        style: { radius: 4 },
        encode: {
          x: xField,
          y: yField,
        },
        transform: [{ type: 'stackY' }],
        interaction: { elementSelect: { single: true } },
        state: { selected: { fill: '#1d6c63' }, unselected: { opacity: 0.99 } },
      });

      chart.render();
    }
    return chart;
  };

  return (
    <Card
      title={title}
      extra={
        <Space>
          <Button type="text" icon={<BarChartOutlined />} />
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
        },
      }}
    >
      <div ref={ChartContainerRef} style={{ width: '100%' }}></div>
    </Card>
  );
};

export default ChartView;

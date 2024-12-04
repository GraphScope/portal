import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import { theme } from 'antd';
interface IColunmChartProps {
  data: Record<string, any>;
  xField: string;
  yField: string;
  type?: string;
  style?: React.CSSProperties;
  onClick?: (data: any) => void;
}

const PieChart: React.FunctionComponent<IColunmChartProps> = props => {
  const { data, xField, yField, style = {}, onClick } = props;
  const { height = 200, padding = 0 } = style;
  const ChartContainerRef = useRef(null);
  const chart = useRef<Chart>();
  const { token } = theme.useToken();

  useEffect(() => {
    if (ChartContainerRef.current) {
      // const sum = data.reduce((acc, curr) => {
      //   return acc + curr[yField];
      // }, 0);
      // const _data = data.map(item => {
      //   return { ...item, __percent: item[yField] / sum };
      // });
      chart.current = new Chart({
        container: ChartContainerRef.current,
        autoFit: true,
        height: height as number,
        padding: padding as number,
      });
      chart.current.options({
        data: data,
        style: { radius: 4 },
        type: 'interval',
        encode: {
          color: xField,
          y: yField,
        },
        legend: false,
        labels: [
          {
            fontSize: 12,
            fill: token.colorTextSecondary,
            position: 'spider',
            text: d => `${d[xField]}`,
          },
        ],
        tooltip: {
          items: [
            data => ({
              name: data[xField],
              value: data[yField],
            }),
          ],
        },
        coordinate: { type: 'theta', outerRadius: 0.8 },
        transform: [{ type: 'stackY' }],
        interaction: { elementSelect: { single: true } },
        state: { selected: { fill: '#1d6c63' }, unselected: { opacity: 0.99 } },
      });
      chart.current.render();
      if (onClick && chart.current) {
        chart.current.on('interval:click', onClick);
      }
    }

    return () => {
      if (chart.current) {
        chart.current.destroy();
        if (onClick) {
          chart.current.off('interval:click', onClick);
        }
      }
    };
  }, [data]);

  return <div ref={ChartContainerRef} style={{ width: '100%' }}></div>;
};

export default PieChart;

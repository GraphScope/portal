import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import { theme } from 'antd';

interface IBarChartProps {
  data: Record<string, any>;
  xField: string;
  yField: string;
  type?: string;
  style?: React.CSSProperties;
  onClick?: (data: any) => void;
  options?: Record<string, any>;
}

const BarChart: React.FunctionComponent<IBarChartProps> = props => {
  const { data, xField, yField, style = {}, onClick, options = {} } = props;
  const { token } = theme.useToken();

  const { padding = [20, 80] } = style;
  const ChartContainerRef = useRef(null);
  const chart = useRef<Chart>();
  const current_data = useRef(new Map());

  useEffect(() => {
    if (current_data) {
      current_data.current = new Map();
    }
    const handleClick = evt => {
      if (onClick && current_data.current) {
        const item = evt.data.data;
        const x = item[xField];
        if (current_data.current.has(x)) {
          current_data.current.delete(x);
        } else {
          current_data.current.set(x, item);
        }
        const values = [...current_data.current.values()];
        onClick(values);
      }
    };
    if (ChartContainerRef.current) {
      const { clientWidth, clientHeight } = ChartContainerRef.current;

      chart.current = new Chart({
        container: ChartContainerRef.current,
        autoFit: true,
        height: clientHeight,
        width: clientWidth,
        padding: padding as number,
      });

      chart.current.options({
        data,
        style: { radius: 4, fill: token.colorPrimary, minHeight: 16, minWidth: 8 },
        type: 'interval',
        axis: {
          y: false,
          x: {
            labelAutoRotate: true,
            labelAutoHide: true,
          },
        },
        encode: {
          x: xField,
          y: yField,
        },
        labels: [
          {
            text: yField,
            fill: token.colorPrimary,
            dy: -15,
            transform: [
              {
                type: 'overlapHide',
              },
            ],
          },
        ],
        transform: [{ type: 'stackY' }],
        interaction: {
          elementSelect: { single: false },
        },
        state: { selected: { fill: '#1d6c63' }, unselected: { opacity: 0.99 } },
        ...(options.transpose
          ? {
              coordinate: { transform: [{ type: 'transpose' }] },
            }
          : {}),
      });
      chart.current.render();

      if (chart.current) {
        chart.current.on('interval:click', handleClick);
      }
    }

    return () => {
      if (chart.current) {
        chart.current.destroy();

        chart.current.off('interval:click', handleClick);
      }
    };
  }, [data]);

  return <div ref={ChartContainerRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default BarChart;

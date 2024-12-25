import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

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

  const { height = 200, padding = [20, 80] } = style;
  const ChartContainerRef = useRef(null);
  const chart = useRef<Chart>();

  useEffect(() => {
    if (ChartContainerRef.current) {
      chart.current = new Chart({
        container: ChartContainerRef.current,
        autoFit: true,
        height: height as number,
        padding: padding as number,
      });

      chart.current.options({
        data,
        style: { radius: 4 },
        type: 'interval',
        encode: {
          x: xField,
          y: yField,
        },
        transform: [{ type: 'stackY' }],
        interaction: { elementSelect: { single: true } },
        state: { selected: { fill: '#1d6c63' }, unselected: { opacity: 0.99 } },
        ...(options.transpose
          ? {
              coordinate: { transform: [{ type: 'transpose' }] },
            }
          : {}),
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

export default BarChart;

import * as React from 'react';
import ColumnChart from './BarChart';
import PieChart from './PieChart';
interface IChartViewProps {
  data: Record<string, any>;
  xField: string;
  yField: string;
  type?: 'pie' | 'bar';
  style?: React.CSSProperties;
  onClick?: (data: any) => void;
}

const ChartView: React.FunctionComponent<IChartViewProps> = props => {
  const { type = 'bar' } = props;
  if (type === 'pie') {
    return <PieChart {...props} />;
  }
  return <ColumnChart {...props} />;
};

export default ChartView;

import * as React from 'react';

interface ILegendProps {
  count: string;
}

const Legend: React.FunctionComponent<ILegendProps> = props => {
  const { count } = props;
  return <div>customer.....({count})</div>;
};

export default Legend;

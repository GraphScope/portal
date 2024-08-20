import React, { useEffect } from 'react';
import { Chart } from '@antv/g2';
interface IBarProps {
  id: string;
  data?: any;
}
const Bar: React.FC<IBarProps> = props => {
  const { id, data } = props;
  useEffect(() => {
    const chart = new Chart({
      container: id,
      autoFit: true,
      width: 200,
      height: 120,
    });

    chart
      .interval()
      .data(data)
      .encode('x', 'name')
      .encode('y', 'count')
      .interaction('tooltip', {
        // render 回调方法返回一个innerHTML 或者 DOM
        render: (event, { title, items }) => `<div>
          <h3 style="padding:0;margin:0">memberName: ${title}</h3>
          <h3 style="padding:0;margin:0">Sum of count: ${items[0].value}</h3>
          </div>`,
      });

    chart.axis(false);
    chart.render();
  }, [data]);
  return <div id={id}></div>;
};

export default Bar;

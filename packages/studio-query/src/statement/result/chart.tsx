import React, { useEffect, useRef } from 'react';
import { Select, Space } from 'antd';
import { Chart } from '@antv/g2';

interface ITableViewProps {
  table: any;
}

export const calc = data => {
  const FirstRow = data[0];
  const colunm = {};
  const numberKeys: string[] = [];
  // const stringKeys: string[] = [];
  Object.keys(FirstRow).forEach(key => {
    const type = typeof FirstRow[key];
    colunm[key] = {
      key,
      type,
      enums: new Set(),
    };
    if (type === 'number') {
      numberKeys.push(key);
    }
    if (type === 'string') {
      // stringKeys.push(key);
    }
  });

  data.forEach(item => {
    Object.keys(item).forEach(key => {
      colunm[key]['enums'].add(item[key]);
    });
  });

  const stringKeys = Object.values(colunm)
    .filter((item: any) => {
      return item.type === 'string';
    })
    //@ts-ignore
    .sort((a, b) => {
      //@ts-ignore
      return a.enums.size < b.enums.size;
    })
    .map(item => {
      //@ts-ignore
      return item.key;
    });

  const [y, _x] = numberKeys;
  const [x, color] = stringKeys;
  const type = numberKeys.length > 1 ? 'point' : 'interval';

  return {
    type,
    x: _x || x,
    y,
    color,
    keys: Object.keys(colunm),
  };
};

const ChartView: React.FunctionComponent<ITableViewProps> = props => {
  const { table } = props;
  const ChartRef = useRef(null);

  const [state, setState] = React.useState<{
    type: string;
    x: string;
    y: string;
    color: string;
  }>(() => {
    const { x, y, color, type, keys } = calc(table);

    return {
      x,
      y,
      color,
      type,
      options: keys.map(key => {
        return { label: key, value: key };
      }),
    };
  });

  console.log(state);
  //@ts-ignore
  const { type, x, y, color, options } = state;
  useEffect(() => {
    let chart;
    if (ChartRef.current) {
      chart = new Chart({
        container: ChartRef.current,
        autoFit: true,
      });
      chart.options({
        type: type,
        data: table,
        encode: {
          x,
          y,
          color,
        },
        transform: [{ type: 'dodgeX' }],
      });

      chart.render();
    }
    return () => {
      if (ChartRef.current) {
        chart.destroy();
      }
    };
  }, [type, x, y, table, color, ChartRef]);

  //TODO
  const types = [
    {
      label: '柱状图',
      value: 'interval',
    },
    // {
    //   label: '堆叠柱状图',
    //   value: 'stacked bar',
    // },
    // {
    //   label: '分组柱状图',
    //   value: 'grouped bar',
    // },
    // {
    //   label: '饼图',
    //   value: 'pie',
    // },
    {
      label: '散点图',
      value: 'point',
    },
    // {
    //   label: '雷达图',
    //   value: 'polar',
    // },
  ];

  const handleChange = () => {};
  return (
    <div style={{ padding: '16px', overflowX: 'hidden' }}>
      <Space style={{ paddingBottom: '16px' }}>
        Type:
        <Select
          size="small"
          defaultValue={type}
          style={{ width: 120 }}
          onChange={value => {
            setState(preState => {
              return {
                ...preState,
                type: value,
              };
            });
          }}
          options={types}
        />
        X:
        <Select
          size="small"
          defaultValue={x}
          style={{ width: 120 }}
          onChange={value => {
            setState(preState => {
              return {
                ...preState,
                x: value,
              };
            });
          }}
          options={options}
        />
        Y:
        <Select
          size="small"
          defaultValue={y}
          style={{ width: 120 }}
          onChange={value => {
            setState(preState => {
              return {
                ...preState,
                y: value,
              };
            });
          }}
          options={options}
        />
        Color:
        <Select
          size="small"
          defaultValue={color}
          style={{ width: 120 }}
          onChange={value => {
            setState(preState => {
              return {
                ...preState,
                color: value,
              };
            });
          }}
          options={options}
        />
      </Space>

      <div ref={ChartRef} style={{ width: '100%' }}></div>
    </div>
  );
};

export default ChartView;

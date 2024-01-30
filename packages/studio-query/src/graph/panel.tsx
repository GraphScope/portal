import React, { useState, useEffect } from 'react';
import PropertiesPanel from '../properties-panel';
import { GraphinContext } from '@antv/graphin';
import type { IDetail } from '../properties-panel';
import { theme } from 'antd';
interface IPanelProps {
  overview: any;
  onChange: () => void;
}

const Panel: React.FunctionComponent<IPanelProps> = props => {
  const { overview, onChange } = props;
  const { graph } = React.useContext(GraphinContext);
  const { token } = theme.useToken();
  const [state, updateState] = useState<{
    detail: IDetail | null;
    mode: 'overview' | 'detail';
  }>({
    detail: null,
    mode: 'overview',
  });
  const { detail, mode } = state;

  useEffect(() => {
    const handleClick = e => {
      const model = e.item.getModel();
      const d: IDetail = {
        type: 'node',
        label: model.label,
        data: model.properties,
      };
      if (e.item) {
        updateState(preState => {
          return {
            ...preState,
            detail: d,
            mode: 'detail',
          };
        });
      }
    };
    const handleClear = () => {
      updateState(preState => {
        return {
          ...preState,
          detail: null,
          mode: 'overview',
        };
      });
    };
    graph.on('node:click', handleClick);
    graph.on('canvas:click', handleClear);
    return () => {
      graph.off('node:click', handleClick);
      graph.off('canvas:click', handleClear);
    };
  }, [graph]);
  const handleChange = value => {
    console.log(value);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '6px',
        right: '6px',
        bottom: '6px',
        background: token.colorBgContainer,
        padding: '12px',
        boxShadow: token.boxShadowTertiary,
        width: '250px',
      }}
    >
      <PropertiesPanel mode={mode} overview={overview} detail={detail as IDetail} onChange={onChange} />
    </div>
  );
};

export default Panel;

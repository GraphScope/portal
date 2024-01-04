import React, { memo } from 'react';
import { Space, Button, Segmented } from 'antd';
import TableView from './table';
import JSONView from './json';
import GraphView from './graph';

interface IResultProps {
  data: any;
}

const Result: React.FunctionComponent<IResultProps> = props => {
  const { data } = props;
  const [state, updateState] = React.useState<{
    viewMode: 'graph' | 'table' | 'raw';
  }>({
    viewMode: 'graph',
  });
  const { viewMode } = state;
  const handleChange = value => {
    updateState(preState => {
      return {
        ...preState,
        viewMode: value,
      };
    });
  };
  const itemStyle: React.CSSProperties = {
    position: 'absolute',
    right: '0px',
    bottom: '0px',
    top: '0px',
    left: '0px',
    display: 'none',
  };
  const activeItemStyle: React.CSSProperties = {
    ...itemStyle,
    display: 'block',
  };

  return (
    <div>
      <Segmented options={['graph', 'table', 'raw']} onChange={handleChange} value={viewMode}></Segmented>
      <div style={{ height: '100px', background: 'grey', position: 'relative' }}>
        <div style={viewMode === 'graph' ? activeItemStyle : itemStyle}>
          <GraphView data={data} />
        </div>
        <div style={viewMode === 'table' ? activeItemStyle : itemStyle}>
          <TableView data={data} />
        </div>
        <div style={viewMode === 'raw' ? activeItemStyle : itemStyle}>
          <JSONView data={data} />
        </div>
      </div>
    </div>
  );
};

export default memo(Result);

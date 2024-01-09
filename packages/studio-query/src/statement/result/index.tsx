import React, { memo } from 'react';
import { Space, Button, Segmented, Skeleton } from 'antd';
import TableView from './table';
import JSONView from './json';
import GraphView from './graph';

interface IResultProps {
  data: any;
  isFetching: boolean;
}

const Result: React.FunctionComponent<IResultProps> = props => {
  const { data, isFetching } = props;
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
      <div style={{ height: '500px', position: 'relative', overflowY: 'scroll' }}>
        <div style={isFetching ? activeItemStyle : itemStyle}>
          <Skeleton active />
          <Skeleton active />
        </div>
        <div style={viewMode === 'graph' && !isFetching ? activeItemStyle : itemStyle}>
          <GraphView data={data} />
        </div>
        <div style={viewMode === 'table' && !isFetching ? activeItemStyle : itemStyle}>
          <TableView data={data} />
        </div>
        <div style={viewMode === 'raw' && !isFetching ? activeItemStyle : itemStyle}>
          <JSONView data={data} />
        </div>
      </div>
    </div>
  );
};

export default memo(Result);

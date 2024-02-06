import React, { memo } from 'react';
import { Space, Button, Segmented, Skeleton } from 'antd';
import TableView from './table';
import JSONView from './json';
import GraphView from './graph';
import ChartView from './chart';

interface IResultProps {
  data: any;
  isFetching: boolean;
  schemaData: any;
  graphName: string;
}

const Result: React.FunctionComponent<IResultProps> = props => {
  const { data, isFetching, schemaData, graphName } = props;
  const { nodes = [], edges = [], table = [] } = data;

  const [state, updateState] = React.useState<{
    viewMode: 'graph' | 'table' | 'chart';
    options: string[];
  }>(() => {
    const hasNodes = nodes.length > 0;
    const hasEdges = edges.length > 0;
    const hasRows = table.length > 0;
    let viewMode = 'table';
    let options: string[] = ['table'];
    if (hasNodes) {
      viewMode = 'graph';
      options = ['graph', 'table'];
    }
    if (!hasNodes && hasEdges) {
      viewMode = 'table';
      options = ['table'];
    }
    if (!hasNodes && !hasEdges && hasRows) {
      viewMode = 'table';
      options = ['table', 'chart'];
    }
    return {
      viewMode: viewMode as 'graph' | 'table' | 'chart',
      options,
    };
  });
  const { viewMode, options } = state;

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
  const isExist = type => {
    return options.indexOf(type) !== -1;
  };

  return (
    <div>
      <Segmented
        style={
          {
            // zIndex: 999,
            // position: 'absolute',
            // top: '6px',
            // left: '6px',
          }
        }
        options={options}
        onChange={handleChange}
        value={viewMode}
      ></Segmented>
      <div style={{ height: '500px', position: 'relative', overflowY: 'scroll' }}>
        {isExist('graph') && (
          <div style={viewMode === 'graph' && !isFetching ? activeItemStyle : itemStyle}>
            <GraphView data={data} schemaData={schemaData} graphName={graphName} />
          </div>
        )}
        {isExist('table') && (
          <div style={viewMode === 'table' && !isFetching ? activeItemStyle : itemStyle}>
            <TableView data={data} />
          </div>
        )}
        {/* <div style={viewMode === 'raw' && !isFetching ? activeItemStyle : itemStyle}>
          <JSONView data={data} />
        </div> */}
        {isExist('chart') && (
          <div style={viewMode === 'chart' && !isFetching ? activeItemStyle : itemStyle}>
            <ChartView data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Result);

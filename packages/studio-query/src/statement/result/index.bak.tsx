import React, { memo } from 'react';
import { Space, Button, Segmented, Skeleton, Flex, Tabs } from 'antd';
import TableView from './table';
import RawView from './raw';
import GraphView from './graph';
import ChartView from './chart';
import { DeploymentUnitOutlined, TableOutlined, BarChartOutlined, CodeOutlined } from '@ant-design/icons';

interface IResultProps {
  data: any;
  isFetching: boolean;
  schemaData: any;
  graphName: string;
}

const MAP = {
  icon: <DeploymentUnitOutlined />,
};

const Result: React.FunctionComponent<IResultProps> = props => {
  const { data, isFetching, schemaData, graphName } = props;
  const { nodes = [], edges = [], table = [] } = data;

  const [state, updateState] = React.useState<{
    viewMode: 'graph' | 'table' | 'raw';
    options: string[];
  }>(() => {
    const hasNodes = nodes.length > 0;
    const hasEdges = edges.length > 0;
    const hasRows = table.length > 0;
    let viewMode = 'table';

    let options: string[] = ['raw', 'table'];
    if (hasNodes) {
      viewMode = 'graph';
      options = ['raw', 'graph', 'table'];
    }
    if (!hasNodes && hasEdges) {
      viewMode = 'table';
      options = ['raw', 'table'];
    }
    if (!hasNodes && !hasEdges && hasRows) {
      viewMode = 'table';
      options = ['raw', 'table'];
    }
    return {
      viewMode: viewMode as 'graph' | 'table' | 'raw',
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
    // display: 'none',
    visibility: 'hidden',
    display: 'block',
    width: '100%',
    overflowY: 'scroll',
  };
  const activeItemStyle: React.CSSProperties = {
    ...itemStyle,
    display: 'block',
    visibility: 'visible',
  };
  const isExist = type => {
    return options.indexOf(type) !== -1;
  };

  const SegmentedOptions = [
    { label: 'Graph ', value: 'graph', icon: <DeploymentUnitOutlined />, disabled: !isExist('graph') },
    { label: 'Table', value: 'table', icon: <TableOutlined />, disabled: !isExist('table') },
    // { label: 'Chart View', value, icon: <BarChartOutlined />, disabled: !isExis) },
    { label: 'Raw', value: 'raw', icon: <CodeOutlined />, disabled: !isExist('raw') },
  ];
  console.log('data', data);

  return (
    <div style={{ padding: '16px 0px' }}>
      <Segmented options={SegmentedOptions} onChange={handleChange} value={viewMode}></Segmented>
      <div style={{ height: '500px', position: 'relative', overflow: 'hidden' }}>
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
        <div style={viewMode === 'raw' && !isFetching ? activeItemStyle : itemStyle}>
          <RawView data={data} />
        </div>
        {/* {isExis) && (
          <div style={viewMode == && !isFetching ? activeItemStyle : itemStyle}>
            <ChartView data={data} />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default memo(Result);

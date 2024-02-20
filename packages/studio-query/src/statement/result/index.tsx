import React, { memo } from 'react';
import { Space, Button, Segmented, Skeleton, Flex } from 'antd';
import TableView from './table';
import JSONView from './json';
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
    viewMode: 'graph' | 'table' | 'chart' | 'code';
    options: string[];
  }>(() => {
    const hasNodes = nodes.length > 0;
    const hasEdges = edges.length > 0;
    const hasRows = table.length > 0;
    let viewMode = 'table';

    let options: string[] = ['code', 'table'];
    if (hasNodes) {
      viewMode = 'graph';
      options = ['code', 'graph', 'table'];
    }
    if (!hasNodes && hasEdges) {
      viewMode = 'table';
      options = ['code', 'table'];
    }
    if (!hasNodes && !hasEdges && hasRows) {
      viewMode = 'table';
      options = ['code', 'table', 'chart'];
    }
    return {
      viewMode: viewMode as 'graph' | 'table' | 'chart' | 'code',
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
    { label: 'Graph View ', value: 'graph', icon: <DeploymentUnitOutlined />, disabled: !isExist('graph') },
    { label: 'Table View', value: 'table', icon: <TableOutlined />, disabled: !isExist('table') },
    { label: 'Chart View', value: 'chart', icon: <BarChartOutlined />, disabled: !isExist('chart') },
    { label: 'Code View', value: 'code', icon: <CodeOutlined />, disabled: !isExist('code') },
  ];

  return (
    <Flex gap={12} vertical>
      <Segmented block options={SegmentedOptions} onChange={handleChange} value={viewMode}></Segmented>
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
    </Flex>
  );
};

export default memo(Result);

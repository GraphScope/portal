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

const getOptions = (data, isFetching) => {
  const { nodes = [], edges = [], table = [], raw } = data;
  const hasNodes = nodes.length > 0;
  const hasEdges = edges.length > 0;
  const hasRows = table.length > 0;

  let viewMode = 'raw';

  let options: string[] = ['raw'];

  if (hasNodes) {
    viewMode = 'graph';
    options = ['raw', 'table', 'graph'];
  }
  if (!hasNodes && hasEdges) {
    viewMode = 'table';
    options = ['raw', 'table'];
  }
  if (!hasNodes && !hasEdges && hasRows) {
    viewMode = 'table';
    options = ['raw', 'table'];
  }
  if (isFetching) {
    options = ['raw'];
    viewMode = 'raw';
  }
  return {
    viewMode,
    options,
  };
};

const Result: React.FunctionComponent<IResultProps> = props => {
  const { data, isFetching, schemaData, graphName } = props;
  const { nodes = [], edges = [], table = [] } = data;

  const [state, updateState] = React.useState<{
    viewMode: 'graph' | 'table' | 'raw';
    options: string[];
  }>(() => {
    const { viewMode, options } = getOptions(data, isFetching);
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

  console.log('data', data);
  const items = [
    {
      label: 'Graph ',
      key: 'graph',
      icon: <DeploymentUnitOutlined />,
      children: <GraphView data={data} schemaData={schemaData} graphName={graphName} />,
      disabled: !isExist('graph'),
    },
    {
      label: 'Table',
      key: 'table',
      icon: <TableOutlined />,
      children: <TableView data={data} />,
      disabled: !isExist('table'),
    },
    {
      label: 'Raw',
      key: 'raw',
      icon: <CodeOutlined />,
      children: <RawView data={data} isFetching={isFetching} />,
      disabled: !isExist('raw'),
    },
  ];
  return (
    <div style={{ padding: '16px 0px' }}>
      <Tabs items={items} size="small" type="card" activeKey={viewMode} onChange={handleChange} />
    </div>
  );
};

export default memo(Result);

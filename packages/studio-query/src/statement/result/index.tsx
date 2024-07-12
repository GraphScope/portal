import React, { memo } from 'react';
import { Tabs } from 'antd';
import TableView from './table';
import RawView from './raw';
import GraphView from './graph';
import { useIntl } from 'react-intl';

import { DeploymentUnitOutlined, TableOutlined, BarChartOutlined, CodeOutlined } from '@ant-design/icons';

interface IResultProps {
  data: any;
  isFetching: boolean;
  schemaData: any;
  graphId: string;
}

/**
 * viewMode 权重 isFetching > activeKey > data
 * @param data
 * @param isFetching
 * @param activeKey
 * @returns
 */
const getOptions = (data, isFetching, activeKey) => {
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
  if (activeKey) {
    viewMode = activeKey;
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
  const { data, isFetching, schemaData, graphId } = props;

  const [activeKey, setActiveKey] = React.useState(null);
  const intl = useIntl();

  const { viewMode, options } = getOptions(data, isFetching, activeKey);

  const handleChange = value => {
    setActiveKey(value);
  };

  const isExist = type => {
    return options.indexOf(type) !== -1;
  };

  const items = [
    {
      label: intl.formatMessage({ id: 'Graph' }),
      key: 'graph',
      icon: <DeploymentUnitOutlined />,
      children: <GraphView data={data} schemaData={schemaData} graphId={graphId} />,
      disabled: !isExist('graph'),
    },
    {
      label: intl.formatMessage({ id: 'Table' }),
      key: 'table',
      icon: <TableOutlined />,
      children: <TableView data={data} />,
      disabled: !isExist('table'),
    },
    {
      label: intl.formatMessage({ id: 'Raw' }),
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

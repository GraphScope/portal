import React, { memo, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import TableView from './table';
import RawView from './raw';
import GraphView from './graph';
import { useIntl } from 'react-intl';
import type { IEditorProps } from '../typing';
import { useDynamicStyle } from '@graphscope/studio-components'
import { DeploymentUnitOutlined, TableOutlined, BarChartOutlined, CodeOutlined } from '@ant-design/icons';

interface IResultProps {
  data: any;
  isFetching: boolean;
  schemaData: any;
  graphId: string;
  onQuery: IEditorProps['onQuery'];
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
  const { data, isFetching, schemaData, graphId, onQuery } = props;

  const [activeKey, setActiveKey] = React.useState(null);
  const intl = useIntl();

  const { viewMode, options } = getOptions(data, isFetching, activeKey);

  // 使用 useDynamicStyle 添加样式
  useDynamicStyle('result-tabs-styles', `
    .result-tabs {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .result-tabs .ant-tabs-content {
      flex: 1;
      height: 100%;
    }
    .result-tabs .ant-tabs-content-holder {
      height: 100%;
      overflow: hidden;
    }
    .result-tabs .ant-tabs-tabpane {
      height: 100%;
      overflow: auto;
    }
    .result-tabs .ant-tabs-tabpane > div {
      height: 100%;
    }
    .ant-table-wrapper {
      height: 100%;
    }
    .ant-spin-nested-loading, 
    .ant-spin-container {
      height: 100%;
    }
  `);

  const handleChange = value => {
    setActiveKey(value);
  };

  const isExist = type => {
    return options.indexOf(type) !== -1;
  };

  // 用于所有Tab内容的通用容器样式
  const tabContentContainerStyle = {
    height: '100%',
    width: '100%',
    padding: '0',
  };

  // 包装Tab内容的函数
  const wrapTabContent = (content) => (
    <div style={tabContentContainerStyle}>
      {content}
    </div>
  );

  const items = [
    {
      label: intl.formatMessage({ id: 'Graph' }),
      key: 'graph',
      icon: <DeploymentUnitOutlined />,
      children: wrapTabContent(<GraphView data={data} schemaData={schemaData} graphId={graphId} />),
      disabled: !isExist('graph'),
    },
    {
      label: intl.formatMessage({ id: 'Table' }),
      key: 'table',
      icon: <TableOutlined />,
      children: wrapTabContent(<TableView data={data} />),
      disabled: !isExist('table'),
    },
    {
      label: intl.formatMessage({ id: 'Raw' }),
      key: 'raw',
      icon: <CodeOutlined />,
      children: wrapTabContent(<RawView data={data} isFetching={isFetching} />),
      disabled: !isExist('raw'),
    },
  ];

  return (
    <div style={{ 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column'
    }}>
      <Tabs 
        items={items} 
        size="small" 
        type="card" 
        activeKey={viewMode} 
        onChange={handleChange}
        tabBarStyle={{ margin: 0 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}
        className="result-tabs"
      />
    </div>
  );
};

export default memo(Result);

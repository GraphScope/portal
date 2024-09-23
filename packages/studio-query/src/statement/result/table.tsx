import React, { useEffect, useState } from 'react';
import { Table, Space, Typography, Flex, Button, Tooltip, Segmented, Popover } from 'antd';
import { FileExcelOutlined, BarChartOutlined, TableOutlined } from '@ant-design/icons';
import ChartView from './chart';
import { useIntl } from 'react-intl';
import { Utils } from '@graphscope/studio-components';
interface ITableViewProps {
  data: any;
}

const RowTable = ({ data }) => {
  /** table */
  const FirstRow = data[0];
  const columns = Object.keys(FirstRow).map(key => {
    return {
      title: key,
      dataIndex: key,
      key: key,
    };
  });
  const dataSource = data.map(item => {
    return {
      ...item,
      key: item.id,
    };
  });

  return <Table columns={columns} dataSource={dataSource} />;
};

const GraphTable = ({ nodes, edges }) => {
  const nodeLabelMap = {};
  const nodeSource = nodes.map(item => {
    const { id, label, properties } = item;
    nodeLabelMap[id] = label;
    return {
      key: id,
      id,
      label,
      properties: JSON.stringify({ ...properties }, null, 2),
    };
  });
  const edgeSource = edges.map(item => {
    const { id, label, properties, source, target } = item;

    return {
      key: id,
      id,
      label: `(${nodeLabelMap[source]})-[:${label}]-(${nodeLabelMap[target]})`,
      properties: JSON.stringify(properties, null, 2),
    };
  });

  const dataSource = [...nodeSource, ...edgeSource];
  /** 处理table columns字符过长展示 */
  function truncateText(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
  }

  const result = dataSource.map(item => {
    const { id, label, properties } = item;
    const expandColumns = properties && JSON.parse(properties);
    return {
      id,
      label,
      ...expandColumns,
    };
  });

  const FirstRow = result[0];
  const columns = Object.keys(FirstRow).map(key => {
    return {
      title: key,
      dataIndex: key,
      key: key,
      width: 180,
      render: record => {
        if (String(record).length > 30) {
          return (
            <Popover
              content={
                <div
                  style={{
                    width: '500px',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {record}
                </div>
              }
            >
              {truncateText(String(record), 30)}
            </Popover>
          );
        }
        return <>{record}</>;
      },
    };
  });

  return <Table style={{ width: '100%' }} columns={columns} dataSource={result} scroll={{ x: 500 }} />;
};

const TableView: React.FunctionComponent<ITableViewProps> = props => {
  const { table = [], nodes = [], edges = [] } = props.data;
  const nodeCount = nodes.length;
  const edgeCount = edges.length;
  const totalCount = table.length;
  const intl = useIntl();
  let description: any;
  if (nodeCount === 0 && edgeCount === 0 && totalCount !== 0) {
    description = intl.formatMessage(
      {
        id: 'A total of {totalCount} records were retrieved',
      },
      {
        totalCount: totalCount,
      },
    );
  } else {
    description = intl.formatMessage(
      {
        id: 'A total of {totalCount} records were retrieved, including {nodeCount} nodes and  {edgeCount} edges.',
      },
      {
        totalCount: nodeCount + edgeCount,
        nodeCount: nodeCount,
        edgeCount: edgeCount,
      },
    );
  }

  const [mode, setMode] = useState<'table' | 'chart'>('table');
  const handleDownload = () => {
    const _nodes = nodes.map(item => {
      const { id, label, properties = {} } = item;
      return {
        id,
        label,
        ...properties,
      };
    });
    const _edges = edges.map(item => {
      const { id, label, source, target, properties = {} } = item;
      return {
        id,
        label,
        source,
        target,
        ...properties,
      };
    });
    Utils.createDownload(JSON.stringify({ nodes: _nodes, edges: _edges }, null, 2), 'result.json');
  };

  return (
    <div style={{ overflowX: 'scroll' }}>
      <Flex justify="space-between" style={{ padding: '0px 10px 10px 10px' }} align="center">
        <Typography.Text>{description}</Typography.Text>
        <Space>
          <Segmented
            value={mode}
            onChange={value => {
              setMode(value as 'table' | 'chart');
            }}
            options={[
              { value: 'chart', icon: <BarChartOutlined />, label: 'chart' },
              { value: 'table', icon: <TableOutlined /> },
            ]}
          />
          <Tooltip title="download">
            <Button icon={<FileExcelOutlined />} type="text" onClick={handleDownload}>
              {' '}
            </Button>
          </Tooltip>
        </Space>
      </Flex>
      {mode === 'table' && nodes.length !== 0 && <GraphTable nodes={nodes} edges={edges} />}
      {mode === 'table' && table.length !== 0 && <RowTable data={table} />}
      {mode === 'chart' && table.length !== 0 && <ChartView table={table} />}
    </div>
  );
};

export default TableView;

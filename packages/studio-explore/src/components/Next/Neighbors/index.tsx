import React, { useEffect, useState } from 'react';
import { Flex, Typography, Divider, Button, Space, Select, Table, TableProps, theme, notification } from 'antd';

import {
  useContext,
  type INeighborQueryData,
  type NodeData,
  type IQueryStatement,
  GraphData,
  processLinks,
} from '@graphscope/studio-graph';
import { Utils, Illustration } from '@graphscope/studio-components';
import { PlayCircleOutlined } from '@ant-design/icons';
import { getPropertyOptions } from '../../Statistics/Properties/utils';
import Chart from '../../ChartView';
import { getTable } from './getTableData';
import TableView from './TableView';
import { BarChartOutlined, TableOutlined } from '@ant-design/icons';
export interface IQueryNeighborStatics {
  id: 'queryNeighborStatics';
  query: (property: string, selecteIds: string[]) => Promise<{ [key: string]: any }>;
}

const CacheData = {};
const InspectNeighbor = props => {
  const { store, updateStore, id } = useContext();
  const { getService, selectNodes, schema } = store;
  const options = getPropertyOptions(schema);
  const selectedKey = selectNodes.map(item => item.id).join('__');
  const [state, setState] = useState<{
    chartData: any[];
    property: string;
    tableData: {
      items: NodeData[];
      counts: number;
      name: string;
    };
    viewMode: 'ChartView' | 'TableView';
  }>({
    chartData: [],
    property: 'NODE_LABEL',
    tableData: { items: [], counts: 0, name: '' },
    viewMode: 'ChartView',
  });
  const { chartData, property, tableData, viewMode } = state;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { token } = theme.useToken();
  useEffect(() => {
    const queryNeighbors = async () => {
      const selectIds = selectedKey.split('__');
      const queryKey = `${id}_${selectedKey}`;

      if (!CacheData[queryKey] && selectIds.length !== 0) {
        const script = `MATCH(a)-[b]-(c) where elementId(a) IN [${selectIds}] return a,b,c`;
        console.log('%c Query Neighbors', 'color:green', script);
        const res = await getService<IQueryStatement>('queryStatement')(script);
        CacheData[queryKey] = res;
      }
      const data = CacheData[queryKey];
      const items = data.nodes.filter(node => {
        if (property) {
          if (property === 'NODE_LABEL' || property === 'EDGE_LABEL') {
            return selectIds.indexOf(node.id) === -1;
          }
          return selectIds.indexOf(node.id) === -1 && node.properties[property];
        }
        return selectIds.indexOf(node.id) === -1;
      });
      const groupedData = Utils.groupBy(items, item => {
        if (property === 'NODE_LABEL' || property === 'EDGE_LABEL') {
          return item.label;
        }
        const value = item.properties[property];
        if (Array.isArray(value)) {
          return value.join('');
        } else {
          return value;
        }
      });

      const chartData = Object.keys(groupedData)
        .map(key => {
          return {
            name: key,
            counts: groupedData[key].length,
            items: groupedData[key],
          };
        })
        .filter(item => item.name !== null && item.name !== undefined && item.name !== '' && item.name !== 'undefined');
      chartData.sort((a, b) => {
        if (a['name'] > b['name']) {
          return 1;
        }
        if (a['name'] === b['name']) {
          return 0;
        }
        return -1;
      });

      if (viewMode === 'TableView') {
        setState(preState => {
          return {
            ...preState,
            tableData: {
              items: items,
              counts: items.length,
              name: 'All',
            },
            chartData: chartData,
          };
        });
      }
      if (viewMode === 'ChartView') {
        setState(preState => {
          return {
            ...preState,
            tableData: {
              items: [],
              counts: 0,
              name: '',
            },
            chartData: chartData,
          };
        });
      }
    };
    queryNeighbors();
  }, [id, selectedKey, property, viewMode]);

  const handleQuery = (ids?: string[]) => {
    updateStore(draft => {
      const queryKey = `${id}_${selectedKey}`;
      let expandedData = CacheData[queryKey];
      if (ids) {
        if (ids.length === 0) {
          return;
        }

        const allIds = [...new Set([...ids, ...selectedKey.split('__')])];
        const nodes = CacheData[queryKey].nodes.filter(item => {
          return allIds.includes(item.id);
        });

        const newSelectNodes = CacheData[queryKey].nodes.filter(item => {
          return ids.includes(item.id);
        });

        const edges = CacheData[queryKey].edges.filter(item => {
          const source = typeof item.source === 'object' ? item.source.id : item.source;
          const target = typeof item.target === 'object' ? item.target.id : item.target;
          return allIds.includes(source) && allIds.includes(target);
        });

        expandedData = {
          nodes,
          edges: processLinks(edges),
        };

        const newData = Utils.handleExpand(draft.data, expandedData);
        if (newData.nodes.length === draft.data.nodes.length && newData.edges.length === draft.data.edges.length) {
          notification.info({
            message: 'The nodes already exists on the canvas.',
          });
          return;
        }
        draft.source = newData;
        draft.data = newData;

        draft.selectNodes = newSelectNodes;
        draft.nodeStatus = {};
        let newNodeStatus = {};
        newData.nodes.forEach(item => {
          if (ids.indexOf(item.id) !== -1) {
            newNodeStatus[item.id] = {
              selected: true,
            };
          } else {
            newNodeStatus[item.id] = {
              disabled: true,
            };
          }
        });
        draft.nodeStatus = newNodeStatus;
      }
    });
  };
  const handleChange = (value: string) => {
    setState(preState => {
      return {
        ...preState,
        property: value,
      };
    });
  };
  const onChartClick = e => {
    const table_items = e.reduce(
      (acc, curr) => {
        return {
          items: [...acc.items, ...curr.items],
          counts: acc.counts + curr.counts,
          name: curr.name,
        };
      },
      {
        items: [],
        counts: 0,
        name: '',
      },
    );

    setState(preState => {
      return {
        ...preState,
        tableData: table_items,
      };
    });
  };

  const handleChangeViewMode = value => {
    let tableData = {};
    if (value === 'ChartView') {
      tableData = {
        items: [],
        counts: 0,
        name: '',
      };
    }
    if (value === 'TableView') {
      const queryKey = `${id}_${selectedKey}`;
      const items = CacheData[queryKey].nodes as NodeData[];
      tableData = {
        items,
        counts: items.length,
        name: 'All',
      };
    }
    //@ts-ignore
    setState(preState => {
      return {
        ...preState,
        viewMode: value,
        tableData,
      };
    });
  };
  const exploreData = CacheData[`${id}_${selectedKey}`] || { nodes: [], edges: [] };
  if (selectNodes.length === 0) {
    return (
      <Flex vertical gap={12} style={{ padding: '48px 0px' }} align="center">
        <Illustration.Loading />
        <Typography.Text type="secondary" italic>
          Please select the nodes first, the system will pre-query the one-degree neighbors for you.
        </Typography.Text>
      </Flex>
    );
  }

  return (
    <Flex vertical gap={12} ref={containerRef} style={{ background: token.colorBgContainer, width: '100%' }}>
      <Flex wrap>
        <Typography.Text type="secondary" italic>
          {`Pre-query the one-degree neighbors of the ${selectNodes.length} selected nodes , resulting in ${exploreData.nodes.length - selectNodes.length} nodes, ${exploreData.edges.length} edges.`}
          {/* <Button icon={<PlayCircleOutlined />} type="text" onClick={() => handleQuery()}></Button> */}
        </Typography.Text>
      </Flex>
      <Flex vertical gap={12}>
        <Flex gap={12} justify="space-between">
          <Select
            prefix={viewMode === 'ChartView' ? <BarChartOutlined /> : <TableOutlined />}
            variant="filled"
            defaultValue="ChartView"
            onChange={handleChangeViewMode}
            style={{ width: '160px' }}
            options={[
              { value: 'ChartView', label: 'ChartView', icon: <BarChartOutlined /> },
              {
                value: 'TableView',
                label: 'TableView',
              },
            ]}
          ></Select>

          <Select
            allowClear
            // variant="borderless"
            variant="filled"
            onChange={handleChange}
            defaultValue={property}
            style={{ width: '160px' }}
            options={options}
            placeholder="Select property"
          />
        </Flex>
      </Flex>

      {viewMode === 'ChartView' && (
        <Flex vertical gap={12}>
          <div style={{ height: '250px', minWidth: '348px' }}>
            <Chart data={chartData} xField="name" yField="counts" onClick={onChartClick} options={options} />
          </div>
          <Divider style={{ margin: 0 }} />
          <TableView {...tableData} onQuery={handleQuery} containerRef={containerRef} />
        </Flex>
      )}

      {viewMode === 'TableView' && (
        <Flex vertical gap={12}>
          <TableView {...tableData} onQuery={handleQuery} containerRef={containerRef} />
        </Flex>
      )}
    </Flex>
  );
};

export default InspectNeighbor;

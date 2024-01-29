import React, { useState } from 'react';
import { Row, Col, Segmented, Flex, Button, Divider, Card, Space, Tooltip, Typography, Upload } from 'antd';
import { download, prop } from '../create-instance/create-schema/utils';
import GraphInsight from './graph-insight';
import DataSource from './data-sources';

interface IImportDataProps {}

export type PropertyType = {
  key: string | number;
  label: string;
  select?: string;
  location?: string;
  source?: string;
  target?: string;
  bind: boolean;
  properties?: {
    name: string;
    type: string;
    primaryKey: boolean;
    source: number;
  }[];
};
type IStateType = {
  suorceSelect: string;
  sourceList: {
    nodes: PropertyType[];
    edges: PropertyType[];
  };
};
const { Text } = Typography;
const ImportData: React.FunctionComponent<IImportDataProps> = props => {
  const [state, updateState] = useState<IStateType>({
    suorceSelect: 'nodesource',
    sourceList: {
      nodes: [
        {
          key: '1',
          label: 'user',
          select: 'ODPS',
          location: 'nodes',
          bind: true,
          properties: [{ name: 'id', type: 'string', primaryKey: true, source: 1 }],
        },
        {
          key: '2',
          label: 'user1',
          select: 'Files',
          location: '',
          bind: false,
          properties: [{ name: 'id', type: 'string', primaryKey: true, source: 3 }],
        },
      ],
      edges: [
        {
          key: '3',
          label: 'edge',
          select: 'ODPS',
          location: 'edges',
          source: 'user',
          target: 'user1',
          bind: false,
          properties: [{ name: 'id', type: 'string', primaryKey: true, source: 5 }],
        },
      ],
    },
  });
  const {
    suorceSelect,
    sourceList: { nodes, edges },
  } = state;

  const sourceData = suorceSelect === 'nodesource' ? nodes : edges;
  const nodeEdgeChange: (val: string) => void = val => {
    updateState(preState => {
      return {
        ...preState,
        suorceSelect: val,
      };
    });
  };
  const option: { label: string; value: string }[] = [
    {
      label: `点数据源绑定（${nodes.filter(item => item.bind).length}/${nodes.length}）`,
      value: 'nodesource',
    },
    {
      label: `边数据源绑定（${edges.filter(item => item.bind).length}/${edges.length})`,
      value: 'edgesource',
    },
  ];
  return (
    <Row style={{ padding: '24px' }} gutter={32}>
      <Col span={16}>
        <Flex gap="middle" justify="space-between">
          <Segmented
            options={option}
            //@ts-ignore
            onChange={nodeEdgeChange}
          />
          <Upload
            beforeUpload={file => {
              let reader = new FileReader();
              reader.readAsText(file, 'utf-8');
              reader.onload = () => {
                updateState(preState => {
                  return {
                    ...preState,
                    //@ts-ignore
                    sourceList: JSON.parse(reader && reader.result),
                  };
                });
              };
            }}
            showUploadList={false}
          >
            <Tooltip placement="topRight" title="您需要先绑定全部的点边数据源才可以导入数据">
              <Button>开始导入</Button>
            </Tooltip>
          </Upload>
        </Flex>
        <Divider style={{ margin: '12px 0px' }} />
        {/* 遍历需要绑定的数据源 */}
        {sourceData &&
          sourceData.map(item => {
            return (
              <div key={item.key}>
                <DataSource
                  //@ts-ignore
                  data={item}
                />
              </div>
            );
          })}
      </Col>
      <Col span={8}>
        <Flex gap="middle" justify="space-between" align="center">
          <Text type="secondary">预览</Text>
          <Space>
            <Upload
              beforeUpload={file => {
                let reader = new FileReader();
                reader.readAsText(file, 'utf-8');
                reader.onload = () => {
                  console.log(reader.result);
                };
              }}
              showUploadList={false}
            >
              <Tooltip placement="topRight" title="导入「数据导入」的配置文件">
                <Button>导入配置</Button>
              </Tooltip>
            </Upload>
            <Tooltip placement="topRight" title="导出「数据导入」的配置文件">
              <Button onClick={() => download('source', JSON.stringify(state.sourceList))}>导出配置</Button>
            </Tooltip>
          </Space>
        </Flex>
        <Card style={{ marginTop: '24px', border: '1px dashed #000', borderRadius: '0px' }}>
          <GraphInsight
            children={
              <Text type="secondary" style={{ display: 'block', textAlign: 'center', margin: '0px' }}>
                目前绑定了{edges.filter(item => item.bind).length} 条边，{nodes.filter(item => item.bind).length}个点
              </Text>
            }
            pdata={{nodeLists:nodes,edgeLists:edges}}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ImportData;

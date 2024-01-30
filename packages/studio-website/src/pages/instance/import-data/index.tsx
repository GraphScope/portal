import React, { useState } from 'react';
import { Row, Col, Segmented, Flex, Button, Divider, Card, Space, Tooltip, Typography, Upload } from 'antd';
import { download, prop } from '../create-instance/create-schema/utils';
import GraphView from './graph-view';
import DataSource from './data-source/index';

interface IImportDataProps {}

export type PropertyType = {
  key: string | number;
  label: string;
  /** 数据源类型 */
  datatype?: string;
  /** 文件位置 */
  filelocation?: string;
  /** 起始节点 */
  source?: string;
  target?: string;
  /** 是否绑定 isBind */
  isBind: boolean;
  properties?: {
    key: string;
    name: string;
    type: string;
    primaryKey: boolean;
    dataindex: number | string;
  }[];
};
type IStateType = {
  suorceSelect: string;
  sourceList: {
    nodes: PropertyType[];
    edges: PropertyType[];
  };
};
type TitleProps = {
  updateState: any;
};
const { Text } = Typography;
const UploadCompnent: React.FunctionComponent<TitleProps> = ({ updateState }) => {
  return (
    <Upload
      beforeUpload={file => {
        let reader = new FileReader();
        reader.readAsText(file, 'utf-8');
        reader.onload = () => {
          updateState((preState: any) => {
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
  );
};
const ImportData: React.FunctionComponent<IImportDataProps> = props => {
  const [state, updateState] = useState<IStateType>({
    /** currentType */
    suorceSelect: 'nodesource',
    sourceList: {
      nodes: [
        {
          key: '1',
          label: 'user',
          datatype: 'ODPS',
          filelocation: 'nodes',
          isBind: true,
          // source 应该改为  dataIndex
          properties: [
            { key: '1', name: 'id', type: 'string', primaryKey: true, dataindex: 1 },
            { key: '2', name: 'pre', type: 'double', primaryKey: true, dataindex: 3 },
          ],
        },
        {
          key: '2',
          label: 'user1',
          datatype: 'Files',
          filelocation: '',
          isBind: false,
          properties: [{ key: '3', name: 'id', type: 'string', primaryKey: true, dataindex: 3 }],
        },
      ],
      edges: [
        {
          key: '3',
          label: 'edge',
          datatype: 'ODPS',
          filelocation: 'edges',
          source: 'user',
          target: 'user1',
          isBind: false,
          properties: [{ key: '4', name: 'id', type: 'str', primaryKey: true, dataindex: 5 }],
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

  const bindNodeCount = nodes.filter(item => item.isBind).length;
  const bindEdgeCount = edges.filter(item => item.isBind).length;

  const option = [
    {
      label: `点数据源绑定（${bindNodeCount}/${nodes.length}）`,
      value: 'nodesource',
    },
    {
      label: `边数据源绑定（${bindEdgeCount}/${edges.length})`,
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
          <UploadCompnent option={option} updateState={updateState} />
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
          <Text type="secondary" style={{ display: 'block', textAlign: 'center', margin: '0px' }}>
            目前绑定了{bindEdgeCount} 条边，{bindNodeCount}个点
          </Text>
          <GraphView pdata={{ nodeLists: nodes, edgeLists: edges }}></GraphView>
        </Card>
      </Col>
    </Row>
  );
};

export default ImportData;

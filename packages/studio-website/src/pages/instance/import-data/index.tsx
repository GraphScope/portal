import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Row, Col, Segmented, Flex, Button, Divider, Card, Space, Tooltip, Typography, Upload, Skeleton } from 'antd';
import { download } from '../create-instance/create-schema/utils';
import GraphView from './graph-view';
import DataSource from './data-source/index';
import { getUrlParams } from './utils';
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
  currentType: string;
  sourceList: {
    nodes: PropertyType[];
    edges: PropertyType[];
  };
  isReady: boolean;
};

const { Text } = Typography;
const SOURCEDATA = {
  nodes: [
    {
      key: uuidv4(),
      label: 'user',
      datatype: 'ODPS',
      filelocation: 'nodes',
      isBind: true,
      // source 应该改为  dataIndex
      properties: [
        { key: uuidv4(), name: 'id', type: 'string', primaryKey: true, dataindex: 1 },
        { key: uuidv4(), name: 'pre', type: 'double', primaryKey: true, dataindex: 3 },
      ],
    },
    {
      key: uuidv4(),
      label: 'user1',
      datatype: 'Files',
      filelocation: '',
      isBind: false,
      properties: [{ key: uuidv4(), name: 'id', type: 'string', primaryKey: true, dataindex: 3 }],
    },
  ],
  edges: [
    {
      key: uuidv4(),
      label: 'edge',
      datatype: 'ODPS',
      filelocation: 'edges',
      source: 'user',
      target: 'user1',
      isBind: false,
      properties: [{ key: uuidv4(), name: 'id', type: 'str', primaryKey: true, dataindex: 5 }],
    },
  ],
};
const ImportData: React.FunctionComponent<IImportDataProps> = props => {
  const [state, updateState] = useState<IStateType>({
    /** 数据源 currentType */
    currentType: 'nodesource',
    // schema 需要通过 fetch(/graph/schema) 接口得到，同时需要增加 iSReady，增加骨架图，提高体验
    sourceList: {
      nodes: [],
      edges: [],
    },
    isReady: false,
  });
  const {
    currentType,
    sourceList: { nodes, edges },
    isReady,
  } = state;
  /** 根据引擎的类型，进行部分UI的隐藏和展示 */
  const { engineType } = getUrlParams();
  useEffect(() => {
    getInportList().then(res => {
      //@ts-ignore
      updateState(preState => {
        return {
          ...preState,
          isReady: true,
          sourceList: res,
        };
      });
    });
  }, []);
  const getInportList = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(SOURCEDATA);
      }, 2000);
    });
  };
  const sourceData = currentType === 'nodesource' ? nodes : edges;
  const nodeEdgeChange: (val: string) => void = val => {
    updateState(preState => {
      return {
        ...preState,
        currentType: val,
      };
    });
  };

  const bindNodeCount = nodes.filter(item => item.isBind).length;
  const bindEdgeCount = edges.filter(item => item.isBind).length;

  const SOURCEDATAOPTIONS = [
    {
      label: `点数据源绑定（${bindNodeCount}/${nodes?.length}）`,
      value: 'nodesource',
    },
    {
      label: `边数据源绑定（${bindEdgeCount}/${edges?.length})`,
      value: 'edgesource',
    },
  ];

  const handleImport = () => {
    console.log('state', state);

    // todo fetch
  };

  return (
    <Row style={{ padding: '24px' }} gutter={32}>
      <Col span={16}>
        <Flex gap="middle" justify="space-between">
          <Segmented
            options={SOURCEDATAOPTIONS}
            //@ts-ignore
            onChange={nodeEdgeChange}
          />
          {engineType !== 'groot' && (
            <Button type="primary" onClick={handleImport}>
              导入数据
            </Button>
          )}
        </Flex>
        <Divider style={{ margin: '12px 0px' }} />
        {!isReady && <Skeleton />}
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
                  updateState(preState => {
                    return {
                      ...preState,
                      //@ts-ignore
                      sourceList: JSON.parse(reader.result),
                    };
                  });
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
          {!isReady && <Skeleton />}
          <GraphView pdata={{ nodeLists: nodes, edgeLists: edges }}></GraphView>
        </Card>
      </Col>
    </Row>
  );
};

export default ImportData;

import * as React from 'react';
import { Row, Col, Segmented, Flex, Button, Divider, Card, Space, Tooltip } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import GraphInsight from '../create-instance/create-schema/graph-view';
import DataSource from './data-sources';
interface IImportDataProps {}
const ImportData: React.FunctionComponent<IImportDataProps> = props => {
  const nodeEdgeChange: (value: SegmentedValue) => void = val => {};
  const option: { label: string; value: string }[] = [
    {
      label: '点数据源绑定（0/2）',
      value: 'nodesource',
    },
    {
      label: '边数据源绑定（0/1）',
      value: 'edgesource',
    },
  ];
  return (
    <Row style={{ padding: '24px' }} gutter={32}>
      <Col span={16}>
        <Flex gap="middle" justify="space-between">
          <Segmented options={option} onChange={nodeEdgeChange} />
          <Tooltip placement="topRight" title="您需要先绑定全部的点边数据源才可以导入数据">
            <Button>开始导入</Button>
          </Tooltip>
        </Flex>
        <Divider style={{ margin: '12px 0px' }} />
        <DataSource />
        <DataSource />
      </Col>
      <Col span={8}>
        <Flex gap="middle" justify="space-between" align="center">
          <>预览</>
          <Space>
            <Tooltip placement="topRight" title="导入「数据导入」的配置文件">
              <Button>导入配置</Button>
            </Tooltip>
            <Tooltip placement="topRight" title="导出「数据导入」的配置文件">
              <Button>导出配置</Button>
            </Tooltip>
          </Space>
        </Flex>
        <Card style={{ marginTop: '24px', border: '1px dashed #000', borderRadius: '0px' }}>
          <GraphInsight children={<p style={{ textAlign: 'center', margin: '0px' }}>目前绑定了 1 条边，2个点</p>} />
        </Card>
      </Col>
    </Row>
  );
};

export default ImportData;

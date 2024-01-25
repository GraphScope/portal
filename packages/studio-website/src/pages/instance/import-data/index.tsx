import * as React from 'react';
import { Row, Col, Segmented, Collapse, Flex, Button, Divider, Card, Space, Tooltip } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import { SegmentedValue } from 'antd/es/segmented';
import GraphInsight from '../create-instance/create-schema/graph-view';
import DataSource from './data-sources'
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/a/font_4377140_slis0xqmzfo.js',
});
interface IImportDataProps {}
const { Panel } = Collapse;
const ImportData: React.FunctionComponent<IImportDataProps> = props => {
  const nodeEdgeChange: (value: SegmentedValue) => void = val => {};
  const genExtra: () => React.ReactNode = () => {
    return (
      <div>
        <IconFont type="icon-bangding" />
        <IconFont type="icon-jiechubangding" />
      </div>
    );
  };
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
    <Row style={{ padding: '24px' }} gutter={[32, 16]}>
      <Col span={16}>
        <Flex gap="middle" justify="space-between">
          <Segmented options={option} onChange={nodeEdgeChange} />
          <Tooltip placement="topRight" title="您需要先绑定全部的点边数据源才可以导入数据">
            <Button>开始导入</Button>
          </Tooltip>
        </Flex>
        <Divider style={{ margin: '12px 0px' }} />
        <Collapse>
          <Panel key={'1'} header={<>label:{'user'}</>} extra={genExtra()}>
            <DataSource/>
          </Panel>
        </Collapse>
      </Col>
      <Col span={8}>
        <Flex gap="middle" justify="space-between" align='center'>
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
        <Card style={{marginTop:'24px'}}>
          <GraphInsight children={<p style={{textAlign:'center',margin:'0px'}}>目前绑定了 1 条边，2个点</p>}/>
        </Card>
      </Col>
    </Row>
  );
};

export default ImportData;

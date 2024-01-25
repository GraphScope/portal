import * as React from 'react';
import { Row, Col,Segmented, Collapse, Flex ,Button,Divider} from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import { SegmentedValue } from 'antd/es/segmented';
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
        {/* <IconFont type="icon-baocun" /> */}
        <IconFont type="icon-bangding" />
        {/* <IconFont type="icon-ziyuan" /> */}
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
      label: '边数据源绑定（0/2）',
      value: 'edgesource',
    },
  ];
  return (
    <Row style={{ padding: '24px' }} gutter={[24,24]}>
      <Col span={16}>
      <Flex gap="middle" justify='space-between'>
        <Segmented options={option} onChange={nodeEdgeChange} />
        <Button >开始导入</Button>
      </Flex>
      <Divider style={{margin:'12px 0px'}}/>
      <Collapse>
        <Panel key={'1'} header={<>label:{'user'}</>} extra={genExtra()}>
          test
        </Panel>
      </Collapse>
      </Col>
      <Col span={8}>

      </Col>
    </Row>
  );
};

export default ImportData;

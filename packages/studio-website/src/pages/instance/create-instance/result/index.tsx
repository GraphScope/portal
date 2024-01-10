import * as React from 'react';
import { Tag, Radio, Collapse, Row, Col, Button, Space } from 'antd';
import { history } from 'umi';
import GraphIn from '../create-schema/graph-in';
interface IImportDataProps {}
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const items = [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <p>{text}</p>,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <p>{text}</p>,
  },
];
const ImportData: React.FunctionComponent<IImportDataProps> = props => {
  const nodeEdgeChange = e => {};
  return (
    <div>
      <p>
        恭喜你已经完成图实例的创建，图实例名称为 <Tag color="green">DEFAULT GRAPH</Tag>，类型为{' '}
        <Tag color="green">Interactive</Tag>, 有2 种类型的点，1 种类型的边，具体信息详见
      </p>
      <Radio.Group defaultValue="Nodes" style={{ marginBottom: '16px' }} onChange={nodeEdgeChange}>
        <Radio.Button value="Node">Node Label</Radio.Button>
        <Radio.Button value="Edge">Edge Label</Radio.Button>
      </Radio.Group>
      <Row>
        <Col span={10}>
          <Collapse items={items} defaultActiveKey={['1']} />
        </Col>
        <Col span={10} push={2}>
          <GraphIn />
        </Col>
      </Row>
      <p>如果确认下没问题的话，我们就可以去导入数据啦～</p>
      {/* <Space>
        <Button
          type="primary"
          onClick={() => {
            history.back();
          }}
        >
          上一页
        </Button>
        <Button type="primary">完成</Button>
      </Space> */}
    </div>
  );
};

export default ImportData;

import * as React from 'react';
import { Radio, Card, Row, Col, Button, Steps, Space } from 'antd';
import { history } from 'umi';
import { useContext } from '../../../../valtio/createGraph';
import ReactJson from 'react-json-view';
import GraphIn from '../graph-in';
interface IImportDataProps {}
const ImportData: React.FunctionComponent<IImportDataProps> = props => {
  const { store, updateStore } = useContext();
  const { checked, json_object } = store;
  const nodeEdgeChange = (e:{target:{value:string}}) => {
    updateStore(draft => {
      draft.checked = e.target.value;
    });
  };
  return (
    <div style={{backgroundColor:'#fff',padding:'16px'}}>
      <Steps
        current={2}
        items={[
          {
            title: 'Choose EngineType',
          },
          {
            title: 'Create Schema',
          },
          {
            title: 'Result',
          },
        ]}
      />
      <div>
        请您先预览确认信息：
        <Radio.Group defaultValue="Nodes" style={{ marginBottom: '16px' }} onChange={nodeEdgeChange}>
          <Radio.Button value="table">Table</Radio.Button>
          <Radio.Button value="json">Json</Radio.Button>
        </Radio.Group>
      </div>
      <div style={{padding:'16px',border:'1px dashed #000'}}>
        {checked == 'table' ? (
          <Row justify='space-between' gutter={5}>
            <Col span={6} style={{marginTop:'5px'}}>
              <Card title="Card title" bordered={false}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
            <Col span={6} style={{marginTop:'5px'}}> 
              <Card title="Card title" bordered={false}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
            <Col span={6} style={{marginTop:'5px'}}>
              <Card title="Card title" bordered={false}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
            <Col span={6} style={{marginTop:'5px'}}>
              <Card title="Card title" bordered={false}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
            <Col span={6} style={{marginTop:'5px'}}>
              <Card title="Card title" bordered={false}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col span={24}>
              <ReactJson src={json_object} />
            </Col>
          </Row>
        )}
      </div>
      <p>如果确认下没问题的话，我们就可以去导入数据啦～</p>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            history.back();
          }}
        >
          上一页
        </Button>
        <Button type="primary"  onClick={() => {
            history.push('/instance');
          }}> 确认创建</Button>
      </Space>
    </div>
  );
};

export default ImportData;

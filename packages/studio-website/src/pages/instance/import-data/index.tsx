import * as React from 'react';
import { Form, Row, Col, Select, Input, Space, Button, Radio } from 'antd';
import PrpertiesEditor from '../../../../../studio-importor/src/properties-editor'
interface IImportDataProps {}

const ImportData: React.FunctionComponent<IImportDataProps> = props => {
  const [form] = Form.useForm();
  const Option = [
    {
      value: 'ODPS',
      label: 'ODPS',
    },
  ];
  //输入映射outputTable字段
  const inputBlur = (e: { target: { value: string } }) => {
    if (e.target.value) {
      let params = '';
      if (e.target.value.includes('|')) {
        params = e.target.value.split('|')[0].trim() + '_tmp';
      } else {
        params = e.target.value.trim() + '_tmp';
      }
      form.setFieldsValue({
        outputTable: params,
        location: e.target.value.trim(),
      });
    }
  };
  const nodeEdgeChange = (e: { target: { value: string } }): void => {

  };
  return (
    <div style={{ paddingRight: '24px' }}>
      <div>
      <Space>
        <span>数据源类型</span>
        <Radio.Group defaultValue="Nodes" style={{ marginBottom: '16px' }} onChange={nodeEdgeChange}>
          <Radio.Button value="Local">Local Files</Radio.Button>
          <Radio.Button value="OSS">OSS</Radio.Button>
        </Radio.Group>
      </Space>

      </div>
      <div>
      <Space>
      <span>绑定数据源</span>
        <Radio.Group defaultValue="Nodes" style={{ marginBottom: '16px' }} onChange={nodeEdgeChange}>
          <Radio.Button value="nodelabel">node label</Radio.Button>
          <Radio.Button value="edgelabels">edge labels</Radio.Button>
        </Radio.Group>
      </Space>

      </div>
      <Form
        className="table-edit-form"
        form={form}
        labelCol={{ flex: '100px' }}
        labelAlign="right"
        wrapperCol={{ flex: 1 }}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              label={<span>数据源</span>}
              name="datasource"
              rules={[{ required: true, message: 'Please input Source Label!' }]}
              tooltip="数据源类型"
            >
              <Select allowClear disabled options={Option} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label={<span>Location</span>}
              name="location"
              rules={[{ required: true, message: 'Please input Location!' }]}
              tooltip="路径"
            >
              <Input onChange={inputBlur} placeholder="odps://<project>/<table>[|partition=xx]" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label={<div className="map-title">属性映射</div>}
              rules={[{ required: true, message: 'Please input Source Label!' }]}
              tooltip="属性映射"
            >
              <div style={{ marginTop: '30px' }}>
                <Form.List name="propertyMapping">
                  {(fields: any, { add, remove }: any) => {
                    // 将Table视为 Form.List 中循环的 Form.Item
                    return (
                      <Form.Item>
                        {/* <Table dataSource={fields} columns={getColumns(remove)} bordered pagination={false} /> */}
                        <PrpertiesEditor properties={[]} onChange={()=>{}} isMapFromFile={true}/>
                      </Form.Item>
                    );
                  }}
                </Form.List>
              </div>
            </Form.Item>
          </Col>
        </Row>
        <div style={{ position: 'relative', marginTop: '16px' }}>
          <Form.Item name="outputTable" label={<span>临时表</span>}>
            <Input />
          </Form.Item>
          {/* {locale == 'en-US' ? (
            <div style={{ position: 'absolute', top: '30px', left: '200px', color: '#000' }}>
              A temporary table will be created during the data import process for saving intermediate data{' '}
              <span style={{ color: 'red' }}>and the table will be deleted after the process completed.</span>
            </div>
          ) : ( */}
          <div style={{ position: 'absolute', top: '30px', left: '100px', color: '#000' }}>
            数据导入过程中，会创建临时表(如果不存在)，用于存储中间数据 ,{' '}
            <span style={{ color: 'red' }}>并且在导入结束时删除该表，注意: 无论是否新建，最终都会删除临时表。</span>
          </div>
          {/* )} */}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button
              // onClick={onFinish}
              type="primary"
              style={{ backgroundColor: '#1650FF', marginTop: '16px', width: '109px' }}
            >
              Save
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default ImportData;

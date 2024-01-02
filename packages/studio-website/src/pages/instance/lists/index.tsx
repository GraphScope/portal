import * as React from 'react';
import { Button, Form, Input, Row, Col, Avatar, Card } from 'antd';
import { history } from 'umi';
import styles from './index.module.less'
interface IListsProps {}
export type FieldType = {
  inputname?: string;
  type?: string;
};
const Lists: React.FunctionComponent<IListsProps> = _props => {
  const [form] = Form.useForm();
  const onFinish = () => {
    form.validateFields().then(res => {
      console.log(res);
    });
  };
  return (
    <div style={{ backgroundColor: '#fff', padding: '24px' }}>
      <Form name="basic" form={form} layout="vertical" style={{ marginTop: '24px' }}>
        <Form.Item<FieldType>
          label="Input Name"
          name="inputname"
          tooltip=" "
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          rules={[{ required: true, message: '' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Choose GraphInstance Type"
          name="type"
          tooltip=" "
          rules={[{ required: true, message: '' }]}
        >
          <Row>
            <Col span={6}>
              <Card style={{ margin: '12px 12px 0 0' }} className={styles['card']}>
                <div style={{ display: 'flex', justifyContent: 'start' }}>
                  <Avatar shape="square" size={45} />
                  <div style={{ marginLeft: '12px', verticalAlign: 'middle' }}>
                    <h3 style={{ margin: '0px' }}>instance</h3>
                    <span>引擎介绍</span>
                  </div>
                </div>
                <div className={styles['triangle']}></div>
              </Card>
            </Col>
            <Col span={6}>
              <Card style={{ margin: '12px 12px 0 0' }} className={styles['card']}>
                <div style={{ display: 'flex', justifyContent: 'start' }}>
                  <Avatar shape="square" size={45} />
                  <div style={{ marginLeft: '12px', verticalAlign: 'middle' }}>
                    <h3 style={{ margin: '0px' }}>instance</h3>
                    <span>引擎介绍</span>
                  </div>
                </div>
                <div className={styles['triangle']}></div>
              </Card>
            </Col>
            <Col span={6}>
              <Card style={{ margin: '12px 12px 0 0' }} className={styles['card']}>
                <div style={{ display: 'flex', justifyContent: 'start' }}>
                  <Avatar shape="square" size={45} />
                  <div style={{ marginLeft: '12px', verticalAlign: 'middle' }}>
                    <h3 style={{ margin: '0px' }}>instance</h3>
                    <span>引擎介绍</span>
                  </div>
                </div>
                <div className={styles['triangle']}></div>
              </Card>
            </Col>
            <Col span={6}>
              <Card style={{ margin: '12px 12px 0 0' }} className={styles['card']}>
                <div style={{ display: 'flex', justifyContent: 'start' }}>
                  <Avatar shape="square" size={45} />
                  <div style={{ marginLeft: '12px', verticalAlign: 'middle' }}>
                    <h3 style={{ margin: '0px' }}>instance</h3>
                    <span>引擎介绍</span>
                  </div>
                </div>
                <div className={styles['triangle']}></div>
              </Card>
            </Col>
          </Row>
        </Form.Item>
      </Form>

      <Button
        type="primary"
        onClick={() => {
          onFinish;
        }}
      >
        下一页
      </Button>
      <Button
        type="primary"
        onClick={() => {
          history.push('/instance/create');
        }}
      >
        create instance
      </Button>
      <Button
        type="primary"
        onClick={() => {
          history.push('/instance/import');
        }}
      >
        import data
      </Button>
      <Button
        type="primary"
        onClick={() => {
          history.push('/instance/schema');
        }}
      >
        view Schema
      </Button>
    </div>
  );
};

export default Lists;

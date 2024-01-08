import * as React from 'react';
import { history } from 'umi';
import { Button, Form, Input, Row, Col, Avatar, Card, ConfigProvider, Alert, Steps, Space } from 'antd';
import { useContext } from '../../../valtio/createGraph';
import styles from './index.module.less';
interface IListsProps {}
export type FieldType = {
  inputname?: string;
  type?: string;
};
const Lists: React.FunctionComponent<IListsProps> = _props => {
  const [form] = Form.useForm();
  const { store, updateStore } = useContext();
  const checkRef = React.useRef();
  const { isAlert, isChecked ,inputvalues} = store;
  const onFinish = () => {
    form.validateFields().then(res => {
      console.log(res);
    });
  };
  const cardClick = (val: string) => {
    updateStore(draft => {
      draft.isChecked = val;
    });
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 6,
          colorBgBase: '#fff',
        },
      }}
    >
      {isAlert ? (
        <Alert
          message="您的图实例类型为 Interactive，一旦创建则不支持修改图模型，您可以选择新建图实例"
          type="info"
          showIcon
          closable
          style={{ margin: '16px 0' }}
        />
      ) : (
        <Steps
          current={0}
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
      )}
      <Form name="basic" form={form} layout="vertical" style={{ marginTop: '24px' }}>
        <Form.Item<FieldType>
          label="Input Name"
          name="inputname"
          tooltip=" "
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          rules={[{ required: true, message: '' }]}
        >
          <Input defaultValue={inputvalues}/>
        </Form.Item>

        <Form.Item<FieldType>
          label="Choose GraphInstance Type"
          name="type"
          tooltip=" "
          rules={[{ required: true, message: '' }]}
        >
          <Row>
            {
              ['1','2','3','4','5'].map(item=>{
                return(
                  <Col span={6}>
                  <Card
                    style={{ margin: '12px 12px 0 0' }}
                    className={isChecked == item ? styles['cards'] : ''}
                    onClick={() => cardClick(item)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'start' }}>
                      <Avatar shape="square" size={45} />
                      <div style={{ marginLeft: '12px', verticalAlign: 'middle' }}>
                        <h3 style={{ margin: '0px' }}>instance</h3>
                        <span>引擎介绍{item}</span>
                      </div>
                    </div>
                    <div className={styles['triangle']}></div>
                  </Card>
                </Col>
                )
              })
            }

          </Row>
        </Form.Item>
      </Form>
      {!isAlert ? (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              history.back();
            }}
          >
            上一页
          </Button>
          <Button
            type="primary"
            onClick={() => {
              updateStore(dreaft=>dreaft.inputvalues = form.getFieldsValue().inputname);
              form.getFieldsValue().inputname ? history.push('/instance/create') : form.validateFields();
            }}
          >
            下一页
          </Button>
        </Space>
      ) : null}
    </ConfigProvider>
  );
};

export default Lists;

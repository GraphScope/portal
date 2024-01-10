import React ,{useState}from 'react';
import {Form, Input, Row, Col, Avatar, Card, Select } from 'antd';
import { useContext } from '../valtio/createGraph';
import styles from './index.module.less';

export type FieldType = {
  inputname?: string;
  type?: string;
  directed:boolean;
};
const ChooseEnginetype: () => JSX.Element = () => {
  const [form] = Form.useForm();
  const { store } = useContext();
  const { inputvalues} = store;
  const [isChecked,setIsChecked] = useState('')
  React.useEffect(()=>{form.setFieldsValue(inputvalues)},[])
  const onFinish = () => {
    form.validateFields().then(res => {
      console.log(res);
    });
  };
  const cardClick = (val: string) => {
    setIsChecked(val)
  };
  return (
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
            {
              ['1','2','3','4','5'].map(item=>{
                return(
                  <Col span={6} key={item}>
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
        <Form.Item<FieldType>
          label="Directed"
          name="directed"
          tooltip=" "
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          rules={[{ required: true, message: '' }]}
        >
          <Select defaultValue={true} options={[{value:true,label:'True'},{value:false,label:'False'}]}/>
        </Form.Item>
      </Form>
  );
};

export default ChooseEnginetype;

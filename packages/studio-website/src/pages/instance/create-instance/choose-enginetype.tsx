import React, { useState, useEffect ,memo} from 'react';
import { Form, Input, Row, Col, Avatar, Card, Select } from 'antd';
import { v4 as uuidv4 } from 'uuid';

export type FieldType = {
  inputname?: string;
  type?: string;
  directed: boolean;
};
type Istate = {
  isChecked: string;
  chooseGraphInstanceList: { key: string; name: string; content: string }[];
};
type ChooseEnginetypeProps ={

}
const arr = [
  { key: uuidv4(), name: 'instance', content: '引擎介绍' },
  { key: uuidv4(), name: 'instance', content: '引擎介绍' },
  { key: uuidv4(), name: 'instance', content: '引擎介绍' },
  { key: uuidv4(), name: 'instance', content: '引擎介绍' },
  { key: uuidv4(), name: 'instance', content: '引擎介绍' },
];
const ChooseEnginetype: React.FunctionComponent<ChooseEnginetypeProps> = () => {
  const [form] = Form.useForm();
  const [state, updateState] = useState<Istate>({
    isChecked: '',
    chooseGraphInstanceList: [],
  });
  const { isChecked, chooseGraphInstanceList } = state;
  useEffect(() => {
    getInstanceData();
  }, []);
  /** 初始化实例 */
  const getInstanceData = async () => {
    let data: { key: string; name: string; content: string }[] = [];
    data = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(arr);
      }, 1000);
    });
    data && updateState(preState=>{return{...preState,chooseGraphInstanceList:data}});
    form.resetFields();
    form.setFieldsValue({ directed: true });
  };

  const styles:{[x:string]:React.CSSProperties } ={
    itemStyle:{
      margin: '12px 12px 0 0',
    },
    activeItemStyle:{
      margin: '12px 12px 0 0',
      border: '1px solid #1650ff',
    }
  }
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
          {chooseGraphInstanceList.map(item => {
            return (
              <Col span={6} key={item.key}>
                <Card style={isChecked == item.key ? styles['activeItemStyle'] : styles['itemStyle']} onClick={() => updateState(preState=>{return{...preState,isChecked:item.key}})}>
                  <div style={{ display: 'flex', justifyContent: 'start' }}>
                    <Avatar shape="square" size={45} />
                    <div style={{ marginLeft: '12px', verticalAlign: 'middle' }}>
                      <h3 style={{ margin: '0px' }}>{item.name}</h3>
                      <span>
                        {item.content}
                        {item.key}
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
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
        <Select
          options={[
            { value: true, label: 'True' },
            { value: false, label: 'False' },
          ]}
        />
      </Form.Item>
    </Form>
  );
};

export default memo(ChooseEnginetype);

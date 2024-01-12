import React, { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Avatar, Card, Select } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useContext } from './useContext';

export type FieldType = {
  inputname?: string;
  type?: string;
  directed: boolean;
};
const arr = [
  { key: uuidv4(), name: 'instance', content: '引擎介绍' },
  { key: uuidv4(), name: 'instance', content: '引擎介绍' },
  { key: uuidv4(), name: 'instance', content: '引擎介绍' },
  { key: uuidv4(), name: 'instance', content: '引擎介绍' },
  { key: uuidv4(), name: 'instance', content: '引擎介绍' },
];
const ChooseEnginetype: () => JSX.Element = () => {
  const [form] = Form.useForm();
  const { store } = useContext();
  const { inputvalues } = store;
  const [isChecked, setIsChecked] = useState('');
  const [chooseGraphInstanceData, setChooseGraphInstanceData] = useState<
    { key: string; name: string; content: string }[]
  >([]);
  useEffect(() => {
    getInstanceData();
  }, []);
  const getInstanceData = async () => {
    let data: { key: string; name: string; content: string }[] = [];
    data = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(arr);
      }, 1000);
    });
    data && setChooseGraphInstanceData(data);
  };
  const onFinish = () => {
    form.validateFields().then(res => {
      console.log(res);
    });
  };
  const cardClick = (val: string) => {
    setIsChecked(val);
  };
  const itemStyle: React.CSSProperties = {
    margin: '12px 12px 0 0',
  };
  const activeItemStyle: React.CSSProperties = {
    margin: '12px 12px 0 0',
    border: '1px solid #1650ff',
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
          {chooseGraphInstanceData.map(item => {
            return (
              <Col span={6} key={item.key}>
                <Card
                  style={isChecked == item.key ? activeItemStyle : itemStyle}
                  onClick={() => cardClick(item.key)}
                >
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
          defaultValue={true}
          options={[
            { value: true, label: 'True' },
            { value: false, label: 'False' },
          ]}
        />
      </Form.Item>
    </Form>
  );
};

export default ChooseEnginetype;

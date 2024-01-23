import React, { useState, useEffect, memo } from 'react';
import { Form, Input, Row, Col, Avatar, Card, Select,theme } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
const { useToken } = theme;
export type FieldType = {
  inputname?: string;
  type?: string;
  directed: boolean;
};
type Istate = {
  isChecked: string;
  chooseGraphInstanceList: { key: string; name: string; content: string }[];
  isHover:string;
};
type ChooseEnginetypeProps = {};
const arr = [
  { key: uuidv4(), name: 'instance', content: '引擎介绍' },
  { key: uuidv4(), name: 'instance', content: '引擎介绍' },
  { key: uuidv4(), name: 'instance', content: '引擎介绍' },
  { key: uuidv4(), name: 'instance', content: '引擎介绍' },
  { key: uuidv4(), name: 'instance', content: '引擎介绍' },
];
const ChooseEnginetype: React.FunctionComponent<ChooseEnginetypeProps> = () => {
  const [form] = Form.useForm();
  const { token } = useToken();
  const [state, updateState] = useState<Istate>({
    isChecked: '',
    chooseGraphInstanceList: [],
    isHover:''
  });
  const { isChecked, chooseGraphInstanceList ,isHover} = state;
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
    data &&
      updateState(preState => {
        return { ...preState, chooseGraphInstanceList: data };
      });
    form.resetFields();
    form.setFieldsValue({ directed: true });
  };

  const styles:{[x:string]:React.CSSProperties } ={
    itemStyle:{
      margin: '12px 12px 0 0',
    },
    activeItemStyle:{
      margin: '12px 12px 0 0',
      border: `1px solid ${token.colorPrimary}`,
    }
  }
  return (
    <Form name="basic" form={form} layout="vertical" style={{ marginTop: '24px' }}>
      <Form.Item<FieldType>
        label={<FormattedMessage id='input-name'/>}
        name="inputname"
        tooltip=" "
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        rules={[{ required: true, message: '' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label={<FormattedMessage id='choose-engine-type'/>}
        name="type"
        tooltip=" "
        rules={[{ required: true, message: '' }]}
      >
        <Row>
          {chooseGraphInstanceList.map(item => {
            return (
              <Col span={6} key={item.key}>
                <Card
                  style={{...isChecked == item.key ? styles['activeItemStyle'] : styles['itemStyle'],...isHover ==item.key ? styles['activeItemStyle'] : ''}}
                  onClick={() =>
                    updateState(preState => {
                      return { ...preState, isChecked: item.key };
                    })
                  }
                  onMouseOver={()=>{
                    updateState(preState => {
                      return { ...preState, isHover: item.key };
                    });
                  }}
                  onMouseOut={()=>{
                    updateState(preState => {
                      return { ...preState, isHover: '' };
                    });
                  }}
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
                  {isChecked == item.key ? <CheckCircleTwoTone twoToneColor={token.colorPrimary} style={{position:'absolute',top:'5px',right:'5px',fontSize:'20px'}}/> : null}
                </Card>
              </Col>
            );
          })}
        </Row>
      </Form.Item>
      <Form.Item<FieldType>
        label={<FormattedMessage id='directed'/>}
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

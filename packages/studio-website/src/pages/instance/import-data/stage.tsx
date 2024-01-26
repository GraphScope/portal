import React from 'react';
import { Form, Input, Button, DatePicker, Select, Typography, Flex } from 'antd';
type StageProps = {
  onChange(val:boolean): void;
};
const { Title } = Typography;
const Stage: React.FunctionComponent<StageProps> = props => {
  const [form] = Form.useForm();
  const { onChange } = props;
  const saveStage = ()=>{
    console.log(form.getFieldsValue());
    onChange && onChange(false)
  }
  return (
    <>
      <Title level={4}>从指定 ODPS 表创建周期性导入任务</Title>
      <Form name="basic" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }} form={form}>
        <Form.Item label="路径" name="path" rules={[{ required: true, message: 'Please input Path!' }]}>
          <Input placeholder="odps://<project>/<table>[|ds=${bizdate},type=param]" />
        </Form.Item>

        <Form.Item label="日期" name="schedule" rules={[{ required: true, message: 'Please Select Date!' }]}>
          <DatePicker placeholder=" " showTime style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="调度策略" name="repeat" rules={[{ required: true, message: 'Please select repeat!' }]}>
          <Select
            options={[
              {
                value: 'null',
                label: 'No repeat',
              },
              {
                value: 'day',
                label: 'Every day on the same time',
              },
              {
                value: 'week',
                label: 'Every week on the same time',
              },
            ]}
          />
        </Form.Item>
      </Form>
      <Flex justify="center">
        <Button type="primary" onClick={saveStage}>提交</Button>
      </Flex>
    </>
  );
};

export default Stage;

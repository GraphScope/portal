import React from 'react';
import { Form, Input, Button, DatePicker, Select, Typography, Flex, Card } from 'antd';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
type StageProps = {
  onChange(value: object, isShow: boolean): void;
};
const { Title } = Typography;
const REPEATOPTIONS = [
  {
    value: 'once',
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
];
const Stage: React.FunctionComponent<StageProps> = props => {
  const [form] = Form.useForm();
  const { onChange } = props;
  const handleScheduleImport = () => {
    const { schedule, repeat } = form.getFieldsValue();
    onChange({ repeat, schedule: dayjs(schedule).format('YYYY-MM-DD HH:mm:ss') }, false);
  };
  return (
    <Card style={{ marginTop: '18px' }} styles={{ body: { padding: '16px 24px 24px' } }}>
      <Title level={5} style={{ margin: '0px 0px 16px' }}>
        {/* 从指定 ODPS 表创建周期性导入任务 */}
        <FormattedMessage id="Create a recurring import task" />
      </Title>
      <Form name="basic" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} form={form}>
        <Form.Item
          label={<FormattedMessage id="Date" />}
          name="schedule"
          rules={[{ required: true, message: 'Please Select Date!' }]}
        >
          <DatePicker placeholder=" " showTime style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="Repeat" />}
          name="repeat"
          rules={[{ required: true, message: 'Please select repeat!' }]}
        >
          <Select options={REPEATOPTIONS} />
        </Form.Item>
      </Form>
      <Flex justify="center">
        <Button type="primary" style={{ width: '108px' }} onClick={handleScheduleImport}>
          <FormattedMessage id="Submit" />
        </Button>
      </Flex>
    </Card>
  );
};

export default Stage;

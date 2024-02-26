import React, { useEffect } from 'react';
import { Button, Checkbox, Form, Input, Select, Modal, Flex, message, InputNumber } from 'antd';
import { FormattedMessage } from 'react-intl';
import { updateAlertRuleByName } from '../service';

type FieldType = {
  name: string;
  severity: string;
  metric_type: string;
  conditions_desription: string;
  frequency: number;
  enable: boolean;
};
type ICreateRecepProps = {
  isEditRules: boolean;
  handelChange(val: boolean): void;
  ruleData: any;
};
const EditRule: React.FC<ICreateRecepProps> = props => {
  const { isEditRules, handelChange, ruleData } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    Object.keys(ruleData).length > 0 && form.setFieldsValue(ruleData);
  }, []);
  const onFinish = async () => {
    /** 编辑告警接收 */
    const { name } = ruleData;
    const data = { ...form.getFieldsValue() };
    const res = await updateAlertRuleByName(name, data);
    await message.success(res);
    handelChange(false);
  };
  return (
    <Modal
      title={<FormattedMessage id="Eidt Alert Rule" />}
      width="35%"
      open={isEditRules}
      footer={null}
      onCancel={() => {
        handelChange(false);
        form.resetFields();
      }}
    >
      <Form name="basic" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} form={form}>
        <Form.Item<FieldType>
          label={<FormattedMessage id="Alert Name" />}
          name="name"
          rules={[{ required: true, message: 'Please input your Rules!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label={<FormattedMessage id="Severity" />}
          name="severity"
          rules={[{ required: true, message: 'Please input your Severity!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label={<FormattedMessage id="Type" />}
          name="metric_type"
          rules={[{ required: true, message: 'Please input your Metric Type!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label={<FormattedMessage id="Alert Conditions" />}
          name="conditions_desription"
          rules={[{ required: true, message: 'Please input your Alert Conditions!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label={<FormattedMessage id="Alert Frequency" />}
          name="frequency"
          rules={[{ required: true, message: 'Please input your MetricType!' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item<FieldType> label={<FormattedMessage id="Status" />} name="enable" valuePropName="checked">
          <Checkbox />
        </Form.Item>
      </Form>
      <Flex justify="center">
        <Button type="primary" htmlType="submit" onClick={() => onFinish()}>
          <FormattedMessage id="Submit" />
        </Button>
      </Flex>
    </Modal>
  );
};

export default EditRule;

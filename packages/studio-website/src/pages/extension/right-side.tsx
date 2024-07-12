import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, Input, Select, Typography, Divider } from 'antd';
type FieldType = {
  name: string;
  type: string;
  bound_graph: string;
  query: string;
  instance: boolean;
  description: string;
};
interface IRightSide {
  form: any;
  isEdit: boolean;
  options: { label: string; value: string }[];
}
const TYPEOPTION = [
  { label: 'Cypher', value: 'cypher' },
  // { label: 'Cpp', value: 'cpp' },
];
const { Title } = Typography;
const RightSide: React.FC<IRightSide> = props => {
  const { form, isEdit, options } = props;
  return (
    <>
      <Title level={3} style={{ margin: 0 }}>
        <FormattedMessage id="Plugin info" />
      </Title>
      <Divider />
      <Form name="basic" layout="vertical" form={form}>
        <Form.Item<FieldType>
          label={<FormattedMessage id="Name" />}
          name="name"
          rules={[{ required: true, message: 'Please input your Graph name!', pattern: /^[^\s]*$/ }]}
        >
          <Input disabled={isEdit} />
        </Form.Item>

        <Form.Item<FieldType>
          label={<FormattedMessage id="Plugin Type" />}
          name="type"
          rules={[{ required: true, message: 'Please input your Plugin Type!' }]}
        >
          <Select options={TYPEOPTION} disabled={isEdit} />
        </Form.Item>
        <Form.Item<FieldType>
          label={<FormattedMessage id="Binding graph" />}
          name="bound_graph"
          rules={[{ required: true, message: 'Please input your Graph Instance!' }]}
        >
          <Select options={options} disabled={isEdit} />
        </Form.Item>
        <Form.Item<FieldType>
          label={<FormattedMessage id="Description" />}
          name="description"
          rules={[{ required: true, message: 'Please input your Description!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </>
  );
};

export default RightSide;

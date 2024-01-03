import * as React from 'react';
import { Form, Input, Select } from 'antd';
import PropertiesEditor from '../../../../../../studio-importor/src/properties-editor';
export type FieldType = {
  label?: string;
  sourcenodelabel?: string;
  targetnodelabek?: string;
};
const CreateSchema = (props: { nodeEdge: any; isEdit: boolean }) => {
  const { nodeEdge, isEdit } = props;
  const [form] = Form.useForm();
  return (
    <>
      <Form name="basic" form={form} layout="vertical">
        <Form.Item<FieldType>
          label={nodeEdge == 'Node' ? 'Node Label' : 'Edge Label'}
          name="label"
          tooltip=" "
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          rules={[{ required: true, message: '' }]}
          style={{ marginBottom: '0' }}
        >
          <Input disabled={isEdit}/>
        </Form.Item>
        {nodeEdge !== 'Node' ? (
          <>
            <Form.Item<FieldType>
              label="Source Node Label"
              name="sourcenodelabel"
              tooltip=" "
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '0' }}
            >
              <Select options={[]} disabled={isEdit}/>
            </Form.Item>
            <Form.Item<FieldType>
              label="Target Node Labek"
              name="targetnodelabek"
              tooltip=" "
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '0' }}
            >
              <Select options={[]} disabled={isEdit}/>
            </Form.Item>
          </>
        ) : null}
      </Form>
      <PropertiesEditor
        properties={[
          {
            id: 1,
            name: 'id',
            type: 'string',
            token: 'id',
            primaryKey: true,
          },
          {
            id: 2,
            name: 'create-date',
            type: 'datetime',
            token: '__create-date',
            primaryKey: false,
          },
        ]}
        onChange={(values: any) => {
          console.log(values);
        }}
      />
    </>
  );
};

export default CreateSchema;

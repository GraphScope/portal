import * as React from 'react';
import { Form, Input, Button, Table, InputNumber, Select, Checkbox, Flex } from 'antd';

interface IImportDataProps {}

const { Option } = Select;
const DataSource: React.FunctionComponent<IImportDataProps> = props => {
  const [form] = Form.useForm();
  const CheckboxComponent = (field: any) => {
    return (
      <Checkbox
        defaultChecked={field.value}
        onChange={(e: { target: { checked: any } }) => {
          field.onChange(e.target.checked);
        }}
        disabled
      />
    );
  };
  const getColumns = () => {
    return [
      {
        title: '属性名',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        render(text: any, field: { name: string | number; fieldKey: React.Key }) {
          return (
            <Form.Item name={[field.name, 'name']} fieldKey={[field.fieldKey, 'name']} style={{ marginBottom: '0' }}>
              <Input style={{ width: '100%' }} bordered={false} disabled />
            </Form.Item>
          );
        },
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: '30%',
        render(text: any, field: { name: string | number; fieldKey: React.Key }) {
          return (
            <Form.Item
              name={[field.name, 'type']}
              fieldKey={[field.fieldKey, 'type']}
              // rules={[{ required: true, message: 'Please input Type!' }]}
              style={{ marginBottom: '0' }}
            >
              <Select
                style={{ width: '100%' }}
                bordered={false}
                disabled
                options={[
                  {
                    value: 'long',
                    label: 'LONG',
                  },
                  {
                    value: 'double',
                    label: 'DOUBLE',
                  },
                  {
                    value: 'str',
                    label: 'STRING',
                  },
                ]}
              />
            </Form.Item>
          );
        },
      },
      {
        title: '主键',
        dataIndex: 'primaryKey',
        key: 'primaryKey',
        width: '10%',
        render(text: any, field: { name: any; fieldKey: any }) {
          return (
            <Form.Item
              // rules={[{ required: false, message: 'primaryKey' }]}
              style={{ marginBottom: '0' }}
              name={[field.name, 'primaryKey']}
              fieldKey={[field.fieldKey, 'primaryKey']}
            >
              <CheckboxComponent field={field} />
            </Form.Item>
          );
        },
      },
      {
        title: '列索引(名称)',
        dataIndex: 'source',
        width: '20%',
        render(text: any, field: { name: string | number; fieldKey: React.Key }) {
          return (
            <Form.Item
              name={[field.name, 'source']}
              fieldKey={[field.fieldKey, 'source']}
              style={{ marginBottom: '0' }}
            >
              <InputNumber min={0} style={{ width: '150px' }} />
            </Form.Item>
          );
        },
      },
    ];
  };
  const selectBefore = (
    <Select defaultValue="ODPS">
      <Option value="Files">Files</Option>
      <Option value="ODPS">ODPS</Option>
    </Select>
  );
  return (
    <div style={{ paddingRight: '24px' }}>
      <Form
        className="table-edit-form"
        form={form}
        labelCol={{ flex: '80px' }}
        labelAlign="right"
        wrapperCol={{ flex: 1 }}
      >
        <Form.Item label="数据源" name="location">
          <Input addonBefore={selectBefore} placeholder="graphscope/modern_graph/user.csv" />
        </Form.Item>

        <Form.Item label="属性映射" rules={[{ required: true, message: 'Please input Source Label!' }]}>
          <Form.List name="propertyMapping">
            {(fields: any, { add, remove }: any) => {
              // 将Table视为 Form.List 中循环的 Form.Item
              return (
                <Form.Item>
                  <Table dataSource={fields} columns={getColumns(remove)} bordered pagination={false} />
                </Form.Item>
              );
            }}
          </Form.List>
        </Form.Item>
      </Form>
      <Flex justify="end">
        <Button type="primary">保存绑定</Button>
      </Flex>
    </div>
  );
};

export default DataSource;

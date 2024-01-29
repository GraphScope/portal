import * as React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import {
  Form,
  Input,
  Button,
  Table,
  InputNumber,
  Select,
  Checkbox,
  Flex,
  Row,
  Col,
  Space,
  Modal,
  notification,
  Typography,
} from 'antd';
import { PropertyType } from './index';
import UploadFiles from './upload-file';
import StagesImportPackages from './stages-import-packages';
import ImportPeriodic from './data-source/import-periodic';
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/a/font_4377140_slis0xqmzfo.js',
});
const { Text } = Typography;
interface IImportDataProps {
  data: PropertyType;
}
const { Option } = Select;
const DataSource: React.FunctionComponent<IImportDataProps> = props => {
  const { data } = props;
  const [form] = Form.useForm();
  const search = location.search.split('=')[1];
  const [api, contextHolder] = notification.useNotification();
  const [state, updateState] = React.useState({
    isEidtProperty: data ? data.bind : false,
    sourceType: data.select,
    isShowModal: false,
  });
  //
  data
    ? form.setFieldsValue({
        ...data,
        label: data && data.source && data.target ? `${data.source}-${data.label}-${data.target}` : data.label,
      })
    : form.setFieldsValue({ select: 'ODPS' });
  const { isEidtProperty, sourceType, isShowModal } = state;
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

  const inputFocus = () => {
    updateState(preState => {
      return {
        ...preState,
        isEidtProperty: true,
      };
    });
  };
  const saveBind = () => {
    let data = {
      ...form.getFieldsValue(),
      bind: true,
    };
    console.log(data);

    updateState(preState => {
      return {
        ...preState,
        isEidtProperty: false,
      };
    });
  };
  const selsctSource = (val: string) => {
    updateState(preState => {
      return {
        ...preState,
        sourceType: val,
      };
    });
  };
  const openNotification = () => {
    api.open({
      message: '数据导入',
      description: (
        <>
          <Text>'「User」类型的节点正在导入中，详情查看任务 JOB-xxx'</Text>
          <Flex justify="flex-end">
            <Space>
              <Button onClick={() => api.destroy()}>关闭</Button>
              <Button type="primary">前往查看</Button>
            </Space>
          </Flex>
        </>
      ),
      style: {
        width: 600,
      },
    });
  };
  return (
    <>
      {contextHolder}
      <Form
        className="table-edit-form"
        form={form}
        labelCol={{ flex: '100px' }}
        labelAlign="right"
        wrapperCol={{ flex: 1 }}
        style={{ border: '1px solid #000', margin: '0px 24px' }}
      >
        <Row style={{ borderBottom: '1px solid #000' }}>
          <Col span={18} style={{ paddingTop: '12px' }}>
            <Form.Item label="label" name="label" style={{ margin: '10px 10px 10px 0px' }}>
              {/* <Input variant="borderless" disabled /> */}
              xx label
            </Form.Item>
            <Form.Item label="数据源" style={{ margin: '0px' }}>
              <Flex justify="flex-start">
                <Form.Item name="select">
                  <Select onChange={selsctSource}>
                    <Option value="Files">Files</Option>
                    <Option value="ODPS">ODPS</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="location">
                  {sourceType == 'ODPS' ? (
                    <Input placeholder="graphscope/modern_graph/user.csv" onFocus={inputFocus} />
                  ) : (
                    <UploadFiles
                      onChange={val => {
                        updateState(preState => {
                          return {
                            ...preState,
                            isEidtProperty: val,
                          };
                        });
                      }}
                    />
                  )}
                </Form.Item>
              </Flex>
            </Form.Item>
          </Col>
          <Col span={6} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', paddingRight: '16px' }}>
            {data && data.bind ? (
              <IconFont type="icon-bangding" style={{ fontSize: '50px' }} />
            ) : (
              <IconFont type="icon-jiechubangding" style={{ fontSize: '50px' }} />
            )}
          </Col>
        </Row>
        {isEidtProperty && (
          <>
            <Form.Item label="属性映射" rules={[{ required: true, message: 'Please input Source Label!' }]}>
              <Form.List name="properties">
                {(fields: any, { add, remove }: any) => {
                  // 将Table视为 Form.List 中循环的 Form.Item
                  return (
                    <Form.Item>
                      <Table dataSource={fields} columns={getColumns()} bordered pagination={false} />
                    </Form.Item>
                  );
                }}
              </Form.List>
            </Form.Item>
            <Flex justify="end" style={{ margin: '16px' }}>
              <Space>
                {search === 'groot' ? (
                  <>
                    <ImportPeriodic />
                    <Button type="primary" onClick={openNotification}>
                      立即导入
                    </Button>
                  </>
                ) : (
                  <Button type="primary" onClick={saveBind}>
                    保存绑定
                  </Button>
                )}
              </Space>
            </Flex>
          </>
        )}
      </Form>
    </>
  );
};

export default DataSource;

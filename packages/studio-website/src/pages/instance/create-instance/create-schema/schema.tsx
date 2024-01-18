import React, { useEffect, useRef } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { PropertiesEditor } from '@graphscope/studio-importor';
import { cloneDeep } from 'lodash';
import { useContext } from '../useContext';
export type FieldType = {
  label?: string;
  src_label?: string;
  dst_label?: string;
};
type SchemaType = {
  newActiveKey: string;
  deleteNode: (currentType: string, newActiveKey: string) => void;
  data?: any;
};

type IFormType = {
  [x: string]: {
    label: string;
    src_label?: string;
    dst_label?: string;
    properties: any;
  };
};
const CreateSchema: React.FunctionComponent<SchemaType> = props => {
  const { newActiveKey, deleteNode, data } = props;
  const [form] = Form.useForm();
  const { store, updateStore } = useContext();
  const { currentType, nodeItems, edgeItems, detail, option } = store;
  const propertyRef = useRef<any>();
  let cbRef = useRef()
  /** 子项 [{title:'表头'，dataIndex:'绑定字段'，type:'字段对应编辑框'，option:'select配置选项',width:'表头宽度'}] */
  const configcolumns = [
    { title: 'primary_name', dataIndex: 'name', width: '40%', type: 'INPUT' },
    { title: 'Type', dataIndex: 'type', width: '25%', type: 'SELECT', option: [{ value: 'string',label:'string' }, { value: 'datetime' ,label:'datetime'}] },
    { title: 'primary_key', width: '25%' },
  ];
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, []);
  /** 创建点、边时值的监控 */
  const formChange = () => {
    if (currentType == 'node') {
      const getData: IFormType = cloneDeep(nodeItems);
      const { label } = form.getFieldsValue();
      getData[newActiveKey] = { label, properties: cbRef.current };
      updateStore(draft => {
        draft.nodeItems = getData;
      });  
    } else {
      const getData: IFormType = cloneDeep(edgeItems);
      const { label, src_label, dst_label } = form.getFieldsValue();
      getData[newActiveKey] = {
        label,
        src_label: src_label || '',
        dst_label: dst_label || '',
        properties: cbRef.current,
      };
      updateStore(draft => {
        draft.edgeItems = getData;
      });
    }
  };  
  return (
    <>
      <Form form={form} layout="vertical" onValuesChange={() => formChange()}>
        <div style={{ position: 'relative' }}>
          <Form.Item<FieldType>
            label={currentType == 'node' ? 'Node Label' : 'Edge Label'}
            name="label"
            tooltip=" "
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            rules={[{ required: true, message: '' }]}
            style={{ marginBottom: '0' }}
          >
            <Input disabled={detail} />
          </Form.Item>
          <Button
            style={{ position: 'absolute', top: '0px', right: '0px' }}
            onClick={() => deleteNode(currentType, newActiveKey)}
          >
            Delete
          </Button>
        </div>
        {currentType !== 'node' ? (
          <>
            <Form.Item<FieldType>
              label="Source Node Label"
              name="src_label"
              tooltip=" "
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '0' }}
            >
              <Select options={[...option]} disabled={detail} />
            </Form.Item>
            <Form.Item<FieldType>
              label="Target Node Labek"
              name="dst_label"
              tooltip=" "
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '0' }}
            >
              <Select options={[...option]} disabled={detail} />
            </Form.Item>
          </>
        ) : null}
      </Form>
      <PropertiesEditor
        ref={propertyRef}
        properties={data?.properties ||[]}
        onChange={(values: any) => {
          cbRef.current = values
          formChange();
        }}
        /**映射控制 */
        isMapFromFile={false}
        tableConfig={configcolumns}

      />
    </>
  );
};

export default CreateSchema;

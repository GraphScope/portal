import React, { useEffect ,useRef} from 'react';
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
  [x:string]:{
    label:string;
    src_label?:string;
    dst_label?:string;
    properties:any;
  };
}
const CreateSchema: React.FunctionComponent<SchemaType> = props => {
  const { newActiveKey, deleteNode, data } = props;
  const [form] = Form.useForm();
  const { store, updateStore } = useContext();
  const { currentType, nodeItems, edgeItems, detail, option } = store;
  const propertyRef = useRef<any>();
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, []);
  /** 创建点、边时值的监控 */
  const formChange = () => {
    if (currentType == 'node') {
      const getData:IFormType = cloneDeep(nodeItems);
      const { label } = form.getFieldsValue();
      getData[newActiveKey] = { label, properties: propertyRef?.current?.getValues() };
      updateStore(draft => {
        draft.nodeItems = getData;
      });
    } else {
      const getData: IFormType = cloneDeep(edgeItems);
      const { label, src_label, dst_label } = form.getFieldsValue();
      getData[newActiveKey] = { label, src_label:src_label || '', dst_label:dst_label || '', properties: propertyRef?.current?.getValues() };
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
        properties={data?.properties || []}
        propertyType={[{ type: 'string' }, { type: 'datetime' }]}
        onChange={(values: any) => {
          formChange();
        }}
        tableType={['Name', 'Type', 'primary_key']} // all['Name', 'Column', 'Type', 'primary_key']
      />
    </>
  );
};

export default CreateSchema;

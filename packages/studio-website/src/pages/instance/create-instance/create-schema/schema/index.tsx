import * as React from 'react';
import { Form, Input, Select, Button } from 'antd';
import {PropertiesEditor} from '@graphscope/studio-importor';
import { cloneDeep } from 'lodash';
import { useContext } from '../../valtio/createGraph';
export type FieldType = {
  label?: string;
  src_label?: string;
  dst_label?: string;
};
const CreateSchema = (props:{nodeEdge?:string;newActiveKey?:string;deleteNode?:any;data?:any;}) => {
  const { nodeEdge, newActiveKey, deleteNode, data } = props;
  const [form] = Form.useForm();
  const { store, updateStore } = useContext();
  const { properties, nodeItems, edgeItems ,detail} = store;
  const propertyRef= React.useRef();
  const formValuesChange = (changedValues: any, allValues: any) => {
    formChange();
  };
  React.useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, []);
  React.useEffect(() => {
    formChange();
  }, [properties]);
  const formChange = () => {
    if (nodeEdge == 'Node') {
      const getData = cloneDeep(nodeItems);
      getData[newActiveKey] = { ...form.getFieldsValue(), properties: propertyRef.current.getValues() };
      updateStore(draft => {
        draft.nodeItems = getData;
      });
    } else {
      const getData = cloneDeep(edgeItems);
      getData[newActiveKey] = { ...form.getFieldsValue(), properties: propertyRef.current.getValues() };
      updateStore(draft => {
        draft.edgeItems = getData;
      });
    }
  };
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(changedValues, allValues) => formValuesChange(changedValues, allValues)}
      >
        <div style={{ position: 'relative' }}>
          <Form.Item<FieldType>
            label={nodeEdge == 'Node' ? 'Node Label' : 'Edge Label'}
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
            onClick={() => deleteNode(nodeEdge, newActiveKey)}
          >
            Delete
          </Button>
        </div>
        {nodeEdge !== 'Node' ? (
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
              <Select options={store?.option} disabled={detail} />
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
              <Select options={store?.option} disabled={detail} />
            </Form.Item>
          </>
        ) : null}
      </Form>
      <PropertiesEditor
        ref={propertyRef}
        properties={data?.properties || []}
        propertyType={[{ type: 'string' }, { type: 'datetime' }]}
        onChange={(values: any) => {
          updateStore(draft => {
            draft.properties = values;
          });
        }}
        tableType={['Name', 'Type', 'ID']} // all['Name', 'Column', 'Type', 'ID']
      />
    </>
  );
};

export default CreateSchema;

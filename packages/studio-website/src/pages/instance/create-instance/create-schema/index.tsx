import * as React from 'react';
import { Form, Input, Select, Button } from 'antd';
import { setLocalData, getLocalData } from '../../localStorage';
import PropertiesEditor from '../../../../../../studio-importor/src/properties-editor';
import { useImmer } from 'use-immer';
import { cloneDeep } from 'lodash';
export type FieldType = {
  label?: string;
  sourcenodelabel?: string;
  targetnodelabek?: string;
};
const CreateSchema = (props: { nodeEdge: any; isEdit: boolean; newActiveKey?: String; data?: any }) => {
  const { nodeEdge, isEdit, newActiveKey, deleteNode, data } = props;
  const [form] = Form.useForm();
  const [state, updateState] = useImmer({
    params: {},
    properties: [],
  });
  const propertyRef = React.useRef();
  const formValuesChange = (changedValues: any, allValues: any) => {
    formChange();
  };
  React.useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
      // const propertiesData = []
      // let arr = []
      // console.log(data?.properties);
      
      // data?.properties.map(item=>{
      //   arr.push(  {
      //     id: 1,
      //     name: 'id',
      //     type: 'string',
      //     token: 'id',
      //     primaryKey: true,
      //   },)
      // })
      // updateState(draft => {
      //   draft.properties = data?.properties;
      // });
    }
  }, []);
  React.useEffect(() => {
    formChange();
  }, [state.properties]);
  const formChange = () => {
    if (nodeEdge == 'Node') {
      const getData = cloneDeep(getLocalData('nodeList'));
      getData[newActiveKey] = { ...form.getFieldsValue(), properties: propertyRef.current.getValues() };
      setLocalData('nodeList', getData);
    } else {
      const getData = cloneDeep(getLocalData('edgeList'));
      getData[newActiveKey] = { ...form.getFieldsValue(), properties: propertyRef.current.getValues() };
      setLocalData('edgeList', getData);
    }
  };
  return (
    <>
      <Form
        name="basic"
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
            <Input disabled={isEdit} />
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
              name="sourcenodelabel"
              tooltip=" "
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '0' }}
            >
              <Select options={[]} disabled={isEdit} />
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
              <Select options={[]} disabled={isEdit} />
            </Form.Item>
          </>
        ) : null}
      </Form>
      <PropertiesEditor
        ref={propertyRef}
        properties={data?.properties || []}
        onChange={values => {
          updateState(draft => {
            draft.properties = values;
          });
        }}
      />
    </>
  );
};

export default CreateSchema;

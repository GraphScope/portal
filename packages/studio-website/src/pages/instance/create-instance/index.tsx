import * as React from 'react';
import { Button, Form, Input, Radio, Tabs } from 'antd';
import { useImmer } from 'use-immer';
// import PropertiesEditor from '@graphscope/studio-importor/src/properties-editor';
interface ICreateInstanceProps {}
const { useRef } = React;
export type FieldType = {
  label?: string;
  sourcenodelabel?: string;
  targetnodelabek?: string;
};
const FormTable = () => {
  // const propertiesRef = useRef();
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };
  return (
    <>
      <Form name="basic" onFinish={onFinish} layout="vertical">
        <Form.Item<FieldType>
          label="Node Label"
          name="label"
          tooltip=" "
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          rules={[{ required: true, message: '' }]}
          style={{ marginBottom: '0' }}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Source Node Label"
          name="sourcenodelabel"
          tooltip=" "
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          rules={[{ required: true, message: '' }]}
          style={{ marginBottom: '0' }}
        >
          <Input />
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
          <Input />
        </Form.Item>
      </Form>
      {/* <PropertiesEditor
        ref={propertiesRef}
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
      /> */}
    </>
  );
};

const CreateInstance: React.FunctionComponent<ICreateInstanceProps> = props => {
  const newTabIndex = useRef(0);
  const [state, updateState] = useImmer({
    items: [],
    activeKey: '0',
    nodeEdge: 'Node',
  });
  const { items, activeKey, nodeEdge } = state;
  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    updateState(draft => {
      draft.items = [...items, { label: 'undefine', children: <FormTable />, key: newActiveKey }];
      draft.activeKey = newActiveKey;
    });
  };
  const onChange = (key: string) => {
    updateState(draft => {
      draft.activeKey = key;
    });
  };
  const nodeEdgeChange = (e: { target: { value: string } }): void => {
    updateState(draft => {
      draft.nodeEdge = e.target.value;
    });
  };
  return (
    <div style={{ backgroundColor: '#fff', padding: '24px', height: '80vh', borderRadius: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Radio.Group defaultValue="Nodes" style={{ marginBottom: '16px' }} onChange={nodeEdgeChange}>
          <Radio.Button value="Node">Nodes</Radio.Button>
          <Radio.Button value="Edge">Edges</Radio.Button>
        </Radio.Group>
        {items.length > 0 ? (
          <Button type="dashed" onClick={add}>
            + Add {nodeEdge}
          </Button>
        ) : null}
      </div>
      {items.length == 0 ? (
        <Button style={{ width: '100%', color: '#1650ff' }} type="dashed" onClick={add}>
          + Add {nodeEdge}
        </Button>
      ) : null}

      <Tabs
        tabBarStyle={{ borderLeft: 0 }}
        tabPosition="left"
        items={items}
        activeKey={activeKey}
        onChange={onChange}
      />
    </div>
  );
};
export default CreateInstance;

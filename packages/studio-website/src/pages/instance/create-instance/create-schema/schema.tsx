import React, { useEffect, useRef ,memo} from 'react';
import { Form, Input, Select, Button } from 'antd';
import { PropertiesEditor } from '@graphscope/studio-importor';
import { cloneDeep } from 'lodash';
import { useContext } from '../useContext';
import { FormattedMessage } from 'react-intl';
export type FieldType = {
  label?: string;
  src_label?: string;
  dst_label?: string;
};
type SchemaType = {
  newActiveKey: string;
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
  const { newActiveKey, data } = props;
  const [form] = Form.useForm();
  const { store, updateStore } = useContext();
  const { currentType, nodeItems, edgeItems, detail, option } = store;
  const propertyRef = useRef<any>();
  let cbRef = useRef()
  /** 子项 [{title:'表头'，dataIndex:'绑定字段'，type:'字段对应编辑框'，option:'select配置选项',width:'表头宽度'}] */
  const configcolumns = [
    { title: <FormattedMessage id='primary_name'/>, dataIndex: 'name', width: '40%', type: 'INPUT' },
    { title: <FormattedMessage id='primary_key'/>, width: '25%' },
    { title: <FormattedMessage id='primary_type'/>, dataIndex: 'type', width: '25%', type: 'SELECT', option: [{ value: 'string',label:'string' }, { value: 'datetime' ,label:'datetime'}] },
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
    <div>
      <Form key={newActiveKey} form={form} layout="vertical" onValuesChange={() => formChange()}>
        <div style={{ position: 'relative' }}>
          <Form.Item<FieldType>
            label={currentType == 'node' ? <FormattedMessage id='Node Label'/> : <FormattedMessage id='Edge Label'/>}
            name="label"
            tooltip=" "
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            rules={[{ required: true, message: '' }]}
            style={{ marginBottom: '0' }}
          >
            <Input disabled={detail} placeholder={`Please Enter ${currentType == 'node' ? 'Node Label.' : 'Edge Label.'}`}/>
          </Form.Item>
        </div>
        {currentType !== 'node' ? (
          <>
            <Form.Item<FieldType>
              label={<FormattedMessage id='Source Node Label'/>}
              name="src_label"
              tooltip=" "
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '0' }}
            >
              <Select options={[...option]} disabled={detail} placeholder='Please Select Source Node Label.'/>
            </Form.Item>
            <Form.Item<FieldType>
              label={<FormattedMessage id='Target Node Label'/>}
              name="dst_label"
              tooltip=" "
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '0' }}
            >
              <Select options={[...option]} disabled={detail} placeholder='Please Select Target Node Label.'/>
            </Form.Item>
          </>
        ) : null}
      </Form>
      <PropertiesEditor
        ref={propertyRef}
        locales={{properties:<FormattedMessage id='Properties'/>,addProperty:<FormattedMessage id='Add Property'/>,mapFromFile:<FormattedMessage id='Map From File'/>}}
        properties={data?.properties ||[]}
        onChange={(values: any) => {
          cbRef.current = values
          formChange();
        }}
        /**映射控制 */
        isMapFromFile={false}
        tableConfig={configcolumns}
      />
    </div>
  );
};

export default memo(CreateSchema);

import React, { useEffect, useRef, memo } from 'react';
import { Form, Input, Select } from 'antd';
import { PropertiesEditor } from '@graphscope/studio-importor';

import { FormattedMessage } from 'react-intl';
import type { IStore } from '../useContext';
export type FieldType = {
  label?: string;
  src_label?: string;
  dst_label?: string;
};
type SchemaType = {
  newActiveKey: string;
  data?: any;
  id: string;
  shouldRender: boolean;
  currentType: 'node' | 'edge';
  updateStore: (fn: (draft: IStore<{}>) => void) => void;
  nodeOptions?: { label: string; value: string }[];
};

/** 子项 [{title:'表头'，dataIndex:'绑定字段'，type:'字段对应编辑框'，option:'select配置选项',width:'表头宽度'}] */
const configcolumns = [
  { title: 'primary_name', dataIndex: 'name', width: '40%', type: 'INPUT' },
  { title: 'primary_key', width: '25%' },
  {
    title: 'primary_type',
    dataIndex: 'type',
    width: '25%',
    type: 'SELECT',
    option: [
      { value: 'string', label: 'string' },
      { value: 'datetime', label: 'datetime' },
    ],
  },
];

const CreateSchema: React.FunctionComponent<SchemaType> = props => {
  const { newActiveKey, data, currentType, updateStore, nodeOptions } = props;
  const [form] = Form.useForm();
  const detail = false;
  console.log(' data', currentType, data, newActiveKey, nodeOptions);

  const propertyRef = useRef<any>();
  let cbRef = useRef();

  /** 用户数据的默认回填 */
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, []);
  /** 创建点、边时值的监控 */
  const formChange = () => {
    if (currentType == 'node') {
      const { label } = form.getFieldsValue();
      updateStore(draft => {
        draft.nodeList.forEach(item => {
          if (item.key === newActiveKey) {
            //@ts-ignore
            item.properties = cbRef.current;
            item.label = label;
          }
        });
      });
    }
    if (currentType === 'edge') {
      const { label, src_label, dst_label } = form.getFieldsValue();

      updateStore(draft => {
        draft.edgeList.forEach(item => {
          if (item.key === newActiveKey) {
            //@ts-ignore
            item.properties = cbRef.current;
            item.label = label;
            item.source = src_label || '';
            item.target = dst_label || '';
          }
        });
      });
    }
  };
  return (
    <div
      style={
        {
          // padding: '12px'
        }
      }
    >
      <Form form={form} layout="vertical" onValuesChange={() => formChange()}>
        <div style={{ position: 'relative' }}>
          <Form.Item<FieldType>
            label={currentType == 'node' ? <FormattedMessage id="Node Label" /> : <FormattedMessage id="Edge Label" />}
            name="label"
            tooltip=" "
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            rules={[{ required: true, message: '' }]}
            style={{ marginBottom: '0' }}
          >
            <Input
              disabled={detail}
              placeholder={`Please Enter ${currentType == 'node' ? 'Node Label.' : 'Edge Label.'}`}
            />
          </Form.Item>
        </div>
        {currentType !== 'node' ? (
          <>
            <Form.Item<FieldType>
              label={'Source Node Label'}
              name="src_label"
              tooltip=" "
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '0' }}
            >
              <Select options={nodeOptions} disabled={detail} placeholder="Please Select Source Node Label." />
            </Form.Item>
            <Form.Item<FieldType>
              label={'Target Node Label'}
              name="dst_label"
              tooltip=" "
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '0' }}
            >
              <Select options={nodeOptions} disabled={detail} placeholder="Please Select Target Node Label." />
            </Form.Item>
          </>
        ) : null}
      </Form>
      <PropertiesEditor
        //@ts-ignore
        ref={propertyRef}
        locales={{
          properties: 'Properties',
          addProperty: 'Add Property',
          mapFromFile: 'Map From File',
        }}
        properties={data?.properties || []}
        onChange={(values: any) => {
          cbRef.current = values;
          formChange();
        }}
        /**映射控制 */
        isMapFromFile={false}
        tableConfig={configcolumns}
      />
    </div>
  );
};

export default memo(CreateSchema, (prevProps, nextPorps) => {
  // 性能优化，多个 Schema 没必要同时渲染
  if (nextPorps.shouldRender) {
    return false;
  }
  return true;
});

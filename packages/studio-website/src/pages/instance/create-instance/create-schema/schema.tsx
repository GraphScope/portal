import React, { useEffect, useRef, memo } from 'react';
import { Form, Input, Select } from 'antd';
import { PropertiesEditor } from '@graphscope/studio-importor';

import { FormattedMessage } from 'react-intl';
import type { IStore } from '../useContext';
export type FieldType = {
  label?: string;
  source?: string;
  target?: string;
};
type SchemaType = {
  mode: 'view' | 'create';
  engineType: 'interactive' | 'groot';
  newActiveKey: string;
  data?: any;
  id: string;
  shouldRender: boolean;
  currentType: 'node' | 'edge';
  updateStore: (fn: (draft: IStore<{}>) => void) => void;
  nodeOptions?: { label: string; value: string }[];
};
type configcolumnsType = {
  title: string;
  dataIndex?: string;
  width?: string | number;
  type?: string;
  option?: { label: string; value: string }[];
};
const primitive_types = ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64', 'DT_DATE32'];

/** 子项 [{title:'表头'，dataIndex:'绑定字段'，type:'字段对应编辑框'，option:'select配置选项',width:'表头宽度'}] */
const configcolumns: configcolumnsType[] = [
  { title: 'primary_name', dataIndex: 'name', width: '200px', type: 'INPUT' },
  { title: 'primary_key', width: '120px' },
  {
    title: 'primary_type',
    dataIndex: 'type',
    type: 'SELECT',
    option: primitive_types.map(item => {
      return { label: item, value: item };
    }),
  },
];

const CreateSchema: React.FunctionComponent<SchemaType> = props => {
  const { newActiveKey, data, currentType, updateStore, nodeOptions, mode } = props;
  const [form] = Form.useForm();

  const disabled = mode === 'view';
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
      const { label, source, target } = form.getFieldsValue();

      updateStore(draft => {
        draft.edgeList.forEach(item => {
          if (item.key === newActiveKey) {
            //@ts-ignore
            item.properties = cbRef.current;
            item.label = label;
            item.source = source || '';
            item.target = target || '';
          }
        });
      });
    }
  };
  /**
   *
   * @param configcolumns
   * currentType:node | edge
   * edge 过滤主键选项
   * @returns
   */
  const hangdleConfigcolumns = (configcolumns: configcolumnsType[]) => {
    if (currentType === 'edge') {
      return configcolumns.filter(item => item.title !== 'primary_key');
    }
    return configcolumns;
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
              disabled={disabled}
              placeholder={`Please Enter ${currentType == 'node' ? 'Node Label.' : 'Edge Label.'}`}
            />
          </Form.Item>
        </div>
        {currentType === 'edge' ? (
          <>
            <Form.Item<FieldType>
              label={'Source Node Label'}
              name="source"
              tooltip=" "
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '0' }}
            >
              <Select options={nodeOptions} disabled={disabled} placeholder="Please Select Source Node Label." />
            </Form.Item>
            <Form.Item<FieldType>
              label={'Target Node Label'}
              name="target"
              tooltip=" "
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '0' }}
            >
              <Select options={nodeOptions} disabled={disabled} placeholder="Please Select Target Node Label." />
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
        tableConfig={hangdleConfigcolumns(configcolumns)}
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

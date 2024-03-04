import React, { useEffect, useRef, memo } from 'react';
import { Button, Empty, Form, Input, Select, Tooltip } from 'antd';
import { PropertiesEditor } from '@graphscope/studio-importor';
import { KeyOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { QuestionCircleOutlined } from '@ant-design/icons';
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
  title: string | React.ReactNode;
  dataIndex?: string;
  width?: string | number;
  type?: string;
  option?: { label: string; value: string }[];
};
const primitive_types = ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64', 'DT_DATE32'];

/** 子项 [{title:'表头'，dataIndex:'绑定字段'，type:'字段对应编辑框'，option:'select配置选项',width:'表头宽度'}] */
const configcolumns: configcolumnsType[] = [
  {
    title: (
      <>
        Name
        <Tooltip title="property name">
          <QuestionCircleOutlined style={{ margin: '0px 4px' }} />
        </Tooltip>
      </>
    ),
    dataIndex: 'name',
    width: '200px',
    type: 'INPUT',
  },
  {
    title: (
      <>
        Data type
        <Tooltip title="data type">
          <QuestionCircleOutlined style={{ margin: '0px 4px' }} />
        </Tooltip>
      </>
    ),
    dataIndex: 'type',
    type: 'SELECT',
    option: primitive_types.map(item => {
      return { label: item, value: item };
    }),
  },
  {
    title: (
      <div>
        <Tooltip title="primary key">
          <Button
            type="text"
            icon={<KeyOutlined style={{ color: '#c6c8cb', fontWeight: 700 }} />}
            size="small"
          ></Button>
        </Tooltip>
      </div>
    ),
    width: '80px',
  },
];

const notFoundContent = (
  <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    description={
      <>
        Vertex type not defined yet.
        <br /> Please define the vertex label first
      </>
    }
  />
);
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
            label={
              currentType == 'node' ? <FormattedMessage id="Vertex Label" /> : <FormattedMessage id="Edge Label" />
            }
            name="label"
            tooltip=" "
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            rules={[{ required: true, message: '' }]}
            style={{ marginBottom: '0' }}
          >
            <Input
              disabled={disabled}
              placeholder={`Please Enter ${currentType == 'node' ? 'Vertex Label.' : 'Edge Label.'}`}
            />
          </Form.Item>
        </div>
        {currentType === 'edge' ? (
          <>
            <Form.Item<FieldType>
              label={'Source Vertex Label'}
              name="source"
              tooltip=" "
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '0' }}
            >
              <Select
                options={nodeOptions}
                disabled={disabled}
                placeholder="Please Select Source Vertex Label."
                notFoundContent={notFoundContent}
              />
            </Form.Item>
            <Form.Item<FieldType>
              label={'Target Vertex Label'}
              name="target"
              tooltip=" "
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '0' }}
            >
              <Select
                options={nodeOptions}
                disabled={disabled}
                placeholder="Please Select Target Vertex Label."
                notFoundContent={notFoundContent}
              />
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

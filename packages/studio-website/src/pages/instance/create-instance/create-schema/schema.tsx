import React, { useEffect, useRef, memo } from 'react';
import { Button, Empty, Form, Input, Select, Tooltip } from 'antd';
import { PropertiesEditor } from '@graphscope/studio-importor';
import PrimaryKey from '@/components/icons/primary-key';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import type { IStore } from '../useContext';
import { useContext } from '@/layouts/useContext';
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
        <FormattedMessage id="Name" />
        <Tooltip title={<FormattedMessage id="property name" />}>
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
        <FormattedMessage id="Data type" />
        <Tooltip title={<FormattedMessage id="Data type" />}>
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
        <Tooltip title={<FormattedMessage id="Primary key" />}>
          <Button type="text" icon={<PrimaryKey style={{ color: '#c6c8cb' }} />} size="small"></Button>
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
  const { store } = useContext();
  const { locale } = store;
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
            console.log('  cbRef.current', cbRef.current);
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
  const nodeOrEdgeTitle =
    currentType == 'node' ? <FormattedMessage id="Vertex Label" /> : <FormattedMessage id="Edge Label" />;
  let labelPlaceholder =
    locale === 'zh-CN'
      ? `请输入 ${currentType == 'node' ? '点标题。' : '边标题。'}`
      : `Please Enter ${currentType == 'node' ? 'Vertex Label.' : 'Edge Label.'}`;
  let sourceVertexLabel = locale === 'zh-CN' ? '请选择源点标签。' : 'Please Select Source Vertex Label.';
  let targetVertexLabel = locale === 'zh-CN' ? '请选择目标点标签。' : 'Please Select Target Vertex Label.';
  /** 添加属性标题国际化 */
  let locales = {
    properties: locale === 'zh-CN' ? '属性' : 'Properties',
    addProperty: locale === 'zh-CN' ? '添加属性' : 'Add Property',
    mapFromFile: locale === 'zh-CN' ? '映射文件' : 'Map From File',
  };
  return (
    <div>
      <Form form={form} layout="vertical" onValuesChange={() => formChange()}>
        <div style={{ position: 'relative' }}>
          <Form.Item<FieldType>
            label={nodeOrEdgeTitle}
            name="label"
            tooltip={nodeOrEdgeTitle}
            rules={[{ required: true, message: '' }]}
            style={{ marginBottom: '8px' }}
          >
            <Input disabled={disabled} placeholder={labelPlaceholder} />
          </Form.Item>
        </div>
        {currentType === 'edge' ? (
          <>
            <Form.Item<FieldType>
              label={<FormattedMessage id="Source Vertex Label" />}
              name="source"
              tooltip={<FormattedMessage id="Source Vertex Label" />}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '8px' }}
            >
              <Select
                options={nodeOptions}
                disabled={disabled}
                placeholder={sourceVertexLabel}
                notFoundContent={notFoundContent}
              />
            </Form.Item>
            <Form.Item<FieldType>
              label={<FormattedMessage id="Target Vertex Label" />}
              name="target"
              tooltip={<FormattedMessage id="Destination Vertex Label" />}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '8px' }}
            >
              <Select
                options={nodeOptions}
                disabled={disabled}
                placeholder={targetVertexLabel}
                notFoundContent={notFoundContent}
              />
            </Form.Item>
          </>
        ) : null}
      </Form>
      <PropertiesEditor
        //@ts-ignore
        ref={propertyRef}
        locales={locales}
        properties={data?.properties || []}
        onChange={(values: any) => {
          cbRef.current = values;
          formChange();
        }}
        /**映射控制 */
        isMapFromFile={false}
        mode={store.mode}
        //@ts-ignore
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

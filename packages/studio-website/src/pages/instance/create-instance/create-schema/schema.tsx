import React, { useEffect, useRef, memo } from 'react';
import { Button, Empty, Form, Input, Select, Tooltip } from 'antd';
import { PropertiesEditor } from '@graphscope/studio-importor';
import PrimaryKey from '@/components/icons/primary-key';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import type { IStore } from '../useContext';
import { useContext } from '@/layouts/useContext';
import { getPrimitiveTypes } from '../service';
import { createVertexOrEdgeType } from './service';
import { getSchema } from '../../view-schema/service';
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
  updateStore: (fn: (draft: IStore) => void) => void;
  nodeOptions?: { label: string; value: string }[];
  graphName: string;
  nodeList?: any;
};
type configcolumnsType = {
  title: string | React.ReactNode;
  dataIndex?: string;
  width?: string | number;
  type?: string;
  option?: { label: string; value: string }[];
};

const primitive_types = getPrimitiveTypes();

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
          <Button
            type="text"
            icon={<PrimaryKey style={{ color: '#c6c8cb', paddingTop: '3px' }} />}
            size="small"
          ></Button>
        </Tooltip>
      </div>
    ),
    type: 'primary_key',
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
  const { newActiveKey, data, currentType, updateStore, nodeOptions, mode, graphName, nodeList } = props;
  const [form] = Form.useForm();
  const { store } = useContext();
  const intl = useIntl();
  // const disabled = mode === 'view' && !data?.isDraft;
  let disabled = false;
  /** groot 根据 isDraft判断是否新建 */
  if (window.GS_ENGINE_TYPE === 'groot' && !data?.isDraft) {
    disabled = !data?.isDraft;
  }
  /** interactive 只有查看不能编辑 */
  if (window.GS_ENGINE_TYPE === 'interactive' && mode === 'view') {
    disabled = mode === 'view';
  }
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
    if (currentType === 'node') {
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
      return configcolumns.filter(item => item.type !== 'primary_key');
    }
    return configcolumns;
  };
  const nodeOrEdgeTitle =
    currentType === 'node' ? <FormattedMessage id="Vertex label" /> : <FormattedMessage id="Edge Label" />;
  let label =
    currentType === 'node'
      ? intl.formatMessage({ id: 'Please enter vertex label.' })
      : intl.formatMessage({ id: 'Please enter edge label.' });
  /** 添加属性标题国际化 */
  let locales = {
    properties: intl.formatMessage({ id: 'Properties' }),
    addProperty: intl.formatMessage({ id: 'Add property' }),
    mapFromFile: intl.formatMessage({ id: 'Mapping from file' }),
  };
  /** groot 创建点/边  */
  const hangdleSubmit = () => {
    const property = cbRef.current || [];
    createVertexOrEdgeType(currentType, graphName, nodeList, form.getFieldsValue(), property).then(res => {
      if (res[0].status === 200) {
        getSchema(graphName).then(data => {
          //@ts-ignore
          const { nodes, edges } = data;
          updateStore(draft => {
            draft.nodeList = nodes;
            draft.edgeList = edges;
            draft.nodeActiveKey = nodes.length && nodes[nodes.length - 1].key;
            draft.edgeActiveKey = edges.length && edges[edges.length - 1].key;
          });
        });
      }
    });
  };
  let SaveGrootType = () => {
    if (window.GS_ENGINE_TYPE === 'groot' && data?.isDraft) {
      return (
        <Button type="primary" style={{ minWidth: '100px' }} onClick={hangdleSubmit}>
          <FormattedMessage id="Submit" />
        </Button>
      );
    } else {
      return null;
    }
  };
  return (
    <div>
      <Form form={form} layout="vertical" onValuesChange={() => formChange()} disabled={disabled}>
        <div style={{ position: 'relative' }}>
          <Form.Item<FieldType>
            label={nodeOrEdgeTitle}
            name="label"
            tooltip={nodeOrEdgeTitle}
            rules={[{ required: true, message: '' }]}
            style={{ marginBottom: '8px' }}
          >
            <Input placeholder={label} />
          </Form.Item>
        </div>
        {currentType === 'edge' ? (
          <>
            <Form.Item<FieldType>
              label={<FormattedMessage id="Source vertex label" />}
              name="source"
              tooltip={<FormattedMessage id="Source vertex label" />}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '8px' }}
            >
              <Select
                options={nodeOptions}
                placeholder={intl.formatMessage({ id: 'Please select source vertex label.' })}
                notFoundContent={notFoundContent}
              />
            </Form.Item>
            <Form.Item<FieldType>
              label={<FormattedMessage id="Target vertex label" />}
              name="target"
              tooltip={<FormattedMessage id="Destination vertex label" />}
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '8px' }}
            >
              <Select
                options={nodeOptions}
                placeholder={intl.formatMessage({ id: 'Please select target vertex label.' })}
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
        isEditable={disabled}
        /**映射控制 */
        isMapFromFile={false}
        mode={store.mode}
        //@ts-ignore
        tableConfig={hangdleConfigcolumns(configcolumns)}
      />
      <div style={{ textAlign: 'right', marginTop: '24px' }}>{mode === 'view' && <SaveGrootType />}</div>
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

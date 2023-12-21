import { Form, Input, Select, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { createContext, useContext, useEffect ,memo} from 'react';
import { EditOutlined } from '@ant-design/icons';
// import styles from './index.module.less';
export enum EditType {
  SWITCH = 'SWITCH',
  INPUT = 'INPUT',
  RADIO = 'RADIO',
  CASCADER = 'CASCADER',
  SELECT = 'SELECT',
  JSON = 'JSON',
  SQL = 'SQL',
  DATE_PICKER = 'DATE_PICKER',
  CUSTOM = 'CUSTOM',
  NULL = 'NULL',
}
const EditableContext = createContext<FormInstance<any> | null>(null);
const TableContext = createContext<{
  onChange?: (i: any) => void;
  data?: Array<any>;
  rowKey?: string;
}>({});
type Prop = {
  columns: any;
  dataSource: any;
  onChange?: (newData: Array<any>) => void;
  rowKey: string;
};
interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof any;
  record: any;
  inputType: string;
  prop: { options: Array<any> };
  editorConfig: (record: any) => void;
}
interface EditableRowProps {
  index: number;
  onChange?: (newData: Array<any>) => void;
}
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  const { onChange, data, rowKey } = useContext(TableContext)!;
  return (
    <Form
      form={form}
      component={false}
      disabled={
        data?.find(item => item[rowKey] === props[`data-row-key`])?.disabled
      }
      onValuesChange={() => {
        const newData = data?.map(item => {
          if (item[rowKey] === props[`data-row-key`]) {
            return { ...item, ...form.getFieldsValue() };
          }
          return item;
        });
        onChange?.(newData);
      }}
    >
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditTable = memo(({
  columns,
  dataSource,
  onChange,
  rowKey,
  inputDoubleClick,
  ...props
}) => {
  const data = dataSource;
  const EditableCell: React.FC<EditableCellProps> = ({
    children,
    editable,
    title,
    dataIndex,
    record,
    editorConfig,
    ...restProps
  }) => {
    const form = useContext(EditableContext)!;
    let childNode = children;
    useEffect(() => {
      if (record) {
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
      }
    }, [record]);
    if (editable) {
      const { inputType, prop, name } = editorConfig(record);
      if (inputType === EditType.INPUT) {
        childNode = (
          <Form.Item
            key={`col-input-${dataIndex}`}
            style={{ margin: 0 }}
            name={dataIndex}
            rules={
              prop?.name && [
                {
                  required: true,
                  validator: (_props, value) => {
                    var reg = new RegExp('^[a-zA-Z0-9_\u4e00-\u9fa5]+$');
                    if (!value) {
                      return Promise.reject(`请填写属性名称！`);
                    }
                    if (!reg.test(value)) {
                      return Promise.reject(
                        '名称由中文、字母、数字、下划线组成。',
                      );
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]
            }
          >
            {record?.disable ? <span style={{height:'27px',backgroundColor:'#505156',color:'#fff',borderRadius:'8px',padding:'8px'}} onDoubleClick={()=>inputDoubleClick(record)}>{record?.name}  <EditOutlined /></span> : <Input {...prop}/>}
          </Form.Item>
        );
      } else if (inputType === EditType.SELECT) {
        childNode = (
          <Form.Item
            style={{ margin: 0 }}
            name={dataIndex}
            key={`col-select-${dataIndex}`}
          >
            <Select {...prop} options={prop?.options} />
          </Form.Item>
        );
      } else {
        childNode = <span key={`col-element-${dataIndex}`}>{children}</span>;
      }
    }
    return (
      <td {...restProps} key={`col-td-${dataIndex}`}>
        {childNode}
      </td>
    );
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const editColumns = columns.map((col: EditableCellProps) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editorConfig: col.editorConfig,
      }),
    };
  });

  return (
    <TableContext.Provider value={{ data, onChange, rowKey }}>
      <Table
        columns={editColumns}
        dataSource={data}
        components={components}
        rowKey={rowKey}
        pagination={false}
        {...props}
      // className={styles[`table-container`]}
      />
    </TableContext.Provider>
  );
})

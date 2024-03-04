import { Form, Input, Select, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { createContext, useContext, useEffect, memo, useRef, forwardRef } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { EditableCellProps, EditableRowProps, ConfigColumns, PropertyList } from '../interface';
import { EditType } from '../mapdata';

const EditableContext = createContext<FormInstance<any> | null>(null);
const TableContext = createContext<{
  onChange?: (i: any) => void;
  data?: Array<any>;
  rowKey: string;
  inputDoubleClick: (record: any) => void;
  inputBlur: (record: any) => void;
}>({
  rowKey: '',
  inputDoubleClick: function (record: any): void {
    throw new Error('Function not implemented.');
  },
  inputBlur: function (record: any): void {
    throw new Error('Function not implemented.');
  },
});

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  const { onChange, data, rowKey } = useContext(TableContext)!;
  return (
    <Form
      form={form}
      component={false}
      // disabled={data?.find(item => item[rowKey] === props[`data-row-key`])?.disabled}
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
  const inputRef = useRef<any>();
  useEffect(() => {
    if (record) {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }
  }, [record]);
  if (editable) {
    //@ts-ignore
    const { inputType, prop, disable } = editorConfig(record);
    const { inputDoubleClick, inputBlur } = useContext(TableContext)!;
    if (inputType === EditType.INPUT) {
      childNode = (
        <Form.Item
          key={`col-input-${dataIndex}`}
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              required: true,
              validator: (_props, value) => {
                var reg = new RegExp('^[a-zA-Z0-9_\u4e00-\u9fa5]+$');
                if (!value) {
                  return Promise.reject(`请填写属性名称！`);
                }
                if (!reg.test(value)) {
                  return Promise.reject('名称由中文、字母、数字、下划线组成。');
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          {record?.disable && record?.name ? (
            <span
              style={{ height: '27px', backgroundColor: '#505156', color: '#fff', borderRadius: '8px', padding: '8px' }}
              onClick={async () => {
                await inputDoubleClick(record);
                await inputRef.current.focus();
              }}
            >
              {record?.name} <EditOutlined />
            </span>
          ) : (
            <Input ref={inputRef} {...prop} onBlur={() => inputBlur(record)} disabled={disable} />
          )}
        </Form.Item>
      );
    } else if (inputType === EditType.SELECT) {
      childNode = (
        <Form.Item style={{ margin: 0 }} name={dataIndex} key={`col-select-${dataIndex}`}>
          <Select {...prop} options={prop?.options} disabled={disable} />
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
export const EditTable: React.FC<{
  columns: ConfigColumns[];
  dataSource: PropertyList[];
  onChange?: any;
  rowKey: string;
  inputDoubleClick?: any;
  inputBlur?: any;
  bordered?: boolean;
  showHeader?: boolean;
  rowSelection?: any;
}> = memo(({ columns, dataSource, onChange, rowKey, inputDoubleClick, inputBlur, ...props }) => {
  const data = dataSource;
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const editColumns = columns.map(col => {
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
    <TableContext.Provider value={{ data, onChange, rowKey, inputDoubleClick, inputBlur }}>
      <Table
        columns={editColumns}
        dataSource={data}
        components={components}
        rowKey={rowKey}
        pagination={false}
        {...props}
        scroll={{ y: 300 }}
        // className={styles[`table-container`]}
      />
    </TableContext.Provider>
  );
});

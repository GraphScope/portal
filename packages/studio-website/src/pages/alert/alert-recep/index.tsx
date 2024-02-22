import React, { useEffect, useState } from 'react';
import { Form, Input, Popconfirm, Table, Typography, Button, Switch, Space, Tooltip, Skeleton } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext } from '../useContext';
import { listReceivers, deleteReceiverById, updateReceiverById } from '../service';

interface Item {
  key: string;
  message: string;
  receiver_id: string;
  webhook_url: string;
  at_user_ids: string[];
  is_at_all: string;
  enable: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: any;
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === 'Switch' ? (
      <Switch defaultChecked={record.enable == 'False' ? false : true} />
    ) : inputType === 'Checkbox' ? (
      <Switch defaultChecked={record.is_at_all == 'False' ? false : true} />
    ) : (
      <Input />
    );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} key={record.receiver_id} style={{ margin: 0 }}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const { Link } = Typography;
type IReceiversProps = {};
const Receivers: React.FC<IReceiversProps> = props => {
  const [form] = Form.useForm();
  const { store, updateStore } = useContext();
  const { alertRecep, isReady } = store;
  const [editingKey, setEditingKey] = useState('');
  useEffect(() => {
    getAlertReceivers();
  }, []);
  /** 获取告警接收数据 */
  const getAlertReceivers = async () => {
    const res = await listReceivers();
    updateStore(draft => {
      draft.alertRecep = res || [];
      draft.isReady = true;
    });
  };
  /** 是否允许编辑 */
  const isEditing = (all: Item) => all.receiver_id === editingKey;
  const editStatus = (all: Partial<Item> & { key: React.Key }) => {
    const { receiver_id } = all;
    form.setFieldsValue({ webhook_url: '', at_user_ids: '', is_at_all: '', enable: '', ...all });
    setEditingKey(receiver_id as string);
  };

  const columns = [
    {
      title: <FormattedMessage id="Webhook Url" />,
      dataIndex: 'webhook_url',
      editable: true,
    },
    {
      title: <FormattedMessage id="At User Ids" />,
      dataIndex: 'at_user_ids',
      editable: true,
      render: (record: string[]) => <span>{record?.join()}</span>,
    },
    {
      title: <FormattedMessage id="Is At All" />,
      dataIndex: 'is_at_all',
      editable: true,
      render: (is_at_all: boolean) => {
        return <Switch checked={is_at_all} />;
      },
    },
    {
      title: <FormattedMessage id="Status" />,
      dataIndex: 'enable',
      editable: true,
      render: (enable: boolean, all: any) => (
        <Space>
          <Switch checked={enable} />
          {!enable ? 'disable' : 'enable'}
          {all.error_msg ? (
            <Tooltip title={all.error_msg}>
              <span>⚠️</span>
            </Tooltip>
          ) : null}
        </Space>
      ),
    },
    {
      title: <FormattedMessage id="Action" />,
      render: (_: any, all: Item) => {
        const { receiver_id } = all;
        const editable = isEditing(all);
        return editable ? (
          <span>
            <Link onClick={() => saveRowReceiver(all)} style={{ marginRight: 8 }}>
              <Button size="small" type="primary">
                Save
              </Button>
            </Link>
            <Popconfirm title="Sure to cancel?" onConfirm={() => setEditingKey('')}>
              <Button size="small">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Link disabled={editingKey !== ''} onClick={() => editStatus(all)}>
              <Button size="small" type="primary" ghost>
                Edit
              </Button>
            </Link>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={(event: any) => delRowReceiver(receiver_id)}
              onCancel={() => {}}
              okText={'yes'}
              cancelText={'no'}
            >
              <Button danger size="small" style={{ width: '80px' }}>
                delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => {
        return {
          record,
          inputType: col.dataIndex === 'is_at_all' ? 'Checkbox' : col.dataIndex === 'enable' ? 'Switch' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        };
      },
    };
  });
  /** 保存告警接收 */
  const saveRowReceiver = async (val: Item) => {
    const { receiver_id } = val;
    const { at_user_ids } = form.getFieldsValue();
    const data = { ...val, ...form.getFieldsValue(), at_user_ids: at_user_ids.split(',') };
    console.log('修改', data);
    setEditingKey('');
    await updateReceiverById(receiver_id, data);
    await getAlertReceivers();
  };
  /** 删除告警接收 */
  const delRowReceiver = async (receiver_id: string) => {
    console.log(receiver_id);
    await deleteReceiverById(receiver_id);
  };
  /** 创建告警接收 */
  const handleChange = () => {
    updateStore(draft => {
      draft.isEditRecep = true;
    });
  };
  return (
    <>
      <Button style={{ position: 'absolute', top: '-55px', right: '0px' }} type="primary" onClick={handleChange}>
        <FormattedMessage id="Create Alert Rules" />
      </Button>
      {!isReady ? (
        <Skeleton />
      ) : (
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            dataSource={JSON.parse(JSON.stringify(alertRecep))}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: () => setEditingKey(''),
            }}
            size="middle"
          />
        </Form>
      )}
    </>
  );
};

export default Receivers;

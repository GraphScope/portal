import React from 'react';
import { Button, Table, Tag } from 'antd';
import { useContext } from '../useContext';

type IAlertRecepProps = {};
const columns = [
  {
    title: 'WebhookUrl',
    dataIndex: 'webhookUrl',
    key: 'webhookUrl',
  },
  {
    title: '被@人的用户ID',
    key: 'id',
    dataIndex: 'id',
  },
  {
    title: '是否@所有人',
    dataIndex: 'isAll',
    key: 'isAll',
    render: (record: boolean) => <>{record ? '是' : '否'}</>,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (record: String) => <Tag color="magenta">{record}</Tag>,
  },
  {
    title: '操作',
    key: 'actions',
    render: (all: any) => {
      return (
        <Button danger size="small">
          Delete
        </Button>
      );
    },
  },
];

const AlertRecep: React.FC<IAlertRecepProps> = () => {
  const { store } = useContext();
  const { alertRecep } = store;
  return <Table columns={columns} dataSource={alertRecep} size="small" pagination={false} />;
};

export default AlertRecep;

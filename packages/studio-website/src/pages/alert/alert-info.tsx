import React from 'react';
import { Space, Table, Tag } from 'antd';
import { useContext } from './useContext';

type IAlertInfoProps = {};
const columns = [
  {
    title: '警报信息',
    dataIndex: 'info',
    key: 'info',
  },
  {
    title: '警报名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '严重性',
    dataIndex: 'severity',
    key: 'severity',
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    render: (status: string) => {
      let color = status === 'Magenta' ? 'geekblue' : 'green';
      return (
        <Tag color={color} key={status}>
          {status}
        </Tag>
      );
    },
  },
  {
    title: 'Action',
    key: 'action',
    render: record => (
      <Space size="middle">
        <a>Delete</a>
      </Space>
    ),
  },
];

const AlertInfo: React.FC<IAlertInfoProps> = () => {
  const { store } = useContext();
  const { alertInfo } = store;
  return <Table columns={columns} dataSource={alertInfo} size="small" />;
};

export default AlertInfo;

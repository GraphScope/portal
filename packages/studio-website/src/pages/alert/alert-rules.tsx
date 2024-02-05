import React from 'react';
import { Switch, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useContext, IAlertRule } from './useContext';

type IAlertRuleProps = {};
const columns: TableProps<IAlertRule>['columns'] = [
  {
    title: '警报名字',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '严重性',
    key: 'severity',
    dataIndex: 'severity',
    render: severity => {
      let color = severity === 'warning' ? 'geekblue' : 'green';
      return (
        <Tag color={color} key={severity}>
          {severity}
        </Tag>
      );
    },
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '报警条件',
    dataIndex: 'condition',
    key: 'condition',
  },
  {
    title: '报警频率',
    dataIndex: 'condition',
    key: 'condition',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: record => (
      <>
        <Switch defaultChecked={record} />
        enable
        {/* disenable */}
      </>
    ),
  },
];

const AlertRule: React.FC<IAlertRuleProps> = () => {
  const { store } = useContext();
  const { alertRule } = store;
  return <Table columns={columns} dataSource={alertRule} size="middle" />;
};

export default AlertRule;

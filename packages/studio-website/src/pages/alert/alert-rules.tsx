import React from 'react';
import { Switch, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext, IAlertRule } from './useContext';

type IAlertRuleProps = {};
const columns: TableProps<IAlertRule>['columns'] = [
  {
    title: <FormattedMessage id="Alert Name" />,
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: <FormattedMessage id="Severity" />,
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
    title: <FormattedMessage id="Type" />,
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: <FormattedMessage id="Alert Conditions" />,
    dataIndex: 'condition',
    key: 'condition',
  },
  {
    title: <FormattedMessage id="Alert Frequency" />,
    dataIndex: 'condition',
    key: 'condition',
  },
  {
    title: <FormattedMessage id="Status" />,
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

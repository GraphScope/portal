import React, { useEffect } from 'react';
import { Switch, Table, Tag, Button } from 'antd';
import type { TableProps } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext, IAlertRule } from '../useContext';
import { listAlertRules } from '../service';

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
    dataIndex: 'frequency',
    key: 'frequency',
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
  const { store, updateStore } = useContext();
  const { alertRule } = store;
  useEffect(() => {
    listAlertRules().then(res => {
      updateStore(draft => {
        draft.alertRule = res || [];
      });
    });
  }, []);
  /**
   * 告警接收内容区组件切换
   */
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
      <Table columns={columns} dataSource={alertRule} size="middle" />
    </>
  );
};

export default AlertRule;

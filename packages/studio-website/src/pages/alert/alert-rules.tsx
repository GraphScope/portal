import React, { useEffect } from 'react';
import { Switch, Table, Tag, Skeleton } from 'antd';
import type { TableProps } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext, IAlertRule } from './useContext';
import { listAlertRules, updateAlertRuleByName, deleteAlertRuleByName } from './service';

type IAlertRuleProps = {};

const AlertRule: React.FC<IAlertRuleProps> = () => {
  const { store, updateStore } = useContext();
  const { alertRule, isReady } = store;
  useEffect(() => {
    listAlertRules().then(res => {
      updateStore(draft => {
        draft.alertRule = res || [];
        draft.isReady = true;
      });
    });
  }, []);
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
      dataIndex: 'metric_type',
      key: 'metric_type',
    },
    {
      title: <FormattedMessage id="Alert Conditions" />,
      dataIndex: 'conditions_desription',
      key: 'conditions_desription',
    },
    {
      title: <FormattedMessage id="Alert Frequency" />,
      dataIndex: 'frequency',
      key: 'frequency',
    },
    {
      title: <FormattedMessage id="Status" />,
      dataIndex: 'enable',
      key: 'enable',
      render: (record: boolean, all: { enable: boolean; name: string }) => (
        <>
          <Switch checked={record} onChange={() => handleChange(all)} /> {record ? 'disable' : 'enable'}
        </>
      ),
    },
  ];
  const handleChange = async (all: { enable: boolean; name: string }) => {
    const { enable, name } = all;
    !enable ? await updateAlertRuleByName(name) : deleteAlertRuleByName(name);
  };
  return <>{!isReady ? <Skeleton /> : <Table columns={columns} dataSource={alertRule} size="middle" />}</>;
};

export default AlertRule;

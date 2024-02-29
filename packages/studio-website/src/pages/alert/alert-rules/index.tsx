import React, { useEffect, useState } from 'react';
import { Form, Popconfirm, Table, Button, Switch, Space, Tag, Skeleton, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import { listAlertRules, deleteAlertRuleByName } from '../service';
import EditRule from './edit-rule';
export type IAlertRule = {
  key: string;
  name: string;
  severity: string;
  metric_type: string;
  conditions_desription: string;
  frequency: number;
  enable: boolean;
};
type Istate = {
  alertRule: IAlertRule[];
  isReady: boolean;
  isEditRules: boolean;
  ruleData: IAlertRule;
};
type IAlertRuleProps = {};
const AlertRule: React.FC<IAlertRuleProps> = props => {
  const [form] = Form.useForm();
  const [state, updateState] = useState<Istate>({
    alertRule: [],
    isReady: false,
    isEditRules: false,
    //@ts-ignore
    ruleData: {},
  });
  const { alertRule, isReady, isEditRules, ruleData } = state;
  useEffect(() => {
    getAlertRules();
  }, []);
  /** 获取告警规则数据 */
  const getAlertRules = async () => {
    const res = await listAlertRules();
    updateState(preset => {
      return {
        ...preset,
        isReady: true,
        alertRule: res || [],
      };
    });
  };
  /** 删除告警规则 */
  const delRowRules = async (name: string) => {
    const res = await deleteAlertRuleByName(name);
    await getAlertRules();
    await message.success(res);
  };

  const columns = [
    {
      title: <FormattedMessage id="Alert Name" />,
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: <FormattedMessage id="Severity" />,
      key: 'severity',
      dataIndex: 'severity',
      editable: true,
      render: (severity: string) => {
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
      editable: true,
    },
    {
      title: <FormattedMessage id="Alert Conditions" />,
      dataIndex: 'conditions_desription',
      key: 'conditions_desription',
      editable: true,
    },
    {
      title: <FormattedMessage id="Alert Frequency" />,
      dataIndex: 'frequency',
      key: 'frequency',
      editable: true,
    },
    {
      title: <FormattedMessage id="Status" />,
      dataIndex: 'enable',
      key: 'enable',
      editable: true,
      render: (record: boolean) => (
        <>
          {/* <Switch checked={record} disabled /> {record ? 'disable' : 'enable'} */}
          <Tag>{record ? 'enable' : 'disable'}</Tag>
        </>
      ),
    },
    {
      title: <FormattedMessage id="Action" />,
      width: 150,
      render: (_: any, all: IAlertRule) => {
        const { name } = all;
        return (
          <Space>
            <Button
              size="small"
              type="primary"
              ghost
              onClick={() =>
                updateState(preset => {
                  return {
                    ...preset,
                    ruleData: all,
                    isEditRules: true,
                  };
                })
              }
            >
              Edit
            </Button>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={(event: any) => delRowRules(name)}
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

  return (
    <>
      {!isReady ? (
        <Skeleton />
      ) : (
        <Form form={form} component={false}>
          <Table
            dataSource={alertRule}
            //@ts-ignores
            columns={columns}
            size="middle"
          />
        </Form>
      )}
      {isEditRules && (
        <EditRule
          isEditRules={isEditRules}
          ruleData={ruleData}
          handelChange={() => {
            //@ts-ignore
            updateState(preset => {
              return {
                ...preset,
                isEditRules: false,
                ruleData: {},
              };
            });
            getAlertRules();
          }}
        />
      )}
    </>
  );
};

export default AlertRule;

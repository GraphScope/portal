import React, { useEffect, useState } from 'react';
import { Form, Popconfirm, Table, Button, Space, Tag, Skeleton, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import { listAlertRules, deleteAlertRuleByName } from '../service';
// import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import EditRule from './edit-rule';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
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
const AlertRule: React.FC = () => {
  const [form] = Form.useForm();
  const [state, updateState] = useState<Istate>({
    alertRule: [],
    isReady: false,
    isEditRules: false,
    //@ts-ignore
    ruleData: {},
  });
  const { alertRule, isReady, isEditRules, ruleData } = state;
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
      title: <FormattedMessage id="Alert name" />,
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
      title: <FormattedMessage id="Alert conditions" />,
      dataIndex: 'conditions_desription',
      key: 'conditions_desription',
      editable: true,
    },
    {
      title: <FormattedMessage id="Alert frequency" />,
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
          <Tag color={record ? 'green' : 'red'}>{record ? 'enable' : 'disable'}</Tag>
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
              type="link"
              size="small"
              onClick={() =>
                updateState(preset => {
                  return {
                    ...preset,
                    ruleData: all,
                    isEditRules: true,
                  };
                })
              }
              icon={<FontAwesomeIcon icon={faPenToSquare} />}
            />
            <Popconfirm
              title={<FormattedMessage id="Are you sure to delete this task?" />}
              onConfirm={() => delRowRules(name)}
              onCancel={() => {}}
              okText={<FormattedMessage id="Yes" />}
              cancelText={<FormattedMessage id="No" />}
            >
              <Button type="text" danger size="small" icon={<FontAwesomeIcon icon={faTrashCan} />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  useEffect(() => {
    getAlertRules();
  }, []);
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

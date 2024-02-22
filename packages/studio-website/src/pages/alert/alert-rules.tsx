import React, { useEffect, useState } from 'react';
import { Form, Input, Popconfirm, Table, Typography, Button, Switch, Space, Tag, Skeleton, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext } from './useContext';
import { listAlertRules, deleteAlertRuleByName, updateAlertRuleByName } from './service';
import { handleOptions } from '@/pages/utils';
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: any;
  record: IAlertRule;
  index: number;
  children: React.ReactNode;
}
export type IAlertRule = {
  key: string;
  name: string;
  severity: string;
  metric_type: string;
  conditions_desription: string;
  frequency: number;
  enable: boolean;
};
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
  const inputNode = inputType === 'Switch' ? <Switch defaultChecked={record.enable} /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const { Link } = Typography;
type IAlertRuleProps = {};
const AlertRule: React.FC<IAlertRuleProps> = props => {
  const [form] = Form.useForm();
  const { updateStore } = useContext();
  const [state, updateState] = useState({
    editingKey: '',
    alertRule: [],
    isReady: false,
  });
  const { editingKey, alertRule, isReady } = state;
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
  /** 保存告警规则 */
  const saveRowRules = async (val: IAlertRule) => {
    const { name } = val;
    const data = form.getFieldsValue();
    updateState(preset => {
      return {
        ...preset,
        editingKey: '',
      };
    });
    const res = await updateAlertRuleByName(name, data);
    await getAlertRules();
    await message.success(res);
  };
  /** 删除告警规则 */
  const delRowRules = async (name: string) => {
    const res = await deleteAlertRuleByName(name);
    await getAlertRules();
    await message.success(res);
  };
  /** 创建告警规则 */
  const handleChange = () => {
    updateStore(draft => {
      draft.isEditRecep = true;
    });
  };
  /** 是否允许编辑 */
  const isEditing = (all: IAlertRule) => all.name === editingKey;
  const editStatus = (all: Partial<IAlertRule> & { key: React.Key }) => {
    const { name } = all;
    form.setFieldsValue({ webhook_url: '', at_user_ids: '', is_at_all: '', enable: '', ...all });
    updateState(preset => {
      return {
        ...preset,
        editingKey: name as string,
      };
    });
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
          <Switch checked={record} /> {record ? 'disable' : 'enable'}
        </>
      ),
    },
    {
      title: <FormattedMessage id="Action" />,
      width: 150,
      render: (_: any, all: IAlertRule) => {
        const { name } = all;
        const editable = isEditing(all);
        return editable ? (
          <span>
            <Link onClick={() => saveRowRules(all)} style={{ marginRight: 8 }}>
              <Button size="small" type="primary">
                Save
              </Button>
            </Link>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={() =>
                updateState(preset => {
                  return {
                    ...preset,
                    editingKey: '',
                  };
                })
              }
            >
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

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IAlertRule) => {
        return {
          record,
          inputType: col.dataIndex === 'enable' ? 'Switch' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        };
      },
    };
  });
  console.log(alertRule);

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
            dataSource={JSON.parse(JSON.stringify(alertRule))}
            //@ts-ignores
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: () =>
                updateState(preset => {
                  return {
                    ...preset,
                    editingKey: '',
                  };
                }),
            }}
            size="middle"
          />
        </Form>
      )}
    </>
  );
};

export default AlertRule;

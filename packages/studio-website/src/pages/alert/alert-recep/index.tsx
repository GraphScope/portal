import React, { useEffect, useState } from 'react';
import { Form, Popconfirm, Table, Button, Switch, Space, Tooltip, Skeleton, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import CreateRecep from './create-resep';
import { listReceivers, deleteReceiverById, updateReceiverById } from '../service';
export interface Item {
  key: string;
  message: string;
  receiver_id: string;
  webhook_url: string;
  at_user_ids: string[];
  is_at_all: boolean;
  enable: boolean;
  type: string;
}

type IReceiversProps = {};
const Receivers: React.FC<IReceiversProps> = props => {
  const [form] = Form.useForm();
  const [state, updateState] = useState<{
    alertRecep: Item[];
    isReady: boolean;
    isEditRecep: boolean;
    editData: Item;
  }>({
    alertRecep: [],
    isReady: false,
    isEditRecep: false,
    //@ts-ignore
    editData: {},
  });
  const { isReady, alertRecep, isEditRecep, editData } = state;
  useEffect(() => {
    getAlertReceivers();
  }, []);
  /** 获取告警接收数据 */
  const getAlertReceivers = async () => {
    const res = await listReceivers();
    updateState(preset => {
      return {
        ...preset,
        alertRecep: res || [],
        isReady: true,
      };
    });
  };
  /** 保存告警接收 */
  const saveRowReceiver = async (val: Item) => {
    const { receiver_id } = val;
    const { at_user_ids } = form.getFieldsValue();
    const userid = Array.isArray(at_user_ids) ? at_user_ids : at_user_ids.split(',');
    const data = { ...val, ...form.getFieldsValue(), at_user_ids: userid };
    const res = await updateReceiverById(receiver_id, data);
    await getAlertReceivers();
    await message.success(res);
  };
  /** 删除告警接收 */
  const delRowReceiver = async (receiver_id: string) => {
    const res = await deleteReceiverById(receiver_id);
    await getAlertReceivers();
    await message.success(res);
  };
  /** 创建告警接收 */
  const handleChange = () => {
    updateState(preset => {
      return {
        ...preset,
        isEditRecep: true,
      };
    });
  };

  const columns = [
    {
      title: <FormattedMessage id="Webhook Url" />,
      dataIndex: 'webhook_url',
      editable: true,
      key: 'webhook_url',
    },
    {
      title: <FormattedMessage id="At User Ids" />,
      dataIndex: 'at_user_ids',
      editable: true,
      key: 'at_user_ids',
      render: (record: string[]) => <span>{record?.join()}</span>,
    },
    {
      title: <FormattedMessage id="Is At All" />,
      dataIndex: 'is_at_all',
      editable: true,
      key: 'is_at_all',
      render: (is_at_all: boolean) => {
        return <Switch checked={is_at_all} disabled />;
      },
    },
    {
      title: <FormattedMessage id="Status" />,
      dataIndex: 'enable',
      editable: true,
      key: 'enable',
      render: (enable: boolean, all: any) => (
        <Space>
          <Switch checked={enable} disabled />
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
      key: 'actions',
      render: (_: any, all: Item) => {
        const { receiver_id } = all;
        console.log(all);
        return (
          <Space>
            <Button
              size="small"
              type="primary"
              ghost
              onClick={() => {
                updateState(preset => {
                  return {
                    ...preset,
                    editData: all,
                    isEditRecep: true,
                  };
                });
              }}
            >
              Edit
            </Button>
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
  let Content = (
    <>
      {isEditRecep && (
        <CreateRecep
          isCreateRecep={isEditRecep}
          editDatas={editData}
          handelChange={(val: boolean) => {
            //@ts-ignore
            updateState(preset => {
              return {
                ...preset,
                isEditRecep: val,
                editData: {},
              };
            });
            getAlertReceivers();
          }}
        />
      )}
    </>
  );

  return (
    <>
      {Content}
      <Button style={{ position: 'absolute', top: '-55px', right: '0px' }} type="primary" onClick={handleChange}>
        <FormattedMessage id="Create Alert Recep" />
      </Button>
      {!isReady ? (
        <Skeleton />
      ) : (
        <Table
          dataSource={alertRecep}
          //@ts-ignores
          columns={columns}
          size="middle"
        />
      )}
    </>
  );
};

export default Receivers;

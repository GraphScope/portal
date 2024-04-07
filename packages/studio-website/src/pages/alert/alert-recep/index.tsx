import React, { useEffect, useState } from 'react';
import { Popconfirm, Table, Button, Space, Tag, Skeleton, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import CreateRecep from './create-resep';
import { listReceivers, deleteReceiverById } from '../service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
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

const Receivers: React.FC = () => {
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
  useEffect(() => {
    getAlertReceivers();
  }, []);
  const columns = [
    {
      title: <FormattedMessage id="Webhook Url" />,
      dataIndex: 'webhook_url',
      editable: true,
      key: 'webhook_url',
    },
    {
      title: <FormattedMessage id="@user IDs" />,
      dataIndex: 'at_user_ids',
      editable: true,
      key: 'at_user_ids',
      render: (record: string[]) => <span>{record?.join()}</span>,
    },
    {
      title: <FormattedMessage id="@all?" />,
      dataIndex: 'is_at_all',
      editable: true,
      key: 'is_at_all',
      render: (is_at_all: boolean) => <Tag color={is_at_all ? 'green' : 'red'}>{is_at_all ? 'enable' : 'disable'}</Tag>,
    },
    {
      title: <FormattedMessage id="Status" />,
      dataIndex: 'enable',
      editable: true,
      key: 'enable',
      render: (enable: boolean) => <Tag color={enable ? 'green' : 'red'}>{enable ? 'enable' : 'disable'}</Tag>,
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
              type="link"
              icon={<FontAwesomeIcon icon={faPenToSquare} />}
              onClick={() => {
                updateState(preset => {
                  return {
                    ...preset,
                    editData: all,
                    isEditRecep: true,
                  };
                });
              }}
            />
            <Popconfirm
              title={<FormattedMessage id="Are you sure to delete this task?" />}
              onConfirm={() => delRowReceiver(receiver_id)}
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
        <FormattedMessage id="Create alert receiver" />
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

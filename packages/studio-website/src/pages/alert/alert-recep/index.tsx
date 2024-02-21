import React, { useEffect } from 'react';
import { Button, Table, Tag } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext } from '../useContext';
import { listReceivers } from '../service';
type IAlertRecepProps = {};

const AlertRecep: React.FC<IAlertRecepProps> = () => {
  const { store, updateStore } = useContext();
  const { alertRecep } = store;
  const columns = [
    {
      title: <FormattedMessage id="WebhookUrl" />,
      dataIndex: 'webhookUrl',
      key: 'webhookUrl',
    },
    {
      title: <FormattedMessage id="At User Ids" />,
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: <FormattedMessage id="Is At All" />,
      dataIndex: 'isAll',
      key: 'isAll',
      render: (record: boolean) => <>{record ? '是' : '否'}</>,
    },
    {
      title: <FormattedMessage id="Status" />,
      dataIndex: 'status',
      key: 'status',
      render: (record: String) => <Tag color="magenta">{record}</Tag>,
    },
    {
      title: <FormattedMessage id="Action" />,
      key: 'actions',
      render: (all: any) => {
        return (
          <Button danger size="small">
            Delete
          </Button>
        );
      },
    },
  ];
  useEffect(() => {
    listReceivers().then(res => {
      updateStore(draft => {
        draft.alertRecep = res || [];
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
      <Table columns={columns} dataSource={alertRecep} size="small" pagination={false} />
    </>
  );
};

export default AlertRecep;

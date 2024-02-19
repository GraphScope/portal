import React, { useEffect } from 'react';
import { Space, Table, Tag, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext } from './useContext';
import { listAlertMessages } from './service';

type IAlertInfoProps = {};

const AlertInfo: React.FC<IAlertInfoProps> = () => {
  const { store, updateStore } = useContext();
  const { selectedRowKeys, alertInfo } = store;

  useEffect(() => {
    listAlertMessages().then(res => {
      updateStore(draft => {
        draft.alertInfo = res || [];
      });
    });
  }, []);
  const columns = [
    {
      title: <FormattedMessage id="Alert Information" />,
      dataIndex: 'info',
      key: 'info',
    },
    {
      title: <FormattedMessage id="Alert Name" />,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <FormattedMessage id="Severity" />,
      dataIndex: 'severity',
      key: 'severity',
    },
    {
      title: <FormattedMessage id="Status" />,
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => {
        let color = status === 'Magenta' ? 'geekblue' : 'green';
        return (
          <Tag color={color} key={status}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: <FormattedMessage id="Action" />,
      key: 'action',
      render: (record: any) => {
        return (
          <Space size="middle">
            {record.status !== 'dealing' && (
              <Button type="primary" ghost>
                Dealing
              </Button>
            )}
            {record.status !== 'solved' && <Button className="alert-solved">Solved</Button>}
          </Space>
        );
      },
    },
  ];
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: string[]) => {
      updateStore(draft => {
        draft.selectedRowKeys = newSelectedRowKeys;
      });
    },
  };
  return (
    <Table
      // @ts-ignore
      rowSelection={rowSelection}
      columns={columns}
      dataSource={alertInfo}
      size="small"
      pagination={{
        defaultCurrent: 1,
        defaultPageSize: 10,
        showTotal: undefined,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100, 200, 500, 1000],
      }}
    />
  );
};

export default AlertInfo;

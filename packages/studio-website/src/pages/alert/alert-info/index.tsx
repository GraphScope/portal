import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Button, Skeleton } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext } from '../useContext';
import InquireMessage from './inquire-message';
import { handleOptions } from '@/pages/utils';
import { listAlertMessages, updateAlertMessages } from '../service';
import type { UpdateAlertMessagesRequest } from '@graphscope/studio-server';

type IAlertInfoProps = {};
type IState = {
  metricTypeOptions: { value: string; text: string }[];
  severityTypeOptions: { value: string; text: string }[];
  isReady: boolean;
};
const AlertInfo: React.FC<IAlertInfoProps> = () => {
  const { store, updateStore } = useContext();
  const { selectedRowKeys, alertInfo, defaultFilteredValue } = store;
  const [state, updateState] = useState<IState>({
    metricTypeOptions: [],
    severityTypeOptions: [],
    isReady: false,
  });
  const { metricTypeOptions, severityTypeOptions, isReady } = state;
  useEffect(() => {
    getListAlertMessages();
  }, []);
  const getListAlertMessages = async () => {
    const data = await listAlertMessages({});
    updateStore(draft => {
      draft.alertInfo = data || [];
    });
    updateState(preset => {
      return {
        ...preset,
        metricTypeOptions: handleOptions(data, 'severity'),
        severityTypeOptions: handleOptions(data, 'metric_type'),
        isReady: true,
      };
    });
  };
  const handleChange = async (params: UpdateAlertMessagesRequest) => {
    await updateAlertMessages(params);
    getListAlertMessages();
  };
  const columns = [
    {
      title: <FormattedMessage id="Alert Information" />,
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: <FormattedMessage id="Alert Name" />,
      dataIndex: 'alert_name',
      key: 'alert_name',
    },
    {
      title: <FormattedMessage id="Severity" />,
      dataIndex: 'severity',
      key: 'severity',
      defaultFilteredValue: defaultFilteredValue,
      filterMultiple: false,
      filters: severityTypeOptions,
      onFilter: (value: string, record: { severity: string | string[] }) => record.severity.indexOf(value) === 0,
    },
    {
      title: <FormattedMessage id="Metric" />,
      dataIndex: 'metric_type',
      key: 'metric_type',
      defaultFilteredValue: defaultFilteredValue,
      filterMultiple: false,
      filters: metricTypeOptions,
      onFilter: (value: string, record: { metric_type: string | string[] }) => record.metric_type.indexOf(value) === 0,
    },
    {
      title: <FormattedMessage id="Trigger Time" />,
      key: 'trigger_time',
      dataIndex: 'trigger_time',
    },
    {
      title: <FormattedMessage id="Status" />,
      key: 'status',
      dataIndex: 'status',
      defaultFilteredValue: defaultFilteredValue,
      filterMultiple: false,
      filters: [
        { value: 'All', text: 'All' },
        { value: 'unsolved', text: 'Unsolved' },
        { value: 'solved', text: 'Solved' },
        { value: 'dealing', text: 'Dealing' },
      ],
      onFilter: (value: string, record: { status: string | string[] }) => record.status.indexOf(value) === 0,
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
              <Button type="primary" ghost onClick={() => handleChange({ ...record, status: 'dealing' })}>
                Dealing
              </Button>
            )}
            {record.status !== 'solved' && (
              <Button onClick={() => handleChange({ ...record, status: 'solved' })}>Solved</Button>
            )}
            {record.status !== 'unsolved' && (
              <Button danger onClick={() => handleChange({ ...record, status: 'unsolved' })}>
                Unsolved
              </Button>
            )}
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
    <>
      <InquireMessage />
      {!isReady ? (
        <Skeleton />
      ) : (
        <Table
          style={{ marginTop: '16px' }}
          // @ts-ignore
          rowSelection={rowSelection}
          // @ts-ignore
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
      )}
    </>
  );
};

export default AlertInfo;

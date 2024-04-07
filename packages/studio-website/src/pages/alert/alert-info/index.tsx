import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Button, Skeleton } from 'antd';
import { FormattedMessage } from 'react-intl';
import DateFilter from './date-filter';
import { listAlertMessages, updateAlertMessages } from '../service';
import type { UpdateAlertMessagesRequest } from '@graphscope/studio-server';
export type IalertInfo = {
  key: string;
  info: string;
  name: number;
  severity: string;
  status: string[];
};
type IState = {
  /** 属性选择 */
  metricTypeOptions: { value: string; text: string }[];
  /** 严重性选择 */
  severityTypeOptions: { value: string; text: string }[];
  isReady: boolean;
  /** 列表数据 */
  alertInfo: IalertInfo[];
  /** 选中列表值ID */
  selectedRowKeys: string[];
  /** 选中列表值 */
  selectedRows: string[];
  filterValues: {
    metric_type?: string[];
    severity?: string[];
    status?: string[];
  };
};
/** 处理alert 属性options方法 */
const handleOptions = (data: { [x: string]: string }[], type: string) => {
  return [{ value: '', text: 'All' }].concat(
    data.map((item: { [x: string]: string }) => {
      const text = item[type].substring(0, 1).toUpperCase() + item[type].substring(1);
      return { value: item[type], text };
    }),
  );
};
const AlertInfo: React.FC = () => {
  const [state, updateState] = useState<IState>({
    metricTypeOptions: [],
    severityTypeOptions: [],
    isReady: false,
    alertInfo: [],
    selectedRowKeys: [],
    selectedRows: [],
    filterValues: {
      metric_type: [''],
      severity: [''],
      status: [''],
    },
  });
  const { metricTypeOptions, severityTypeOptions, isReady, alertInfo, selectedRowKeys, selectedRows, filterValues } =
    state;
  const getListAlertMessages = async () => {
    const data = await listAlertMessages({});
    updateState(preset => {
      return {
        ...preset,
        metricTypeOptions: handleOptions(data, 'severity'),
        severityTypeOptions: handleOptions(data, 'metric_type'),
        isReady: true,
        alertInfo: data || [],
      };
    });
  };
  const handleChange = async (params: UpdateAlertMessagesRequest) => {
    const data = {
      messages: [
        {
          ...params,
        },
      ],
      batch_status: params.batch_status,
      batch_delete: false,
    };
    await updateAlertMessages(data);
    getListAlertMessages();
  };
  useEffect(() => {
    getListAlertMessages();
  }, []);
  const columns = [
    {
      title: <FormattedMessage id="Alert information" />,
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: <FormattedMessage id="Alert name" />,
      dataIndex: 'alert_name',
      key: 'alert_name',
    },
    {
      title: <FormattedMessage id="Severity" />,
      dataIndex: 'severity',
      key: 'severity',
      filteredValue: filterValues.severity || null,
      filterMultiple: false,
      filters: severityTypeOptions,
      onFilter: (value: string, record: { severity: string | string[] }) => record.severity.indexOf(value) === 0,
    },
    {
      title: <FormattedMessage id="Metrics" />,
      dataIndex: 'metric_type',
      key: 'metric_type',
      filteredValue: filterValues.metric_type || null,
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
      filteredValue: filterValues.status || null,
      filterMultiple: false,
      filters: [
        { value: '', text: 'All' },
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
              <Button type="primary" ghost onClick={() => handleChange({ ...record, batch_status: 'dealing' })}>
                Dealing
              </Button>
            )}
            {record.status !== 'solved' && (
              <Button onClick={() => handleChange({ ...record, batch_status: 'solved' })}>Solved</Button>
            )}
            {record.status !== 'unsolved' && (
              <Button danger onClick={() => handleChange({ ...record, batch_status: 'unsolved' })}>
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
    onChange: (newSelectedRowKeys: string[], selectedRows: any) => {
      updateState(preset => {
        return {
          ...preset,
          selectedRowKeys: newSelectedRowKeys,
          selectedRows,
        };
      });
    },
  };

  return (
    <>
      <DateFilter
        selectedRowKeys={selectedRowKeys}
        selectedRows={selectedRows}
        /** 查询修改列表 */
        searchChange={val => {
          console.log(val);
          //@ts-ignore
          updateState(preset => {
            return {
              ...preset,
              alertInfo: val,
            };
          });
        }}
        /**查询重置 */
        resetChange={() => {
          updateState(preset => {
            return {
              ...preset,
              selectedRowKeys: [],
              defaultFilteredValue: '',
              filterValues: {
                metric_type: [''],
                severity: [''],
                status: [''],
              },
            };
          });
          getListAlertMessages();
        }}
      />
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
          onChange={(pagination, filters) => {
            const { metric_type, severity, status } = filters;
            //@ts-ignore
            updateState(preset => {
              return {
                ...preset,
                filterValues: {
                  metric_type: metric_type,
                  severity: severity,
                  status: status,
                },
              };
            });
          }}
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

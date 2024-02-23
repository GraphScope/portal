import { useEffect, useState } from 'react';
import { Table, Popover, Tag, Flex, Space } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import Action from './action';
import { listJobs, IJobType } from '../service';

/** 定义状态选项 */
const STATUSOPTIONS = [
  { value: 'All', text: 'All' },
  { value: 'Running', text: 'Running' },
  { value: 'CANCELLED', text: 'Cancelled' },
  { value: 'Failed', text: 'Failed' },
  { value: 'Succeed', text: 'Succeed' },
  { value: 'Waiting', text: 'Waiting' },
];
/** 定义job类型 */
const JOBOPTIONS = [
  { value: 'All', text: 'All' },
  { value: 'Data Import', text: 'Data Import' },
];
/** job状态显示图标 */
const statusColor = [
  {
    type: 'RUNNING',
    color: 'blue',
    icon: <SyncOutlined spin />,
  },
  {
    type: 'CANCELLED',
    color: 'grey',
    icon: <MinusCircleOutlined />,
  },
  {
    type: 'SUCCESS',
    color: 'green',
    icon: <CheckCircleOutlined />,
  },
  {
    type: 'FAILED',
    color: 'red',
    icon: <CloseCircleOutlined />,
  },
  {
    type: 'WAITING',
    color: 'orange',
    icon: <ExclamationCircleOutlined />,
  },
];

interface IInfoListProps {}
const InfoList: React.FunctionComponent<IInfoListProps> = props => {
  const [jobsList, setJobsList] = useState([]);
  useEffect(() => {
    getJobList();
  }, []);
  /** 获取jobs列表数据 */
  const getJobList = async () => {
    const res = await listJobs();
    setJobsList(res);
  };
  /** detail Popover 展示*/
  const handleChange = (detail: { [s: string]: unknown } | ArrayLike<unknown>) => {
    const data = Object.entries(detail);
    return (
      <Flex vertical gap={2}>
        {data.map(item => {
          return (
            <Tag style={{ display: 'block' }}>
              <Space>
                <span>{item[0]}:</span>
                <span>{item[1]}</span>
              </Space>
            </Tag>
          );
        })}
      </Flex>
    );
  };

  const columns = [
    { title: 'Job Id', dataIndex: 'job_id', key: 'job_id', ellipsis: true },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: JOBOPTIONS,
      onFilter: (value: string, record: IJobType) => record.type.startsWith(value),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: STATUSOPTIONS,
      onFilter: (value: string, record: IJobType) => record.status.startsWith(value),
      render: (record: string) => {
        return (
          <>
            {statusColor.map(item => {
              const { type, color, icon } = item;
              return (
                <>
                  {record == type && (
                    <Tag icon={icon} color={color}>
                      {record.substring(0, 1) + record.substring(1).toLowerCase()}
                    </Tag>
                  )}
                </>
              );
            })}
          </>
        );
      },
    },
    {
      title: 'starttime',
      key: 'start_time',
      dataIndex: 'start_time',
      ellipsis: true,
    },
    {
      title: 'endtime',
      key: 'end_time',
      dataIndex: 'end_time',
      ellipsis: true,
    },
    {
      title: 'Detail',
      dataIndex: 'detail',
      key: 'detail',
      render: (record: any) => <Popover content={() => handleChange(record)}>查询详情</Popover>,
    },
    {
      title: 'Action',
      key: 'actions',
      render: (record: IJobType) => <Action {...record} onChange={() => getJobList()} />,
    },
  ];
  return (
    <>
      <Table
        dataSource={jobsList}
        //@ts-ignores
        columns={columns}
      />
    </>
  );
};

export default InfoList;

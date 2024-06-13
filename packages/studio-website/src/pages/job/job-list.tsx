import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Table, Tag, Flex, message, Button, Popconfirm } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { history } from 'umi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
// import Action from './action';
import { listJobs, IJobType, deleteJobById } from './service';
import dayjs from 'dayjs';

interface JobOption {
  value: string;
  text: string;
}
/** 定义状态选项 */
const STATUSOPTIONS: JobOption[] = [
  { value: '', text: 'All' },
  { value: 'RUNNING', text: 'Running' },
  { value: 'CANCELLED', text: 'Cancelled' },
  { value: 'FAILED', text: 'Failed' },
  { value: 'SUCCESS', text: 'Succeed' },
  { value: 'WAITING', text: 'Waiting' },
];
/** 定义job类型 */
let JOBOPTIONS: JobOption[] = [{ value: '', text: 'All' }];
/** job状态显示图标 */
const JOB_TYPE_ICONS: Record<string, JSX.Element> = {
  RUNNING: <SyncOutlined spin />,
  CANCELLED: <MinusCircleOutlined />,
  SUCCESS: <CheckCircleOutlined />,
  FAILED: <CloseCircleOutlined />,
  WAITING: <ExclamationCircleOutlined />,
};
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'RUNNING':
      return 'blue';
    case 'CANCELLED':
      return 'grey';
    case 'SUCCESS':
      return 'green';
    case 'FAILED':
      return 'red';
    case 'WAITING':
      return 'orange';
    default:
      return '';
  }
};
const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const JobsList: FC = () => {
  const [jobsList, setJobsList] = useState<IJobType[]>([]);
  /** 获取jobs列表数据 */
  const getJobList = useCallback(async () => {
    const res = await listJobs();
    setJobsList(res);
    /** 接口获取类型值 */
    JOBOPTIONS = JOBOPTIONS.concat(
      //@ts-ignore
      res.map(item => {
        return {
          value: item.type,
          text: item.type,
        };
      }),
    );
    /** 过滤相同属性 */
    JOBOPTIONS = JOBOPTIONS.filter((item, index) => JOBOPTIONS.findIndex(i => i.value === item.value) === index);
  }, []);

  useEffect(() => {
    getJobList();
  }, []);

  /** 删除job */
  const handleDeleteJob = useCallback(async (job_id: string) => {
    const res = await deleteJobById(job_id);
    message.success(res);
    getJobList();
  }, []);

  const columns = [
    {
      title: <FormattedMessage id="Job ID" />,
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: <FormattedMessage id="Type" />,
      dataIndex: 'type',
      key: 'type',
      filters: JOBOPTIONS,
      filterMultiple: false,
      onFilter: (value: string, record: IJobType) => record.type.startsWith(value),
    },
    {
      title: <FormattedMessage id="Status" />,
      dataIndex: 'status',
      key: 'status',
      filters: STATUSOPTIONS,
      filterMultiple: false,
      onFilter: (value: string, record: IJobType) => record.status.startsWith(value),
      render: (status: string) => (
        <Tag icon={JOB_TYPE_ICONS[status]} color={getStatusColor(status)}>
          {capitalizeFirstLetter(status.toLowerCase())}
        </Tag>
      ),
    },
    {
      title: <FormattedMessage id="Start time" />,
      key: 'start_time',
      dataIndex: 'start_time',
      sorter: (a: IJobType, b: IJobType) => dayjs(a.start_time).valueOf() - dayjs(b.start_time).valueOf(),
    },
    {
      title: <FormattedMessage id="End time" />,
      key: 'end_time',
      dataIndex: 'end_time',
      sorter: (a: IJobType, b: IJobType) => dayjs(a.end_time).valueOf() - dayjs(b.end_time).valueOf(),
    },
    {
      title: <FormattedMessage id="Graph id" />,
      dataIndex: 'detail',
      key: 'detail',
      render: (record: { graph_id: String } | { [s: string]: unknown }) => <>{record?.graph_id}</>,
    },
    {
      title: <FormattedMessage id="Process id" />,
      dataIndex: 'detail',
      key: 'detail',
      render: (record: { process_id: string } | { [s: string]: unknown }) => <>{record?.process_id}</>,
    },
    {
      title: <FormattedMessage id="Action" />,
      key: 'actions',
      // render: (record: IJobType) => <Action {...record} onChange={() => getJobList()} />,
      render: (record: IJobType) => (
        <Popconfirm
          placement="bottomRight"
          title={<FormattedMessage id="Are you sure to delete this task?" />}
          onConfirm={() => handleDeleteJob(record.id)}
          okText={<FormattedMessage id="Yes" />}
          cancelText={<FormattedMessage id="No" />}
          icon
        >
          <Button
            type="text"
            size="small"
            danger
            ghost
            icon={<FontAwesomeIcon icon={faTrashCan} />}
            disabled={!['RUNNING', 'WAITING'].includes(record.status)}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      style={{ marginTop: '-18px', cursor: 'pointer' }}
      dataSource={jobsList}
      //@ts-ignores
      columns={columns}
      size="middle"
      onRow={record => {
        return {
          onClick: event => {
            history.push(`/job/detail#?jobId=${record.id}`);
          },
        };
      }}
    />
  );
};

export default JobsList;

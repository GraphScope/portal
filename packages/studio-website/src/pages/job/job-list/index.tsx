import { useEffect, useState } from 'react';
import { Table, Tooltip, Tag, Flex, message, Button, Popconfirm } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
// import Action from './action';
import { listJobs, IJobType, deleteJobById } from '../service';

/** 定义状态选项 */
const STATUSOPTIONS = [
  { value: '', text: 'All' },
  { value: 'RUNNING', text: 'Running' },
  { value: 'CANCELLED', text: 'Cancelled' },
  { value: 'FAILED', text: 'Failed' },
  { value: 'SUCCESS', text: 'Succeed' },
  { value: 'WAITING', text: 'Waiting' },
];
/** 定义job类型 */
let JOBOPTIONS = [{ value: '', text: 'All' }];
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

interface IInfoListProps {
  handleDetail(val: { isShow: boolean; log: string }): void;
}
const JobsList: React.FunctionComponent<IInfoListProps> = props => {
  const { handleDetail } = props;
  const [jobsList, setJobsList] = useState([]);
  useEffect(() => {
    getJobList();
  }, []);
  /** 获取jobs列表数据 */
  const getJobList = async () => {
    const res = await listJobs();
    setJobsList(res);
    /** 接口获取类型值 */
    JOBOPTIONS = JOBOPTIONS.concat(
      res.map(item => {
        return {
          value: item.type,
          text: item.type,
        };
      }),
    );
    /** 过滤相同属性 */
    JOBOPTIONS = JOBOPTIONS.filter((item, index) => JOBOPTIONS.findIndex(i => i.value === item.value) === index);
  };
  /** 删除job */
  const deleteJob = async (job_id: string) => {
    const res = await deleteJobById(job_id);
    message.success(res);
    getJobList();
  };
  /** detail Popover 展示*/
  const handleChange = (detail: { [s: string]: unknown } | ArrayLike<unknown>) => {
    const data = Object.entries(detail);
    return (
      <Flex vertical gap={2}>
        {data.map(item => (
          <span>{item[1]}</span>
        ))}
      </Flex>
    );
  };
  const hangdleJobid = (val: string) => (
    <>
      {val.substring(0, val.length / 2)}
      <br />
      {val.substring(val.length / 2)}
    </>
  );

  const columns = [
    {
      title: <FormattedMessage id="Job ID" />,
      dataIndex: 'job_id',
      key: 'job_id',
      render: (record: string, all: { log: string }) => (
        <span style={{ cursor: 'pointer' }} onClick={() => handleDetail({ isShow: true, log: all.log })}>
          {hangdleJobid(record)}
        </span>
      ),
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
      title: <FormattedMessage id="Start Time" />,
      key: 'start_time',
      dataIndex: 'start_time',
    },
    {
      title: <FormattedMessage id="End Time" />,
      key: 'end_time',
      dataIndex: 'end_time',
    },
    {
      title: <FormattedMessage id="Graph Name" />,
      dataIndex: 'detail',
      key: 'detail',
      // render: (record: any) => <Popover content={() => handleChange(record)}>查询详情</Popover>,
      render: (record: ArrayLike<unknown> | { [s: string]: unknown }) => <>{handleChange(record)}</>,
    },
    {
      title: <FormattedMessage id="Action" />,
      key: 'actions',
      // render: (record: IJobType) => <Action {...record} onChange={() => getJobList()} />,
      render: (record: IJobType) => (
        <Popconfirm
          placement="bottomRight"
          title="确定删除？"
          onConfirm={() => deleteJob(record.job_id)}
          okText="Yes"
          cancelText="No"
          icon
        >
          <Tooltip title="Delete">
            <Button type="text" size="small" danger ghost icon={<DeleteOutlined />} />
          </Tooltip>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ height: '100%', overflow: 'hidden' }}>
      <Table
        dataSource={jobsList}
        //@ts-ignores
        columns={columns}
      />
    </div>
  );
};

export default JobsList;

import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Table, Tag, message, Button, Popconfirm, Space } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useHistory } from '@/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FileSearchOutlined } from '@ant-design/icons';
// import Action from './action';
import { listJobs, IJobType, deleteJobById } from './service';
import dayjs from 'dayjs';
import useStore from './useStore';
interface IState {
  jobsList: IJobType[];
  typeOptions: { value: string; text: string }[];
}

const JobsList: FC = () => {
  const history = useHistory();
  const [state, updateState] = useState<IState>({
    jobsList: [],
    typeOptions: [{ value: '', text: 'All' }],
  });
  const { jobsList, typeOptions } = state;
  const { STATUSOPTIONS, JOB_TYPE_ICONS, getStatusColor, capitalizeFirstLetter } = useStore();
  /** 获取jobs列表数据 */
  const getJobList = useCallback(async () => {
    const res = await listJobs();
    /** 接口获取类型值 */
    let uniqueJobTypes = typeOptions.concat(
      res.map(item => {
        return {
          value: item.type,
          text: item.type,
        };
      }),
    );
    /** 过滤相同属性 */
    uniqueJobTypes = uniqueJobTypes.filter(
      (item, index) => uniqueJobTypes.findIndex(i => i.value === item.value) === index,
    );
    updateState(preset => ({ ...preset, jobsList: res, typeOptions: uniqueJobTypes }) as typeof state);
  }, []);

  useEffect(() => {
    getJobList();
  }, []);

  /** 删除job */
  const handleDeleteJob = useCallback(async (job_id: string) => {
    const res = await deleteJobById(job_id);
    //@ts-ignore
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
      filters: typeOptions,
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
        //@ts-ignore
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
      title: <FormattedMessage id="Graph name" />,
      key: 'graph_name',
      dataIndex: 'graph_name',
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
      render: (record: IJobType) => (
        <Space>
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
          <FileSearchOutlined onClick={() => history.push(`/job/detail?jobId=${record.id}`)} />
        </Space>
      ),
    },
  ];

  return (
    <Table
      style={{ marginTop: '-8px' }}
      dataSource={jobsList}
      //@ts-ignore
      columns={columns}
      size="middle"
    />
  );
};

export default JobsList;

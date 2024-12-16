import React, { useCallback, useEffect, useState } from 'react';
import type { FC } from 'react';
import {
  List,
  Typography,
  Tag,
  message,
  Button,
  Popconfirm,
  Divider,
  Space,
  Popover,
  theme,
  Skeleton,
  Card,
} from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { useHistory } from '../../hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { listJobs, IJobType, deleteJobById } from './service';
import JobHeader from './job-header';
import dayjs from 'dayjs';
import useStore from './useStore';

const { Title, Text } = Typography;

export interface IState {
  jobsList: IJobType[];
  rawJobsList: IJobType[];
  typeOptions: { value: string; label: string }[];
  searchOptions: { value: string; label: string }[];
  jobId: string;
  loading: boolean;
}

const JobsList: FC = () => {
  const { token } = theme.useToken();
  const history = useHistory();

  const [state, setState] = useState<IState>({
    jobsList: [],
    rawJobsList: [],
    typeOptions: [],
    searchOptions: [],
    jobId: '',
    loading: false,
  });

  const { jobsList, rawJobsList } = state;
  const { JOB_TYPE_ICONS, statusColor, capitalizeFirstLetter, formatDateTime, handleChange } = useStore();

  const getJobList = useCallback(async () => {
    try {
      setState(prevState => ({ ...prevState, loading: true }));
      const res = await listJobs();
      const uniqueTypes = Array.from(new Set(res.map(item => item.type)));
      const typeOptions = uniqueTypes.map(type => ({ value: type, label: type }));
      const searchOptions = res.map(item => ({ value: item.id, label: item.id }));

      setState(prevState => {
        return {
          ...prevState,
          jobsList: res,
          rawJobsList: res,
          typeOptions,
          searchOptions,
          loading: false,
        };
      });
    } catch (error) {
      message.error('Failed to load jobs');
    }
  }, []);

  useEffect(() => {
    getJobList();
  }, [getJobList]);

  const handleDeleteJob = useCallback(
    async (jobId: string) => {
      try {
        await deleteJobById(jobId);
        message.success('Job deleted successfully');
        getJobList();
      } catch {
        message.error('Failed to delete job');
      }
    },
    [getJobList],
  );
  if (state.loading) {
    return (
      <Card>
        <Skeleton active />
      </Card>
    );
  }

  return (
    <List
      style={{ padding: '0px 12px 24px 12px', backgroundColor: token.colorBgBase, borderRadius: 6 }}
      itemLayout="horizontal"
      header={
        <JobHeader
          {...state}
          onChange={(selectedItems, filterType) => {
            const updatedJobsList = handleChange(selectedItems, filterType, rawJobsList);
            setState(prevState => ({ ...prevState, jobsList: updatedJobsList }));
          }}
        />
      }
      dataSource={jobsList}
      pagination={{ position: 'bottom', align: 'end' }}
      renderItem={({ id, status, graph_name, type, start_time, end_time }) => {
        const isJobSelected = state.jobId === id;

        return (
          <List.Item
            style={{
              padding: '12px 12px',
              backgroundColor: isJobSelected ? token.colorBgLayout : token.colorBgBase,
              cursor: 'pointer',
            }}
            onMouseEnter={() => setState(prevState => ({ ...prevState, jobId: id }))}
            onMouseLeave={() => setState(prevState => ({ ...prevState, jobId: '' }))}
            onClick={() => history.push(`/job/detail?jobId=${id}`)}
          >
            <List.Item.Meta
              title={
                <Space align="center">
                  <Title level={5}>{id}</Title>
                  <Tag icon={JOB_TYPE_ICONS[status]} color={statusColor[status]}>
                    {capitalizeFirstLetter(status.toLowerCase())}
                  </Tag>
                </Space>
              }
              description={
                <Space align="center" split={<Divider type="vertical" />}>
                  <Text type="secondary">GraphName: {graph_name}</Text>
                  <Text type="secondary">JobType: {type}</Text>
                  <Text type="secondary">{end_time}</Text>
                </Space>
              }
            />

            <Space>
              <Text type="secondary">{formatDateTime(dayjs(start_time))}</Text>
              <Popover
                placement="bottom"
                content={
                  <Popconfirm
                    placement="bottomRight"
                    title={<FormattedMessage id="Are you sure to delete this task?" />}
                    onConfirm={() => handleDeleteJob(id)}
                    okText={<FormattedMessage id="Yes" />}
                    cancelText={<FormattedMessage id="No" />}
                  >
                    <Button
                      type="text"
                      size="small"
                      danger
                      ghost
                      icon={<FontAwesomeIcon icon={faTrashCan} />}
                      disabled={!['RUNNING', 'WAITING'].includes(status)}
                    >
                      <FormattedMessage id="Delete" />
                    </Button>
                  </Popconfirm>
                }
              >
                <EllipsisOutlined />
              </Popover>
            </Space>
          </List.Item>
        );
      }}
    />
  );
};

export default JobsList;

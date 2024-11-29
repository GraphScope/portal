import React, { useCallback, useEffect, useState } from 'react';
import type { FC } from 'react';
import { List, Typography, Tag, message, Button, Popconfirm, Space, Popover, Divider, Flex } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useHistory } from '../../hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FileSearchOutlined, EllipsisOutlined } from '@ant-design/icons';
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
}

const JobsList: FC = () => {
  const history = useHistory();
  const [state, setState] = useState<IState>({
    jobsList: [],
    rawJobsList: [],
    typeOptions: [],
    searchOptions: [],
    jobId: '',
  });

  const { jobsList, rawJobsList } = state;
  const { JOB_TYPE_ICONS, getStatusColor, capitalizeFirstLetter, formatDateTime, handleChange } = useStore();

  const getJobList = useCallback(async () => {
    try {
      const res = await listJobs();
      const uniqueTypes = Array.from(new Set(res.map(item => item.type)));
      const typeOptions = uniqueTypes.map(type => ({ value: type, label: type }));
      const searchOptions = res.map(item => ({ value: item.id, label: item.id }));

      setState(prevState => ({
        ...prevState,
        jobsList: res,
        rawJobsList: res,
        typeOptions,
        searchOptions,
      }));
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

  return (
    <List
      style={{ padding: 24, backgroundColor: '#fff', borderRadius: 6 }}
      itemLayout="horizontal"
      header={
        <JobHeader
          {...state}
          onChange={(selectedItems, filterType) => {
            setState(prevState => ({
              ...prevState,
              jobsList: handleChange(selectedItems, filterType, rawJobsList),
            }));
          }}
        />
      }
      dataSource={jobsList}
      pagination={{ position: 'bottom', align: 'end' }}
      renderItem={({ id, status, graph_name, type, start_time, end_time }) => (
        <List.Item
          style={{ padding: '6px 12px', backgroundColor: state.jobId === id ? '#fafafa' : '#fff' }}
          onMouseEnter={() => setState(prevState => ({ ...prevState, jobId: id }))}
          onMouseLeave={() => setState(prevState => ({ ...prevState, jobId: '' }))}
        >
          <List.Item.Meta
            title={
              <Flex align="center" gap={6}>
                <Title level={5}>{id}</Title>
                <Tag icon={JOB_TYPE_ICONS[status]} color={getStatusColor(status)}>
                  {capitalizeFirstLetter(status.toLowerCase())}
                </Tag>
              </Flex>
            }
            description={
              <Flex align="center">
                <Text type="secondary">GraphName: {graph_name}</Text>
                <Divider type="vertical" />
                <Text type="secondary">JobType: {type}</Text>
                <Divider type="vertical" />
                <Text type="secondary">{end_time}</Text>
              </Flex>
            }
          />
          <Flex gap={12}>
            <Text type="secondary">{formatDateTime(dayjs(start_time))}</Text>
            <Popover
              placement="bottom"
              content={
                <Space>
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
                    />
                  </Popconfirm>
                  <Button
                    type="text"
                    size="small"
                    icon={<FileSearchOutlined />}
                    onClick={() => history.push(`/job/detail?jobId=${id}`)}
                  />
                </Space>
              }
            >
              <EllipsisOutlined style={{ cursor: 'pointer' }} />
            </Popover>
          </Flex>
        </List.Item>
      )}
    />
  );
};

export default JobsList;

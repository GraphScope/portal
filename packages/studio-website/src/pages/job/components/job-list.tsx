import React, { FC } from 'react';
import { List, Card, Skeleton, theme } from 'antd';
import { useJobs } from '../hooks/useJobs';
import JobHeader from './job-header';
import JobListItem from './job-item';

const JobsList: FC = () => {
  const { token } = theme.useToken();
  const { state, handleDeleteJob, handleFilterChange } = useJobs();

  if (state.loading) {
    return (
      <Card>
        <Skeleton active />
      </Card>
    );
  }

  return (
    <List
      style={{ padding: '0px 12px 24px 12px', backgroundColor: token.colorBgContainer, borderRadius: 6 }}
      itemLayout="horizontal"
      header={<JobHeader {...state} onChange={handleFilterChange} />}
      dataSource={state.jobsList}
      pagination={{ position: 'bottom', align: 'end' }}
      renderItem={job => <JobListItem job={job} onDelete={handleDeleteJob} />}
    />
  );
};

export default JobsList;

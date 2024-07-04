import * as React from 'react';
import Section from '@/components/section';
import JobsList from './job-list';

const Job: React.FunctionComponent = () => {
  return (
    <>
      <Section
        breadcrumb={[
          {
            title: { id: 'Jobs' },
          },
        ]}
        desc={{ id: 'Managing long-running tasks, such as data importing, analytic jobs, and complex queries.' }}
        children={<JobsList />}
      ></Section>
    </>
  );
};

export default Job;

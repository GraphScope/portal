import * as React from 'react';
import Section from '@/components/section';
import JobsList from './job-list';

interface IJobProps {}
const Job: React.FunctionComponent<IJobProps> = props => {
  return (
    <>
      <Section
        breadcrumb={[
          {
            title: 'Home',
          },
          {
            title: 'Jobs',
          },
        ]}
        title="Jobs"
        desc="Managing long-running tasks, such as data importing, analytic jobs, and complex queries."
        children={<JobsList />}
      ></Section>
    </>
  );
};

export default Job;

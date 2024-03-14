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
        desc="GraphScope transforms tasks like data import, analysis, and other long-processing tasks into jobs, which you can monitor and manage here."
        children={<JobsList />}
      ></Section>
    </>
  );
};

export default Job;

import * as React from 'react';
import Section from '@/components/section';
interface IJobProps {}

const Job: React.FunctionComponent<IJobProps> = props => {
  return (
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
      desc="Jobs"
    >
      WIP...
    </Section>
  );
};

export default Job;

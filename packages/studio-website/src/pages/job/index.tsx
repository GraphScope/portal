import * as React from 'react';
import Section from '../../components/section';
import JobsList from './job-list';
import { FormattedMessage } from 'react-intl';
const Job: React.FunctionComponent = () => {
  return (
    <>
      <Section
        breadcrumb={[
          {
            title: <FormattedMessage id="Jobs" />,
          },
        ]}
        desc="Managing long-running tasks, such as data importing, analytic jobs, and complex queries."
      >
        <JobsList />
      </Section>
    </>
  );
};

export default Job;

import * as React from 'react';
import Section from '@/components/section';
import JobsList from './job-list';
import Detail from './job-list/detail';

interface IJobProps {}
const { useState } = React;
const Job: React.FunctionComponent<IJobProps> = props => {
  const [state, updateState] = useState({
    isShowDetail: false,
  });
  const { isShowDetail } = state;

  return (
    <>
      {isShowDetail ? (
        <Detail />
      ) : (
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
          children={
            <JobsList
              handleDetail={val => {
                const { isShow, log } = val;
                updateState(preset => {
                  return {
                    ...preset,
                    isShowDetail: isShow,
                  };
                });
              }}
            />
          }
        ></Section>
      )}
    </>
  );
};

export default Job;

import * as React from 'react';
import Section from '@/components/section';
import type { TabsProps } from 'antd';
/** 作业列表 */
import JobsList from './job-list';
/** 作业详情 */
import Detail from './job-list/detail';
import { FormattedMessage } from 'react-intl';

interface IJobProps {}
const { useState } = React;
const Job: React.FunctionComponent<IJobProps> = props => {
  const [state, updateState] = useState({
    isShowDetail: false,
  });
  const { isShowDetail } = state;
  const items: TabsProps['items'] = [
    {
      key: 'jobs',
      label: <FormattedMessage id="Job List" />,
      children: (
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
      ),
    },
    // {
    //   key: 'import',
    //   label: '数据导入',
    //   children: <>数据导入</>,
    // },
    // {
    //   key: 'receive',
    //   label: 'Alert Receive',
    //   children: <InfoList />,
    // },
    // {
    //   key: 'deployment',
    //   label: 'Deployment Status',
    //   children: <InfoList />,
    // },
  ];

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
          items={items}
        ></Section>
      )}
    </>
  );
};

export default Job;

import * as React from 'react';
import Section from '@/components/section';
import type { TabsProps } from 'antd';
import JobsList from './job-list';
import Detail from './job-list/detail';
import { FormattedMessage } from 'react-intl';

interface IJobProps {}
const { useState } = React;
const Job: React.FunctionComponent<IJobProps> = props => {
  const [state, updateState] = useState({
    isShowDetail: false,
    detailData: '',
  });
  const { isShowDetail, detailData } = state;
  const items: TabsProps['items'] = [
    {
      key: 'info',
      label: <FormattedMessage id="Job List" />,
      children: (
        <JobsList
          handleDetail={val => {
            const { isShow, log } = val;
            updateState(preset => {
              return {
                ...preset,
                isShowDetail: isShow,
                detailData: log,
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
        <Detail detailData={detailData} />
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

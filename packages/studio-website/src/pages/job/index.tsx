import * as React from 'react';
import Section from '@/components/section';
import type { TabsProps } from 'antd';
import InfoList from './job-list';
interface IJobProps {}

const Job: React.FunctionComponent<IJobProps> = props => {
  const items: TabsProps['items'] = [
    {
      key: 'info',
      label: 'Job List',
      children: <InfoList />,
    },
    {
      key: 'import',
      label: '数据导入',
      children: <>数据导入</>,
    },
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
      items={items}
    ></Section>
  );
};

export default Job;

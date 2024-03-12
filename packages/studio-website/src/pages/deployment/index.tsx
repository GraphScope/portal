import * as React from 'react';
import Section from '@/components/section';
import DeploymentList from './deployment-list';

interface IDeploymentProps {}
const Deployment: React.FunctionComponent<IDeploymentProps> = props => {
  return (
    <Section
      breadcrumb={[
        {
          title: 'Home',
        },
        {
          title: 'Deployment',
        },
      ]}
      title="Deployment"
      desc="Deployment"
      children={<DeploymentList />}
    ></Section>
  );
};

export default Deployment;

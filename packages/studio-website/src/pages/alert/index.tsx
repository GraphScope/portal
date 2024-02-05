import * as React from 'react';
import Section from '@/components/section';
import AlertSegmente from './segmente';
interface AlertModuleProps {}

const AlertModule: React.FunctionComponent<AlertModuleProps> = props => {
  return (
    <Section
      breadcrumb={[
        {
          title: 'Home',
        },
        {
          title: 'Alert',
        },
      ]}
      title="Alert"
      desc="Alert"
    >
      <AlertSegmente />
    </Section>
  );
};

export default AlertModule;

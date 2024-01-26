import * as React from 'react';
import Section from '@/components/section';

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
      WIP...
    </Section>
  );
};

export default AlertModule;

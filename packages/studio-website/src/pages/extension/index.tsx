import * as React from 'react';
import Section from '@/components/section';
interface ExtensionProps {}

const Extension: React.FunctionComponent<ExtensionProps> = props => {
  return (
    <Section
      breadcrumb={[
        {
          title: 'Home',
        },
        {
          title: 'Extensions',
        },
      ]}
      title="Extensions"
      desc="Extensions"
    >
      WIP...
    </Section>
  );
};

export default Extension;

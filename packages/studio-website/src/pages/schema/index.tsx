import * as React from 'react';
import ImportApp from '@graphscope/studio-importor';
import Section from '@/components/section';
interface ISchemaPageProps {}

const SchemaPage: React.FunctionComponent<ISchemaPageProps> = props => {
  return (
    <Section
      title="Schema"
      desc="Managing long-running tasks, such as data importing, analytic jobs, and complex queries."
    >
      <ImportApp />
    </Section>
  );
};

export default SchemaPage;

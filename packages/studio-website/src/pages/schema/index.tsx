import * as React from 'react';
import ImportApp from '@graphscope/studio-importor';
import Section from '@/components/section';
interface ISchemaPageProps {}

const SchemaPage: React.FunctionComponent<ISchemaPageProps> = props => {
  return (
    <div style={{ padding: '12px', height: '100%', boxSizing: 'border-box' }}>
      <ImportApp />
    </div>
  );
};

export default SchemaPage;

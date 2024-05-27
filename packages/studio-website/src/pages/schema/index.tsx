import * as React from 'react';
import ImportApp from '@graphscope/studio-importor';
import Section from '@/components/section';
import { createGraph, getPrimitiveTypes } from './services';
interface ISchemaPageProps {}

const SchemaPage: React.FunctionComponent<ISchemaPageProps> = props => {
  return (
    <div style={{ padding: '12px', height: '100%', boxSizing: 'border-box' }}>
      <ImportApp createGraph={createGraph} getPrimitiveTypes={getPrimitiveTypes} />
    </div>
  );
};

export default SchemaPage;

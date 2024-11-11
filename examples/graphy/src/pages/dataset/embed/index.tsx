import * as React from 'react';
import { Container } from '../../components';
import Graph from './graph';
interface IModelingProps {}

const EmbedSchema: React.FunctionComponent<IModelingProps> = props => {
  return (
    <div>
      <Container
        breadcrumb={[
          {
            title: <a href="/dataset">dataset</a>,
          },
          {
            title: 'embed schema',
          },
        ]}
      >
        <Graph />
      </Container>
    </div>
  );
};

export default EmbedSchema;

import * as React from 'react';

import { Container, ClusterGraph } from '../../components';

interface ICreateProps {}

const ExtractSetting: React.FunctionComponent<ICreateProps> = props => {
  return (
    <Container
      breadcrumb={[
        {
          title: 'Home',
        },
        {
          title: <a href="/dataset">dataset</a>,
        },
        {
          title: 'cluster entity',
        },
      ]}
    >
      <ClusterGraph />
    </Container>
  );
};

export default ExtractSetting;

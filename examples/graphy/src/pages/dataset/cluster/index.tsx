import * as React from 'react';
import ClusterGraph from './graph';

import { Container } from '../../components';

interface ICreateProps {}

const ExtractSetting: React.FunctionComponent<ICreateProps> = props => {
  return (
    <Container
      breadcrumb={[
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

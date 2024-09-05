import * as React from 'react';
import Container from '../components/Container';
import { QueryStatement } from '@graphscope/studio-query';

interface IExploreProps {}

const Explore: React.FunctionComponent<IExploreProps> = props => {
  return (
    <Container
      breadcrumb={[
        {
          title: 'Home',
        },
        {
          title: 'explore',
        },
      ]}
    >
      <QueryStatement />
    </Container>
  );
};

export default Explore;

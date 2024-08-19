import * as React from 'react';

import { Container } from '../../components';

import ExtractForm from './setting';

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
          title: 'extract',
        },
      ]}
    >
      <ExtractForm />
    </Container>
  );
};

export default ExtractSetting;

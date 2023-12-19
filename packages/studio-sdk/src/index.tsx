import Query from '@graphscope/studio-query';
import { PropertiesEditor } from '@graphscope/studio-importor';
import React from 'react';
const sdk = () => {
  console.log('...');
  return (
    <div>
      <Query />
      <PropertiesEditor title="sdk" />
    </div>
  );
};

export default sdk;

//@ts-nocheck
import Query from '@graphscope/studio-query';
import { PropertiesEditor } from '@graphscope/studio-importor';
import React from 'react';
const sdk = () => {
  return (
    <div>
      <Query />
      <PropertiesEditor title="sdk" />
    </div>
  );
};

export default sdk;

import React from 'react';
import StudioQuery from '@graphscope/studio-query';
import StudioImportor from '@graphscope/studio-importor';

export default () => {
  return (
    <div>
      <div>
        <StudioQuery />
        <StudioImportor />
      </div>
    </div>
  );
};

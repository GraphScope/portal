import React from 'react';
import { Toolbar } from '@graphscope/studio-components';
import { AddNode, ClearCanvas, ExportSvg } from '@graphscope/studio-flow-editor';

const ButtonController: React.FunctionComponent = props => {
  return (
    <Toolbar>
      <AddNode noDefaultLabel />
      <ClearCanvas />
      <ExportSvg />
    </Toolbar>
  );
};

export default ButtonController;

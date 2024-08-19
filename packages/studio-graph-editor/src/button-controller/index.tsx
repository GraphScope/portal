import React from 'react';
import { Toolbar } from '@graphscope/studio-components';
import 'reactflow/dist/style.css';
import ClearCanvas from './clear-canvas';
import AddNode from './add-node';

import ExportImage from './export-image';

interface IButtonControllerProps {}

const ButtonController: React.FunctionComponent<IButtonControllerProps> = props => {
  return (
    <>
      <Toolbar>
        <AddNode />
        <ClearCanvas />
        <ExportImage />
      </Toolbar>
    </>
  );
};

export default React.memo(ButtonController);

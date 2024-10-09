import React from 'react';
import { Toolbar } from '@graphscope/studio-components';
import 'reactflow/dist/style.css';
import ClearCanvas from './clear-canvas';
import AddNode from './add-node';

import ExportImage from './export-image';
import { useGraphContext } from '..';

interface IButtonControllerProps {}

const ButtonController: React.FunctionComponent<IButtonControllerProps> = props => {
  const { controlElements } = useGraphContext();
  return (
    <>
      <Toolbar>
        <AddNode />
        <ClearCanvas />
        <ExportImage />
        {controlElements}
      </Toolbar>
    </>
  );
};

export default React.memo(ButtonController);

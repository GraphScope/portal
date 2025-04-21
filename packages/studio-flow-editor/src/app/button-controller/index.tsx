import React from 'react';
import { Toolbar } from '@graphscope/studio-components';
import ClearCanvas from './clear-canvas';
import AddNode from './add-node';
import ExportImage from './export-image';

const ButtonController: React.FunctionComponent = props => {
    return (
      <Toolbar style={{ top: '12px', right: '24px', left: 'unset' }} direction="vertical">
        <AddNode />
        <ClearCanvas />
        <ExportImage />
      </Toolbar>
    );
};

export default ButtonController;

import React from 'react';
import { Divider } from 'antd';
import { Toolbar, useCustomToken } from '@graphscope/studio-components';

import RightButton from './right-button';
import ClearCanvas from './clear-canvas';
import AddNode from './add-node';
import ExportImage from './export-image';
import { useContext } from '@graphscope/use-zustand';

import ParseCSV from './parse-csv';
import ImportAndExportConfig from './import-and-export-config';
interface IButtonControllerProps {}

const ButtonController: React.FunctionComponent<IButtonControllerProps> = props => {
  const { store } = useContext();
  const { appMode } = store;

  if (appMode === 'DATA_MODELING') {
    return (
      <>
        <Toolbar style={{ top: '12px', right: '24px', left: 'unset' }} direction="vertical">
          <RightButton />
          <Divider style={{ margin: '0px' }} />
          <ParseCSV />
          <Divider style={{ margin: '0px' }} />
          <ImportAndExportConfig />
          <Divider style={{ margin: '0px' }} />
          <AddNode />
          <ClearCanvas />
          <ExportImage />
        </Toolbar>
      </>
    );
  }
  if (appMode === 'DATA_IMPORTING') {
    return (
      <>
        <Toolbar style={{ top: '12px', right: '24px', left: 'unset' }} direction="vertical">
          <RightButton />
          <Divider style={{ margin: '0px' }} />
          <ImportAndExportConfig />
        </Toolbar>
      </>
    );
  }
  return null;
};

export default ButtonController;

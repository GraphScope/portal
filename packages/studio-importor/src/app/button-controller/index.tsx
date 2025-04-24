import React from 'react';
import { Divider } from 'antd';
import { Toolbar } from '@graphscope/studio-components';
import {AddNode,ClearCanvas,ExportSvg} from '@graphscope/studio-flow-editor';
import RightButton from './right-button';
import { useContext } from '../useContext';

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
          <ExportSvg />
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

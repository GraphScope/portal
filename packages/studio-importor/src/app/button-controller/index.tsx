import React from 'react';
import { Divider } from 'antd';
import { Toolbar, ThemeProvider, Section } from '@graphscope/studio-components';
import 'reactflow/dist/style.css';
import RightButton from './right-button';
import LeftButton from './left-button';
import ClearCanvas from './clear-canvas';
import AddNode from './add-node';
import ImportAndExportYaml from './import-and-export-yaml';
import ExportImage from './export-image';
import { useContext } from '../useContext';
interface IButtonControllerProps {}

const ButtonController: React.FunctionComponent<IButtonControllerProps> = props => {
  const { store } = useContext();
  const { appMode } = store;
  if (appMode === 'DATA_MODELING') {
    return (
      <>
        <Toolbar>
          <LeftButton />
          <Divider type="horizontal" style={{ margin: '0px' }} />
          <AddNode />
          <ClearCanvas />
          <ExportImage />
        </Toolbar>
        <Toolbar style={{ top: '12px', right: '24px', left: 'unset' }} direction="horizontal">
          <ImportAndExportYaml />
          <Divider type="vertical" style={{ margin: '0px' }} />
          <RightButton />
        </Toolbar>
      </>
    );
  }
  if (appMode === 'DATA_IMPORTING') {
    return (
      <>
        <Toolbar style={{ top: '12px', right: '24px', left: 'unset' }} direction="horizontal">
          <ImportAndExportYaml />
          <Divider type="vertical" style={{ margin: '0px' }} />
          <RightButton />
        </Toolbar>
      </>
    );
  }
  return null;
};

export default ButtonController;

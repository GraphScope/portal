import React from 'react';
import { Divider } from 'antd';
import { Toolbar } from '@graphscope/studio-components';
import 'reactflow/dist/style.css';
import RightButton from './right-button';
import LeftButton from './left-button';
import ClearCanvas from './clear-canvas';
import AddNode from './add-node';
import ExportImage from './export-image';
import { useContext } from '../useContext';
import ImportSchema from '../import-schema';
import ExportModel from './export-model';
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
          <ImportSchema displayType="model" />
          <Divider style={{ margin: '0px' }} />
          <AddNode />
          <ClearCanvas />
          <ExportImage />
          <ExportModel />
        </Toolbar>
      </>
    );
  }
  if (appMode === 'DATA_IMPORTING') {
    return (
      <>
        <Toolbar style={{ top: '12px', right: '24px', left: 'unset' }} direction="horizontal">
          <RightButton />
        </Toolbar>
      </>
    );
  }
  return null;
};

export default ButtonController;

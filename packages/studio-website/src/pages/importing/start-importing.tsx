import { Button } from 'antd';
import * as React from 'react';
import { AppstoreOutlined, CloseOutlined } from '@ant-design/icons';

import { Icons } from '@graphscope/studio-components';
import { useContext } from '../../layouts/useContext';

import { useContext as useImporting } from '@graphscope/studio-importor';
interface StartImportingProps {
  onClick?: () => void;
}

const StartImporting: React.FunctionComponent<StartImportingProps> = props => {
  const { store } = useContext();
  const { store: importingStore } = useImporting();
  const { appMode } = importingStore;
  const { onClick } = props;
  const handleClick = () => {
    onClick && onClick();
  };

  if (appMode === 'DATA_IMPORTING') {
    return (
      <Button type="primary" onClick={handleClick}>
        Start Importing
      </Button>
    );
  }
  return null;
};

export default StartImporting;

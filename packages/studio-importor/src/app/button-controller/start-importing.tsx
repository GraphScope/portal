import { Button } from 'antd';
import * as React from 'react';
import { AppstoreOutlined, CloseOutlined } from '@ant-design/icons';
import { useContext } from '../useContext';
import { Icons } from '@graphscope/studio-components';
interface StartImportingProps {
  onClick?: () => void;
}

const StartImporting: React.FunctionComponent<StartImportingProps> = props => {
  const { store } = useContext();
  const { appMode } = store;
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

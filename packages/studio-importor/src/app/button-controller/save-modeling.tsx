import { Button } from 'antd';
import * as React from 'react';
import { AppstoreOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { useContext } from '../useContext';
import { Icons } from '@graphscope/studio-components';

interface SaveModelingProps {
  onClick?: () => void;
}

const SaveModeling: React.FunctionComponent<SaveModelingProps> = props => {
  const { store } = useContext();
  const { appMode, elementOptions } = store;
  const disabled = !elementOptions.isEditable;

  const { onClick } = props;
  const handleClick = () => {
    onClick && onClick();
  };
  const text = disabled ? 'View Schema' : 'Save Importing';

  if (appMode === 'DATA_MODELING') {
    return (
      <Button disabled={disabled} type="primary" icon={<SaveOutlined />} onClick={handleClick}>
        {text}
      </Button>
    );
  }
  return null;
};

export default SaveModeling;

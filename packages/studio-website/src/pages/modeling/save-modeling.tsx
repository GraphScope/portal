import { Button } from 'antd';
import * as React from 'react';
import { AppstoreOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { useContext } from '../../layouts/useContext';
import { Icons } from '@graphscope/studio-components';
import { useContext as useModeling } from '@graphscope/studio-importor';
interface SaveModelingProps {
  onClick?: () => void;
}

const SaveModeling: React.FunctionComponent<SaveModelingProps> = props => {
  const { store } = useContext();

  const { store: modelingStore } = useModeling();
  const { elementOptions, appMode } = modelingStore;
  console.log(store, modelingStore);

  const { graphId } = store;
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

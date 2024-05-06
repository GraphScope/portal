import { Button, Segmented } from 'antd';
import * as React from 'react';
import { useContext } from './useContext';

interface IModeSwitchProps {
  style: React.CSSProperties;
}

const ModeSwitch: React.FunctionComponent<IModeSwitchProps> = props => {
  const { style } = props;
  const { store, updateStore } = useContext();
  const { displayMode } = store;
  const handleChange = value => {
    updateStore(draft => {
      draft.displayMode = value;
    });
  };

  return (
    <div style={style}>
      <Segmented options={['table', 'graph']} value={displayMode} onChange={handleChange} />
    </div>
  );
};

export default ModeSwitch;

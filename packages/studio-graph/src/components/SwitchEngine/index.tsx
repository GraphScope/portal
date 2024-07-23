import * as React from 'react';
import { Button } from 'antd';
import { useContext } from '../../app/useContext';
export interface ISwitchEngineProps {}

const SwitchEngine: React.FunctionComponent<ISwitchEngineProps> = props => {
  const { updateStore, store } = useContext();
  const { render } = store;
  const handleSwitch = () => {
    updateStore(draft => {
      draft.render = render === '2D' ? '3D' : '2D';
    });
  };
  return (
    <Button onClick={handleSwitch} style={{ position: 'absolute', top: '20px', right: '20px' }}>
      Switch
    </Button>
  );
};

export default SwitchEngine;

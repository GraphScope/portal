import React from 'react';
import CreateGraph from './create-graph';
interface ICreateGraph {
  handleCreate: () => void;
}
const { GS_ENGINE_TYPE } = window;
const GrootCase: React.FC<ICreateGraph> = props => {
  const { handleCreate } = props;
  if (GS_ENGINE_TYPE === 'interactive') {
    return <CreateGraph onCreate={handleCreate} />;
  }
  return <></>;
};

export default GrootCase;

import * as React from 'react';
import useNodeClick from '../../hooks/useNodeClick';
interface IBasicInteractionProps {}

const BasicInteraction: React.FunctionComponent<IBasicInteractionProps> = props => {
  useNodeClick();

  return null;
};

export default BasicInteraction;

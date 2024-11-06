import * as React from 'react';
import useNodeClick from '../../hooks/useNodeClick';
import useEdgeClick from '../../hooks/useEdgeClick';
interface IBasicInteractionProps {}

const BasicInteraction: React.FunctionComponent<IBasicInteractionProps> = props => {
  useNodeClick();
  useEdgeClick();

  return null;
};

export default BasicInteraction;

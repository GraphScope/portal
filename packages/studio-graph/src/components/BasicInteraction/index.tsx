import * as React from 'react';
import useNodeClick from '../../hooks/useNodeClick';
import useEdgeClick from '../../hooks/useEdgeClick';
import useComboEvent from '../../graph/custom-combo/useComboEvent';
interface IBasicInteractionProps {}

const BasicInteraction: React.FunctionComponent<IBasicInteractionProps> = props => {
  useNodeClick();
  useEdgeClick();
  useComboEvent();

  return null;
};

export default BasicInteraction;

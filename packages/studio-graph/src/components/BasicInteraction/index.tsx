import * as React from 'react';
import useNodeClick from './useNodeClick';
import useEdgeClick from './useEdgeClick';
import useComboEvent from '../../graph/custom-combo/useComboEvent';
import { useFoucs } from './useFoucs';
interface IBasicInteractionProps {}

const BasicInteraction: React.FunctionComponent<IBasicInteractionProps> = props => {
  useNodeClick();
  useEdgeClick();
  useComboEvent();
  useFoucs();

  return null;
};

export default BasicInteraction;

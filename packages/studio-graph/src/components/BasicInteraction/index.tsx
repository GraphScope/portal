import * as React from 'react';
import useNodeClick from './useNodeClick';
import useEdgeClick from './useEdgeClick';
import useNodeHover from './useNodeHover';
import useComboEvent from '../../graph/custom-combo/useComboEvent';
import { useFoucs } from './useFoucs';
interface IBasicInteractionProps {}

const BasicInteraction: React.FunctionComponent<IBasicInteractionProps> = props => {
  useNodeClick();
  useNodeHover();
  useEdgeClick();
  useComboEvent();
  useFoucs();

  return null;
};

export default BasicInteraction;

import * as React from 'react';

import { Typography, Input } from 'antd';
import { useContext } from '../../useContext';

interface ISourceTargetProps {
  source: string;
  target: string;
}

const SourceTarget: React.FunctionComponent<ISourceTargetProps> = props => {
  const { source, target } = props;
  const { store } = useContext();
  const { nodes } = store;
  let source_label, target_label;
  nodes.forEach(item => {
    if (item.id === source) {
      source_label = item.data.label;
    }
    if (item.id === target) {
      target_label = item.data.label;
    }
  });

  return (
    <>
      <Typography.Text>Source</Typography.Text>
      <Input value={source_label} disabled />
      <Typography.Text>Target</Typography.Text>
      <Input value={target_label} disabled />
    </>
  );
};

export default SourceTarget;

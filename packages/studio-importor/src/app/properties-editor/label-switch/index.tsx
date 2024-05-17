import React, { Children } from 'react';
import { Segmented } from 'antd';
interface ILabelSwitchProps {
  children: React.ReactNode;
}

const LabelSwitch: React.FunctionComponent<ILabelSwitchProps> = props => {
  const { children } = props;
  return (
    <div>
      <Segmented options={['Vertex labels', 'Edge labels']} />
      {children}
    </div>
  );
};

export default LabelSwitch;

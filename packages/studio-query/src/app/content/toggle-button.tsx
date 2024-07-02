import { Button } from 'antd';
import * as React from 'react';
import { useSection, Icons } from '@graphscope/studio-components';

interface IToggleButtonProps {}

const ToggleButton: React.FunctionComponent<IToggleButtonProps> = props => {
  const { toggleLeftSide } = useSection();
  return <Button icon={<Icons.Sidebar />} onClick={toggleLeftSide} />;
};

export default ToggleButton;

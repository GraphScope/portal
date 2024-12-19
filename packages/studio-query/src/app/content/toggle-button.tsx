import { Button } from 'antd';
import * as React from 'react';
import { useSection, Icons } from '@graphscope/studio-components';
import { IStudioQueryProps } from '../context';

interface IToggleButtonProps {
  displaySidebarPosition: IStudioQueryProps['displaySidebarPosition'];
}

const ToggleButton: React.FunctionComponent<IToggleButtonProps> = props => {
  const { toggleLeftSide, toggleRightSide } = useSection();
  if (props.displaySidebarPosition === 'right') {
    return <Button icon={<Icons.Sidebar />} onClick={() => toggleRightSide()} type="text" />;
  }
  if (props.displaySidebarPosition === 'left') {
    return <Button icon={<Icons.Sidebar />} onClick={() => toggleLeftSide()} type="text" />;
  }
  return null;
};

export default ToggleButton;

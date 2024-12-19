import { Button } from 'antd';
import * as React from 'react';
import { Icons, useSection } from '@graphscope/studio-components';
interface IRightButtonProps {}

const RightButton: React.FunctionComponent<IRightButtonProps> = props => {
  const { toggleRightSide } = useSection();

  return (
    <Button
      type="text"
      icon={<Icons.Sidebar revert />}
      onClick={() => {
        toggleRightSide();
      }}
    />
  );
};

export default RightButton;

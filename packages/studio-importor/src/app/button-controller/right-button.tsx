import { Button } from 'antd';
import * as React from 'react';
import { Icons, useSection } from '@graphscope/studio-components';
interface ILeftButtonProps {}

const LeftButton: React.FunctionComponent<ILeftButtonProps> = props => {
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

export default LeftButton;

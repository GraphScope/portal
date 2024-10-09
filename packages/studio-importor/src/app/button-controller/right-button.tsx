import { Button } from 'antd';
import * as React from 'react';
import { Icons, useSection, useStudioProvier } from '@graphscope/studio-components';
interface ILeftButtonProps {}

const LeftButton: React.FunctionComponent<ILeftButtonProps> = props => {
  const { toggleRightSide } = useSection();
  const { isLight } = useStudioProvier();
  return (
    <Button
      type="text"
      icon={<Icons.Sidebar revert disabled={!isLight} />}
      onClick={() => {
        toggleRightSide();
      }}
    />
  );
};

export default LeftButton;

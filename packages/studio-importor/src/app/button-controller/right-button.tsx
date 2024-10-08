import { Button } from 'antd';
import * as React from 'react';
import { Icons, useSection, useThemeContainer } from '@graphscope/studio-components';
interface ILeftButtonProps {}

const LeftButton: React.FunctionComponent<ILeftButtonProps> = props => {
  const { toggleRightSide } = useSection();
  const { algorithm } = useThemeContainer();
  const isDark = algorithm === 'darkAlgorithm';
  return (
    <Button
      type="text"
      icon={<Icons.Sidebar revert disabled={isDark} />}
      onClick={() => {
        toggleRightSide();
      }}
    />
  );
};

export default LeftButton;

import { Button } from 'antd';
import * as React from 'react';
import { Icons, useSection, useStudioProvier } from '@graphscope/studio-components';
interface ILeftButtonProps {}

const LeftButton: React.FunctionComponent<ILeftButtonProps> = props => {
  const { toggleRightSide } = useSection();
  const { isLight } = useStudioProvier();
  /** 夜间与白天模式 */
  const fill = !isLight ? '#ddd' : '#000';

  return (
    <Button
      type="text"
      icon={<Icons.Sidebar revert fill={fill} />}
      onClick={() => {
        toggleRightSide();
      }}
    />
  );
};

export default LeftButton;

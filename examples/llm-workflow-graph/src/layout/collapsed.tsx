import { Button, Tooltip } from 'antd';
import * as React from 'react';

import { Icons, useSection } from '@graphscope/studio-components';

interface ICollapsedButtonProps {}
const CollapsedButton: React.FunctionComponent<ICollapsedButtonProps> = props => {
  const { toggleLeftSide } = useSection();

  return (
    <Button
      style={{ transform: 'translateY(2px)' }}
      type="text"
      icon={<Icons.Sidebar />}
      onClick={() => {
        toggleLeftSide();
      }}
    />
  );
};

export default CollapsedButton;

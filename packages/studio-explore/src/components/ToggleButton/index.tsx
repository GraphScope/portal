import React from 'react';
import { Tooltip, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useSection, Icons } from '@graphscope/studio-components';

const ToogleButton = () => {
  const { toggleRightSide } = useSection();
  return (
    <Tooltip title={<FormattedMessage id="Toggle Right Side" />} placement="left">
      <Button icon={<Icons.Sidebar revert />} onClick={() => toggleRightSide()} type="text" />
    </Tooltip>
  );
};

export default ToogleButton;

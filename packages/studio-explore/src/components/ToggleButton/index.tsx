import React, { useEffect } from 'react';
import { Tooltip, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useSection, Icons } from '@graphscope/studio-components';
import { useContext } from '@graphscope/studio-graph';

export const ToogleLeftButton = () => {
  const { toggleLeftSide } = useSection();
  return (
    <Tooltip title={<FormattedMessage id="Toggle Left Side" />} placement="right">
      <Button icon={<Icons.Sidebar />} onClick={() => toggleLeftSide()} type="text" />
    </Tooltip>
  );
};
export const ToogleRightButton = () => {
  const { toggleRightSide } = useSection();
  const { store } = useContext();
  const { selectNodes } = store;
  const isEmpty = selectNodes.length === 0;
  useEffect(() => {
    if (isEmpty) {
      toggleRightSide(true);
    } else {
      toggleRightSide(false);
    }
  }, [isEmpty]);
  return (
    <Tooltip title={<FormattedMessage id="Toggle Right Side" />} placement="left">
      <Button icon={<Icons.Sidebar revert />} onClick={() => toggleRightSide()} type="text" />
    </Tooltip>
  );
};

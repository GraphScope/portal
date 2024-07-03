import { Button, Tooltip } from 'antd';
import * as React from 'react';
import { useContext } from '../useContext';
import { Icons, useSection } from '@graphscope/studio-components';
import { FormattedMessage } from 'react-intl';
interface ILeftButtonProps {}

const LeftButton: React.FunctionComponent<ILeftButtonProps> = props => {
  const { updateStore, store } = useContext();
  const { elementOptions } = store;
  const { toggleLeftSide } = useSection();
  const disabled = !elementOptions.isConnectable;
  const tooltipText = disabled ? (
    <FormattedMessage id="The current mode is preview only, and does not support opening multi-source modeling" />
  ) : (
    <FormattedMessage id="Expand or collapse multi-source modeling" />
  );
  return (
    <Tooltip title={tooltipText} placement="right">
      <Button
        type="text"
        disabled={!elementOptions.isConnectable}
        icon={<Icons.Sidebar disabled={disabled} />}
        // onClick={() => {
        //   updateStore(draft => {
        //     draft.collapsed.left = !draft.collapsed.left;
        //   });
        // }}
        onClick={() => {
          toggleLeftSide();
        }}
      />
    </Tooltip>
  );
};

export default LeftButton;

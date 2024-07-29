import { Button, Tooltip } from 'antd';
import * as React from 'react';
import { useContext } from '../useContext';
import { Icons, useSection } from '@graphscope/studio-components';
import { FormattedMessage } from 'react-intl';
interface ILeftButtonProps {}
const LeftButton: React.FunctionComponent<ILeftButtonProps> = props => {
  const { store } = useContext();
  const { elementOptions, isQueryData } = store;
  const { toggleLeftSide } = useSection();
  const disabled = !elementOptions.isConnectable || isQueryData;
  const tooltipText = disabled ? (
    <FormattedMessage id="The current mode is preview only, and does not support opening multi-source modeling" />
  ) : (
    <FormattedMessage id="Expand or collapse multi-source modeling" />
  );
  return (
    <Tooltip title={tooltipText} placement="right">
      <Button
        type="text"
        disabled={disabled}
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

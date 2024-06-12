import { Button, Tooltip } from 'antd';
import * as React from 'react';
import { useContext } from '../useContext';
import { Icons } from '@graphscope/studio-components';

interface ILeftButtonProps {}

const LeftButton: React.FunctionComponent<ILeftButtonProps> = props => {
  const { updateStore, store } = useContext();
  const { elementOptions } = store;
  const disabled = !elementOptions.isConnectable;
  const tooltipText = disabled
    ? 'The current mode is preview only, and does not support opening multi-source modeling'
    : 'Expand or collapse multi-source modeling';
  return (
    <Tooltip title={tooltipText} placement="right">
      <Button
        type="text"
        disabled={!elementOptions.isConnectable}
        icon={<Icons.Sidebar disabled={disabled} />}
        onClick={() => {
          updateStore(draft => {
            draft.collapsed.left = !draft.collapsed.left;
          });
        }}
      />
    </Tooltip>
  );
};

export default LeftButton;

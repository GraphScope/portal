import { Button, Tooltip } from 'antd';
import * as React from 'react';
import { useContext } from '@graphscope/use-zustand';
import { Icons, useSection } from '@graphscope/studio-components';
import { FormattedMessage } from 'react-intl';
interface ILeftButtonProps {}
const LeftButton: React.FunctionComponent<ILeftButtonProps> = props => {
  const { store } = useContext();
  const { elementOptions } = store;
  const { toggleLeftSide } = useSection();
  const tooltipText = elementOptions.isEditable ? (
    <FormattedMessage id="The current mode is preview only, and does not support opening multi-source modeling" />
  ) : (
    <FormattedMessage id="Expand or collapse multi-source modeling" />
  );
  /** Button disabled 不能使图标置灰 */
  const color = elementOptions.isEditable ? '#ddd' : '#000';

  return (
    <Tooltip title={tooltipText} placement="right">
      <Button
        type="text"
        disabled={elementOptions.isEditable}
        icon={<Icons.Sidebar style={{ color }} />}
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

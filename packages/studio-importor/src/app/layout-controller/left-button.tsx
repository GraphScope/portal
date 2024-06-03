import { Button } from 'antd';
import * as React from 'react';
import { updateStore } from '../useContext';
import { Icons } from '@graphscope/studio-components';

interface ILeftButtonProps {}

const LeftButton: React.FunctionComponent<ILeftButtonProps> = props => {
  return (
    <Button
      type="text"
      icon={<Icons.Sidebar />}
      onClick={() => {
        updateStore(draft => {
          draft.collapsed.left = !draft.collapsed.left;
        });
      }}
    />
  );
};

export default LeftButton;

import { Button } from 'antd';
import * as React from 'react';
import { AppstoreOutlined, CloseOutlined } from '@ant-design/icons';
import { updateStore } from '../useContext';
import SidebarIcon from '../../components/Icons/Sidebar';
interface ILeftButtonProps {}

const LeftButton: React.FunctionComponent<ILeftButtonProps> = props => {
  return (
    <Button
      type="text"
      icon={<SidebarIcon />}
      onClick={() => {
        updateStore(draft => {
          draft.collapsed.left = !draft.collapsed.left;
        });
      }}
    />
  );
};

export default LeftButton;

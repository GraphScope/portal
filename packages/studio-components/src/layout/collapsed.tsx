import { Button, Tooltip } from 'antd';
import * as React from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { Icons, useSection } from '../';

interface ICollapsedButtonProps {}
const CollapsedButton: React.FunctionComponent<ICollapsedButtonProps> = props => {
  const { toggleLeftSide, collapsed } = useSection();

  return (
    <Tooltip title="Toggle Sidebar" placement="right">
      <Button
        style={{ transform: 'translateY(2px)' }}
        type="text"
        size="small"
        // icon={<Icons.Sidebar />}
        icon={
          <MenuOutlined
            style={{
              transition: 'all 0.3s ease',
              transform: collapsed.leftSide ? 'rotate(90deg)' : 'rotate(0)',
              color: '#ddd',
            }}
          />
        }
        onClick={() => {
          toggleLeftSide();
        }}
      />
    </Tooltip>
  );
};

export default CollapsedButton;

import React from 'react';
import { BarsOutlined, InsertRowAboveOutlined, OrderedListOutlined } from '@ant-design/icons';
import { Tooltip, Segmented } from 'antd';
import Toolbar from '../../statement/toolbar';

interface IHeaderProps {
  onChangeMode: () => void;
}

const Header: React.FunctionComponent<IHeaderProps> = props => {
  const { onChangeMode } = props;
  return (
    <div style={{ position: 'relative', minHeight: '50px', lineHeight: '50px', borderBottom: '1px solid #ddd' }}>
      <div style={{}}>
        <Toolbar />
      </div>
      <div>
        <Segmented
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
          }}
          size="small"
          options={[
            {
              icon: <InsertRowAboveOutlined />,
              value: 'tabs',
            },
            { icon: <OrderedListOutlined />, value: 'flow' },
          ]}
          onChange={onChangeMode}
        />
      </div>
    </div>
  );
};

export default Header;

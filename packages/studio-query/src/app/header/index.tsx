import React from 'react';
import { BarsOutlined, InsertRowAboveOutlined, OrderedListOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Tooltip, Segmented, Button } from 'antd';
import Toolbar from '../../statement/toolbar';
import { useContext } from '../context';
interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = props => {
  const { updateStore } = useContext();
  const handleAddQuery = () => {
    updateStore(draft => {
      const num = Math.round(Math.random() * 10000);
      draft.statements.push({
        id: `query-${num}`,
        name: `query-${num}`,
        script: 'Match (n) return n limit 10',
      });
    });
  };
  const onChangeMode = value => {
    updateStore(draft => {
      draft.mode = value;
    });
  };
  return (
    <div style={{ position: 'relative', minHeight: '50px', lineHeight: '50px', borderBottom: '1px solid #ddd' }}>
      <div style={{}}>
        <Button type="text" icon={<PlayCircleOutlined />} onClick={handleAddQuery} />
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

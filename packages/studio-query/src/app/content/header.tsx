import React from 'react';
import { BarsOutlined, InsertRowAboveOutlined, OrderedListOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Tooltip, Segmented, Button, Space, Select, Flex } from 'antd';

import { useContext } from '../context';
interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = props => {
  const { updateStore } = useContext();
  const handleAddQuery = () => {
    updateStore(draft => {
      const num = Math.round(Math.random() * 10000);
      const id = `query-${num}`;
      draft.statements = [
        {
          id,
          name: id,
          script: 'Match (n) return n limit 10',
        },
        ...draft.statements,
      ];

      draft.activeId = id;
    });
  };
  const onChangeMode = value => {
    updateStore(draft => {
      draft.mode = value;
    });
  };
  return (
    <div style={{ position: 'relative', minHeight: '50px', lineHeight: '50px' }}>
      <Flex align="center" justify="space-between">
        <div style={{}}>
          <Select
            defaultValue="Cypher"
            options={[
              { value: 'Cypher', label: 'Cypher' },
              { value: 'Gremlin', label: 'Gremlin', disabled: true },
              { value: 'ISO-GQL', label: 'ISO-GQL', disabled: true },
            ]}
          />
          <Button type="text" icon={<PlayCircleOutlined />} onClick={handleAddQuery} />
        </div>

        <Segmented
          options={[
            {
              icon: <InsertRowAboveOutlined />,
              value: 'tabs',
            },
            { icon: <OrderedListOutlined />, value: 'flow' },
          ]}
          onChange={onChangeMode}
        />
      </Flex>
    </div>
  );
};

export default Header;

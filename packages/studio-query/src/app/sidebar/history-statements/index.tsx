import React, { useState } from 'react';
import { useContext } from '../../context';
import List from './list';
import type { IStudioQueryProps } from '../../context';
import { Typography, Button, Space, Flex, Checkbox } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';

const HistoryStatements = () => {
  const { store, updateStore } = useContext();
  const { historyStatements } = store;
  const [checkedList, setCheckedList] = useState([]);

  const items = historyStatements.map(item => {
    return item;
  });

  const handleClick = value => {
    const { id, script } = value;
    updateStore(draft => {
      draft.globalScript = script;
    });
  };

  const indeterminate = checkedList.length > 0 && checkedList.length < items.length;
  const checkAll = items.length === checkedList.length;
  const onCheckAllChange = e => {
    //@ts-ignore
    setCheckedList(e.target.checked ? items.map(item => item.id) : []);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '8px' }}>
      <Flex justify="space-between" align="center">
        <Typography.Title level={4} style={{ margin: '0px' }}>
          History
        </Typography.Title>

        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          <Button icon={<DeleteOutlined />} size="small" type="text"></Button>
        </Checkbox>
      </Flex>
      <List items={items} onClick={handleClick} />
    </div>
  );
};

export default HistoryStatements;

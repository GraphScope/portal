import React, { useState } from 'react';
import { useContext } from '../../context';
import List from './list';
import type { IStudioQueryProps } from '../../context';
import { Typography, Button, Space, Flex, Checkbox } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';

const HistoryStatements = props => {
  const { deleteHistoryStatements } = props;
  const { store, updateStore } = useContext();
  const { historyStatements } = store;
  const [state, updateState] = useState({
    checkedSet: new Set<string>(),
  });
  const { checkedSet } = state;

  const items = historyStatements.map(item => {
    return item;
  });

  const handleClick = value => {
    const { id, script } = value;
    updateStore(draft => {
      draft.globalScript = script;
    });
  };

  const indeterminate = checkedSet.size > 0 && checkedSet.size < items.length;
  const checkAll = items.length === checkedSet.size;
  const onCheckAllChange = e => {
    //@ts-ignore
    const newSet = e.target.checked ? new Set(items.map(item => item.id)) : new Set();
    updateCheckedSet(newSet);
  };
  const updateCheckedSet = value => {
    updateState(preState => {
      return {
        ...preState,
        checkedSet: value,
      };
    });
  };

  const handleDelete = async () => {
    const ids = [...checkedSet];
    deleteHistoryStatements(ids);
    updateStore(draft => {
      draft.historyStatements = draft.historyStatements.filter(item => {
        return ids.indexOf(item.id) === -1;
      });
    });
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '8px' }}>
      <Flex justify="space-between" align="center">
        <Typography.Title level={4} style={{ margin: '0px' }}>
          History
        </Typography.Title>

        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          <Button icon={<DeleteOutlined />} size="small" type="text" onClick={handleDelete}></Button>
        </Checkbox>
      </Flex>
      <List items={items} onClick={handleClick} checkedSet={checkedSet} updateCheckedSet={updateCheckedSet} />
    </div>
  );
};

export default HistoryStatements;

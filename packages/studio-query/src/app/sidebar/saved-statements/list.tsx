import React, { useState } from 'react';
import { useContext } from '../../context';
import { theme, Typography, Checkbox, Button, Empty, Flex } from 'antd';
import { DeleteOutlined, BookOutlined } from '@ant-design/icons';
const styles: Record<string, React.CSSProperties> = {
  ul: {
    paddingInlineStart: '0px',
    padding: '0px 12px',
    margin: '0px',
  },
  li: {
    padding: '6px 6px',
    cursor: 'pointer',
    listStyle: 'none',
    borderRadius: '8px',
    margin: '4px 0px',
    boxSizing: 'border-box',
  },
};
interface IListProps {
  items: any[];
  onClick: (value: any) => void;
  onDelete: (value: string[]) => void;
}

const List: React.FunctionComponent<IListProps> = props => {
  const { items, onClick, onDelete } = props;
  const { store, updateStore } = useContext();
  const { activeId } = store;
  const { token } = theme.useToken();

  const [state, updateState] = useState({
    checkedSet: new Set<string>(),
  });
  const { checkedSet } = state;

  const indeterminate = checkedSet.size > 0 && checkedSet.size < items.length;
  const checkAll = items.length > 0 && items.length === checkedSet.size;

  const updateCheckedSet = value => {
    updateState(preState => {
      return {
        ...preState,
        checkedSet: value,
      };
    });
  };

  const onCheckAllChange = e => {
    //@ts-ignore
    const newSet = e.target.checked ? new Set(items.map(item => item.id)) : new Set();
    updateCheckedSet(newSet);
  };

  const onChange = (id, value) => {
    if (value) {
      checkedSet.add(id);
    } else {
      checkedSet.delete(id);
    }
    updateCheckedSet(checkedSet);
  };

  return (
    <ul style={styles.ul}>
      <Checkbox
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
        checked={checkAll}
        style={{ position: 'absolute', top: '14px', right: '0px' }}
      >
        <Button
          icon={<DeleteOutlined />}
          size="small"
          type="text"
          onClick={() => {
            onDelete([...checkedSet]);
          }}
        ></Button>
      </Checkbox>
      {items.map(item => {
        const activeStyles =
          activeId === item.id
            ? {
                // background: token.colorBgTextHover,
              }
            : {
                // background: token.colorBgTextHover,
              };
        const checked = checkedSet.has(item.id);

        return (
          <li
            key={item.id}
            style={{ ...styles.li, ...activeStyles }}
            onClick={() => {
              onClick && onClick(item);
            }}
            className="gs-query-list-item"
          >
            <Checkbox
              checked={checked}
              onChange={e => onChange(item.id, e.target.checked)}
              style={{ paddingRight: '4px' }}
            ></Checkbox>
            <Typography.Text>{item.name} </Typography.Text>
          </li>
        );
      })}
    </ul>
  );
};

export default List;

import React, { useState } from 'react';
import { IStatement } from '../../context';
import { Typography, Checkbox, Button, Flex } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    flex: 1,
    height: '100%',
  },
  list: {
    flex: 1,
    height: '100%',
    overflow: 'scroll',
  },
  ul: {
    paddingInlineStart: '0px',
    boxSizing: 'border-box',
    margin: '0px',
  },
  li: {
    cursor: 'pointer',
    listStyle: 'none',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'start',
    gap: '4px',
    padding: '6px 6px 6px 6px',
  },
};
interface IListProps {
  items: IStatement[];
  onClick: (value: any) => void;
  onDelete: (ids: string[]) => void;
  actionStyle?: React.CSSProperties;
}

const List: React.FunctionComponent<IListProps> = props => {
  const { items, onClick, onDelete, actionStyle } = props;

  const [state, updateState] = useState({
    checkedSet: new Set<string>(),
  });
  const { checkedSet } = state;

  const convertItems = convertTimestamps(items);

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
    <>
      <div style={{ position: 'absolute', top: '14px', right: '0px', ...actionStyle }}>
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          <Button
            icon={<DeleteOutlined />}
            size="small"
            type="text"
            onClick={() => {
              onDelete([...checkedSet]);
            }}
          ></Button>
        </Checkbox>
      </div>

      <Flex
        vertical
        flex={1}
        style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <div style={styles.list}>
          {convertItems.map(item => {
            const { day, items } = item;
            return (
              <div key={day}>
                <Title
                  level={5}
                  style={{
                    padding: '12px 12px',
                    margin: '0px',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'white' /* Add a background color if needed */,
                    zIndex: 100 /* Ensure the header stays on top of other elements */,
                  }}
                >
                  {day}
                </Title>
                <ul style={styles.ul}>
                  {items.map(item => {
                    const { hours, id } = item;
                    const checked = checkedSet.has(id);

                    return (
                      <li key={item.id} style={styles.li} className="gs-query-list-item">
                        <Checkbox
                          checked={checked}
                          onChange={e => onChange(item.id, e.target.checked)}
                          style={{ marginTop: '8px' }}
                        ></Checkbox>

                        <pre
                          style={{
                            background: '#f4f5f5',
                            overflow: 'hidden',
                            textWrap: 'pretty',
                            padding: '6px 12px',
                            fontSize: '12px',
                            margin: '2px 6px 2px 0px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            flex: 1,
                          }}
                          onClick={() => {
                            onClick && onClick(item);
                          }}
                        >
                          <div style={{ fontSize: '12px', padding: '4px 0px 8px 0px', color: '#767676' }}>{hours}</div>
                          <code>{item.script}</code>
                        </pre>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </Flex>
    </>
  );
};

export default List;

export function convertTimestamps(timestamps) {
  const a = timestamps.sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  return a.reduce((result, entry) => {
    const date = dayjs(entry.timestamp);
    const day = date.format('YYYY-MM-DD');
    const hours = date.format('HH:mm');

    const existingDate = result.find(item => item.day === day);

    if (existingDate) {
      existingDate.items.push({
        ...entry,
        hours,
      });
    } else {
      result.push({
        day,
        items: [
          {
            ...entry,
            hours,
          },
        ],
      });
    }
    return result;
  }, []);
}

import React, { useState } from 'react';
import { IStatement } from '../../context';
import { Typography, Checkbox, Button, Flex, theme, Empty } from 'antd';
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { useToken } = theme;
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
    padding: '6px 12px',
    gap: '4px',
  },
};
interface IListProps {
  items: IStatement[];
  onClick: (value: any) => void;
  onDelete: (ids: string[]) => void;
  actionStyle?: React.CSSProperties;
  group?: boolean;
  placeholder?: React.ReactNode;
}

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
const List = props => {
  const { items, checkedSet, batch, onChange, onClick } = props;
  const { token } = useToken();
  return (
    <ul style={styles.ul}>
      {items.map(item => {
        const { hours, id, name, timestamp } = item;
        const checked = checkedSet.has(id);
        const title = name || hours || dayjs(timestamp).format('YYYY-MM-DD HH:mm');

        return (
          <li key={item.id} style={styles.li} className="gs-query-list-item">
            {batch && <Checkbox checked={checked} onChange={e => onChange(item.id, e.target.checked)}></Checkbox>}

            <pre
              style={{
                background: '#f4f5f5',
                overflow: 'hidden',
                textWrap: 'pretty',
                padding: '6px 14px',
                fontSize: '12px',
                border: '1px solid transparent',
                borderRadius: '6px',
                flex: 1,
                margin: '0px',
              }}
              className="statement-list-item-pre"
              onClick={() => {
                onClick && onClick(item);
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  padding: '4px 0px 12px 0px',
                  color: token.colorTextDescription,
                  fontStyle: 'italic',
                }}
              >
                {title}
              </div>
              <code style={{ fontSize: '12px', color: token.colorTextHeading }}>{item.script}</code>
            </pre>
          </li>
        );
      })}
    </ul>
  );
};
const GroupList = props => {
  const { items, batch, checkedSet, onChange, onClick } = props;
  const convertItems = convertTimestamps(items);
  return (
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
            <List items={items} batch={batch} checkedSet={checkedSet} onChange={onChange} onClick={onClick} />
          </div>
        );
      })}
    </div>
  );
};

const StatementList: React.FunctionComponent<IListProps> = props => {
  const { items, onClick, onDelete, actionStyle, group, placeholder } = props;

  const [state, updateState] = useState({
    checkedSet: new Set<string>(),
    batch: false,
  });
  const { checkedSet, batch } = state;

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

  const isEmpty = items.length == 0;
  if (isEmpty && placeholder) {
    return (
      <div style={{ padding: '120px 0px' }}>
        <Empty
          imageStyle={{ height: '80px' }}
          description={<Typography.Text style={{ fontSize: '12px' }}>{placeholder}</Typography.Text>}
        ></Empty>
      </div>
    );
  }
  return (
    <>
      <div style={{ position: 'absolute', top: '14px', right: '8px', ...actionStyle }}>
        {batch && (
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
        )}
        <Button
          icon={batch ? <MoreOutlined /> : <EditOutlined />}
          size="small"
          type="text"
          onClick={() => {
            updateState(pre => {
              return {
                ...pre,
                batch: !pre.batch,
              };
            });
          }}
        ></Button>
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
        {group ? (
          <GroupList items={items} batch={batch} checkedSet={checkedSet} onChange={onChange} onClick={onClick} />
        ) : (
          <div style={styles.list}>
            <List items={items} batch={batch} checkedSet={checkedSet} onChange={onChange} onClick={onClick} />
          </div>
        )}
      </Flex>
    </>
  );
};

export default StatementList;

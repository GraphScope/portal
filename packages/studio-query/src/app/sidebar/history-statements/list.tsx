import * as React from 'react';
import { IStatement, useContext } from '../../context';
import { theme, Typography, Checkbox, Space } from 'antd';
import dayjs from 'dayjs';
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const { Text, Title } = Typography;

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100%',
    overflow: 'scroll',
  },
  ul: {
    paddingInlineStart: '0px',
    boxSizing: 'border-box',
  },
  li: {
    padding: '4px 8px 4px 0px',
    cursor: 'pointer',
    listStyle: 'none',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'start',
    gap: '4px',
  },
};
interface IListProps {
  items: IStatement[];
  onClick: (value: any) => void;
  checkedSet: Set<string>;
  updateCheckedSet: (value: Set<string>) => void;
}

const List: React.FunctionComponent<IListProps> = props => {
  const { items, onClick, checkedSet, updateCheckedSet } = props;
  const { store, updateStore } = useContext();
  const { activeId } = store;
  const { token } = theme.useToken();

  const convertItems = convertTimestamps(items);

  const onChange = (id, value) => {
    if (value) {
      checkedSet.add(id);
    } else {
      checkedSet.delete(id);
    }
    updateCheckedSet(checkedSet);
  };

  return (
    <div style={styles.container}>
      {convertItems.map(item => {
        const { day, items } = item;

        return (
          <>
            <Title
              level={5}
              style={{
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
                  <li key={item.id} style={styles.li}>
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
                        margin: '2px 0px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                      }}
                      onClick={() => {
                        onClick && onClick(item);
                      }}
                    >
                      <div style={{ fontSize: '12px', padding: '4px 0px' }}>{hours}</div>

                      <code>{item.script}</code>
                    </pre>
                  </li>
                );
              })}
            </ul>
          </>
        );
      })}
    </div>
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

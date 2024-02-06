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
    padding: '8px 16px',
    cursor: 'pointer',
    listStyle: 'none',
    boxSizing: 'border-box',
  },
};
interface IListProps {
  items: IStatement[];
  onClick: (value: any) => void;
}

const List: React.FunctionComponent<IListProps> = props => {
  const { items, onClick } = props;
  const { store, updateStore } = useContext();
  const { activeId } = store;
  const { token } = theme.useToken();

  const convertItems = convertTimestamps(items);

  const onChange = () => {};

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
                const { hours } = item;
                return (
                  <li
                    key={item.id}
                    style={styles.li}
                    onClick={() => {
                      onClick && onClick(item);
                    }}
                  >
                    <Space>
                      <Checkbox onChange={onChange}></Checkbox>
                      <Text type="secondary">{hours}</Text>
                    </Space>
                    <pre
                      style={{
                        border: '1px solid #ddd',
                        background: '#f4f5f5',
                        overflow: 'hidden',
                        textWrap: 'pretty',
                        padding: '12px',
                        borderRadius: '6px',
                      }}
                    >
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
  return timestamps.reduce((result, entry) => {
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

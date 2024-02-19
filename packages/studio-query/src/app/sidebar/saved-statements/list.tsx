import * as React from 'react';
import { useContext } from '../../context';
import { theme } from 'antd';
const styles: Record<string, React.CSSProperties> = {
  ul: {
    paddingInlineStart: '0px',
    padding: '12px',
  },
  li: {
    padding: '8px 16px',
    cursor: 'pointer',
    listStyle: 'none',
    borderRadius: '8px',
  },
};
interface IListProps {
  items: any[];
  onClick: (value: any) => void;
}

const List: React.FunctionComponent<IListProps> = props => {
  const { items, onClick } = props;
  const { store, updateStore } = useContext();
  const { activeId } = store;
  const { token } = theme.useToken();
  return (
    <ul style={styles.ul}>
      {items.map(item => {
        const activeStyles =
          activeId === item.id
            ? {
                background: token.colorBgTextHover,
              }
            : {};

        return (
          <li
            key={item.id}
            style={{ ...styles.li, ...activeStyles }}
            onClick={() => {
              onClick && onClick(item);
            }}
          >
            {item.name}
          </li>
        );
      })}
    </ul>
  );
};

export default List;

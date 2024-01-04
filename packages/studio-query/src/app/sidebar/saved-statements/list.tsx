import * as React from 'react';

const styles: Record<string, React.CSSProperties> = {
  li: {
    padding: '8px',
    cursor: 'pointer',
  },
};
interface IListProps {
  items: any[];
  onClick: (value: any) => void;
}

const List: React.FunctionComponent<IListProps> = props => {
  const { items, onClick } = props;
  return (
    <ul>
      {items.map(item => {
        return (
          <li
            key={item.id}
            style={styles.li}
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

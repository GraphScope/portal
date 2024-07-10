import * as React from 'react';
import { Typography, Flex } from 'antd';
interface ITableCardProps {
  data: {
    label: string;
  };
  _fromEdge: boolean;
}
const properties = [
  {
    key: 'id',
    type: 'string',
    index: 0,
  },
  {
    key: 'age',
    type: 'int',
    index: 1,
  },
  {
    key: 'time',
    type: 'int',
    index: 2,
  },
  {
    key: 'account',
    type: 'number',
    index: 3,
  },
];
const edgeProperties = [
  {
    key: 'source',
    type: 'string',
    index: 0,
  },
  {
    key: 'target',
    type: 'int',
    index: 1,
  },
];
const styles: Record<string, React.CSSProperties> = {
  ul: {
    margin: '0px',
    padding: '0px',
  },
  li: {
    padding: '4px 8px',
    display: 'flex',
    justifyContent: 'space-between',
  },
};
const TableCard: React.FunctionComponent<ITableCardProps> = props => {
  const { data, _fromEdge } = props;
  //@ts-ignore
  const { label, properties = [] } = data;

  const tableStyle = _fromEdge
    ? {
        border: '1px dashed #000',
        backgroundColor: '#F6F7F9',
        borderRadius: '6px',
        // height: '60px',
        width: '250px',
        borderTop: '4px solid blue',
      }
    : {
        border: '1px solid #ddd',
        backgroundColor: '#F6F7F9',
        borderRadius: '6px',
        width: '250px',
        // height: '200px',
        borderTop: '4px solid red',
      };
  const p = _fromEdge ? edgeProperties : properties;

  return (
    <div style={tableStyle}>
      <div style={{ borderBottom: '1px solid #ddd', padding: '6px 12px' }}>{label}</div>
      <div>
        <ul style={styles.ul}>
          {p.map(item => {
            return (
              <li key={item.key} style={styles.li}>
                <span>{item.key}</span>
                <span style={{ color: '#9d9d9d' }}> {item.type}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TableCard;

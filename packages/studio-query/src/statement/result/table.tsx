import React, { useEffect } from 'react';

interface ITableViewProps {
  data: any;
}

const TableView: React.FunctionComponent<ITableViewProps> = props => {
  useEffect(() => {
    return () => {
      console.log('unmount....graph');
    };
  }, []);
  return <div>tableView</div>;
};

export default TableView;

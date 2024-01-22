import * as React from 'react';
import { Table} from 'antd';

interface IImportDataProps {}
interface DataType {
  key: string;
  title: string;
  dataIndex: string;
}
const TableList: React.FunctionComponent<IImportDataProps> = props => {
  const columns: DataType[] = [
    {
      title: 'label_name',
      dataIndex: 'label_name',
      key: 'label_name',
    },
    {
      title: 'property_name',
      dataIndex: 'property_name',
      key: 'property_name',
    },
    {
      title: 'property_type',
      dataIndex: 'property_type',
      key: 'property_type',
    },
    {
      title: 'primary_keys',
      dataIndex: 'primary_keys',
      key: 'primary_keys',
    },
  ];
  return <Table columns={columns} dataSource={[]} />

};

export default TableList;

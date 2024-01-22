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
      title: 'label_type',
      dataIndex: 'label_type',
      key: 'label_type',
    },
    {
      title: 'label_name',
      dataIndex: 'label_name',
      key: 'label_name',
    },
    {
      title: 'source_label',
      dataIndex: 'source_label',
      key: 'source_label',
    },
    {
      title: 'target_label',
      dataIndex: 'target_label',
      key: 'target_label',
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
  return (
    <>
      <Table
        columns={columns?.filter(item => !['source_label', 'target_label'].includes(item?.title))}
        dataSource={[]}
      />
      <Table columns={columns?.filter(item => item?.title !== 'label_name')} dataSource={[]} />
    </>
  );
};

export default TableList;

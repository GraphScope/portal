import * as React from 'react';
import { Table,Tag} from 'antd';

interface IImportDataProps {
  data:{ type?:string;label_name:string; property_name?:string; property_type?:string; primary_keys?:boolean}[]
}
interface DataType {
  key: string;
  title: string;
  dataIndex?: string;
  render?:(val:{type:string,label_name:string})=>any;
}
const TableList: React.FunctionComponent<IImportDataProps> = props => {
  const {data}=props
  const columns: DataType[] = [
    {
      title: 'label_name',
      key: 'label_name',
      render:(record)=>{
        return <>{record?.type && (record?.type == 'Node' ? <Tag color='magenta'>{record?.type}</Tag>:<Tag color='green'>{record?.type}</Tag>)}{record?.label_name}</>
      }
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
  return <Table columns={columns} dataSource={data} pagination={false} scroll={{y:'60vh'}}/>

};

export default TableList;

import * as React from 'react';
import { Table,Tag} from 'antd';
import { FormattedMessage } from 'react-intl';
interface IImportDataProps {
  data:{ type?:string;label_name:string; property_name?:string; property_type?:string; primary_keys?:boolean}[]
}
interface DataType {
  key: string;
  title: React.ReactNode;
  dataIndex?: string;
  render?:(val:{type:string,label_name:string})=>any;
}
const TableList: React.FunctionComponent<IImportDataProps> = props => {
  const {data}=props
  const columns: DataType[] = [
    {
      title: <FormattedMessage id='label_name'/>,
      key: 'label_name',
      render:(record)=>{
        return <>{record?.type && (record?.type == 'Node' ? <Tag color='magenta'>{record?.type}</Tag>:<Tag color='green'>{record?.type}</Tag>)}{record?.label_name}</>
      }
    },
    {
      title: <FormattedMessage id='property_name'/>,
      dataIndex: 'property_name',
      key: 'property_name',
    },
    {
      title: <FormattedMessage id='property_type'/>,
      dataIndex: 'property_type',
      key: 'property_type',
    },
    {
      title: <FormattedMessage id='property_keys'/>,
      dataIndex: 'primary_keys',
      key: 'primary_keys',
    },
  ];
  return <Table columns={columns} dataSource={data} pagination={false} scroll={{y:'60vh'}}/>

};

export default TableList;

import React from 'react';
import { Space, Table, Tag, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { history } from 'umi';
import { useContext } from '@/pages/instance/create-instance/valtio/createGraph';

interface DataType {
  key: string;
  name: string;
  schema: string;
  gremlin_interface: string;
}
const data: DataType[] = [
  {
    key: '1',
    name: 'Instance',
    schema: '',
    gremlin_interface: 'New York No. 1 Lake Park',
  },
  {
    key: '1',
    name: 'Instance',
    schema: '',
    gremlin_interface: 'New York No. 1 Lake Park',
  }
];

const Lists: React.FC = () => {
  const { store, updateStore } = useContext();
  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      width: '10%',
    },
    {
      title: 'Schema',
      key: 'schema',
      width: '35%',
      render: (record: any) => <Button style={{ color: '#1650FF' }} onClick={()=>{history.push('/instance/create');updateStore(draft=>draft.detail = true)}}>Schema</Button>,
    },
    {
      title: 'Detail',
      key: 'Detail',
      dataIndex: 'gremlin_interface',
      width: '20%',
    },
    {
      title: 'Action',
      key: 'action',
      width: '35%',
      render: (_: any, record) => (
        <Space>
          <Button disabled={_.type == 'GrootGraph'}>Start Service</Button>
          <Button danger>Stop Service</Button>
          <Button danger >Deleta</Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <div style={{display:'flex',justifyContent:'space-between'}}>
        <h3>Instance List</h3>
        <Button onClick={()=>{history.push('/instance/create');updateStore(draft=>draft.detail = false)}}>Create Graph Instance</Button>
      </div>
      <Table columns={columns} dataSource={data} bordered/>
    </>
  );
};

export default Lists;

import { useEffect, useState } from 'react';
import { Table, Button, Tag } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { getDeploymentInfo } from './service';
import ShrinkComponent from './shrink-component';
/** 状态设置颜色 */
const statusColor = [
  {
    status: 'Running',
    color: 'blue',
    icon: <LoadingOutlined />,
  },
  {
    status: 'Waiting',
    color: 'warning',
    icon: <LoadingOutlined />,
  },
  {
    status: 'Terminated',
    color: 'red',
  },
];
interface DeploymentProps {}

const DeploymentList: React.FunctionComponent<DeploymentProps> = props => {
  const [deploymentData, setDeploymentData] = useState([]);

  useEffect(() => {
    getDeploymentInfoList();
  }, []);
  const getDeploymentInfoList = async () => {
    try {
      const res = await getDeploymentInfo();
      console.log(res);
      setDeploymentData([res]);
    } catch (error) {
      console.log(error);
    }
  };
  const columns: {
    title: string;
    dataIndex?: string;
    key: string;
    width?: string | number;
    render?: (record: string, all: any) => React.ReactNode;
  }[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: '10%',
      render: (record: string, all: { image: string[] }) => {
        const { image } = all;
        return (
          <>
            {image?.map(img => {
              let color = img.length > 5 ? 'geekblue' : 'green';
              if (img === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={img}>
                  {img}
                </Tag>
              );
            })}
          </>
        );
      },
    },
    {
      title: 'Label',
      key: 'labels',
      dataIndex: 'labels',
      width: '15%',
      render: (record: string, all: { name: string; labels: string[] }) => {
        const { name, labels } = all;
        return <ShrinkComponent result={labels} name={name} num={3} />;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '5%',
      render: (record: string) => {
        return (
          <>
            {statusColor.map((item, index) => {
              return (
                item.status == record && (
                  <Tag key={index} icon={item.icon} color={item.color}>
                    {record}
                  </Tag>
                )
              );
            })}
          </>
        );
      },
    },
    {
      title: 'Restart Count',
      dataIndex: 'restart_count',
      key: 'restart_count',
      width: '10%',
    },
    {
      title: 'CPU Usage',
      dataIndex: 'cpu_usage',
      key: 'cpu_usage',
      width: '5%',
      render: (record: string) => (
        <Button style={{ backgroundColor: '#00CD66', color: '#fff', width: '110px' }}>{record}m</Button>
      ),
    },
    {
      title: 'Memory Usage',
      dataIndex: 'memory_usage',
      key: 'memory_usage',
      width: '10%',
      render: (record: string) => (
        <Button style={{ backgroundColor: '#1E90FF', color: '#fff', width: '110px' }}>{record}Mi</Button>
      ),
    },
    {
      title: 'Create Time',
      dataIndex: 'creation_time',
      key: 'creation_time',
      width: '10%',
    },
    {
      title: 'Actions',
      key: 'action',
      width: '15%',
      render: (all: any) => (
        <Button
          type="primary"
          // onClick={() => {
          //   history.push('/log', all);
          // }}
        >
          <span>View Log</span>
        </Button>
      ),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={[
        {
          name: 'string',
          container: ['string'],
          image: ['string'],
          labels: ['string'],
          node: 'string',
          status: 'string',
          restart_count: 0,
          cpu_value: 0,
          memory_value: 0,
          timestamp: 'string',
          creation_time: 'string',
        },
      ]}
    />
  );
};

export default DeploymentList;

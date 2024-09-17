import React, { useEffect, useState } from 'react';
import { Typography, Table, Space, Flex, Button, Checkbox, Switch, Progress } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Utils } from '@graphscope/studio-components';
import { render } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import type { IEntity } from '../../dataset/typing';
import { getExtractResult } from '../../dataset/service';
interface IListProps {
  dataSource: IEntity[];
  datasetId: string;
}

const List: React.FunctionComponent<IListProps> = props => {
  const { datasetId } = props;
  const navigate = useNavigate();
  const [state, setState] = useState({
    more: false,
    dataSource: [],
  });
  const { more, dataSource } = state;
  const queryEntities = async () => {
    const data = await getExtractResult(datasetId);
    console.log('data', data);
    const dataSource = data.map(item => {
      const { node_name, papers, progress } = item;

      return {
        id: node_name,
        progress,
      };
    });
    setState(preState => {
      return {
        ...preState,
        dataSource: dataSource,
      };
    });
  };
  useEffect(() => {
    queryEntities();
  }, []);
  const handleCluster = record => {
    console.log(record);
    const { id } = record;
    navigate(`/dataset/cluster?datasetId=${datasetId}&entityId=${id}`);
  };

  const columns = [
    {
      title: 'Entity',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      render: value => {
        return <Progress percent={value} size="small" status="active" />;
      },
    },
    {
      title: 'Original Enums',
      key: 'value',
      dataIndex: 'value',
    },
    {
      title: 'Cluster Enums',
      key: 'count',
      dataIndex: 'count',
    },
    {
      title: 'Clustered',
      key: 'summarized',
      render: (record: IEntity) => {
        const { summarized } = record;
        return <Switch checked={summarized} size="small" disabled />;
      },
    },
    {
      title: 'Operator',
      render: (record: IEntity) => {
        // return <Button icon={<Icons.Cluster />} size="small" type="text" />;
        const { summarized } = record;
        return (
          <Typography.Link
            disabled={summarized}
            onClick={() => {
              handleCluster(record);
            }}
          >
            cluster
          </Typography.Link>
        );
      },
      fixed: 'right',
      width: 80,
    },
  ];
  const handleToggle = () => {
    setState({
      ...state,
      more: !state.more,
    });
  };
  const height = more ? 'auto' : '160px';
  const icon = more ? <CaretDownOutlined /> : <CaretUpOutlined />;

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Flex justify="space-between" style={{ paddingBottom: '8px' }}>
        <Typography.Text>Extract entities and relationships</Typography.Text>
        <Button icon={icon} type="text" onClick={handleToggle}>
          More
        </Button>
      </Flex>

      <Table
        size="small"
        dataSource={dataSource}
        //@ts-ignore
        columns={columns}
        style={{ width: '100%', height: height, overflow: 'hidden', transition: 'all 0.3s ease' }}
      />
    </div>
  );
};

export default List;

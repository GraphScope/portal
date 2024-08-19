import React, { useState } from 'react';
import { Typography, Table, Space, Flex, Button, Checkbox, Switch } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Icons } from '@graphscope/studio-components';
import { render } from 'react-dom';
interface IListProps {}

const List: React.FunctionComponent<IListProps> = props => {
  const [state, setState] = useState({
    more: false,
  });
  const { more } = state;
  const dataSource = [
    {
      key: 'challenge',
      entity: 'Challenge',
      cost: '1 hours',
      enums: '110',
      clustered: true,
    },
    {
      key: 'task',
      entity: 'Task',
      cost: '2 hours',
      enums: '210',
      clustered: false,
    },
    {
      key: 'solution',
      entity: 'Solution',
      cost: '1 hours',
      enums: '310',
      clustered: false,
    },
    {
      key: 'Paper',
      entity: 'Paper',
      cost: '3 hours',
      enums: '410',
      clustered: false,
    },
  ];
  const columns = [
    {
      title: 'Entity',
      key: 'entity',
      dataIndex: 'entity',
    },
    {
      title: 'Enums',
      key: 'enums',
      dataIndex: 'enums',
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
    },
    {
      title: 'Clustered',
      key: 'clustered',
      dataIndex: 'clustered',
      render: (clustered: boolean) => {
        return <Switch checked={clustered} size="small" disabled />;
      },
    },
    {
      title: 'Operator',
      render: () => {
        // return <Button icon={<Icons.Cluster />} size="small" type="text" />;
        return <Typography.Link>cluster</Typography.Link>;
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

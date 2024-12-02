import React, { useState } from 'react';
import { Space, Flex, Typography, Tooltip, Button } from 'antd';

import ChartView from './ChartView';
import { Utils } from '@graphscope/studio-components';
import { QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons';

export interface IQueryPropertyStatics {
  id: 'queryPropertyStatics';
  query: (property: string) => Promise<{ [key: string]: any }>;
}

const Properties = props => {
  const [state, setState] = useState({
    charts: [
      {
        id: Utils.uuid(),
        property: undefined,
      },
    ],
  });
  const handleAdd = () => {
    setState(preState => {
      return {
        ...preState,
        charts: [
          ...preState.charts,
          {
            id: Utils.uuid(),
            property: undefined,
          },
        ],
      };
    });
  };
  const handleRemove = (id: string) => {
    setState(preState => {
      return {
        ...preState,
        charts: preState.charts.filter(item => item.id !== id),
      };
    });
  };

  const { charts } = state;

  return (
    <Flex vertical gap={12}>
      <Flex justify="space-between">
        <Typography.Title level={5} style={{ margin: '0px' }}>
          Properties Statistics
        </Typography.Title>
        <Space>
          <Tooltip title="Add Property Statistics">
            <Button onClick={handleAdd} type="text" icon={<PlusOutlined />}></Button>
          </Tooltip>
          <Tooltip
            title={` Select the properties you're interested in for statistical display, and click on the bar chart for quick
              queries.`}
          >
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
      </Flex>
      <Flex vertical gap={12}>
        {charts.map(item => {
          return <ChartView property={item.property} key={item.id} onRemove={() => handleRemove(item.id)} />;
        })}
      </Flex>
    </Flex>
  );
};
export default Properties;

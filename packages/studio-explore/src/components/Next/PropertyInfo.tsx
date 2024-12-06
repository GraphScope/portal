import { Flex, Typography } from 'antd';
import * as React from 'react';
import type { GraphData, NodeData, EdgeData } from '@graphscope/studio-graph';

interface IPropertyInfoProps {
  data: NodeData | EdgeData;
}

const PropertyInfo: React.FunctionComponent<IPropertyInfoProps> = props => {
  const { data } = props;
  const { id, properties = {} } = data;
  console.log('data', data);
  return (
    <Flex
      vertical
      gap={12}
      style={{ overflowY: 'scroll', height: 'calc(100vh - 100px)', padding: '0px 28px', margin: '0px -28px' }}
    >
      {Object.keys(properties).map(key => {
        return (
          <Flex key={key} vertical gap={6}>
            <Typography.Text type="secondary">{key}</Typography.Text>
            <Typography.Text>{properties[key] || '-'}</Typography.Text>
          </Flex>
        );
      })}
    </Flex>
  );
};

export default PropertyInfo;

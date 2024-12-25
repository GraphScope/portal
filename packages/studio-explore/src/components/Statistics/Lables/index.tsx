import React, { useEffect, useState } from 'react';

import { useContext, IQueryStatement, SchemaView, type GraphData } from '@graphscope/studio-graph';

import { Flex, Typography } from 'antd';
interface ILabelsProps {}

const Labels: React.FunctionComponent<ILabelsProps> = props => {
  return (
    <Flex gap={12} style={{ width: '100%', height: '200px' }} vertical>
      <Typography.Title level={5} style={{ margin: '0px' }}>
        Labels Statistics
      </Typography.Title>
      <SchemaView id="explore-schema-view" />
    </Flex>
  );
};

export default Labels;

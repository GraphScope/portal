import React from 'react';
import { Flex, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import Result from '@/components/icons/result';
const { Text } = Typography;
const ResultSuccess: React.FC = () => (
  <Flex vertical style={{ marginTop: '10%' }}>
    <Result style={{}} />
    <Text style={{ textAlign: 'center', marginTop: '12px' }}>
      <FormattedMessage id="Congratulations on successfully creating the graph! You are now encouraged to bind and import the graph data." />
    </Text>
  </Flex>
);

export default ResultSuccess;

import React from 'react';
import { Flex, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import Result from '@/components/icons/result';
const { Text } = Typography;
const ResultSuccess: React.FC = () => (
  <Flex vertical style={{ marginTop: '10%' }}>
    <Result style={{}} />
    <Text style={{ textAlign: 'center', marginTop: '12px' }}>
      <FormattedMessage id="Congratulations on the successful creation of the model, now let's start to guide the data." />
    </Text>
  </Flex>
);

export default ResultSuccess;

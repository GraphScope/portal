import * as React from 'react';
import InstanceLists from './lists';
import { Button, Flex, Typography } from 'antd';
import Section from '../../components/section';
import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import CreateInstance from './create';
import FeatureCase from '../../components/feature-case';
const Instance: React.FunctionComponent = () => {
  return (
    <Section
      breadcrumb={[
        {
          title: <FormattedMessage id="Graphs" />,
        },
      ]}
      style={{ padding: '0px 20px' }}
    >
      <Flex align="end" justify="flex-start" style={{ padding: '16px 0px' }}>
        <FeatureCase match="MULTIPLE_GRAPHS">
          <CreateInstance />
        </FeatureCase>
      </Flex>
      <InstanceLists />
    </Section>
  );
};

export default Instance;

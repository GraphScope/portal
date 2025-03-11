import * as React from 'react';
import InstanceLists from './lists';
import { Button, Flex, Typography } from 'antd';
import Section from '../../components/section';
import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import CreateInstance from './create';
import FeatureCase from '../../components/feature-case';
const Instance: React.FunctionComponent = () => {
  const [showCreateAction, setShowCreateAction] = React.useState(true);
  return (
    <Section
      breadcrumb={[
        {
          title: <FormattedMessage id="Graphs" />,
        },
      ]}
    >
      {showCreateAction && (
        <Flex justify="end">
          <FeatureCase match="MULTIPLE_GRAPHS">
            <CreateInstance />
          </FeatureCase>
        </Flex>
      )}
      <InstanceLists changeCreateAction={setShowCreateAction} />
    </Section>
  );
};

export default Instance;

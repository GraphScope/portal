import * as React from 'react';
import InstanceLists from './lists';
import { Button, Flex, Typography } from 'antd';
import Section from '../../components/section';
import { PlusOutlined } from '@ant-design/icons';
const Instance: React.FunctionComponent = () => {
  return (
    <Section
      breadcrumb={[
        {
          title: 'Graphs',
        },
      ]}
      desc="Listing all graphs on the cluster"
      style={{ padding: '0px 20px' }}
    >
      <Flex align="end" justify="flex-start" style={{ padding: '16px 0px' }}>
        {/* <Typography.Text type="secondary"> List all graphs</Typography.Text> */}
        <Button type="primary" icon={<PlusOutlined />}>
          Create graph instance
        </Button>
      </Flex>
      <InstanceLists />
    </Section>
  );
};

export default Instance;

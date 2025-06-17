import * as React from 'react';
import { Divider, Card, Row, Col, Typography, Flex, Switch } from 'antd';
import Section from '../../components/section';
import InteractTheme from './interact-theme';
import PrimaryColor from './primary-color';
import RoundedCorner from './rounded-corner';
import International from './International';

import QuerySetting from './query-setting';
import { FormattedMessage } from 'react-intl';
import Coordinator from './coordinator';
import GraphyPlugin from './plugins/graphy';
import ExplorePlugin from './plugins/explore';
import { Utils } from '@graphscope/studio-components';

const Setting: React.FunctionComponent = () => {
  const [whetherMockLLM, setWhetherMockLLM] = React.useState(() => {
    const val = Utils.storage.get('WhetherMockLLM');
    return val === true || val === 'true';
  });

  const handleSwitchChange = (checked: boolean) => {
    setWhetherMockLLM(checked);
    Utils.storage.set('WhetherMockLLM', checked);
  };

  return (
    <Section
      breadcrumb={[
        {
          title: <FormattedMessage id="Settings" />,
        },
      ]}
      desc="Change how Untitled UI looks and feels in your browser"
    >
      <Row gutter={16}>
        <Col span={12} xs={24} md={12} lg={12}>
          <Flex gap={12} vertical>
            <Card
              title={
                <Typography.Title level={4}>
                  <FormattedMessage id="System Setting" />
                </Typography.Title>
              }
            >
              <Coordinator />
              <Divider />
              <International />
              <Divider />
            </Card>
            <Card
              title={
                <Typography.Title level={4}>
                  <FormattedMessage id="Querying Setting" />
                </Typography.Title>
              }
            >
              <QuerySetting />
            </Card>
          </Flex>
        </Col>
        <Col span={12} xs={24} md={12} lg={12}>
          <Flex gap={12} vertical>
            <Card
              title={
                <Typography.Title level={4}>
                  <FormattedMessage id="Appearance Setting" />
                </Typography.Title>
              }
            >
              <InteractTheme />
              <Divider />
              <PrimaryColor />
              <Divider />
              <RoundedCorner />
              <Divider />
              <Flex align="center" gap={8}>
                <Typography.Text>WhetherMockLLM</Typography.Text>
                <Switch checked={whetherMockLLM} onChange={handleSwitchChange} />
              </Flex>
            </Card>
            <Card
              title={
                <Typography.Title level={4}>
                  <FormattedMessage id="Experimental Tools" />
                </Typography.Title>
              }
            >
              <Flex vertical gap={24}>
                <ExplorePlugin />
                <Divider />
                <GraphyPlugin />
              </Flex>
            </Card>
          </Flex>
        </Col>
      </Row>
    </Section>
  );
};

export default Setting;

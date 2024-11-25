import * as React from 'react';
import { Divider, Card, Row, Col, Typography, Flex } from 'antd';
import Section from '../../components/section';
import InteractTheme from './interact-theme';
import PrimaryColor from './primary-color';
import RoundedCorner from './rounded-corner';
import International from './International';

import QuerySetting from './query-setting';
import { FormattedMessage } from 'react-intl';
import Coordinator from './coordinator';
import GraphyPlugin from './plugins/graphy';

const Setting: React.FunctionComponent = () => {
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
            </Card>
            <Card
              title={
                <Typography.Title level={4}>
                  <FormattedMessage id="Experimental Tools" />
                </Typography.Title>
              }
            >
              <GraphyPlugin />
            </Card>
          </Flex>
        </Col>
      </Row>
    </Section>
  );
};

export default Setting;

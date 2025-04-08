import * as React from 'react';
import { Divider, Card, Row, Col, Typography, Flex } from 'antd';
import Section from '../../components/section';
import PrimaryColor from './primary-color';
import RoundedCorner from './rounded-corner';
// import InteractTheme from './interact-theme';
// import International from './International';
import QuerySetting from './query-setting';
import { FormattedMessage } from 'react-intl';
import Coordinator from './coordinator';
import GraphyPlugin from './plugins/graphy';
import ExplorePlugin from './plugins/explore';

const { Meta } = Card;
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
      <Row gutter={[16, 12]}>
        <Col span={24} xs={24} md={24} lg={24}>
          <Card>
            <Meta
              title={
                <Typography.Title level={4}>
                  <FormattedMessage id="System Setting" />
                </Typography.Title>
              }
              description={
                <FormattedMessage id="Configure GraphScope engine address and set query page sidebar style" />
              }
              style={{ paddingBottom: 24 }}
            />
            <Coordinator />
            <Divider />
            <QuerySetting />

            {/* <International /> */}
          </Card>
        </Col>
        <Col span={24} xs={24} md={24} lg={24}>
          <Card>
             <Meta
              title={
                <Typography.Title level={4}>
                  <FormattedMessage id="Appearance Setting" />
                </Typography.Title>
              }
              description={
                <FormattedMessage id="Configure theme colors and rounded corners" />
              }
              style={{ paddingBottom: 24 }}
            />
            {/* <InteractTheme /> */}
            <PrimaryColor />
            <Divider />
            <RoundedCorner />
          </Card>
        </Col>
        <Col span={24}>
          <Card>
             <Meta
              title={
                <Typography.Title level={4}>
                  <FormattedMessage id="Experimental Tools" />
                </Typography.Title>
              }
              description={
                <FormattedMessage id="Configure and enable experimental tools for advanced graph data exploration and analysis." />
              }
              style={{ paddingBottom: 24 }}
            />
            <Flex vertical gap={24}>
              <ExplorePlugin />
              <Divider style={{margin: '0px'}}/>
              <GraphyPlugin />
            </Flex>
          </Card>
        </Col>
      </Row>
    </Section>
  );
};

export default Setting;

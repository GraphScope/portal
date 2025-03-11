import React, { memo } from 'react';
import { Row, Col, Card, Result,  Flex, ConfigProvider, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';

const { Text, Title } = Typography;
const ServerNotAvailable: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Result: {
            paddingLG: 0,
            marginXS: 0,
            iconFontSize: 20,
          },
        },
      }}
    >
      <Row gutter={[12, 12]}>
        <Col span={24} style={{ padding: '20px' }}>
          <Card>
            <Flex style={{ height: '320px' }}>
              <Result status="404" />
              <Flex vertical justify="flex-start" style={{ padding: '20px', flex: 1 }}>
                <Title level={3}>
                  <FormattedMessage id="No available Coordinator service" />
                </Title>
                <Text style={{ fontSize: '16px' }}>
                  <FormattedMessage id="Start the local service by following the steps below and then refresh this web page" />
                </Text>
                <Flex
                  vertical
                  style={{
                    background: 'rgba(0, 0, 0, 0.7)',
                    flex: 1,
                    borderRadius: '10px',
                    padding: '20px',
                    marginTop: '20px',
                  }}
                >
                  <Text style={{ color: 'rgba(255,255,255,.8)' }}>
                    <FormattedMessage id="# Pull the GraphScope Interactive Docker image" />
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,.8)' }}>
                    <FormattedMessage id="docker pull registry.cn-hongkong.aliyuncs.com/graphscope/interactive:0.29.3-arm64" />
                  </Text>
                  <br />
                  <Text style={{ color: 'rgba(255,255,255,.8)' }}>
                    <FormattedMessage id="# Start the GraphScope Interactive service" />
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,.8)' }}>
                    <FormattedMessage
                      id="docker run -d --name gs -label flex=interactive - 8080:8080 - 7777:7777 - 10000:10000 -p
7687:7687 registry.cn-hongkong.aliyuncs.com/graphscope/interactive:0.29.3-arm64-enable-coordinator"
                    />
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </Col>
      </Row>
    </ConfigProvider>
  );
};

export default memo(ServerNotAvailable);

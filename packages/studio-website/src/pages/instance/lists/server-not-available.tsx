import React, { memo } from 'react';
import { Row, Col, Card, Result, Flex, ConfigProvider, Typography, theme } from 'antd';
import { FormattedMessage } from 'react-intl';

const { Text, Title } = Typography;
const ServerNotAvailable: React.FC = () => {
  const { token } = theme.useToken();
  return (
    <Row >
      <Col span={24}>
        <Card>
          <Flex>
            <Result status="404" style={{padding: '0 20px 0 0',margin: 0}}/>
            <Flex vertical justify="flex-start" style={{ flex: 1, paddingTop: 10 }}>
              <Title level={3}>
                <FormattedMessage id="No available Coordinator service" />
              </Title>
              <Text type="secondary">
                <FormattedMessage id="Start the local service by following the steps below and then refresh this web page" />
              </Text>
              <Flex
                vertical
                style={{
                  background: token.colorBgSpotlight,
                  height: '160px',
                  borderRadius: token.borderRadius,
                  marginTop: 20,
                  padding: '20px 20px 0',
                }}
              >
                <pre
                  style={{
                    color: token.colorTextLightSolid,
                    whiteSpace: 'pre-wrap', 
                  }}
                >{`# Pull the GraphScope Interactive Docker image
docker pull registry.cn-hongkong.aliyuncs.com/graphscope/interactive

# Start the GraphScope Interactive service
docker run -d --name gs -p 8080:8080 -p 7777:7777 -p 10000:10000 -p 7687:7687 registry.cn-hongkong.aliyuncs.com/graphscope/interactive --enable-coordinator --port-mapping "8080:8080,7777:7777,10000:10000,7687:7687"`}
                </pre>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </Col>
    </Row>
  );
};

export default memo(ServerNotAvailable);

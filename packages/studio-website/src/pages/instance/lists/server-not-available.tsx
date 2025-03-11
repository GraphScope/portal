import React, { memo } from 'react';
import { Row, Col, Card, Result,  Flex, ConfigProvider, Typography, theme } from 'antd';
import { FormattedMessage } from 'react-intl';

const { Text, Title } = Typography;

const ServerNotAvailable: React.FC = () => {


const { token } = theme.useToken();
const ColorText = (props) => <Text style={{ color: token.colorTextLightSolid }} >{props.children}</Text>;
  return (
      <Row gutter={[12, 12]}>
        <Col span={24} >
          <Card>
            <Flex >
              <Result status="404" />
              <Flex vertical justify="flex-start" style={{  flex: 1 }}>
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
                    flex: 1,
                    borderRadius: token.borderRadius,
                    padding: '20px',
                    marginTop: '20px',
                  }}
                >
                  <ColorText>
                    # Pull the GraphScope Interactive Docker image
                  </ColorText>
                  <ColorText>
                   docker pull registry.cn-hongkong.aliyuncs.com/graphscope/interactive:0.29.3-arm64
                  </ColorText>
                  <br />
                  <ColorText>
                    # Start the GraphScope Interactive service
                  </ColorText>
                  <ColorText>
                    docker run -d --name gs -label flex=interactive - 8080:8080 - 7777:7777 - 10000:10000 -p
7687:7687 registry.cn-hongkong.aliyuncs.com/graphscope/interactive:0.29.3-arm64-enable-coordinator
                  </ColorText>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </Col>
      </Row>
  );
};

export default memo(ServerNotAvailable);

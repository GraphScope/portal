import React, { memo } from 'react';
import { Row, Col, Card, Result, Flex, ConfigProvider, Typography,theme } from 'antd';
import { FormattedMessage } from 'react-intl';
import FeatureCase from '../../../components/feature-case';
import CreateInstance from '../create';

const { Text, Title } = Typography;
const ServerNotAvailable: React.FC = () => {
  const { token } = theme.useToken();
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
                  <FormattedMessage id="No graph available" />
                </Title>
                <Text style={{ marginBottom: 30,marginTop:4 }} type="secondary">
                  <FormattedMessage id="Please click the button below to 「Create instances」" />
                </Text>
                <FeatureCase match="MULTIPLE_GRAPHS">
                  <CreateInstance />
                </FeatureCase>
              </Flex>
            </Flex>
          </Card>
        </Col>
      </Row>
    </ConfigProvider>
  );
};

export default memo(ServerNotAvailable);

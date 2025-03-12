import React, { memo } from 'react';
import { Row, Col, Card, Result, Flex,  Typography,theme } from 'antd';
import { FormattedMessage } from 'react-intl';
import FeatureCase from '../../../components/feature-case';
import CreateInstance from '../create';

const { Text, Title } = Typography;
const ServerNotAvailable: React.FC = () => {
  return (
      <Row gutter={[12, 12]}>
        <Col span={24} >
          <Card>
            <Flex >
              <Result status="404" />
              <Flex vertical>
              <br/>
                <Title level={3}>
                  <FormattedMessage id="No graph available" />
                </Title>
                <Text type="secondary">
                  <FormattedMessage id="Please click the button below to 「Create instances」" />
                </Text>
                <br/>
                <FeatureCase match="MULTIPLE_GRAPHS">
                  <CreateInstance />
                </FeatureCase>
              </Flex>
            </Flex>
          </Card>
        </Col>
      </Row>
  );
};

export default memo(ServerNotAvailable);

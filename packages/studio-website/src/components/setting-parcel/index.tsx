import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Flex, Row, Col, Typography } from 'antd';
const { Title, Text } = Typography;
type ISettingParcelProps = {
  title: string;
  text: string;
  style?: React.CSSProperties;
  leftModule?: React.ReactNode;
  rightModule?: React.ReactNode;
  children?: React.ReactNode;
};

const SettingParcel: React.FunctionComponent<ISettingParcelProps> = props => {
  const { title, text, style = { margin: '0px  24px 0px 0px' }, leftModule, rightModule, children } = props;
  return (
    <Row>
      <Col span={8}>
        <Flex vertical>
          <Title level={3} style={style}>
            <FormattedMessage id={title} />
          </Title>
          <Text>
            <FormattedMessage id={text} />
          </Text>
        </Flex>
      </Col>
      {leftModule && <Col span={4}>{leftModule}</Col>}
      {rightModule && <Col span={8}>{rightModule}</Col>}
      {children && <Col>{children}</Col>}
    </Row>
  );
};

export default SettingParcel;

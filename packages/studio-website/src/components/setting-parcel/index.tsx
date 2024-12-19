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
    <Flex vertical gap={12}>
      <Title level={5} style={style}>
        <FormattedMessage id={title} />
      </Title>
      <Text type="secondary">
        <FormattedMessage id={text} />
      </Text>
      {leftModule && leftModule}
      {rightModule && rightModule}
      {children && children}
    </Flex>
  );
};

export default SettingParcel;

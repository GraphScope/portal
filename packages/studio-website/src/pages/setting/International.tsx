import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Flex, Row, Col, Typography } from 'antd';
import { useContext } from '@/layouts/useContext';
import LocaleSwitch from '@/components/locale-switch';
const { Title, Text } = Typography;
type IInternationalProps = {};
const International: React.FunctionComponent<IInternationalProps> = props => {
  const { store, updateStore } = useContext();
  const { locale } = store;
  return (
    <Row>
      <Col span={8}>
        <Flex vertical>
          <Title level={3} style={{ margin: '0px  24px 0px 0px' }}>
            <FormattedMessage id="International" />
          </Title>
          <Text>
            <FormattedMessage id="Select national language" />
          </Text>
        </Flex>
      </Col>
      <Col span={8}>
        <LocaleSwitch
          value={locale}
          onChange={value => {
            updateStore(draft => {
              draft.locale = value;
            });
          }}
        ></LocaleSwitch>
      </Col>
    </Row>
  );
};

export default International;

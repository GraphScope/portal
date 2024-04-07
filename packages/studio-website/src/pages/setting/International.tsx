import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Flex, Row, Col, Typography } from 'antd';
import { useContext } from '@/layouts/useContext';
import LocaleSwitch from '@/components/locale-switch';
import localStorage from '@/components/utils/localStorage';

const { Title, Text } = Typography;

const International: React.FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { locale } = store;
  const { setItem, getItem } = localStorage;
  const handleLocale = (value: string) => {
    setItem('locale', value);
    const locale = getItem('locale');
    updateStore(draft => {
      draft.locale = locale;
    });
  };
  return (
    <Row>
      <Col span={8}>
        <Flex vertical>
          <Title level={3} style={{ margin: '0px  24px 0px 0px' }}>
            <FormattedMessage id="International" />
          </Title>
          <Text>
            <FormattedMessage id="Select language" />
          </Text>
        </Flex>
      </Col>
      <Col span={8}>
        <LocaleSwitch value={locale} onChange={value => handleLocale(value)}></LocaleSwitch>
      </Col>
    </Row>
  );
};

export default International;

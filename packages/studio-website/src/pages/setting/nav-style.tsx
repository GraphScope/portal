import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Flex, Row, Col, Typography, Segmented } from 'antd';
import { useContext } from '@/layouts/useContext';
import localStorage from '@/components/utils/localStorage';

const { Title, Text } = Typography;

interface ILocaleSwitchProps {}
interface INavStyleOption {
  label: string;
  value: string;
}
const NavStyle: React.FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { navStyle } = store;
  const { setItem, getItem } = localStorage;
  const onChange = (value: string) => {
    setItem('navStyle', value);
    const navStyle = getItem('navStyle');
    updateStore(draft => {
      draft.navStyle = navStyle;
    });
  };

  const options: INavStyleOption[] = [
    {
      label: 'Inline',
      value: 'inline',
    },
    {
      label: 'Menu',
      value: 'menu',
    },
  ];
  return (
    <Row>
      <Col span={8}>
        <Flex vertical>
          <Title level={3} style={{ margin: '0px  24px 0px 0px' }}>
            <FormattedMessage id="Navigation Style" />
          </Title>
          <Text>
            <FormattedMessage id="Select navigation style" />
          </Text>
        </Flex>
      </Col>
      <Col span={8}>
        <Segmented options={options} value={navStyle} onChange={onChange} />
      </Col>
    </Row>
  );
};

export default NavStyle;

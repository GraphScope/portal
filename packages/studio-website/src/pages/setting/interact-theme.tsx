import * as React from 'react';
import { Flex, Typography, Row, Col } from 'antd';
import { useContext } from '@/layouts/useContext';
import SelectCards from '@/components/select-cards';
import { FormattedMessage } from 'react-intl';
import localStorage from '@/components/utils/localStorage';
interface IInteractThemeProps {}
const { Title, Text } = Typography;

const engines = [
  {
    id: 'defaultAlgorithm',
    title: 'Light',
    avatar: 'https://gw.alipayobjects.com/zos/bmw-prod/ae669a89-0c65-46db-b14b-72d1c7dd46d6.svg',
    desc: 'System preference',
    primaryBGgColor: '#f5f7f9',
  },
  {
    id: 'darkAlgorithm',
    title: 'Dark',
    avatar: 'https://gw.alipayobjects.com/zos/bmw-prod/0f93c777-5320-446b-9bb7-4d4b499f346d.svg',
    desc: 'Nighttime theme ',
    primaryBGgColor: '#000',
  },
];
const InteractTheme: React.FunctionComponent<IInteractThemeProps> = props => {
  const { store, updateStore } = useContext();
  const { mode } = store;
  const { setItem, getItem } = localStorage;
  const changeEngineType = (item: any) => {
    setItem('themeColor', item.id);
    const themeColor = getItem('themeColor');
    updateStore(draft => {
      draft.mode = themeColor;
    });
  };
  return (
    <Row>
      <Col span={8}>
        <Flex vertical>
          <Title level={3} style={{ margin: '0px' }}>
            <FormattedMessage id="Interact theme" />
          </Title>
          <Text>
            <FormattedMessage id="Select or customize your UI theme" />
          </Text>
        </Flex>
      </Col>
      <Col span={16}>
        <SelectCards val={mode} items={engines} onChange={changeEngineType} />
      </Col>
    </Row>
  );
};

export default InteractTheme;

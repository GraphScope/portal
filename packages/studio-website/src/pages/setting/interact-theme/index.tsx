import * as React from 'react';
import { Flex, Typography, Row, Col } from 'antd';
import { useContext } from '@/layouts/useContext';
import SelectCards from '@/components/select-cards';
import dark from './img/dark.jpg';
import { FormattedMessage } from 'react-intl';
interface IInteractThemeProps {}
const { Title, Text } = Typography;

const engines = [
  {
    id: 'System_preference',
    title: 'System',
    avatar: dark,
    desc: 'System preference',
  },
  {
    id: 'defaultAlgorithm',
    title: 'Light',
    avatar: dark,
    desc: 'Daytime theme ',
  },
  {
    id: 'darkAlgorithm',
    title: 'Dark',
    avatar: dark,
    desc: 'Nighttime theme ',
  },
];
const InteractTheme: React.FunctionComponent<IInteractThemeProps> = props => {
  const { store, updateStore } = useContext();
  const { mode } = store;
  const changeEngineType = (item: any) => {
    updateStore(draft => {
      draft.mode = item.id;
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

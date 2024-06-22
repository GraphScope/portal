import * as React from 'react';
import { Flex, Typography, Row, Col, theme } from 'antd';
import SelectCards from '@/components/select-cards';
import { FormattedMessage } from 'react-intl';
import { useThemeContainer } from '@graphscope/studio-components';
import { ICard } from '@/components/select-cards';
const { Title, Text } = Typography;

const engines: ICard[] & { primaryBGgColor: string }[] = [
  {
    id: 'defaultAlgorithm',
    title: 'Light',
    avatar: 'https://gw.alipayobjects.com/zos/bmw-prod/ae669a89-0c65-46db-b14b-72d1c7dd46d6.svg',
    desc: <FormattedMessage id="Lighttime theme" />,
    primaryBGgColor: '#f5f7f9',
  },
  {
    id: 'darkAlgorithm',
    title: 'Dark',
    avatar: 'https://gw.alipayobjects.com/zos/bmw-prod/0f93c777-5320-446b-9bb7-4d4b499f346d.svg',
    desc: <FormattedMessage id="Nighttime theme" />,
    primaryBGgColor: '#000',
  },
];
const InteractTheme: React.FunctionComponent = () => {
  const { algorithm = 'defaultAlgorithm', handleTheme } = useThemeContainer();
  const changeEngineType = (item: { id: string }) => {
    handleTheme({
      algorithm: item.id as 'defaultAlgorithm' | 'darkAlgorithm',
    });
  };
  return (
    <Row>
      <Col span={8}>
        <Flex vertical>
          <Title level={3} style={{ margin: '0px' }}>
            <FormattedMessage id="Select theme" />
          </Title>
          <Text>
            <FormattedMessage id="Select or customize your UI theme" />
          </Text>
        </Flex>
      </Col>
      <Col span={16}>
        <SelectCards selectValue={algorithm} items={engines} onChange={changeEngineType} />
      </Col>
    </Row>
  );
};

export default InteractTheme;

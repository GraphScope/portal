import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Flex, Row, Col, Typography, Segmented, Divider } from 'antd';
import { useContext } from '@/layouts/useContext';
import { Utils } from '@graphscope/studio-components';

const { Title, Text } = Typography;

interface ILocaleSwitchProps {
  value: string;
  onChange: (value: string) => void;
}

const { storage } = Utils;
const NavStyle: React.FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { displaySidebarPosition, displaySidebarType } = store;

  const onChangePosition = (value: 'right' | 'left') => {
    storage.set('displaySidebarPosition', value);
    updateStore(draft => {
      draft.displaySidebarPosition = value;
    });
  };
  const onChangeType = (value: 'Sidebar' | 'Segmented') => {
    storage.set('displaySidebarType', value);
    updateStore(draft => {
      draft.displaySidebarType = value;
    });
  };

  return (
    <>
      <Row>
        <Col span={8}>
          <Flex vertical>
            <Title level={3} style={{ margin: '0px  24px 0px 0px' }}>
              <FormattedMessage id="Sidebar placement" />
            </Title>
            <Text>
              <FormattedMessage id="Querying page sidebar placement" />
            </Text>
          </Flex>
        </Col>
        <Col span={8}>
          <Segmented
            options={[
              {
                label: 'left',
                value: 'left',
              },
              {
                label: 'right',
                value: 'right',
              },
            ]}
            value={displaySidebarPosition}
            //@ts-ignore
            onChange={onChangePosition}
          />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={8}>
          <Flex vertical>
            <Title level={3} style={{ margin: '0px  24px 0px 0px' }}>
              <FormattedMessage id="Sidebar type" />
            </Title>
            <Text>
              <FormattedMessage id="Querying page sidebar style" />
            </Text>
          </Flex>
        </Col>
        <Col span={8}>
          <Segmented
            options={[
              {
                label: 'Sidebar',
                value: 'Sidebar',
              },
              {
                label: 'Segmented',
                value: 'Segmented',
              },
            ]}
            value={displaySidebarType}
            //@ts-ignore
            onChange={onChangeType}
          />
        </Col>
      </Row>
    </>
  );
};

export default NavStyle;

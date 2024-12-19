import React, { useState } from 'react';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { Card, Flex, Typography, theme, Avatar, Row, Col, Space } from 'antd';
const { Title, Text } = Typography;
import { FormattedMessage } from 'react-intl';

export interface ICard {
  id: 'defaultAlgorithm' | 'darkAlgorithm';
  title?: string;
  desc?: string | React.ReactNode;
  avatar?: string;
  disabled?: boolean;
}

interface ISelectCardsProps {
  items: ICard[];
  value: string;
  style?: React.CSSProperties;
  onChange: (card: ICard) => void;
}
const iconStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  fontSize: '20px',
};
const SelectCards: React.FunctionComponent<ISelectCardsProps> = props => {
  const { value, onChange, items, style } = props;

  const { useToken } = theme;
  const { token } = useToken();

  return (
    <div>
      <Row gutter={16}>
        {items.map(item => {
          const { id, title, desc, avatar, disabled } = item;
          const isChecked = id === value;

          console.log('isChecked', value, id);
          return (
            <Space>
              <Col span={24} key={id}>
                <Card
                  onClick={() => {
                    if (!disabled) {
                      onChange(item);
                    }
                  }}
                  style={
                    disabled
                      ? {
                          background: '#dddddd29',
                          cursor: 'not-allowed',
                        }
                      : isChecked
                        ? {
                            border: `1px solid ${token.colorPrimary}`,
                          }
                        : {}
                  }
                  styles={{ body: { padding: '24px' } }}
                >
                  <Flex justify="space-between" align="">
                    {avatar && <Avatar shape="square" size={45} src={avatar} />}
                    <div style={{ marginLeft: '10px' }}>
                      <Title level={4} style={{ margin: '0px 0px 10px 0px' }}>
                        {<FormattedMessage id={title} />}
                      </Title>
                      <Text type="secondary">{desc}</Text>
                    </div>
                  </Flex>
                  {isChecked && <CheckCircleTwoTone twoToneColor={token.colorPrimary} style={style || iconStyle} />}
                </Card>
              </Col>
            </Space>
          );
        })}
      </Row>
    </div>
  );
};

export default SelectCards;

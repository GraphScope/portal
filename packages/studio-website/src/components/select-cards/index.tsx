import React, { useState } from 'react';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { Card, Flex, Typography, theme, Avatar, Row, Col } from 'antd';
const { Title, Text } = Typography;

export interface Card {
  id: string;
  title: string;
  desc: string;
  avatar?: string;
  disabled?: boolean;
}
interface ISelectCardsProps {
  items: Card[];
  val: string;
  onChange: (card: Card) => void;
}
const iconStyle: React.CSSProperties = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  fontSize: '20px',
};
const SelectCards: React.FunctionComponent<ISelectCardsProps> = props => {
  const { val: value, onChange, items } = props;
  const [current, setCurrent] = useState(value);
  const { useToken } = theme;
  const { token } = useToken();
  console.log('value', value, props);
  return (
    <div>
      <Row gutter={16}>
        {items.map(item => {
          const { id, title, desc, avatar, disabled } = item;
          const isChecked = id === current;
          console.log('isChecked', value, current, id);
          return (
            <Col span={8} key={id}>
              <Card
                onClick={() => {
                  if (!disabled) {
                    setCurrent(id);
                    onChange && onChange(item);
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
              >
                <Flex justify="space-between" align="">
                  {avatar && <Avatar shape="square" size={45} />}
                  <div>
                    <Title level={4} style={{ marginTop: '0px' }}>
                      {title}
                    </Title>
                    <Text type="secondary">{desc}</Text>
                  </div>
                </Flex>
                {isChecked && <CheckCircleTwoTone twoToneColor={token.colorPrimary} style={iconStyle} />}
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default SelectCards;

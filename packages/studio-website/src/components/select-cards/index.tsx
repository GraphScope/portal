import React, { useState } from 'react';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { Card, Flex, Typography, theme, Avatar, Row, Col } from 'antd';
const { Title, Text } = Typography;

export interface Card {
  id: string;
  title: string;
  desc: string;
  avatar?: string;
}
interface ISelectCardsProps {
  items: Card[];
  value: string;
  onChange: (card: Card) => void;
}
const iconStyle: React.CSSProperties = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  fontSize: '20px',
};
const SelectCards: React.FunctionComponent<ISelectCardsProps> = props => {
  const { value, onChange, items } = props;
  const [current, setCurrent] = useState(value);
  const { useToken } = theme;
  const { token } = useToken();

  return (
    <div>
      <Row gutter={16}>
        {items.map(item => {
          const { id, title, desc, avatar } = item;
          const isChecked = id === current;
          return (
            <Col span={8} key={id}>
              <Card
                onClick={() => {
                  setCurrent(id);
                  onChange && onChange(item);
                }}
              >
                <Flex justify="space-between" align="">
                  {avatar && <Avatar shape="square" size={45} />}
                  <div>
                    <Title level={4}>{title}</Title>
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

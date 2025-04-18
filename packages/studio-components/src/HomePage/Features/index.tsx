import React, { useRef } from 'react';
import { Flex, Col, Row, theme, Typography, Card } from 'antd';
export interface IFeaturesProps {
  items: {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    description: string[];
  }[];
}

const Features: React.FunctionComponent<IFeaturesProps> = props => {
  const { items } = props;
  const { token } = theme.useToken();

  return (
    <Flex vertical style={{ width: '100%' }} gap={24} align="center">
      <Typography.Title level={2}>Core Features</Typography.Title>
      <Row
        gutter={[
          {
            xs: 24,
            sm: 24,
            md: 24,
            lg: 24,
            xl: 24,
          },
          {
            xs: 24,
            sm: 24,
            md: 24,
            lg: 24,
            xl: 24,
          },
        ]}
      >
        {items.map((item, index) => {
          const { icon: Icon, title, description } = item;
          return (
            <Col key={index} xs={24} sm={12} md={12} lg={6} xl={6}>
              <Card hoverable style={{ height: '100%' }}>
                <Flex vertical gap={12}>
                  <Icon
                    style={{
                      fontSize: token.fontSizeHeading2,
                      color: token.colorPrimary,
                      // position: 'absolute',
                      // top: '0px',
                      // right: '0px',
                      zIndex: 0,
                    }}
                  />
                  <Typography.Title level={4} style={{ margin: '0px' }}>
                    {title}
                  </Typography.Title>
                  <Typography.Text style={{ fontWeight: 500, margin: '0px' }} type="secondary">
                    {description.join(',')}
                  </Typography.Text>
                </Flex>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Flex>
  );
};

export default Features;

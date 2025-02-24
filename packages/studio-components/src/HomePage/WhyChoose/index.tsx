import React, { useState } from 'react';
import { Flex, Typography, Segmented, theme, Row, Col, Button } from 'antd';
import { useEnv } from '../Hooks';
export interface Item {
  keyword?: string;
  title: string;
  description: string;
  image: string;
  link?: string;
}
export interface IWhyChooseProps {
  items: Item[];
}

const WhyChoose: React.FunctionComponent<IWhyChooseProps> = props => {
  const { token } = theme.useToken();
  const { items } = props;
  const { isDark, isMobile } = useEnv();

  return (
    <Flex vertical style={{ width: '100%', padding: '12px' }} align="center" gap={isMobile ? '24px' : '48px'}>
      <Typography.Title level={2}>Why Choose us</Typography.Title>
      {items.map((item, index) => {
        const { title, description, image, keyword, link } = item;
        const isOld = index % 2 === 0 || isMobile;

        return (
          <Row
            key={title}
            style={{ paddingBottom: '48px' }}
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
            {isOld && (
              <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                {/* {keyword && <Typography.Text>{keyword}</Typography.Text>} */}
                <Typography.Title level={3}>{title}</Typography.Title>
                <Typography.Paragraph style={{ color: token.colorTextSecondary, fontSize: token.fontSizeHeading4 }}>
                  {description}
                </Typography.Paragraph>
                {link && <Button onClick={() => window.open(link)}>Learn More</Button>}
              </Col>
            )}
            <Col
              xs={24}
              sm={24}
              md={10}
              lg={10}
              xl={10}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <img
                src={image}
                alt=""
                style={{
                  borderRadius: token.borderRadiusLG,
                  width: isMobile ? '100%' : '80%',
                  filter: isDark ? 'invert(1)' : 'none',
                  boxShadow: token.boxShadowTertiary,
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              />
            </Col>
            {!isOld && (
              <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                {/* {keyword && <Typography.Text>{keyword}</Typography.Text>} */}
                <Typography.Title level={3}>{title}</Typography.Title>
                <Typography.Paragraph style={{ color: token.colorTextSecondary, fontSize: token.fontSizeHeading4 }}>
                  {description}
                </Typography.Paragraph>
                {link && <Button onClick={() => window.open(link)}>Learn More</Button>}
              </Col>
            )}
          </Row>
        );
      })}
    </Flex>
  );
};

export default WhyChoose;

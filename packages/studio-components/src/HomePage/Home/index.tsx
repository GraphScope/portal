import React, { useRef } from 'react';
import LightArea, { useLightArea } from '../LightArea';
import { Flex, Col, Row, Button, Space, theme, Typography, ConfigProvider, Descriptions, Card } from 'antd';
import { useDynamicStyle, useIsMobile, useTheme } from '../Hooks';
import * as Icons from '../../Icons';
import { GithubOutlined } from '@ant-design/icons';

import HeroSection, { type IHeroSectionProps } from '../Hero';
import Features, { type IFeaturesProps } from '../Features';

interface SiteThemeProps {
  hero: IHeroSectionProps;
  features: IFeaturesProps;
}

const HomeSite = (props: SiteThemeProps) => {
  const isMobile = useIsMobile();
  const currentMode = useTheme();
  const algorithmMap = {
    dark: theme.darkAlgorithm,
    light: theme.defaultAlgorithm,
    system: theme.defaultAlgorithm,
  };
  //@ts-ignore
  const algorithm = algorithmMap[currentMode];

  const { hero, features } = props;

  return (
    <ConfigProvider
      theme={{
        algorithm,
        token: {
          colorPrimary: '#2581f0', //'#00b96b',
          fontSizeHeading1: isMobile ? 32 : 60,
        },
      }}
    >
      <Flex vertical align="center" justify="center" gap={12}>
        <ResetCSS />
        <HeroSection {...hero} />
        <Features {...features} />
      </Flex>
    </ConfigProvider>
  );
};

function ResetCSS() {
  const { token } = theme.useToken();

  useDynamicStyle(
    `
    body{
        overflow-x: hidden;
        background-color:${token.colorBgContainer},
    }
    `,
    'root',
  );

  return null;
}

export default HomeSite;

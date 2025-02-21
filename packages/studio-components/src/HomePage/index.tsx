import React, { useRef } from 'react';

import { Flex, theme, ConfigProvider } from 'antd';
import { useDynamicStyle, useIsMobile, useTheme } from './Hooks';
import HeroSection, { type IHeroSectionProps } from './Hero';
import Features, { type IFeaturesProps } from './Features';

interface SiteThemeProps {
  hero: IHeroSectionProps;
  features: IFeaturesProps['items'];
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
        <Flex
          vertical
          align="center"
          style={{ width: '100%', maxWidth: '90rem', padding: '0 1.5rem' }}
          justify="center"
        >
          <Features items={features} />
        </Flex>
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

import React, { useRef } from 'react';

import { Flex, theme, ConfigProvider } from 'antd';
import { useDynamicStyle, useIsMobile, useTheme, EnvProvider, useEnv } from './Hooks';
import HeroSection, { type IHeroSectionProps } from './Hero';
import Features, { type IFeaturesProps } from './Features';
import Installation, { IInstallationProps } from './Installation';
import WhyChoose, { IWhyChooseProps } from './WhyChoose';

interface SiteThemeProps {
  hero: IHeroSectionProps;
  features: IFeaturesProps['items'];
  installation: IInstallationProps['items'];
  whychoose: IWhyChooseProps['items'];
}

const HomeSite = (props: SiteThemeProps) => {
  const { isDark, isMobile } = useEnv();
  const algorithm = isDark ? theme.darkAlgorithm : theme.defaultAlgorithm;
  const { hero, features, installation, whychoose } = props;

  return (
    <ConfigProvider
      theme={{
        algorithm,
        token: {
          colorPrimary: '#2581f0', //'#00b96b',
          fontSizeHeading1: isMobile ? 32 : 60,
          fontSizeHeading2: isMobile ? 26 : 40,
          fontSizeHeading3: isMobile ? 20 : 24,
          fontSizeHeading4: isMobile ? 14 : 18,
        },
      }}
    >
      <Flex vertical align="center" justify="center" gap={48}>
        <ResetCSS />
        <HeroSection {...hero} />
        <Flex
          vertical
          align="center"
          style={{ width: '100%', maxWidth: '90rem', padding: '1.5rem', boxSizing: 'border-box' }}
          justify="center"
          gap={84}
        >
          <Features items={features} />
          <Installation items={installation} />
          <WhyChoose items={whychoose} />
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

export default (props: SiteThemeProps) => {
  return (
    <EnvProvider>
      <HomeSite {...props} />
    </EnvProvider>
  );
};

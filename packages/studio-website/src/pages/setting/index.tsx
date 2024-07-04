import * as React from 'react';
import { Divider } from 'antd';
import Section from '@/components/section';
import InteractTheme from './interact-theme';
import PrimaryColor from './primary-color';
import RoundedCorner from './rounded-corner';
import International from './International';
import NavStyle from './nav-style';
const Setting: React.FunctionComponent = () => {
  return (
    <div>
      <Section
        breadcrumb={[
          {
            title: 'Appearance Setting',
          },
        ]}
        desc="Change how Untitled UI looks and feels in your browser"
      >
        <>
          <InteractTheme />
          <Divider />
          <PrimaryColor />
          <Divider />
          <NavStyle />
          <Divider />
          <RoundedCorner />
          <Divider />
          <International />
        </>
      </Section>
    </div>
  );
};

export default Setting;

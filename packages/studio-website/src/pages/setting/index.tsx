import * as React from 'react';
import { Divider } from 'antd';
import Section from '@/components/section';
import InteractTheme from './interact-theme';
import PrimaryColor from './primary-color';
import RoundedCorner from './rounded-corner';
import International from './International';

const Setting: React.FunctionComponent = () => {
  return (
    <div>
      <Section
        breadcrumb={[
          {
            title: 'Home',
          },
          {
            title: 'Setting',
          },
        ]}
        title="Appearance Setting"
        desc="Change how Untitled UI looks and feels in your browser"
      >
        <>
          <InteractTheme />
          <Divider />
          <PrimaryColor />
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

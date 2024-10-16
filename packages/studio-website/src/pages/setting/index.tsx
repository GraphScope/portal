import * as React from 'react';
import { Divider, Card } from 'antd';
import Section from '../../components/section';
import InteractTheme from './interact-theme';
import PrimaryColor from './primary-color';
import RoundedCorner from './rounded-corner';
import International from './International';
import NavStyle from './nav-style';
import QuerySetting from './query-setting';
import { FormattedMessage } from 'react-intl';
const Setting: React.FunctionComponent = () => {
  return (
    <Section
      breadcrumb={[
        {
          title: <FormattedMessage id="Appearance Setting" />,
        },
      ]}
      desc="Change how Untitled UI looks and feels in your browser"
    >
      <Card>
        <InteractTheme />
        <Divider />
        <PrimaryColor />
        <Divider />
        <NavStyle />
        <Divider />
        <RoundedCorner />
        <Divider />
        <International />
        <Divider />
        <QuerySetting />
      </Card>
    </Section>
  );
};

export default Setting;

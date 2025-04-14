import * as React from 'react';
import Section from '../../components/section';
import Plugins from './plugins';
import { FormattedMessage } from 'react-intl';
import { SegmentedTabs } from '@graphscope/studio-components';

const Extension: React.FunctionComponent = () => {
  const items = [
    {
      key: 'Store',
      children: <Plugins />,
      label: <FormattedMessage id="Stored Procedures" />,
    },
  ];
  return (
    <>
      <Section
        breadcrumb={[
          {
            title: <FormattedMessage id="Extensions" />,
          },
        ]}
        desc="GraphScope provides an extension plugin mechanism, allowing you to flexibly create various types of plugins such as graph learning, store procedures, and graph analysis according to business needs."
      >
        <SegmentedTabs items={items} rootStyle={{ borderRadius: '6px', padding: '12px' }} />
      </Section>
    </>
  );
};

export default Extension;

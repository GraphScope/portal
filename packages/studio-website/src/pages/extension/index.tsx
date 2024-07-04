import * as React from 'react';
import Section from '@/components/section';
import Plugins from './plugins';
import { FormattedMessage } from 'react-intl';

const Extension: React.FunctionComponent = () => {
  const items = [
    // {
    //   key: 'Plugins',
    //   children: <>全部插件</>,
    //   label: '全部插件',
    // },
    {
      key: 'Store',
      children: <Plugins />,
      label: <FormattedMessage id="Store Procedure" />,
    },
    // {
    //   key: 'Learn',
    //   children: <>图学习</>,
    //   label: '图学习',
    // },
    // {
    //   key: 'analyse',
    //   children: <>图分析</>,
    //   label: '图分析',
    // },
  ];
  return (
    <>
      <Section
        breadcrumb={[
          {
            title: 'Extensions',
          },
        ]}
        desc="GraphScope provides an extension plugin mechanism, allowing you to flexibly create various types of plugins such as graph learning, store procedures, and graph analysis according to business needs."
        items={items}
      ></Section>
    </>
  );
};

export default Extension;

import * as React from 'react';
import Section from '@/components/section';
import Plugins from './plugins';
import CreatePlugins from './plugins/create-plugins';
import { FormattedMessage } from 'react-intl';
interface ExtensionProps {}
const { useState } = React;
const Extension: React.FunctionComponent<ExtensionProps> = props => {
  const [isCreatePlugin, setIsOpenCreatePlugin] = useState(false);
  const handelChange = (val: boolean) => {
    setIsOpenCreatePlugin(val);
  };
  const items = [
    // {
    //   key: 'Plugins',
    //   children: <>全部插件</>,
    //   label: '全部插件',
    // },
    {
      key: 'Store',
      children: <Plugins handelChange={handelChange} />,
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
      {!isCreatePlugin ? (
        <Section
          breadcrumb={[
            {
              title: 'Home',
            },
            {
              title: 'Extensions',
            },
          ]}
          title="Extensions"
          desc="GraphScope provides an extension plugin mechanism, allowing you to flexibly create various types of plugins such as graph learning, store procedures, and graph analysis according to business needs."
          items={items}
        ></Section>
      ) : (
        <CreatePlugins handelChange={handelChange} />
      )}
    </>
  );
};

export default Extension;

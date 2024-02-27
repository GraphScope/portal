import * as React from 'react';
import Section from '@/components/section';
import Plugins from './plugins';
import CreatePlugins from './plugins/create-plugins';
interface ExtensionProps {}
const { useState } = React;
const Extension: React.FunctionComponent<ExtensionProps> = props => {
  const [isCreatePlugin, setIsOpenCreatePlugin] = useState(false);
  const handelChange = (val: boolean) => {
    setIsOpenCreatePlugin(val);
  };
  const items = [
    {
      key: 'Plugins',
      children: (
        <>{!isCreatePlugin ? <Plugins handelChange={handelChange} /> : <CreatePlugins handelChange={handelChange} />}</>
      ),
      label: '全部插件',
    },
    {
      key: 'Store',
      children: <>存储过程</>,
      label: '存储过程',
    },
    {
      key: 'Learn',
      children: <>图学习</>,
      label: '图学习',
    },
    {
      key: 'analyse',
      children: <>图分析</>,
      label: '图分析',
    },
  ];
  return (
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
      desc="Extensions"
      items={items}
    ></Section>
  );
};

export default Extension;

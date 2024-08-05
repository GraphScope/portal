import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import PeriodicStage from './periodic-stage';
import PeriodicSpark from './periodic-spark';
interface IGrootCase {
  handleChange?: (val: string) => void;
}
const GrootCase: React.FC<IGrootCase> = props => {
  const { handleChange } = props;
  const items: TabsProps['items'] = [
    {
      key: 'spark',
      label: 'Periodic Import From Dataworks',
      children: <PeriodicSpark />,
    },
    {
      key: 'stage',
      label: 'Periodic Import From ODPS',
      children: <PeriodicStage />,
    },
  ];
  return <Tabs items={items} onChange={handleChange} />;
};

export default GrootCase;

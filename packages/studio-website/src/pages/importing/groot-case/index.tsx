import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { FormattedMessage } from 'react-intl';
import PeriodicStage from './periodic-stage';
import PeriodicSpark from './periodic-spark';
interface IGrootCase {
  codeMirrorData: string;
  handleChange?: (val: string) => void;
}
const GrootCase: React.FC<IGrootCase> = props => {
  const { codeMirrorData, handleChange } = props;
  const items: TabsProps['items'] = [
    {
      key: 'spark',
      label: <FormattedMessage id="Periodic Import From Dataworks" />,
      children: <PeriodicSpark codeMirrorData={codeMirrorData} />,
    },
    {
      key: 'stage',
      label: <FormattedMessage id="Periodic Import From ODPS" />,
      children: <PeriodicStage />,
    },
  ];
  return <Tabs items={items} onChange={handleChange} />;
};

export default GrootCase;

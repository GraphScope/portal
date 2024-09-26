import * as React from 'react';
import { Steps } from 'antd';
import DataImport from '../import-data';
interface ISidebarProps {}
const description = 'This is a description.';
const Sidebar: React.FunctionComponent<ISidebarProps> = props => {
  return (
    <Steps
      style={{ height: '100%' }}
      current={1}
      direction="vertical"
      items={[
        {
          title: 'Create Graph Model',
          description: <DataImport />,
        },
        {
          title: 'Load Graph Data',
          description,
          subTitle: 'Left 00:00:08',
        },
      ]}
    />
  );
};

export default Sidebar;

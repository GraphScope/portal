import * as React from 'react';
import { SegmentedTabs } from '@graphscope/studio-components';
import ImportFromCSV from './import-from-csv';
import ImportFromJSON from './import-from-json';
interface ISideProps {}

const Side: React.FunctionComponent<ISideProps> = props => {
  const items = [
    {
      key: 'CSV',
      label: 'CSV',
      value: 'CSV',
      children: <ImportFromCSV />,
    },
    {
      key: 'JSON',
      label: 'JSON',
      value: 'JSON',
      children: <ImportFromJSON />,
    },
  ];
  return (
    <div style={{ background: '#fafafa', width: '100%', height: '100%' }}>
      <SegmentedTabs items={items} block />
    </div>
  );
};

export default Side;
